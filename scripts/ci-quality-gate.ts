import fs from 'fs';
import path from 'path';

// ANSI terminal colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`${BLUE}=== Running KaruviLab Elite CI Quality Gate v3.0 ===${RESET}\n`);

let hasFailed = false;

function fail(message: string) {
  console.error(`${RED}❌ [FAIL] ${message}${RESET}`);
  hasFailed = true;
}

function warn(message: string) {
  console.log(`${YELLOW}⚠️ [WARN] ${message}${RESET}`);
}

function success(message: string) {
  console.log(`${GREEN}✅ [PASS] ${message}${RESET}`);
}

// 1. Validate Tool Architecture (3-file structure)
const toolsDir = path.join(process.cwd(), 'app', '(tools)');
if (fs.existsSync(toolsDir)) {
  const categories = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory());
  for (const category of categories) {
    const catPath = path.join(toolsDir, category);
    const tools = fs.readdirSync(catPath).filter(f => fs.statSync(path.join(catPath, f)).isDirectory());
    
    for (const tool of tools) {
      const toolId = `${category}/${tool}`;
      const toolDetailPath = path.join(catPath, tool);
      
      const hasPage = fs.existsSync(path.join(toolDetailPath, 'page.tsx'));
      
      if (hasPage) {
        // Enforce 3-file pattern for interactive browser tools
        const pageContent = fs.readFileSync(path.join(toolDetailPath, 'page.tsx'), 'utf-8');
        
        // If page imports dynamic ToolClient, verify wrapper exists
        if (pageContent.includes('ClientWrapper') || pageContent.includes('Wrapper')) {
          let targetDir = toolDetailPath;
          const importMatch = pageContent.match(/import\s+\w+ClientWrapper\s+from\s+['"]([^'"]+)['"]/i) || 
                              pageContent.match(/import\s+\w+Wrapper\s+from\s+['"]([^'"]+)['"]/i);
          if (importMatch && importMatch[1]) {
            const importPath = importMatch[1];
            if (importPath.startsWith('@/src/features/')) {
              targetDir = path.join(process.cwd(), importPath.replace('@/', ''));
            } else if (importPath.startsWith('src/features/')) {
              targetDir = path.join(process.cwd(), importPath);
            } else if (importPath.startsWith('../') || importPath.startsWith('./')) {
              targetDir = path.resolve(toolDetailPath, importPath);
            }
            if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
              targetDir = path.dirname(targetDir);
            }
          }

          if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
            const targetFiles = fs.readdirSync(targetDir);
            const hasWrapper = targetFiles.some(f => f.toLowerCase().endsWith('wrapper.tsx'));
            const hasClient = targetFiles.some(f => f.toLowerCase().endsWith('client.tsx') && !f.toLowerCase().endsWith('wrapper.tsx')) ||
                              targetFiles.some(f => f.endsWith('Page.tsx') && !f.endsWith('Wrapper.tsx')) ||
                              targetFiles.some(f => f.toLowerCase().includes('client') && !f.toLowerCase().includes('wrapper')) ||
                              targetFiles.some(f => f.toLowerCase().includes('page') && !f.toLowerCase().includes('wrapper'));
            if (!hasWrapper || !hasClient) {
              fail(`Tool "${toolId}" violates 3-file architecture. Found page.tsx but missing ClientWrapper or Client in resolved folder: ${targetDir}`);
            }
          } else {
            fail(`Tool "${toolId}" violates 3-file architecture. Resolved target folder does not exist: ${targetDir}`);
          }
        }
        
        // Enforce Server Component constraints on page.tsx
        if (pageContent.includes('"use client"') || pageContent.includes("'use client'")) {
          fail(`page.tsx in tool "${toolId}" must be a Server Component. Found "use client".`);
        }
        if (pageContent.includes('useState') || pageContent.includes('useEffect')) {
          fail(`page.tsx in tool "${toolId}" must not use hooks (useState/useEffect).`);
        }

        // Validate "use client" in wrapper
        let wrapperFilePath = '';
        const importMatch = pageContent.match(/import\s+\w+ClientWrapper\s+from\s+['"]([^'"]+)['"]/i) || 
                            pageContent.match(/import\s+\w+Wrapper\s+from\s+['"]([^'"]+)['"]/i);
        if (importMatch && importMatch[1]) {
          const importPath = importMatch[1];
          let targetPath = '';
          if (importPath.startsWith('@/src/features/')) {
            targetPath = path.join(process.cwd(), importPath.replace('@/', ''));
          } else if (importPath.startsWith('src/features/')) {
            targetPath = path.join(process.cwd(), importPath);
          } else if (importPath.startsWith('../') || importPath.startsWith('./')) {
            targetPath = path.resolve(toolDetailPath, importPath);
          }
          if (fs.existsSync(targetPath + '.tsx')) {
            wrapperFilePath = targetPath + '.tsx';
          } else if (fs.existsSync(targetPath + '.ts')) {
            wrapperFilePath = targetPath + '.ts';
          }
        } else {
          const files = fs.readdirSync(toolDetailPath);
          const wrapperFile = files.find(f => f.endsWith('Wrapper.tsx'));
          if (wrapperFile) {
            wrapperFilePath = path.join(toolDetailPath, wrapperFile);
          }
        }

        if (wrapperFilePath && fs.existsSync(wrapperFilePath)) {
          const wrapperContent = fs.readFileSync(wrapperFilePath, 'utf-8');
          if (!wrapperContent.includes('"use client"') && !wrapperContent.includes("'use client'")) {
            fail(`${path.basename(wrapperFilePath)} in tool "${toolId}" must contain "use client" directive.`);
          }
        }
      }
    }
  }
}

// 2. Validate Design System Tokens & Forbidden Patterns in components and app
const allowedFilesRegex = /\.(tsx|ts)$/;
const skippedDirs = ['.next', 'node_modules', 'dist', 'build', 'public', 'scripts'];

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!skippedDirs.includes(file)) {
        scanDirectory(fullPath);
      }
    } else if (allowedFilesRegex.test(file)) {
      validateFile(fullPath);
    }
  }
}

function validateFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(process.cwd(), filePath);
  
  // Skip tests and workers in token validation if they are exempted
  const isTest = file => file.includes('.test.') || file.includes('.spec.');
  const isWorker = file => file.includes('.worker.');
  
  if (isTest(filePath) || isWorker(filePath)) {
    return;
  }

  // A. Check for raw numeric z-index tailwind classes (z-10, z-20, z-30, z-40, z-50 etc.)
  // We exclude comments containing z-index and configuration constants
  const zIndexRegex = /\b(z-(?:10|20|30|40|50))\b/g;
  let match;
  while ((match = zIndexRegex.exec(content)) !== null) {
    // Check if it's on a commented out line
    const lines = content.substring(0, match.index).split('\n');
    const currentLine = lines[lines.length - 1] + content.substring(match.index).split('\n')[0];
    if (!currentLine.trim().startsWith('//') && !currentLine.includes('/*')) {
      fail(`${relPath}: Found hardcoded z-index class "${match[0]}". Use named z-index tokens from src/theme/zindex.ts instead.`);
    }
  }

  // B. Check for raw Tailwind color classes that bypass design tokens
  // E.g. bg-blue-500, text-red-500, border-gray-200, etc.
  const hardcodedColors = /\b(?:bg|text|border|ring|to|from)-(?:gray|red|blue|green|purple|yellow|amber|slate|zinc|neutral|emerald|indigo|violet|orange)-(?:100|200|300|400|500|600|700|800|900)\b/g;
  while ((match = hardcodedColors.exec(content)) !== null) {
    const lines = content.substring(0, match.index).split('\n');
    const currentLine = lines[lines.length - 1] + content.substring(match.index).split('\n')[0];
    // Exclude allowed sample data/constants and comments
    if (!currentLine.trim().startsWith('//') && !currentLine.includes('/*') && !currentLine.includes('COLOR_PALETTE') && !currentLine.includes('SAMPLE')) {
      warn(`${relPath}: Found potential hardcoded color class "${match[0]}". Ensure it matches design system tokens (e.g. text-muted, text-primary, text-danger).`);
    }
  }

  // C. Check for raw alert(), confirm(), prompt(), debugger
  const forbiddenApis = /\b(alert|confirm|prompt|debugger)\s*\(/g;
  while ((match = forbiddenApis.exec(content)) !== null) {
    const lines = content.substring(0, match.index).split('\n');
    const currentLine = lines[lines.length - 1] + content.substring(match.index).split('\n')[0];
    if (!currentLine.trim().startsWith('//') && !currentLine.includes('/*')) {
      fail(`${relPath}: Found forbidden browser API call "${match[1]}()". Use safe dialogs or toasts.`);
    }
  }
}

// Start scans
scanDirectory(path.join(process.cwd(), 'app'));
scanDirectory(path.join(process.cwd(), 'components'));
scanDirectory(path.join(process.cwd(), 'src'));

// 3. Final Report
if (hasFailed) {
  console.log(`\n${RED}=== QUALITY GATE FAILED ===${RESET}`);
  console.log('Please resolve all blocking architectural and design system issues listed above before merging.');
  process.exit(1);
} else {
  success('All KaruviLab Elite Quality Gate checks passed successfully!');
  console.log(`\n${GREEN}=== QUALITY GATE PASSED ===${RESET}`);
  process.exit(0);
}
