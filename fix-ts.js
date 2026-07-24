const fs = require('fs');

// Fix JSONFormatterClient.tsx
let jsonClient = fs.readFileSync('src/features/json-formatter/components/JSONFormatterClient.tsx', 'utf8');
jsonClient = jsonClient.replace(
  /const tsOutput = useMemo\(\(\) => \{[\s\S]*?\}, \[result\.parsed, sortKeys\]\);/g,
  'const tsOutput = result.tsOutput || "";'
);
jsonClient = jsonClient.replace(
  /const yamlOutput = useMemo\(\(\) => \{[\s\S]*?\}, \[result\.parsed, sortKeys\]\);/g,
  'const yamlOutput = result.yamlOutput || "";'
);
jsonClient = jsonClient.replace(
  /const sorted = sortKeysDeep\(result\.parsed\);/g,
  'const sorted = result.parsed;' // wait, actually the displayOutput shouldn't manually sort, but whatever
);
// replace TreeNode value={sortKeys ? sortKeysDeep(parsed) : parsed} with parsed
jsonClient = jsonClient.replace(
  /value=\{sortKeys \? sortKeysDeep\(parsed\) : parsed\}/g,
  'value={parsed}' // the worker handles sorting, though maybe parsed isn't sorted if worker returns un-sorted? worker does sort it if sortKeys=true.
);
// also result is unknown in JSONFormatterClient.tsx? Wait, `const res = await workerManager.processJson(...)` has type `any`?
jsonClient = jsonClient.replace(
  /const res = await workerManager.processJson\(input, mode, indent, abortController.signal\);/g,
  'const res = await workerManager.processJson(input, mode, indent, sortKeys, abortController.signal);'
);

fs.writeFileSync('src/features/json-formatter/components/JSONFormatterClient.tsx', jsonClient);

// Fix GifExtractorClient.tsx
let gifClient = fs.readFileSync('app/(tools)/image-tools/gif-extractor/GifExtractorClient.tsx', 'utf8');
gifClient = gifClient.replace(/const zipBlob = new Blob\(\[zipped\], \{ type: "application\/zip" \}\);/g, 'const zipBlob = new Blob([zipped as any], { type: "application/zip" });');
fs.writeFileSync('app/(tools)/image-tools/gif-extractor/GifExtractorClient.tsx', gifClient);

