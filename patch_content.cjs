const fs = require('fs');
let c = fs.readFileSync('src/registry/core-registry.ts', 'utf8');

if (!c.includes('financialFreedomCalculatorContent')) {
  c = c.replace(
    "import { ageCalculatorContent } from '../content/tools/age-calculator';",
    "import { ageCalculatorContent } from '../content/tools/age-calculator';\nimport { financialFreedomCalculatorContent } from '../content/tools/financial-freedom-calculator';"
  );
  c = c.replace(
    "ageCalculatorContent,",
    "ageCalculatorContent,\n  financialFreedomCalculatorContent,"
  );
  fs.writeFileSync('src/registry/core-registry.ts', c);
}
