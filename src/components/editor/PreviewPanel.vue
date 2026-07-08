<template>
  <div class="border rounded-xl overflow-hidden flex flex-col" style="border-color: rgb(61 12 17 / 0.5); background: #16161f; height: 464px">
    <div class="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style="border-color: rgb(61 12 17 / 0.5)">
      <span class="font-mono text-[10px] text-muted uppercase tracking-wider">{{ title }}</span>
      <div style="line-height:0">
        <slot name="header-right" />
      </div>
    </div>
    <div style="background: #0a0a12; width: 100%; flex: 1; min-height:0" class="flex items-center justify-center relative">
      <!-- Curves canvas -->
      <canvas v-if="mode === 'curves'" ref="curveCanvas" class="max-w-full max-h-full object-contain" />
      <!-- Processed video -->
      <video v-else-if="mode === 'processed' && fileType === 'video'" :src="outputUrl ?? ''" controls class="max-w-full max-h-full rounded-lg object-contain" />
      <!-- Processed image -->
      <img v-else-if="mode === 'processed' && fileType === 'image'" :src="outputUrl ?? ''" class="max-w-full max-h-full rounded-lg object-contain" />
      <!-- Original file -->
      <img v-else-if="fileType === 'image'" :src="fileUrl ?? ''" class="max-w-full max-h-full rounded-lg object-contain" />
      <video v-else-if="fileType === 'video'" :src="fileUrl ?? ''" controls class="max-w-full max-h-full rounded-lg object-contain" />
      <!-- Empty state -->
      <div v-else class="text-center text-muted">
        <svg class="w-10 h-10 mx-auto mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        <p class="font-mono text-[11px]">Nenhum processamento ainda</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class PreviewPanel extends Base {
  private imgData: ImageData | null = null;

  get mode(): string { return (this as any).mode ?? 'original'; }
  get fileType(): string { return (this as any).fileType ?? ''; }
  get fileUrl(): string { return (this as any).fileUrl ?? ''; }
  get outputUrl(): string { return (this as any).outputUrl ?? ''; }
  get title(): string { return (this as any).title ?? 'Preview'; }

  // Curves props
  get curvesS(): number { return (this as any).curvesS ?? 0; }
  get curvesL(): number { return (this as any).curvesL ?? 0; }
  get curvesC(): number { return (this as any).curvesC ?? 0; }

  mounted() {
    if (this.mode === 'curves') this.loadImage();
  }

  loadImage() {
    const cvs = this.$refs.curveCanvas as HTMLCanvasElement | undefined;
    if (!cvs) return;
    const src = this.fileUrl;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const ctx = cvs.getContext('2d')!;
      const w = Math.min(img.naturalWidth, 600);
      const h = Math.min(img.naturalHeight, 400);
      cvs.width = w; cvs.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      this.imgData = ctx.getImageData(0, 0, w, h);
      this.apply();
    };
    img.src = src;
  }

  private buildLUT(): Uint8Array {
    const s = this.curvesS, l = this.curvesL, c = this.curvesC;
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      let x = i / 255;
      if (s !== 0) { const k = s * 4; x = 1 / (1 + Math.exp(-k * (x - 0.5))); }
      if (l > 0) { const t = Math.max(0, 1 - x * 3); x = x + l * (1 - x) * t; }
      if (c > 0) { const t = Math.max(0, 1 - x * 3); x = x - c * x * t; }
      lut[i] = Math.max(0, Math.min(255, Math.round(x * 255)));
    }
    return lut;
  }

  apply() {
    if (!this.imgData || this.mode !== 'curves') return;
    const cvs = this.$refs.curveCanvas as HTMLCanvasElement;
    if (!cvs) return;
    const data = new Uint8ClampedArray(this.imgData.data);
    const lut = this.buildLUT();
    for (let i = 0; i < data.length; i += 4) {
      data[i] = lut[data[i]]; data[i + 1] = lut[data[i + 1]]; data[i + 2] = lut[data[i + 2]];
    }
    cvs.getContext('2d')!.putImageData(new ImageData(data, cvs.width, cvs.height), 0, 0);
  }

  redraw() {
    if (this.mode !== 'curves') return;
    if (!this.imgData) { this.loadImage(); return; }
    this.apply();
  }
}

Register(PreviewPanel);
const C = toNative(PreviewPanel);
C.props = {
  mode: { type: String, default: 'original' },
  fileType: { type: String },
  fileUrl: { type: String },
  outputUrl: { type: String },
  title: { type: String, default: 'Preview' },
  curvesS: { type: Number, default: 0 },
  curvesL: { type: Number, default: 0 },
  curvesC: { type: Number, default: 0 },
};
export default C;
</script>
