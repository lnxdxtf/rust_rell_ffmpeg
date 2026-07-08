<template>
  <div class="space-y-6">
    <div v-if="fileType === 'video'">
      <h3 class="font-display text-sm font-bold text-primary uppercase tracking-widest mb-4">Efeitos de Vídeo</h3>
      <div class="grid grid-cols-3 gap-2">
        <EffectItem
          v-for="ef in videoEffects"
          :key="ef.name"
          :label="ef.label"
          :active="selectedOp === ef.op"
          @select="$emit('select-effect', ef.op)"
        />
      </div>
    </div>

    <div v-if="fileType === 'image'">
      <h3 class="font-display text-sm font-bold text-primary uppercase tracking-widest mb-4">Efeitos de Imagem</h3>
      <div class="grid grid-cols-3 gap-2">
        <EffectItem
          v-for="ef in imageEffects"
          :key="ef.name"
          :label="ef.label"
          :active="selectedOp === ef.op"
          @select="$emit('select-effect', ef.op)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import type { VideoOperation, ImageOperation, Operation } from '@/types/editor';

class EffectList extends Base {
  get selectedOp(): Operation | null {
    return (this as any).selectedOp;
  }

  videoEffects = [
    { name: 'bw', label: 'Preto e Branco', op: { type: 'filter', name: 'blackandwhite' } as VideoOperation },
    { name: 'sepia', label: 'Sépia', op: { type: 'filter', name: 'sepia' } as VideoOperation },
    { name: 'vintage', label: 'Vintage', op: { type: 'filter', name: 'vintage' } as VideoOperation },
    { name: 'negative', label: 'Negativo', op: { type: 'filter', name: 'negative' } as VideoOperation },
    { name: 'speed15', label: 'Speed 1.5x', op: { type: 'speed', factor: 1.5 } as VideoOperation },
    { name: 'speed2', label: 'Speed 2x', op: { type: 'speed', factor: 2 } as VideoOperation },
    { name: 'slow', label: 'Slow 0.5x', op: { type: 'speed', factor: 0.5 } as VideoOperation },
    { name: 'reverse', label: 'Inverter', op: { type: 'reverse' } as VideoOperation },
    { name: 'audio-mp3', label: 'Extrair MP3', op: { type: 'extractAudio', format: 'mp3' } as VideoOperation },
  ];

  imageEffects = [
    { name: 'curves', label: 'Curvas', op: { type: 'curves', sCurve: 0, lift: 0, crush: 0 } as ImageOperation },
    { name: 'grayscale', label: 'Preto e Branco', op: { type: 'filter', name: 'grayscale' } as ImageOperation },
    { name: 'sepia', label: 'Sépia', op: { type: 'filter', name: 'sepia' } as ImageOperation },
    { name: 'blur', label: 'Blur', op: { type: 'filter', name: 'blur' } as ImageOperation },
    { name: 'sharpen', label: 'Sharp', op: { type: 'filter', name: 'sharpen' } as ImageOperation },
    { name: 'vintage', label: 'Vintage', op: { type: 'filter', name: 'vintage' } as ImageOperation },
  ];

}

Register(EffectList);
const Component = toNative(EffectList);
Component.props = { fileType: { type: String }, selectedOp: { default: null } };
Component.emits = ['select-effect'];
export default Component;
</script>
