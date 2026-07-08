export interface FFmpegProgress {
  progress: number;
  time: number;
}

export type FFmpegStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'done' | 'error';

export interface FFmpegState {
  status: FFmpegStatus;
  progress: number;
  error: string | null;
  outputUrl: string | null;
}
