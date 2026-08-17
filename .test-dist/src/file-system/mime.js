export const MIME_TYPES = {
    pdf: 'application/pdf',
    json: 'application/json',
    csv: 'text/csv',
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    text: 'text/plain',
};
export const isImage = (file) => file.type.startsWith('image/');
export const isPdf = (file) => file.type === MIME_TYPES.pdf;
export const isText = (file) => file.type.startsWith('text/') || file.type === MIME_TYPES.json;
