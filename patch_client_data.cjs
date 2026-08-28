const fs = require('fs');
let client = fs.readFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', 'utf8');
client = client.replace(/data-result-field=/g, "dataResultField=");
client = client.replace(/data-input-field="[^"]+"/g, "");
fs.writeFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', client);
