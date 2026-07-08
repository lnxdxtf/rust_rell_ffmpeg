<template>
  <div
    class="rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 border-2 border-dashed w-full max-w-xl mx-auto"
    :style="{
      background: dragOver ? '#1a1a2e' : '#16161f',
      borderColor: dragOver ? 'rgb(184 48 69 / 0.8)' : 'rgb(61 12 17 / 0.5)',
      boxShadow: dragOver ? '0 0 20px rgb(122 26 42 / 0.4)' : 'none'
    }"
    @click="openFilePicker"
    @dragover.prevent="dragOver = true"
    @dragleave="dragOver = false"
    @drop.prevent="onDrop"
  >
    <div class="space-y-6">
      <div class="text-6xl text-muted group-hover:text-wine-300 transition-colors duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <p class="font-display text-xl text-primary font-semibold">
          Arraste seu arquivo aqui
        </p>
        <p class="font-display text-sm text-secondary mt-2">
          ou clique para selecionar
        </p>
      </div>
      <p class="font-mono text-[10px] text-muted uppercase tracking-widest">
        Vídeo · Imagem
      </p>
    </div>
    <input ref="fileInput" type="file" accept="video/*,image/*" class="hidden" @change="onFilePicked" />
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class DropZone extends Base {
  dragOver = false;

  get fileInput(): HTMLInputElement {
    return this.$refs.fileInput as HTMLInputElement;
  }

  openFilePicker() {
    this.fileInput.click();
  }

  onFilePicked(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.$emit('file-selected', input.files[0]);
    }
  }

  onDrop(e: DragEvent) {
    this.dragOver = false;
    if (e.dataTransfer?.files.length) {
      this.$emit('file-selected', e.dataTransfer.files[0]);
    }
  }
}

Register(DropZone);
const C = toNative(DropZone);
C.emits = ['file-selected'];
export default C;
</script>
