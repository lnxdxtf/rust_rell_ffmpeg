export type FileType = 'video' | 'image' | null;

export type VideoOperation =
  | { type: 'trim'; start: number; end: number }
  | { type: 'filter'; name: VideoFilter }
  | { type: 'speed'; factor: number }
  | { type: 'reverse' }
  | { type: 'extractAudio'; format: 'mp3' | 'wav' };

export type ImageOperation =
  | { type: 'filter'; name: ImageFilter }
  | { type: 'resize'; width: number; height: number }
  | { type: 'crop'; x: number; y: number; width: number; height: number }
  | { type: 'curves'; sCurve: number; lift: number; crush: number };

export type Operation = VideoOperation | ImageOperation;

export type VideoFilter = 'blackandwhite' | 'sepia' | 'vintage' | 'negative';
export type ImageFilter = 'grayscale' | 'sepia' | 'blur' | 'sharpen' | 'vintage';
