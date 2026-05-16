export const MIME_TYPES = {
  pdf: 'application/pdf',
  json: 'application/json',
  csv: 'text/csv',
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  text: 'text/plain',
} as const;

export const isImage = (file: File) => file.type.startsWith('image/');
export const isPdf = (file: File) => file.type === MIME_TYPES.pdf;
export const isText = (file: File) => file.type.startsWith('text/') || file.type === MIME_TYPES.json;
