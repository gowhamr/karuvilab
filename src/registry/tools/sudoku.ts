import { ToolEntry } from '../types';

export const sudoku: ToolEntry = {
  id: 'sudoku',
  name: 'Sudoku',
  desc: 'Classic 9x9 Sudoku logical number placement puzzle with multiple difficulty modes, hints, and local best times.',
  href: 'break-time-tools/sudoku/',
  category: 'break-time',
  icon: null,
  color: '#8B5CF6',
  featured: false,
  popular: false,
  status: 'new',
  lastAdded: '2026-07-11',
  keywords: ['sudoku', 'number puzzle', 'logic game', 'brain training', 'puzzle', 'offline'],
  input: null,
  output: null,
  related: ['game-2048', 'memory-match', 'word-guess'],
  subCategory: 'Puzzles',
  requiresNetwork: false,
  difficulty: 'intermediate',
  priority: 0.8,
  schemaType: 'WebApplication',
};
