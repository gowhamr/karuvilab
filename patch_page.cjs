const fs = require('fs');
let page = fs.readFileSync('app/(tools)/calculators/financial-freedom-calculator/page.tsx', 'utf8');
page = page.replace("generateToolMetadata(financialFreedomCalculator);", "generateToolMetadata(financialFreedomCalculator.id);");
page = page.replace("financialFreedomCalculator.description", "financialFreedomCalculator.desc");
fs.writeFileSync('app/(tools)/calculators/financial-freedom-calculator/page.tsx', page);
