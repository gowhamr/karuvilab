const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'src'];
const basePath = path.resolve(__dirname, '..');

const patterns = {
  ArbitraryTailwind: /\b(w|h|text|bg|gap|p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|rounded|top|bottom|left|right)-\[[^\]]+\]/g,
  HardcodedZIndex: /\bz-(10|20|30|40|50|auto)\b/g,
  ConsoleLog: /console\.log\(/g,
  ExhaustiveDeps: /eslint-disable-next-line react-hooks\/exhaustive-deps/g,
  RawObjectURL: /URL\.createObjectURL/g,
  AnyType: /:\s*any\b|as\s+any\b/g,
  Eval: /\beval\(/g,
};

const results = {
  filesScanned: 0,
  largeFiles: [],
  violations: {}
};

for (const key of Object.keys(patterns)) {
  results.violations[key] = [];
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      results.filesScanned++;
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      if (lines.length > 500) {
        results.largeFiles.push({ file: fullPath.replace(basePath, ''), lines: lines.length });
      }
      
      for (const [key, regex] of Object.entries(patterns)) {
        let match;
        // reset regex
        regex.lastIndex = 0;
        while ((match = regex.exec(content)) !== null) {
          // Find line number
          const lineNumber = content.substring(0, match.index).split('\n').length;
          results.violations[key].push({
            file: fullPath.replace(basePath, ''),
            line: lineNumber,
            match: match[0]
          });
        }
      }
    }
  }
}

dirsToScan.forEach(dir => scanDir(path.join(basePath, dir)));

fs.writeFileSync(path.join(basePath, 'qa_report.json'), JSON.stringify(results, null, 2));
console.log('QA Report generated.');
