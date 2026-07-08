import { createStore } from 'vuex';
import { editorModule } from './editor';
import { ffmpegModule } from './ffmpeg';

const store = createStore({
  modules: {
    editor: editorModule,
    ffmpeg: ffmpegModule,
  },
});

export default store;
