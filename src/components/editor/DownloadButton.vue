<template>
  <button
    class="w-full rounded-xl px-6 py-4 font-display text-sm font-bold text-primary tracking-wider uppercase transition-all duration-300 active:scale-[0.98] border"
    style="background: linear-gradient(135deg, #7a1a2a, #5c4416); border-color: rgb(61 12 17 / 0.5); box-shadow: 0 0 20px rgb(122 26 42 / 0.2)"
    @click="download"
  >
    Baixar resultado
  </button>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import { downloadBlob } from '@/utils/download';

class DownloadButton extends Base {
  download() {
    const outputUrl = (this as any).outputUrl as string;
    const fileName = (this as any).fileName as string;
    if (outputUrl && fileName) {
      downloadBlob(outputUrl, 'rell_' + fileName);
    }
  }
}

Register(DownloadButton);
const C = toNative(DownloadButton);
C.props = { outputUrl: { type: String }, fileName: { type: String } };
export default C;
</script>
