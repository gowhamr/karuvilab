import { ToolEntry } from '../types';

export const audio_converter: ToolEntry = {
  id: 'audio-converter',
  name: 'Audio Converter',
  desc: 'Convert audio files locally between WAV, MP3, AAC, and Opus formats.',
  href: 'media-tools/audio-converter/',
  category: 'media',
  subCategory: 'Audio',
  keywords: ['audio converter', 'convert wav to mp3', 'mp3 converter', 'opus encoder', 'aac converter', 'private audio tool'],
  popular: true,
  difficulty: 'beginner',
  searchIntent: 'action',
  priority: 0.8,
  status: 'new',
  lastAdded: '2026-06-05',
  related: ['video-trim', 'video-metadata-viewer']
};
