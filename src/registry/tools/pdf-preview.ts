import { ToolEntry } from '../types';

export const pdfPreview: ToolEntry = {
  id: 'pdf-preview',
  name: 'Preview PDF',
  desc: 'A native, fast, offline PDF viewer with search and zoom capabilities.',
  href: 'pdf-tools/pdf-preview/',
  category: 'pdf',
  input: 'pdf',
  output: 'none',
  keywords: ['preview', 'pdf', 'viewer', 'read pdf', 'pdf viewer'],
  related: ['pdf-editor', 'pdf-bookmarks', 'pdf-attachments'],
  status: 'new'
};
