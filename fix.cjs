const fs = require('fs');
const file = '/home/gowtham/karuvilab/app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'return (\n                const isMatch',
  'const isMatch'
);

c = c.replace(
  'contentClassName="min-h-16 h-auto" // overrides the min-h-30 to be compact\n                  />\n                </div>',
  'contentClassName="min-h-16 h-auto" // overrides the min-h-30 to be compact\n                  />\n                </div>'
); // Wait, I already added </div> in my previous replacement? Let's check!

fs.writeFileSync(file, c);
