import { ToolEntry } from '../types';

export const video_trim: ToolEntry = {
  id: 'video-trim',
  name: 'Video Trimmer',
  desc: 'Trim MP4, WebM, and MOV videos without re-encoding',
  href: 'media-tools/video-trim/',
  category: 'media',
  subCategory: 'Video',
  keywords: ['video trim', 'cut video', 'mp4 trimmer', 'webm cutter', 'fast video trim', 'private video editor'],
  popular: false,
  difficulty: 'beginner',
  searchIntent: 'action',
  priority: 0.9,
  status: 'new',
  related: ['audio-converter', 'video-metadata-viewer', 'gif-creator']
};
