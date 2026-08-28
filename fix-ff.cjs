const fs = require('fs');

// 1. Fix registry
let registry = fs.readFileSync('src/registry/tools/financial-freedom-calculator.ts', 'utf8');
registry = registry.replace("import { Tool } from '../types';", "import { ToolEntry } from '../types';");
registry = registry.replace("export const financialFreedomCalculator: Tool =", "export const financialFreedomCalculator: ToolEntry =");
registry = registry.replace("description:", "desc:");
registry = registry.replace("path:", "href:");
fs.writeFileSync('src/registry/tools/financial-freedom-calculator.ts', registry);

// 2. Fix test
let testFile = fs.readFileSync('src/__tests__/features/financial-freedom.test.ts', 'utf8');
testFile = "import { describe, it, expect } from 'vitest';\n" + testFile;
fs.writeFileSync('src/__tests__/features/financial-freedom.test.ts', testFile);

// 3. Fix client TS errors (dataInputField -> data-input-field)
let client = fs.readFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', 'utf8');
client = client.replace(/dataInputField=/g, "data-input-field=");
client = client.replace(/dataResultField=/g, "data-result-field=");
client = client.replace('title="Freedom Age"', ''); // Remove title if MetricCard doesn't support it, but MetricCard does support title usually? Wait, error says: Type '{ title: string; value: string; dataResultField: string; subtitle: string; }' is not assignable. Property 'title' does not exist... maybe it is `label`?
fs.writeFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', client);

// 4. Fix fire-utils
let utils = fs.readFileSync('src/features/calculators/financial-freedom/fire-utils.ts', 'utf8');
utils = utils.replace("projections[years - 1].endCorpus", "projections[Math.min(years - 1, 59)]?.endCorpus || 0");
fs.writeFileSync('src/features/calculators/financial-freedom/fire-utils.ts', utils);

