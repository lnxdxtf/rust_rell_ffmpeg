<template>
  <div class="min-h-screen bg-deep">
    <header class="border-b px-6 py-4" style="background: #16161fe0; border-color: rgb(61 12 17 / 0.5); backdrop-filter: blur(12px)">
      <router-link to="/" class="font-display text-xl font-black text-gradient-wine tracking-tight no-underline">
        RELL
      </router-link>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12">
      <div v-if="!$store.state.editor.file" class="flex items-center justify-center min-h-[60vh]">
        <DropZone @file-selected="onFileSelected" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left: Original file preview -->
        <div class="space-y-4">
          <div class="border rounded-xl overflow-hidden flex flex-col" style="border-color: rgb(61 12 17 / 0.5); background: #16161f; height: 464px">
            <div class="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style="border-color: rgb(61 12 17 / 0.5)">
              <span class="font-mono text-[10px] text-muted uppercase tracking-wider">Original</span>
              <div style="line-height:0">
                <button @click="removeFile" class="text-muted hover:text-wine-300 transition-colors leading-none" style="font-size:16px; padding:0 4px" title="Remover arquivo">&#10005;</button>
              </div>
            </div>
            <div style="background: #0a0a12; width: 100%; flex: 1" class="flex items-center justify-center">
              <video
                v-if="$store.state.editor.fileType === 'video'"
                :src="$store.state.editor.fileUrl ?? ''"
                controls
                class="max-w-full max-h-full rounded-lg object-contain"
              />
              <img
                v-else-if="$store.state.editor.fileType === 'image'"
                :src="$store.state.editor.fileUrl ?? ''"
                class="max-w-full max-h-full rounded-lg object-contain"
              />
            </div>
          </div>

          <EffectList
            :file-type="$store.state.editor.fileType"
            :selected-op="selectedOp"
            @select-effect="onSelectEffect"
          />
        </div>

        <!-- Right: Processed preview / Curves -->
        <div class="space-y-4">
          <div class="border rounded-xl overflow-hidden flex flex-col" style="border-color: rgb(61 12 17 / 0.5); background: #16161f; height: 464px">
            <div class="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style="border-color: rgb(61 12 17 / 0.5)">
              <span class="font-mono text-[10px] text-muted uppercase tracking-wider">{{ showCurves ? 'Curvas' : 'Processado' }}</span>
              <div v-if="$store.state.ffmpeg.outputUrl && !showCurves" class="relative" ref="menuWrap" style="line-height:0">
                <button @click="menuOpen = !menuOpen" class="text-muted hover:text-primary transition-colors leading-none" style="font-size:18px; padding:0 4px">&#8942;</button>
                <div v-if="menuOpen" class="absolute right-0 top-6 border rounded-lg overflow-hidden z-20" style="background: #1a1a2e; border-color: rgb(61 12 17 / 0.5); min-width: 140px">
                  <button @click="downloadResult; menuOpen = false" class="w-full text-left px-4 py-2.5 font-mono text-xs text-primary hover:bg-wine-700/30 transition-colors flex items-center gap-2">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                </div>
              </div>
            </div>

            <!-- Curves mode -->
            <template v-if="showCurves && $store.state.editor.fileType === 'image'">
              <div style="background: #0a0a12; width: 100%; flex: 1; min-height:0" class="flex items-center justify-center relative">
                <canvas ref="curveCanvas" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="p-3 space-y-2 border-t shrink-0" style="border-color: rgb(61 12 17 / 0.5)">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[9px] text-secondary w-16">S-Curve</span>
                  <input type="range" min="-1" max="1" step="0.05" :value="curveS" @input="curveS = parseFloat(($event.target as HTMLInputElement).value); updateCurves()" class="w-full accent-wine-500" style="height:3px" />
                  <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveS.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[9px] text-secondary w-16">Lift</span>
                  <input type="range" min="0" max="1" step="0.02" :value="curveL" @input="curveL = parseFloat(($event.target as HTMLInputElement).value); updateCurves()" class="w-full accent-wine-500" style="height:3px" />
                  <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveL.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[9px] text-secondary w-16">Crush</span>
                  <input type="range" min="0" max="1" step="0.02" :value="curveC" @input="curveC = parseFloat(($event.target as HTMLInputElement).value); updateCurves()" class="w-full accent-wine-500" style="height:3px" />
                  <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveC.toFixed(1) }}</span>
                </div>
                <div class="flex gap-2 pt-1">
                  <button @click="showCurves = false; selectedOp = null" class="flex-1 py-2 font-mono text-[9px] text-secondary tracking-wider uppercase rounded-lg border transition-all duration-300 active:scale-[0.97]" style="border-color: rgb(61 12 17 / 0.5); background: #16161f">Cancelar</button>
                  <button @click="applyCurves" class="flex-1 py-2 font-mono text-[9px] text-primary tracking-wider uppercase rounded-lg border transition-all duration-300 active:scale-[0.97]" style="border-color: rgb(61 12 17 / 0.5); background: linear-gradient(135deg, #7a1a2a, #5c4416)">Aplicar</button>
                </div>
              </div>
            </template>

            <!-- Normal processed preview -->
            <template v-else>
              <div style="background: #0a0a12; width: 100%; flex: 1" class="flex items-center justify-center">
                <div v-if="!$store.state.ffmpeg.outputUrl" class="text-center text-muted">
                  <svg class="w-10 h-10 mx-auto mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <p class="font-mono text-[11px]">Nenhum processamento ainda</p>
                </div>
                <video
                  v-if="$store.state.ffmpeg.outputUrl && $store.state.editor.fileType === 'video'"
                  :src="$store.state.ffmpeg.outputUrl"
                  controls
                  class="max-w-full max-h-full rounded-lg object-contain"
                />
                <img
                  v-else-if="$store.state.ffmpeg.outputUrl && $store.state.editor.fileType === 'image'"
                  :src="$store.state.ffmpeg.outputUrl"
                  class="max-w-full max-h-full rounded-lg object-contain"
                />
              </div>
            </template>
          </div>

          <!-- Action button (only for video) -->
          <div v-if="$store.state.editor.fileType === 'video' && status !== 'processing' && status !== 'done'" class="border rounded-xl overflow-hidden" style="border-color: rgb(61 12 17 / 0.5)">
            <button @click="startEditing" :disabled="!selectedOp"
              class="w-full py-3 font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 rounded-xl border"
              :style="{
                background: selectedOp ? 'linear-gradient(135deg, #7a1a2a, #5c4416)' : '#16161f',
                borderColor: 'rgb(61 12 17 / 0.5)',
                color: selectedOp ? '#e8e4f0' : '#404055',
              }">
              {{ selectedOp ? 'Editar' : 'Selecione um efeito' }}
            </button>
          </div>

          <div v-if="status === 'processing'" class="border rounded-xl p-5 space-y-3" style="background: #16161f; border-color: rgb(61 12 17 / 0.5)">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs text-secondary uppercase tracking-wider">Processando</span>
              <span class="font-mono text-xs text-wine-300">{{ progress }}%</span>
            </div>
            <div class="w-full h-2 rounded-full overflow-hidden" style="background: #0d0d14">
              <div class="h-full rounded-full transition-all duration-300" :style="{ width: progress + '%', background: 'linear-gradient(90deg, #7a1a2a, #c9a03c)' }" />
            </div>
          </div>

          <div v-if="status === 'done' || (status === 'idle' && $store.state.ffmpeg.outputUrl)" class="flex gap-3">
            <button @click="clearResult"
              class="flex-1 py-3 font-display text-sm font-bold tracking-wider uppercase rounded-xl border transition-all duration-300 active:scale-[0.97]"
              style="border-color: rgb(61 12 17 / 0.5); background: #16161f; color: #78708a">
              Limpar
            </button>
          </div>

          <div v-if="error" class="font-mono text-xs text-wine-300 rounded-lg p-3 border" style="background: #1a0505; border-color: rgb(61 12 17 / 0.5)">
            {{ error }}
          </div>

          <LogPanel />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import type { Operation, ImageOperation } from '@/types/editor';
import { downloadBlob } from '@/utils/download';
import LogPanel from '@/components/editor/LogPanel.vue';

class EditorPage extends Base {
  selectedOp: Operation | null = null;
  menuOpen: boolean = false;
  showCurves: boolean = false;
  curveS: number = 0;
  curveL: number = 0;
  curveC: number = 0;
  private curvePixels: ImageData | null = null;
  private boundClick: ((e: Event) => void) | null = null;

  get status() { return this.$store.state.ffmpeg.status; }
  get progress() { return this.$store.state.ffmpeg.progress; }
  get error() { return this.$store.state.ffmpeg.error; }

  mounted() {
    this.$store.dispatch('ffmpeg/loadCore');
    this.boundClick = (e: Event) => {
      const wrap = this.$refs.menuWrap as HTMLElement | undefined;
      if (this.menuOpen && wrap && !wrap.contains(e.target as Node)) {
        this.menuOpen = false;
      }
    };
    document.addEventListener('click', this.boundClick);
  }

  beforeUnmount() {
    if (this.boundClick) document.removeEventListener('click', this.boundClick);
  }

  onFileSelected(file: File) {
    this.$store.commit('editor/setFile', file);
  }

  removeFile() {
    this.$store.commit('editor/clearFile');
    this.$store.dispatch('ffmpeg/reset');
    this.selectedOp = null;
  }

  onSelectEffect(op: Operation) {
    this.selectedOp = op;
    const file = this.$store.state.editor.file;
    if (!file || this.$store.state.editor.fileType !== 'image') return;
    if (op.type === 'curves') {
      this.curveS = 0; this.curveL = 0; this.curveC = 0;
      this.curvePixels = null;
      this.showCurves = true;
      this.$nextTick(() => this.loadCurveImage());
      return;
    }
    this.$store.dispatch('ffmpeg/processImage', { file, op });
  }

  private loadCurveImage() {
    const canvas = this.$refs.curveCanvas as HTMLCanvasElement;
    if (!canvas) return;
    const src = this.$store.state.editor.fileUrl;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d')!;
      const w = Math.min(img.naturalWidth, 600);
      const h = Math.min(img.naturalHeight, 400);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      this.curvePixels = ctx.getImageData(0, 0, w, h);
      this.updateCurves();
    };
    img.src = src;
  }

  private buildCurveLUT(): Uint8Array {
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      let x = i / 255;
      if (this.curveS !== 0) {
        const k = this.curveS * 4;
        x = 1 / (1 + Math.exp(-k * (x - 0.5)));
      }
      if (this.curveL > 0) {
        const t = Math.max(0, 1 - x * 3);
        x = x + this.curveL * (1 - x) * t;
      }
      if (this.curveC > 0) {
        const t = Math.max(0, 1 - x * 3);
        x = x - this.curveC * x * t;
      }
      lut[i] = Math.max(0, Math.min(255, Math.round(x * 255)));
    }
    return lut;
  }

  updateCurves() {
    if (!this.curvePixels) { this.loadCurveImage(); return; }
    const canvas = this.$refs.curveCanvas as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const data = new Uint8ClampedArray(this.curvePixels.data);
    const lut = this.buildCurveLUT();
    for (let i = 0; i < data.length; i += 4) {
      data[i] = lut[data[i]];
      data[i + 1] = lut[data[i + 1]];
      data[i + 2] = lut[data[i + 2]];
    }
    ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
  }

  applyCurves() {
    this.showCurves = false;
    const file = this.$store.state.editor.file;
    if (!file) return;
    this.$store.dispatch('ffmpeg/processImage', {
      file,
      op: { type: 'curves', sCurve: this.curveS, lift: this.curveL, crush: this.curveC } as ImageOperation,
    });
  }

  async startEditing() {
    const file = this.$store.state.editor.file;
    const op = this.selectedOp;
    if (!file || !op) return;
    await this.$store.dispatch('ffmpeg/processVideo', { file, op });
  }

  clearResult() {
    this.$store.dispatch('ffmpeg/reset');
    this.selectedOp = null;
    this.menuOpen = false;
  }

  downloadResult() {
    const url = this.$store.state.ffmpeg.outputUrl;
    const name = this.$store.state.editor.fileName;
    if (url && name) {
      downloadBlob(url, 'rell_' + name);
    }
  }
}

Register(EditorPage);
const Page = toNative(EditorPage);
Page.components = { LogPanel };
export default Page;
</script>
