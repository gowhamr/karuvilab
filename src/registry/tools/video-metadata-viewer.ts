import { ToolEntry } from '../types';

export const video_metadata_viewer: ToolEntry = {
  id: 'video-metadata-viewer',
  name: 'Video Metadata Viewer',
  desc: 'Instantly inspect video metadata or decoding the full file',
  href: 'media-tools/video-metadata-viewer/',
  category: 'media',
  subCategory: 'Analysis',
  keywords: ['video metadata', 'inspect video', 'video resolution checker', 'video codec info', 'mp4 analyzer'],
  popular: false,
  difficulty: 'beginner',
  searchIntent: 'informational',
  priority: 0.6,
  status: 'new',
  related: ['video-trim', 'audio-converter', 'file-validator']
};
