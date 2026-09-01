const fs = require('fs');
let file = fs.readFileSync('src/features/metadata-viewer/metadata-viewerClient.tsx', 'utf8');
file = file.replace(/const result = await workerOrchestrator\.dispatch.*/, "const result = await workerOrchestrator.dispatch('inspectMetadata', [buffer, file.name, file.type, file.lastModified], [buffer]) as MetadataDocument;");
fs.writeFileSync('src/features/metadata-viewer/metadata-viewerClient.tsx', file);
