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

let allFiles = [];
for (const dir of scanDirs) {
  const fullDir = path.join(rootDir, dir);
  if (fs.existsSync(fullDir)) {
    getAllFiles(fullDir, allFiles);
  }
}

const report = {
  totalFiles: allFiles.length,
  findings: [],
};

function getCodeSnippet(code, lineNum) {
  const lines = code.split('\n');
  const start = Math.max(0, lineNum - 3);
  const end = Math.min(lines.length, lineNum + 2);
  return lines.slice(start, end).map((l, i) => `${start + i + 1}: ${l}`).join('\n');
}

function getElementName(nameNode) {
  if (!nameNode) return 'unknown';
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') {
    return `${getElementName(nameNode.object)}.${nameNode.property.name}`;
  }
  return 'unknown';
}

function isInsideRadix(pathNode) {
  let parent = pathNode.parentPath;
  while (parent) {
    if (parent.isJSXElement()) {
      const opening = parent.node.openingElement;
      const name = getElementName(opening.name);
      if (
        name.includes('Trigger') ||
        name.includes('Close') ||
        name.includes('Item') ||
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

for (const filePath of allFiles) {
  const relPath = path.relative(rootDir, filePath);
  const code = fs.readFileSync(filePath, 'utf-8');

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    });
  } catch (err) {
    continue;
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

      // Check 1: Button with no action
      if (elementName === 'button') {
        const hasOnClick = 'onClick' in attrMap || 'onPointerDown' in attrMap || 'onMouseDown' in attrMap;
        const hasSpread = '...spread' in attrMap;
        const typeAttr = attrMap['type'];
        const typeVal = typeAttr && typeAttr.type === 'StringLiteral' ? typeAttr.value : 'button';
        const isDisabled = 'disabled' in attrMap;
        const hasForm = 'form' in attrMap;
        const insideRadixOrLabel = isInsideRadix(pathNode);

        if (!hasOnClick && !hasSpread && !hasForm && typeVal === 'button' && !isDisabled && !insideRadixOrLabel) {
          report.findings.push({
            rule: 'P-12 / Rule 12.1',
            severity: 'BLOCKER',
            category: 'DEAD_BUTTON',
            file: relPath,
            line: loc.line,
            element: '<button>',
            description: '<button> element rendered without onClick handler, form action, or parent interactive trigger.',
            snippet: getCodeSnippet(code, loc.line)
          });
        }
      }

      // Check 2: Empty handler
      for (const handlerName of ['onClick', 'onChange', 'onSubmit', 'onSelect', 'onProcess']) {
        if (attrMap[handlerName] && attrMap[handlerName].type === 'JSXExpressionContainer') {
          const expr = attrMap[handlerName].expression;
          if (
            (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') &&
            expr.body.type === 'BlockStatement' &&
            expr.body.body.length === 0
          ) {
            report.findings.push({
              rule: 'P-12 / Rule 12.1',
              severity: 'BLOCKER',
              category: 'EMPTY_EVENT_HANDLER',
              file: relPath,
              line: loc.line,
              element: `<${elementName} ${handlerName}={...}>`,
              description: `Empty / no-op event handler passed to ${handlerName}: () => {}`,
              snippet: getCodeSnippet(code, loc.line)
            });
          }
        }
      }

      // Check 3: Links with dead hrefs
      if (elementName === 'a' || elementName === 'Link') {
        const href = attrMap['href'];
        const onClick = attrMap['onClick'];
        const hasSpread = '...spread' in attrMap;
        if (href && href.type === 'StringLiteral') {
          const val = href.value.trim();
          if (val === '#' || val === '' || val.startsWith('javascript:')) {
            if (!onClick && !hasSpread) {
              report.findings.push({
                rule: 'P-12 / Rule 12.1',
                severity: 'BLOCKER',
                category: 'DEAD_LINK',
                file: relPath,
                line: loc.line,
                element: `<${elementName} href="${val}">`,
                description: `Link has dead href="${val}" without an onClick action handler.`,
                snippet: getCodeSnippet(code, loc.line)
              });
            }
          }
        }
      }
    }
  });
}

console.log(`\n========================================`);
console.log(`🔍 KARUVILAB ZERO DEAD ELEMENT QA REPORT`);
console.log(`========================================`);
console.log(`Total Source Files Analyzed: ${report.totalFiles}`);
console.log(`Total Confirmed Dead Element Issues: ${report.findings.length}\n`);

report.findings.forEach((f, idx) => {
  console.log(`[Issue #${idx + 1}] [${f.severity}] [${f.category}] ${f.file}:${f.line}`);
  console.log(`Element: ${f.element}`);
  console.log(`Description: ${f.description}`);
  console.log(`Rule: ${f.rule}`);
  console.log(`Snippet:\n${f.snippet}\n----------------------------------------`);
});

fs.writeFileSync(path.join(rootDir, 'deep_qa_verified_report.json'), JSON.stringify(report, null, 2));
