import { ToolEntry } from '../types';

export const notes: ToolEntry = {
  id: 'notes',
  name: 'Kv Secure Notes',
  desc: 'Zero-transmission, AES-256 encrypted private notes with Markdown and checklists',
  href: 'productivity/notes/',
  category: 'productivity',
  input: 'text',
  output: 'text',
  keywords: ['notes', 'notebook', 'private notes', 'offline notes', 'markdown notes', 'checklist'],
  icon: 'StickyNote',
  color: '#4F46E5',
  featured: true,
  popular: false,
  difficulty: 'beginner',
  related: ['calendar', 'task-reminder', 'markdown'],
  status: 'new',
  lastUpdated: new Date().toISOString().split('T')[0]!,
};
