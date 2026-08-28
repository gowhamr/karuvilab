const fs = require('fs');
let c = fs.readFileSync('src/registry/core-registry.ts', 'utf8');

if (!c.includes('financialFreedomCalculator')) {
  c = c.replace(
    "import { ageCalculator } from './tools/age-calculator';",
    "import { ageCalculator } from './tools/age-calculator';\nimport { financialFreedomCalculator } from './tools/financial-freedom-calculator';"
  );
  c = c.replace(
    "ageCalculator,",
    "ageCalculator,\n  financialFreedomCalculator,"
  );
  fs.writeFileSync('src/registry/core-registry.ts', c);
}
