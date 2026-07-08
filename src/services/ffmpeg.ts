import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface LogEntry {
  message: string;
  timestamp: number;
}

type ProgressFn = (pct: number) => void;
type LogFn = (entry: LogEntry) => void;

export class FFmpegService {
  private static inst: FFmpegService;
  private ff = new FFmpeg();
  private loaded = false;
  private onProgress: ProgressFn | null = null;
  private onLog: LogFn[] = [];

  private constructor() {
    this.ff.on('progress', ({ progress }) => {
      this.onProgress?.(Math.round(progress * 100));
    });
    this.ff.on('log', ({ message }) => {
      const entry: LogEntry = { message, timestamp: Date.now() };
      this.onLog.forEach(fn => fn(entry));
    });
  }

  static get(): FFmpegService {
    if (!FFmpegService.inst) FFmpegService.inst = new FFmpegService();
    return FFmpegService.inst;
  }

  setProgressCb(fn: ProgressFn) { this.onProgress = fn; }
  addLogCb(fn: LogFn) { this.onLog.push(fn); }
  removeLogCb(fn: LogFn) { this.onLog = this.onLog.filter(f => f !== fn); }

  async load() {
    if (this.loaded) return;
    const coreBase = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
    await this.ff.load({
      coreURL: await toBlobURL(`${coreBase}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${coreBase}/ffmpeg-core.wasm`, 'application/wasm'),
      classWorkerURL: '/ffmpeg/worker.js',
    });
    this.loaded = true;
  }

  get ffmpeg(): FFmpeg { return this.ff; }
}
