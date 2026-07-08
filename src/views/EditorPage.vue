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
        <!-- Left: ARQUIVO + EFEITOS -->
        <div class="space-y-4">
          <PreviewPanel
            mode="original"
            :file-type="$store.state.editor.fileType"
            :file-url="$store.state.editor.fileUrl"
            title="Original"
          >
            <template #header-right>
              <button @click="removeFile" class="text-muted hover:text-wine-300 transition-colors leading-none" style="font-size:16px; padding:0 4px" title="Remover">&#10005;</button>
            </template>
          </PreviewPanel>

          <EffectList
            :file-type="$store.state.editor.fileType"
            :selected-op="selectedOp"
            @select-effect="onSelectEffect"
          />
        </div>

        <!-- Right: PREVIEW + CURVAS + LIMPAR + LOG -->
        <div class="space-y-4">
          <!-- Video action button -->
          <div v-if="$store.state.editor.fileType === 'video' && !showCurves && status !== 'processing' && status !== 'done'" class="border rounded-xl overflow-hidden" style="border-color: rgb(61 12 17 / 0.5)">
            <button @click="startEditing" :disabled="!selectedOp" class="w-full py-3 font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 rounded-xl border"
              :style="{ background: selectedOp ? 'linear-gradient(135deg, #7a1a2a, #5c4416)' : '#16161f', borderColor: 'rgb(61 12 17 / 0.5)', color: selectedOp ? '#e8e4f0' : '#404055' }">
              {{ selectedOp ? 'Editar' : 'Selecione um efeito' }}
            </button>
          </div>

          <!-- Shared Preview -->
          <PreviewPanel
            ref="previewPanel"
            :mode="previewMode"
            :file-type="$store.state.editor.fileType"
            :file-url="$store.state.editor.fileUrl"
            :output-url="$store.state.ffmpeg.outputUrl"
            :title="previewTitle"
            :curves-s="curveS"
            :curves-l="curveL"
            :curves-c="curveC"
          >
            <template #header-right>
              <div v-if="$store.state.ffmpeg.outputUrl && previewMode !== 'curves'" class="relative" ref="menuWrap" style="line-height:0">
                <button @click="menuOpen = !menuOpen" class="text-muted hover:text-primary transition-colors leading-none" style="font-size:18px; padding:0 4px">&#8942;</button>
                <div v-if="menuOpen" class="absolute right-0 top-6 border rounded-lg overflow-hidden z-20" style="background: #1a1a2e; border-color: rgb(61 12 17 / 0.5); min-width: 140px">
                  <button @click="downloadResult; menuOpen = false" class="w-full text-left px-4 py-2.5 font-mono text-xs text-primary hover:bg-wine-700/30 transition-colors flex items-center gap-2">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                </div>
              </div>
            </template>
          </PreviewPanel>

          <!-- Curves controls (compact) -->
          <div v-if="showCurves && $store.state.editor.fileType === 'image'" class="border rounded-xl p-3 space-y-2" style="border-color: rgb(61 12 17 / 0.5); background: #16161f">
            <div class="flex items-center gap-2">
              <span class="font-mono text-[9px] text-secondary w-12 shrink-0">S-Curve</span>
              <input type="range" min="-1" max="1" step="0.05" :value="curveS" @input="onCurveChange('s', parseFloat(($event.target as HTMLInputElement).value))" class="w-full accent-wine-500" style="height:3px" />
              <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveS.toFixed(1) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[9px] text-secondary w-12 shrink-0">Lift</span>
              <input type="range" min="0" max="1" step="0.02" :value="curveL" @input="onCurveChange('l', parseFloat(($event.target as HTMLInputElement).value))" class="w-full accent-wine-500" style="height:3px" />
              <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveL.toFixed(1) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[9px] text-secondary w-12 shrink-0">Crush</span>
              <input type="range" min="0" max="1" step="0.02" :value="curveC" @input="onCurveChange('c', parseFloat(($event.target as HTMLInputElement).value))" class="w-full accent-wine-500" style="height:3px" />
              <span class="font-mono text-[9px] text-wine-300 w-6 text-right">{{ curveC.toFixed(1) }}</span>
            </div>
            <div class="flex justify-center py-1">
              <svg class="w-28 h-28" viewBox="0 0 100 100" style="opacity:0.5">
                <line x1="5" y1="95" x2="95" y2="95" stroke="#404055" stroke-width="1" />
                <line x1="5" y1="5" x2="5" y2="95" stroke="#404055" stroke-width="1" />
                <polyline ref="curveLine" fill="none" stroke="#c9a03c" stroke-width="1.5" vector-effect="non-scaling-stroke" />
                <line x1="5" y1="95" x2="95" y2="5" stroke="#404055" stroke-width="0.5" stroke-dasharray="4,4" />
              </svg>
            </div>
            <div class="flex gap-2">
              <button @click="cancelCurves" class="flex-1 py-2 font-mono text-[9px] text-secondary tracking-wider uppercase rounded-lg border transition-all duration-300 active:scale-[0.97]" style="border-color: rgb(61 12 17 / 0.5); background: #16161f">Cancelar</button>
              <button @click="applyCurves" class="flex-1 py-2 font-mono text-[9px] text-primary tracking-wider uppercase rounded-lg border transition-all duration-300 active:scale-[0.97]" style="border-color: rgb(61 12 17 / 0.5); background: linear-gradient(135deg, #7a1a2a, #5c4416)">Aplicar</button>
            </div>
          </div>

          <!-- Limpar + Progress + Error + Log -->
          <div v-if="previewMode === 'processed' && !showCurves" class="flex gap-3">
            <button @click="clearResult" class="flex-1 py-3 font-display text-sm font-bold tracking-wider uppercase rounded-xl border transition-all duration-300 active:scale-[0.97]" style="border-color: rgb(61 12 17 / 0.5); background: #16161f; color: #78708a">Limpar</button>
          </div>

          <div v-if="status === 'processing'" class="border rounded-xl p-5 space-y-3" style="background: #16161f; border-color: rgb(61 12 17 / 0.5)">
            <div class="flex items-center justify-between"><span class="font-mono text-xs text-secondary uppercase tracking-wider">Processando</span><span class="font-mono text-xs text-wine-300">{{ progress }}%</span></div>
            <div class="w-full h-2 rounded-full overflow-hidden" style="background: #0d0d14"><div class="h-full rounded-full transition-all duration-300" :style="{ width: progress + '%', background: 'linear-gradient(90deg, #7a1a2a, #c9a03c)' }" /></div>
          </div>

          <div v-if="error" class="font-mono text-xs text-wine-300 rounded-lg p-3 border" style="background: #1a0505; border-color: rgb(61 12 17 / 0.5)">{{ error }}</div>

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
import PreviewPanel from '@/components/editor/PreviewPanel.vue';
import EffectList from '@/components/editor/EffectList.vue';

class EditorPage extends Base {
  selectedOp: Operation | null = null;
  menuOpen: boolean = false;
  showCurves: boolean = false;
  curveS: number = 0;
  curveL: number = 0;
  curveC: number = 0;
  private boundClick: ((e: Event) => void) | null = null;

  get status() { return this.$store.state.ffmpeg.status; }
  get progress() { return this.$store.state.ffmpeg.progress; }
  get error() { return this.$store.state.ffmpeg.error; }
  get previewMode(): string {
    if (this.showCurves && this.$store.state.editor.fileType === 'image') return 'curves';
    if (this.$store.state.ffmpeg.outputUrl) return 'processed';
    return 'original';
  }
  get previewTitle(): string {
    if (this.showCurves) return 'Curvas';
    if (this.$store.state.ffmpeg.outputUrl) return 'Processado';
    return 'Preview';
  }

  mounted() {
    this.$store.dispatch('ffmpeg/loadCore');
    this.boundClick = (e: Event) => {
      const w = this.$refs.menuWrap as HTMLElement | undefined;
      if (this.menuOpen && w && !w.contains(e.target as Node)) this.menuOpen = false;
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
      this.showCurves = true;
      this.$nextTick(() => {
        const pp = this.$refs.previewPanel as any;
        if (pp?.loadImage) pp.loadImage();
      });
      return;
    }
    this.$store.dispatch('ffmpeg/processImage', { file, op });
  }

  onCurveChange(which: string, val: number) {
    if (which === 's') this.curveS = val;
    else if (which === 'l') this.curveL = val;
    else this.curveC = val;
    this.updateCurveLine();
    const pp = this.$refs.previewPanel as any;
    if (pp?.redraw) pp.redraw();
  }

  private updateCurveLine() {
    const s = this.curveS, l = this.curveL, c = this.curveC;
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      let x = i / 255;
      if (s !== 0) { const k = s * 4; x = 1 / (1 + Math.exp(-k * (x - 0.5))); }
      if (l > 0) { const t = Math.max(0, 1 - x * 3); x = x + l * (1 - x) * t; }
      if (c > 0) { const t = Math.max(0, 1 - x * 3); x = x - c * x * t; }
      lut[i] = Math.max(0, Math.min(255, Math.round(x * 255)));
    }
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const o = lut[Math.round(i / 100 * 255)];
      pts.push(`${5 + i * 0.9},${95 - Math.round(o / 255 * 90)}`);
    }
    const el = this.$refs.curveLine as unknown as SVGPolylineElement;
    if (el) el.setAttribute('points', pts.join(' '));
  }

  cancelCurves() {
    this.showCurves = false;
    this.selectedOp = null;
  }

  applyCurves() {
    this.showCurves = false;
    const file = this.$store.state.editor.file;
    if (!file) return;
    this.$store.dispatch('ffmpeg/processImage', {
      file, op: { type: 'curves', sCurve: this.curveS, lift: this.curveL, crush: this.curveC } as ImageOperation,
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
    const u = this.$store.state.ffmpeg.outputUrl;
    const n = this.$store.state.editor.fileName;
    if (u && n) downloadBlob(u, 'rell_' + n);
  }
}

Register(EditorPage);
const Page = toNative(EditorPage);
Page.components = { LogPanel, PreviewPanel, EffectList };
export default Page;
</script>
