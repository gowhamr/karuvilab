const fs = require('fs');
const path = 'src/features/qa-workbench/components/QAWorkbenchClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import JsonFormatterClient from '@/src/features/json-formatter/components/JsonFormatterClient';",
  "import JsonFormatterClient from '@/src/features/json-formatter/components/JSONFormatterClient';"
);

content = content.replace(
  "import FakeDataGeneratorClient from '@/src/features/fake-data-generator/components/FakeDataGeneratorClient';",
  "import FakeDataGeneratorClient from '@/app/(tools)/developer-tools/fake-data-generator/FakeDataGeneratorClient';"
);

fs.writeFileSync(path, content);
console.log("Patched QAWorkbenchClient.tsx");
