<template>
  <div class="rounded-2xl overflow-hidden border" style="background: #16161f; border-color: rgb(61 12 17 / 0.5)">
    <div class="p-3 border-b" style="border-color: rgb(61 12 17 / 0.5); background: #1a1a2e">
      <span class="font-mono text-[10px] text-muted uppercase tracking-wider">Preview</span>
    </div>
    <div style="background: #0a0a12; width: 100%; height: 420px" class="flex items-center justify-center">
      <video
        v-if="fileType === 'video'"
        :src="fileUrl ?? ''"
        controls
        class="max-w-full max-h-full rounded-lg object-contain"
      />
      <img
        v-else-if="fileType === 'image'"
        :src="fileUrl ?? ''"
        class="max-w-full max-h-full rounded-lg object-contain"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class PreviewPanel extends Base {}

Register(PreviewPanel);
const C = toNative(PreviewPanel);
C.props = { fileType: { type: String }, fileUrl: { type: String } };
export default C;
</script>
