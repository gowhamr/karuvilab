const fs = require('fs');

let c = fs.readFileSync('src/features/calculators/date/date-calc-utils.ts', 'utf8');

c = c.replace(
  "isValidDateString,",
  ""
);

c = c.replace(
  "years: calDiff.years,\n      months: calDiff.months,\n      days: includeEndDay ? calDiff.days + 1 : calDiff.days,",
  "years: calDiff?.years || 0,\n      months: calDiff?.months || 0,\n      days: includeEndDay ? (calDiff?.days || 0) + 1 : (calDiff?.days || 0),"
);
fs.writeFileSync('src/features/calculators/date/date-calc-utils.ts', c);

