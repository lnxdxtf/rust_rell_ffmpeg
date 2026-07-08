import type { Module } from 'vuex';
import type { FFmpegStatus } from '@/types/ffmpeg';
import { FFmpegService } from '@/services/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { VideoOperation, ImageOperation } from '@/types/editor';

interface St {
  status: FFmpegStatus;
  progress: number;
  error: string | null;
  outputUrl: string | null;
}

const state: St = {
  status: 'idle',
  progress: 0,
  error: null,
  outputUrl: null,
};

const mutations = {
  setStatus(s: St, v: FFmpegStatus) { s.status = v; },
  setProgress(s: St, v: number) { s.progress = v; },
  setError(s: St, v: string | null) { s.error = v; },
  setOutputUrl(s: St, v: string | null) {
    if (s.outputUrl) URL.revokeObjectURL(s.outputUrl);
    s.outputUrl = v;
  },
};

function ext(n: string) { const i = n.lastIndexOf('.'); return i >= 0 ? n.slice(i) : '.mp4'; }

function mime(n: string) {
  if (n.endsWith('.mp3')) return 'audio/mpeg';
  if (n.endsWith('.wav')) return 'audio/wav';
  if (n.endsWith('.mp4')) return 'video/mp4';
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
  if (n.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

const actions = {
  async loadCore({ commit, state: st }: { commit: any; state: St }) {
    if (st.status === 'ready' || st.status === 'loading') return;
    commit('setStatus', 'loading');
    try {
      await FFmpegService.get().load();
      commit('setStatus', 'ready');
    } catch (e) {
      commit('setError', e instanceof Error ? e.message : 'Failed to load FFmpeg');
      commit('setStatus', 'error');
    }
  },

  async processVideo(
    { commit }: { commit: any },
    { file, op }: { file: File; op: VideoOperation }
  ) {
    commit('setStatus', 'processing');
    commit('setProgress', 0);
    commit('setError', null);
    commit('setOutputUrl', null);

    try {
      const ff = FFmpegService.get().ffmpeg;
      ff.on('progress', ({ progress }) => commit('setProgress', Math.round(progress * 100)));

      const inName = `input${ext(file.name)}`;
      let outName = 'output.mp4';
      await ff.writeFile(inName, await fetchFile(file));

      const args: string[] = ['-y', '-i', inName];

      switch (op.type) {
        case 'trim':
          args.push('-ss', String(op.start), '-to', String(op.end));
          break;
        case 'filter': {
          const f = ({ blackandwhite: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3', sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131', vintage: 'curves=vintage', negative: 'negate' })[op.name];
          if (f) args.push('-vf', f);
          break;
        }
        case 'speed':
          args.push('-vf', `setpts=${1 / op.factor}*PTS`, '-af', `atempo=${op.factor}`);
          break;
        case 'reverse':
          args.push('-vf', 'reverse', '-af', 'areverse');
          break;
        case 'extractAudio':
          outName = `output.${op.format}`;
          args.push('-vn', '-c:a', op.format === 'mp3' ? 'libmp3lame' : 'pcm_s16le');
          break;
      }
      args.push(outName);

      await ff.exec(args);
      const data = await ff.readFile(outName);
      const blob = new Blob([data.buffer], { type: mime(outName) });
      commit('setOutputUrl', URL.createObjectURL(blob));
      commit('setStatus', 'done');
    } catch (e) {
      commit('setError', e instanceof Error ? e.message : 'Processing failed');
      commit('setStatus', 'error');
    }
  },

  async processImage(
    { commit }: { commit: any },
    { file, op }: { file: File; op: import('@/types/editor').ImageOperation }
  ) {
    commit('setStatus', 'processing');
    commit('setProgress', 0);
    commit('setError', null);
    commit('setOutputUrl', null);

    try {
      const ff = FFmpegService.get().ffmpeg;
      ff.on('progress', ({ progress }) => commit('setProgress', Math.round(progress * 100)));

      const inName = `input${ext(file.name)}`;
      let outName = 'output.png';
      await ff.writeFile(inName, await fetchFile(file));

      const args: string[] = ['-y', '-i', inName];

      switch (op.type) {
        case 'filter': {
          const f = ({ grayscale: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3', sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131', blur: 'boxblur=5:1', sharpen: 'unsharp=5:5:1.0:5:5:0.0', vintage: 'curves=vintage' })[op.name];
          if (f) args.push('-vf', f);
          break;
        }
        case 'resize':
          args.push('-vf', `scale=${op.width}:${op.height}`);
          break;
        case 'crop':
          args.push('-vf', `crop=${op.width}:${op.height}:${op.x}:${op.y}`);
          break;
        case 'curves': {
          const pts: string[] = [];
          for (let i = 0; i <= 10; i++) {
            let x = i / 10;
            if (op.sCurve !== 0) {
              const k = op.sCurve * 4;
              x = 1 / (1 + Math.exp(-k * (x - 0.5)));
            }
            if (op.lift > 0) {
              const t = Math.max(0, 1 - x * 3);
              x = x + op.lift * (1 - x) * t;
            }
            if (op.crush > 0) {
              const t = Math.max(0, 1 - x * 3);
              x = x - op.crush * x * t;
            }
            pts.push(`${(i/10).toFixed(1)}/${x.toFixed(4)}`);
          }
          const curve = pts.join(' ');
          args.push('-vf', `curves=r='${curve}':g='${curve}':b='${curve}'`);
          break;
        }
      }
      args.push(outName);

      await ff.exec(args);
      const data = await ff.readFile(outName);
      const blob = new Blob([data.buffer], { type: mime(outName) });
      commit('setOutputUrl', URL.createObjectURL(blob));
      commit('setStatus', 'done');
    } catch (e) {
      commit('setError', e instanceof Error ? e.message : 'Processing failed');
      commit('setStatus', 'error');
    }
  },

  reset({ commit }: { commit: any }) {
    commit('setStatus', 'idle');
    commit('setProgress', 0);
    commit('setError', null);
    commit('setOutputUrl', null);
  },
};

export const ffmpegModule: Module<St, unknown> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
