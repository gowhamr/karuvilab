import { ToolEntry } from '../types';

export const gif_creator: ToolEntry = {
  id: 'gif-creator',
  name: 'GIF Creator',
  desc: 'Create lightweight animated GIFs from uploaded images entirely inside your browser.',
  href: 'media-tools/gif-creator/',
  category: 'media',
  subCategory: 'Animation',
  keywords: ['gif creator', 'make gif', 'animated gif maker', 'images to gif', 'online gif maker', 'private gif tool'],
  popular: false,
  difficulty: 'beginner',
  searchIntent: 'action',
  priority: 0.7,
  status: 'new',
  related: ['image-compressor', 'image-resizer', 'image-converter']
};
