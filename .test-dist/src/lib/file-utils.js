export const EXTENSION_TO_LANG = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    css: 'css',
    md: 'markdown',
    py: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    sql: 'sql',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    txt: 'text',
    csv: 'csv',
};
export function detectLanguage(fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return (ext && EXTENSION_TO_LANG[ext]) || 'text';
}
export async function isBinaryFile(file) {
    // Check common binary mime types
    const binaryMimeTypes = [
        'image/',
        'video/',
        'audio/',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'application/x-executable',
    ];
    if (binaryMimeTypes.some(type => file.type.startsWith(type))) {
        return true;
    }
    // Check for null bytes in the first 8KB
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < uint8Array.length; i++) {
                if (uint8Array[i] === 0) {
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        };
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file.slice(0, 8192));
    });
}
export async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
