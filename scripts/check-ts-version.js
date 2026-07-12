import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const tsPackageJsonPath = path.resolve(__dirname, '../node_modules/typescript/package.json');
  const tsPackage = JSON.parse(fs.readFileSync(tsPackageJsonPath, 'utf8'));
  
  if (tsPackage.version !== '6.0.3') {
    console.error(`\n❌ ERROR: TypeScript version must be exactly 6.0.3 (found ${tsPackage.version}).`);
    console.error(`This is locked due to unresolved AST and Next.js verification blockers with TS 7.x.\n`);
    process.exit(1);
  }
  console.log(`✅ TypeScript version verified: ${tsPackage.version}`);
} catch (err) {
  console.error('\n❌ ERROR: Failed to verify TypeScript version.', err.message, '\n');
  process.exit(1);
}
