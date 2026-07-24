const fs = require('fs');

let workerStr = fs.readFileSync('src/workers/karuvi.worker.ts', 'utf8');
workerStr = workerStr.replace(/const api: WorkerAPI = \{/g, 'const api = {');
workerStr = workerStr.replace(/Comlink\.expose\(api\);/g, 'Comlink.expose(api as unknown as WorkerAPI);');
fs.writeFileSync('src/workers/karuvi.worker.ts', workerStr);

// Also remove sortKeysDeep from displayOutput useMemo
let jsonClient = fs.readFileSync('src/features/json-formatter/components/JSONFormatterClient.tsx', 'utf8');
jsonClient = jsonClient.replace(
  /const sorted = sortKeys \? sortKeysDeep\(result\.parsed\) : result\.parsed;/g,
  'const sorted = result.parsed;'
);
fs.writeFileSync('src/features/json-formatter/components/JSONFormatterClient.tsx', jsonClient);
