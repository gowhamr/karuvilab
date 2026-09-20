import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import parser from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const scanDirs = ['app', 'components', 'src'];
const excludePatterns = ['node_modules', '.next', '.test-dist', 'dist', '__tests__', '.d.ts'];

const findings = [];

function isExcluded(filePath) {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!isExcluded(fullPath)) {
        getAllFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && /\.(tsx|jsx|ts|js)$/.test(entry.name)) {
      if (!isExcluded(fullPath)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function isInsideRadixTriggerOrClose(pathNode) {
  let parent = pathNode.parentPath;
  while (parent) {
    if (parent.isJSXElement()) {
      const opening = parent.node.openingElement;
      const name = getElementName(opening.name);
      if (
        name.endsWith('.Trigger') ||
        name.endsWith('.Close') ||
        name.endsWith('.Item') ||
        name === 'PopoverTrigger' ||
        name === 'DialogClose' ||
        name === 'DropdownMenuTrigger' ||
        name === 'TooltipTrigger' ||
        name === 'AccordionTrigger' ||
        name === 'TabsTrigger' ||
        name === 'Link' ||
        name === 'label'
      ) {
        return true;
      }
    }
    parent = parent.parentPath;
  }
  return false;
}

function checkAST(filePath, code) {
  const relPath = path.relative(rootDir, filePath);
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    });
  } catch (err) {
    return;
  }

  traverse(ast, {
    JSXOpeningElement(pathNode) {
      const elementName = getElementName(pathNode.node.name);
      const attributes = pathNode.node.attributes || [];
      const loc = pathNode.node.loc?.start || { line: 0, column: 0 };

      const attrMap = {};
      for (const attr of attributes) {
        if (attr.type === 'JSXAttribute') {
          const name = attr.name.name;
          attrMap[name] = attr.value;
        } else if (attr.type === 'JSXSpreadAttribute') {
          attrMap['...spread'] = true;
        }
      }

      // Check 1: Empty / Noop event handlers (onClick, onSelect, onChange, onSubmit, onKeyDown)
      for (const eventName of ['onClick', 'onSelect', 'onChange', 'onSubmit', 'onKeyDown']) {
        if (attrMap[eventName]) {
          const eventVal = attrMap[eventName];
          if (eventVal && eventVal.type === 'JSXExpressionContainer') {
            const expr = eventVal.expression;
            if (isNoopFunction(expr)) {
              findings.push({
                file: relPath,
                line: loc.line,
                severity: 'BLOCKER',
                type: 'EMPTY_EVENT_HANDLER',
                element: elementName,
                detail: `Element has an empty / no-op ${eventName} handler: () => {}`,
                snippet: getCodeSnippet(code, loc.line)
              });
            } else if (isComingSoonOrAlertOnly(expr, code)) {
              findings.push({
                file: relPath,
                line: loc.line,
                severity: 'BLOCKER',
                type: 'PLACEHOLDER_ACTION',
                element: elementName,
                detail: `Element ${eventName} triggers a placeholder alert or "coming soon" toast without real functionality`,
                snippet: getCodeSnippet(code, loc.line)
              });
            }
          }
        }
      }

      // Check 2: Native <button> without action
      if (elementName === 'button') {
        const hasOnClick = 'onClick' in attrMap || 'onPointerDown' in attrMap || 'onMouseDown' in attrMap;
        const hasSpread = '...spread' in attrMap;
        const typeAttr = attrMap['type'];
        let typeVal = 'button';
        if (typeAttr && typeAttr.type === 'StringLiteral') {
          typeVal = typeAttr.value;
        }
        const isDisabled = 'disabled' in attrMap;
        const hasForm = 'form' in attrMap;
        const insideTrigger = isInsideRadixTriggerOrClose(pathNode);

        // Check if there is an <input type="file"> sibling inside the same parent container
        const hasFileInputSibling = checkFileInputSibling(pathNode);

        if (!hasOnClick && !hasSpread && !hasForm && typeVal === 'button' && !isDisabled && !insideTrigger && !hasFileInputSibling) {
          findings.push({
            file: relPath,
            line: loc.line,
            severity: 'BLOCKER',
            type: 'BUTTON_MISSING_ACTION',
            element: elementName,
            detail: '<button> has type="button" (or default) but has no onClick handler, form action, Radix trigger context, or spread props',
            snippet: getCodeSnippet(code, loc.line)
          });
        }
      }

      // Check 3: Broken / Dummy links <a> and <Link>
      if (elementName === 'a' || elementName === 'Link') {
        const hrefAttr = attrMap['href'];
        const onClickAttr = attrMap['onClick'];
        const hasSpread = '...spread' in attrMap;

        if (!hrefAttr && !onClickAttr && !hasSpread) {
          findings.push({
            file: relPath,
            line: loc.line,
            severity: 'HIGH',
            type: 'LINK_MISSING_HREF',
            element: elementName,
            detail: `<${elementName}> is missing an href attribute and has no onClick handler`,
            snippet: getCodeSnippet(code, loc.line)
          });
        } else if (hrefAttr && hrefAttr.type === 'StringLiteral') {
          const hrefVal = hrefAttr.value.trim();
          if (hrefVal === '#' || hrefVal === '' || hrefVal === 'javascript:void(0)' || hrefVal === 'javascript:;' || hrefVal === 'javascript:void(0);') {
            if (!onClickAttr && !hasSpread) {
              findings.push({
                file: relPath,
                line: loc.line,
                severity: 'BLOCKER',
                type: 'DUMMY_HREF_LINK',
                element: elementName,
                detail: `<${elementName}> has dummy href="${hrefVal}" with no onClick handler (dead link)`,
                snippet: getCodeSnippet(code, loc.line)
              });
            }
          }
        }
      }

      // Check 4: Pseudo-interactive cursor-pointer elements
      const classAttr = attrMap['className'];
      if (classAttr && classAttr.type === 'StringLiteral') {
        const classVal = classAttr.value;
        if (/\bcursor-pointer\b/.test(classVal)) {
          const isNativeInteractive = [
            'button', 'a', 'Link', 'input', 'select', 'textarea', 'label', 'summary',
            'AccordionTrigger', 'TabsTrigger', 'DropdownMenuItem', 'DialogClose', 'PopoverClose'
          ].includes(elementName);
          const hasOnClick = 'onClick' in attrMap || 'onPointerDown' in attrMap;
          const hasSpread = '...spread' in attrMap;
          const insideInteractive = isInsideRadixTriggerOrClose(pathNode);
          const hasFileInputSibling = checkFileInputSibling(pathNode);

          if (!isNativeInteractive && !hasOnClick && !hasSpread && !insideInteractive && !hasFileInputSibling) {
            findings.push({
              file: relPath,
              line: loc.line,
              severity: 'MEDIUM',
              type: 'CURSOR_POINTER_WITHOUT_ONCLICK',
              element: elementName,
              detail: `<${elementName} className="...cursor-pointer..."> has pointer styling but no onClick handler or interactive semantics`,
              snippet: getCodeSnippet(code, loc.line)
            });
          }
        }
      }

      // Check 5: role="button" without onClick
      if (attrMap['role'] && attrMap['role'].type === 'StringLiteral' && attrMap['role'].value === 'button') {
        if (elementName !== 'button') {
          const hasOnClick = 'onClick' in attrMap || 'onPointerDown' in attrMap;
          const hasSpread = '...spread' in attrMap;
          const insideInteractive = isInsideRadixTriggerOrClose(pathNode);

          if (!hasOnClick && !hasSpread && !insideInteractive) {
            findings.push({
              file: relPath,
              line: loc.line,
              severity: 'HIGH',
              type: 'ROLE_BUTTON_WITHOUT_ACTION',
              element: elementName,
              detail: `<${elementName} role="button"> has ARIA button role but no onClick handler`,
              snippet: getCodeSnippet(code, loc.line)
            });
          }
        }
      }
    }
  });
}

function checkFileInputSibling(pathNode) {
  let parent = pathNode.parentPath;
  if (parent && parent.isJSXElement()) {
    const children = parent.node.children || [];
    for (const child of children) {
      if (child.type === 'JSXElement') {
        const name = getElementName(child.openingElement.name);
        if (name === 'input') {
          for (const attr of child.openingElement.attributes || []) {
            if (attr.type === 'JSXAttribute' && attr.name.name === 'type') {
              if (attr.value?.value === 'file') {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}

function getElementName(nameNode) {
  if (!nameNode) return 'unknown';
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') {
    return `${getElementName(nameNode.object)}.${nameNode.property.name}`;
  }
  return 'unknown';
}

function isNoopFunction(expr) {
  if (!expr) return false;
  if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') {
    if (expr.body.type === 'BlockStatement') {
      return expr.body.body.length === 0;
    }
    if (expr.body.type === 'Identifier' && expr.body.name === 'undefined') {
      return true;
    }
  }
  if (expr.type === 'Identifier' && (expr.name === 'noop' || expr.name === 'NOOP')) {
    return true;
  }
  return false;
}

function isComingSoonOrAlertOnly(expr, fullCode) {
  if (!expr || expr.start === undefined || expr.end === undefined) return false;
  const exprCode = fullCode.substring(expr.start, expr.end);
  const comingSoonPattern = /(alert|toast(\.info|\.warn|\.warning|\.error)?)\s*\(\s*["'`][^"'`]*(coming soon|under construction|not yet implemented|wip|work in progress|todo)[^"'`]*["'`]\s*\)/i;
  return comingSoonPattern.test(exprCode);
}

function getCodeSnippet(code, lineNum) {
  const lines = code.split('\n');
  const start = Math.max(0, lineNum - 2);
  const end = Math.min(lines.length, lineNum + 1);
  return lines.slice(start, end).map((l, i) => `${start + i + 1}: ${l}`).join('\n');
}

// Run scanner
console.log('🔍 Starting Deep QA Zero Dead Element Audit across all project files...');
let allFiles = [];
for (const dir of scanDirs) {
  const fullDir = path.join(rootDir, dir);
  if (fs.existsSync(fullDir)) {
    getAllFiles(fullDir, allFiles);
  }
}

console.log(`📂 Scanning ${allFiles.length} source files...`);

for (const filePath of allFiles) {
  const code = fs.readFileSync(filePath, 'utf-8');
  checkAST(filePath, code);
}

console.log(`\n📊 Audit Complete: Found ${findings.length} total potential dead element issues.`);

const summary = {};
findings.forEach(f => {
  summary[f.type] = (summary[f.type] || 0) + 1;
});
console.log('\n--- Finding Summary by Type ---');
console.table(summary);

const reportPath = path.join(rootDir, 'dead_elements_audit.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  filesScanned: allFiles.length,
  totalFindings: findings.length,
  summary,
  findings
}, null, 2));

console.log(`\n📄 Detailed JSON report written to ${reportPath}`);
