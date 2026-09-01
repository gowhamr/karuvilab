const fs = require('fs');

const typesTs = fs.readFileSync('src/features/metadata-viewer/types.ts', 'utf8');

const targetWorker = 'src/workers/karuvi.worker.ts';
let workerContent = fs.readFileSync(targetWorker, 'utf8');

const imports = `import { MetadataDocument, PrivacyFinding } from '../features/metadata-viewer/types';

const MAGIC_MAP: Record<string, { format: string; mime: string; ext: string[] }> = {
  'FFD8FFE0': { format: 'JPEG', mime: 'image/jpeg', ext: ['jpg', 'jpeg'] },
  'FFD8FFE1': { format: 'JPEG', mime: 'image/jpeg', ext: ['jpg', 'jpeg'] },
  'FFD8FFE2': { format: 'JPEG', mime: 'image/jpeg', ext: ['jpg', 'jpeg'] },
  '89504E47': { format: 'PNG', mime: 'image/png', ext: ['png'] },
  '47494638': { format: 'GIF', mime: 'image/gif', ext: ['gif'] },
  '25504446': { format: 'PDF', mime: 'application/pdf', ext: ['pdf'] },
  '504B0304': { format: 'ZIP', mime: 'application/zip', ext: ['zip', 'docx', 'xlsx', 'pptx', 'epub'] },
  '52494646': { format: 'RIFF', mime: 'image/webp', ext: ['webp', 'wav', 'avi'] },
  '4D4D002A': { format: 'TIFF (Big Endian)', mime: 'image/tiff', ext: ['tif', 'tiff'] },
  '49492A00': { format: 'TIFF (Little Endian)', mime: 'image/tiff', ext: ['tif', 'tiff'] },
  '424D': { format: 'BMP', mime: 'image/bmp', ext: ['bmp'] },
  '4D5A': { format: 'Windows Executable', mime: 'application/x-msdownload', ext: ['exe', 'dll'] },
  '7F454C46': { format: 'ELF Executable', mime: 'application/x-executable', ext: ['elf', 'so'] },
};

function toHex(buffer: Uint8Array): string {
  return Array.from(buffer).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function identifyMagic(hex: string): { format: string; mime: string; ext: string[] } | null {
  for (const [magic, info] of Object.entries(MAGIC_MAP)) {
    if (hex.startsWith(magic)) {
      if (magic === '52494646' && hex.length >= 24) {
        const webpTag = hex.substring(16, 24);
        if (webpTag === '57454250') return { format: 'WebP', mime: 'image/webp', ext: ['webp'] };
      }
      return info;
    }
  }
  return null;
}
`;

const method = `  async inspectMetadata(fileData: ArrayBuffer, fileName: string, mimeClaimed: string, lastModified: number): Promise<MetadataDocument> {
    const extMatch = fileName.match(/\\.([^.]+)$/);
    const extensionClaimed = extMatch ? extMatch[1].toLowerCase() : '';
    
    let magicBytesHex = '';
    let detectedFormat = 'Unknown';
    let detectedMime = 'Unknown';
    let isExtensionConsistent = true;
    
    try {
      const buffer = new Uint8Array(fileData.slice(0, 32));
      magicBytesHex = toHex(buffer);
      
      const identity = identifyMagic(magicBytesHex);
      if (identity) {
        detectedFormat = identity.format;
        detectedMime = identity.mime;
        if (extensionClaimed) {
          isExtensionConsistent = identity.ext.includes(extensionClaimed);
        }
      }
    } catch (err) {}

    const doc: MetadataDocument = {
      file: {
        name: fileName,
        sizeBytes: fileData.byteLength,
        lastModified,
        extensionClaimed,
        mimeClaimed: mimeClaimed || 'Unknown'
      },
      forensics: {
        magicBytes: magicBytesHex.substring(0, 16) + (magicBytesHex.length > 16 ? '...' : ''),
        detectedFormat,
        detectedMime,
        isExtensionConsistent
      },
      technical: {},
      namespaces: {},
      privacy: []
    };

    return doc;
  },
`;

workerContent = workerContent.replace('import * as Comlink from "comlink";', 'import * as Comlink from "comlink";\n' + imports);
workerContent = workerContent.replace('export const api = {', 'export const api = {\n' + method);

fs.writeFileSync(targetWorker, workerContent);
console.log('Worker patched!');
