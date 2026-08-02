import fs from 'fs/promises';
import path from 'path';

const RULES = {
  P01: {
    id: 'P-01',
    name: 'Raw URL.createObjectURL',
    regex: /URL\.createObjectURL\(/g,
    message: 'Found raw URL.createObjectURL. Use blobManager or useObjectUrlManager.'
  },
  P02: {
    id: 'P-02',
    name: 'Full store destructure',
    regex: /const\s+\{\s*[^}]+\s*\}\s*=\s*use[A-Za-z]+Store\(\)/g,
    message: 'Found full store destructure. Use atomic selectors: useStore(s => s.field).'
  },
  P03: {
    id: 'P-03',
    name: 'Suppressed exhaustive-deps',
    regex: /eslint-disable-next-line\s+react-hooks\/exhaustive-deps/g,
    message: 'Found suppressed exhaustive-deps rule. Fix the dependency array instead.'
  },
  P06: {
    id: 'P-06',
    name: 'Raw HTML injection',
    regex: /dangerouslySetInnerHTML/g,
    message: 'Found dangerouslySetInnerHTML. Ensure DOMPurify.sanitize() is used.'
  },
  P13: {
    id: 'P-13',
    name: 'Usage of any',
    regex: /:\s*any[\s,;>]/g,
    message: 'Found "any" type. Narrow the type or document the exception.'
  },
  P14: {
    id: 'P-14',
    name: 'console.log',
    regex: /console\.(log|info|warn|error)\(/g,
    message: 'Found console.log/info/warn/error. Use structured logger.'
  },
  P16: {
    id: 'P-16',
    name: 'eval() or new Function()',
    regex: /\b(eval\(|new Function\()/g,
    message: 'Found eval() or new Function(). These are forbidden outside trusted worker contexts.'
  },
  P19: {
    id: 'P-19',
    name: 'Raw numeric z-index',
    regex: /\bz-(10|20|30|40|50|auto)\b/g,
    message: 'Found raw numeric z-index (z-10, z-50, etc.). Use named tokens from src/theme/zindex.ts.'
  },
  KL07: {
    id: 'KL-07',
    name: 'Missing ssr: false',
    // We check ToolClientWrapper.tsx files
    regex: /dynamic\([^)]+\)/g,
    check: (content) => {
      if (!content.includes('ssr: false')) {
        return true;
      }
      return false;
    },
    message: 'ToolClientWrapper.tsx is missing ssr: false.'
  },
  KL03: {
    id: 'KL-03',
    name: 'Missing ToolSkeleton in dynamic',
    check: (content) => {
      if (content.includes('dynamic(') && (!content.includes('loading:') || content.includes('loading: () => null') || content.includes('loading: null'))) {
        return true;
      }
      return false;
    },
    message: 'dynamic() import missing <ToolSkeleton> fallback.'
  }
};

async function walkDir(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await walkDir(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function auditFile(filePath, isToolWrapper) {
  const content = await fs.readFile(filePath, 'utf-8');
  const issues = [];
  
  for (const [key, rule] of Object.entries(RULES)) {
    if (key === 'KL07' || key === 'KL03') {
      if (isToolWrapper && rule.check && rule.check(content)) {
        issues.push(rule);
      }
    } else {
      let match;
      const regex = new RegExp(rule.regex);
      let count = 0;
      while ((match = regex.exec(content)) !== null) {
        count++;
      }
      if (count > 0) {
        issues.push({ ...rule, count });
      }
    }
  }
  return issues;
}

async function runAudit() {
  const rootDir = '/home/gowtham/karuvilab';
  const dirsToAudit = [
    path.join(rootDir, 'app', '(tools)'),
    path.join(rootDir, 'src', 'features')
  ];

  let totalIssues = 0;
  const results = {};

  for (const dir of dirsToAudit) {
    try {
      const files = await walkDir(dir);
      for (const file of files) {
        const isToolWrapper = file.endsWith('ToolClientWrapper.tsx');
        const issues = await auditFile(file, isToolWrapper);
        if (issues.length > 0) {
          results[file.replace(rootDir, '')] = issues;
          totalIssues += issues.length;
        }
      }
    } catch (e) {
      console.error(`Error walking ${dir}:`, e.message);
    }
  }

  console.log(JSON.stringify({ totalIssues, results }, null, 2));
}

runAudit();
