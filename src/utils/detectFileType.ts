import type { FileType } from '@/types/editor';

export function detectFileType(file: File): FileType {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('image/')) return 'image';
  return null;
}
