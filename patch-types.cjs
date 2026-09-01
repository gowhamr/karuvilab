const fs = require('fs');

let typesContent = fs.readFileSync('src/workers/types.ts', 'utf8');

const importType = "import { MetadataDocument } from '../features/metadata-viewer/types';\n";
typesContent = importType + typesContent;

const methodType = `
  inspectMetadata(
    fileData: ArrayBuffer, 
    fileName: string, 
    mimeClaimed: string, 
    lastModified: number
  ): Promise<MetadataDocument>;
`;

typesContent = typesContent.replace('export interface WorkerAPI {', 'export interface WorkerAPI {' + methodType);

fs.writeFileSync('src/workers/types.ts', typesContent);
console.log('Types patched!');
