const fs = require('fs');
let client = fs.readFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', 'utf8');
client = client.replace(/title=/g, "label=");
client = client.replace(/subtitle=/g, "sub=");
client = client.replace(/highlight/g, "accent");
fs.writeFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', client);
