const fs = require('fs');
let c = fs.readFileSync('src/features/calculators/date/date-calc-utils.ts', 'utf8');

c = c.replace(
  "import {",
  "export function isValidDateString(y: number, m: number, d: number) { return d > 0 && d <= getDaysInMonth(y, m); }\nimport {"
);

fs.writeFileSync('src/features/calculators/date/date-calc-utils.ts', c);

