import { ToolEntry } from '../types';

export const color_palette_extractor: ToolEntry = {
  id: 'color-palette-extractor',
  name: 'Color Palette Extractor',
  desc: 'Extract dominant colors from an image.',
  href: 'image-tools/color-palette-extractor/',
  category: 'image',
  subCategory: 'Analysis',
  keywords: ['color', 'palette', 'extractor', 'image', 'design', 'hex'],
  searchIntent: 'action',
  relatedTools: ['image-compressor', 'image-converter', 'image-resizer'],
};
