import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/tailwind.css';

import DropZone from '@/components/editor/DropZone.vue';
import PreviewPanel from '@/components/editor/PreviewPanel.vue';
import EffectList from '@/components/editor/EffectList.vue';
import EffectItem from '@/components/editor/EffectItem.vue';
import DownloadButton from '@/components/editor/DownloadButton.vue';

const app = createApp(App);
app.use(router);
app.use(store);

app.component('DropZone', DropZone);
app.component('PreviewPanel', PreviewPanel);
app.component('EffectList', EffectList);
app.component('EffectItem', EffectItem);
app.component('DownloadButton', DownloadButton);

app.mount('#app');
