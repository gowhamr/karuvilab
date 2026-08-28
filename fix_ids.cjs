const fs = require('fs');
let client = fs.readFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', 'utf8');

const idMap = {
  'Lean Expense Multiplier': 'lean-expense',
  'Fat Expense Multiplier': 'fat-expense',
  'Traditional Retirement Age': 'trad-retire-age',
  'Current Age': 'current-age',
  'Age to Stop Investing (Coast)': 'target-age',
  'Target FIRE Age': 'target-age',
  'Expected Return Rate': 'return-rate',
  'Expense Inflation Rate': 'inflation-rate',
  'Withdrawal Rate': 'withdrawal-rate',
};

// Simple regex replace to add id based on label
client = client.replace(/<SliderField\s+label="([^"]+)"/g, (match, label) => {
  let id = "slider-id";
  for (let key in idMap) {
    if (label.includes(key)) id = idMap[key];
  }
  return `<SliderField id="${id}" label="${label}"`;
});

// Also tool inputs? ToolInput might need id too. Let's check ToolInput props.
// Wait, the errors were only for SliderField. I will add id to ToolInput just in case.
client = client.replace(/<ToolInput\s+label="([^"]+)"/g, (match, label) => {
  let id = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `<ToolInput id="${id}" label="${label}"`;
});


fs.writeFileSync('app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomClient.tsx', client);
