import { ToolEntry } from '../types';

export const notes: ToolEntry = {
  id: 'notes',
  name: 'KV Notes',
  desc: 'Private, offline-first note-taking tool with Markdown and checklists.',
  href: 'productivity/notes/',
  category: 'productivity',
  input: 'text',
  output: 'text',
  keywords: ['notes', 'notebook', 'private notes', 'offline notes', 'markdown notes', 'checklist'],
  icon: 'StickyNote',
  color: '#4F46E5',
  featured: true,
  popular: true,
  difficulty: 'beginner',
  related: ['calendar', 'task-reminder', 'markdown'],
  status: 'new',
  lastUpdated: new Date().toISOString().split('T')[0]!,
};
