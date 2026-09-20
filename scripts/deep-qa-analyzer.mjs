import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const auditCategories = {
  emptyHandlers: [],
  comingSoonAlerts: [],
  dummyHrefs: [],
  unwiredButtons: [],
  emptyFunctionsInProps: [],
  unhandledTabs: [],
};

for (const file of allFiles) {
  const relPath = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check: Empty handlers like onClick={() => {}} or onSelect={() => {}} or onProcess={async () => {}}
    if (/on[A-Z][a-zA-Z]+\s*=\s*\{\s*(async\s*)?\(\s*[^)]*\)\s*=>\s*\{\s*\}\s*\}/.test(line)) {
      auditCategories.emptyHandlers.push({
        file: relPath,
        line: lineNum,
        code: line.trim()
      });
    }

    // Check: Coming soon / placeholder alerts / toasts
    if (/(alert|toast(\.[a-zA-Z]+)?)\s*\(\s*["'`][^"'`]*(coming soon|not implemented|work in progress|under construction)[^"'`]*["'`]\s*\)/i.test(line)) {
      auditCategories.comingSoonAlerts.push({
        file: relPath,
        line: lineNum,
        code: line.trim()
      });
    }

    // Check: href="#" or href=""
    if (/<(a|Link)\b[^>]*\bhref\s*=\s*["'](#|\s*|javascript:\s*void\(0\);?|javascript:\s*;)["']/.test(line)) {
      auditCategories.dummyHrefs.push({
        file: relPath,
        line: lineNum,
        code: line.trim()
      });
    }

    // Check: TODO or FIXME inside action handlers
    if (/\b(onClick|onProcess|onDownload|onExport|onSelect|onSubmit)\b.*(TODO|FIXME|noop|unimplemented)/i.test(line)) {
      auditCategories.unwiredButtons.push({
        file: relPath,
        line: lineNum,
        code: line.trim()
      });
    }
  });
}

console.log('=== DEEP QA AUDIT RESULTS ===');
console.log(`Files scanned: ${allFiles.length}`);
console.log(`Empty event handlers: ${auditCategories.emptyHandlers.length}`);
console.log(`Coming soon / placeholder alerts: ${auditCategories.comingSoonAlerts.length}`);
console.log(`Dummy href links: ${auditCategories.dummyHrefs.length}`);
console.log(`Unwired / TODO action handlers: ${auditCategories.unwiredButtons.length}`);

console.log('\n--- Details of Empty Handlers ---');
console.log(JSON.stringify(auditCategories.emptyHandlers, null, 2));

console.log('\n--- Details of Coming Soon Alerts ---');
console.log(JSON.stringify(auditCategories.comingSoonAlerts, null, 2));

console.log('\n--- Details of Dummy Hrefs ---');
console.log(JSON.stringify(auditCategories.dummyHrefs, null, 2));

console.log('\n--- Details of Unwired / TODO Handlers ---');
console.log(JSON.stringify(auditCategories.unwiredButtons, null, 2));

fs.writeFileSync(path.join(rootDir, 'deep_qa_report.json'), JSON.stringify(auditCategories, null, 2));
