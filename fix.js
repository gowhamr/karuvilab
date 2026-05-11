const fs = require('fs');
let c = fs.readFileSync('app/(tools)/utilities/grammar-checker/GrammarCheckerClient.tsx', 'utf8');

c = c.replace(
  /original: m\[0\], suggestion: m\[1\] \+ " " \+ m\[2\], start: m\.index, end: m\.index \+ m\[0\]\.length/g, 
  'original: m[0]!, suggestion: m[1]! + " " + m[2]!, start: m.index, end: m.index + m[0]!.length'
);

c = c.replace(
  /message: `Missing space after "\$\{m\[1\]\}"`/g, 
  'message: `Missing space after "${m[1]!}"`'
);

c = c.replace(
  /original: trimmed\[0\], suggestion: trimmed\[0\]\.toUpperCase\(\), start: idx, end: idx \+ 1/g,
  'original: trimmed[0]!, suggestion: trimmed[0]!.toUpperCase(), start: idx, end: idx + 1'
);

c = c.replace(
  /message: `Possible passive voice: "\$\{m\[0\]\}"`, original: m\[0\], start: m\.index, end: m\.index \+ m\[0\]\.length/g,
  'message: `Possible passive voice: "${m[0]!}"`, original: m[0]!, start: m.index, end: m.index + m[0]!.length'
);

fs.writeFileSync('app/(tools)/utilities/grammar-checker/GrammarCheckerClient.tsx', c);
console.log("Done");