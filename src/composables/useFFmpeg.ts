import { computed } from 'vue';
import store from '@/store';
import type { Operation, VideoOperation, ImageOperation } from '@/types/editor';

export function useFFmpeg() {
  return {
    status: computed(() => store.state.ffmpeg.status),
    progress: computed(() => store.state.ffmpeg.progress),
    error: computed(() => store.state.ffmpeg.error),
    outputUrl: computed(() => store.state.ffmpeg.outputUrl),
    loadCore: () => store.dispatch('ffmpeg/loadCore') as Promise<void>,
    processVideo: (file: File, ops: VideoOperation[]) =>
      store.dispatch('ffmpeg/processVideo', { file, operations: ops }) as Promise<void>,
    processImage: (file: File, ops: ImageOperation[]) =>
      store.dispatch('ffmpeg/processImage', { file, operations: ops }) as Promise<void>,
    reset: () => store.dispatch('ffmpeg/reset') as Promise<void>,
  };
}

export function useEditor() {
  return {
    file: computed(() => store.state.editor.file),
    fileType: computed(() => store.state.editor.fileType),
    fileUrl: computed(() => store.state.editor.fileUrl),
    fileName: computed(() => store.state.editor.fileName),
    operations: computed(() => store.state.editor.operations),
    setFile: (f: File | null) => store.commit('editor/setFile', f),
    clearFile: () => store.commit('editor/clearFile'),
    addOperation: (op: Operation) => store.commit('editor/addOperation', op),
    clearOperations: () => store.commit('editor/clearOperations'),
  };
}
