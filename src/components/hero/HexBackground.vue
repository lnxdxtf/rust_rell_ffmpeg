<template>
  <canvas ref="canvas" class="fixed inset-0 w-full h-full" style="z-index: 0; display: block" />
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

const COLORS = [
  [122, 26, 42],   // #7a1a2a
  [184, 48, 69],   // #b83045
  [232, 80, 106],  // #e8506a
  [140, 106, 42],  // #8c6a2a
  [201, 160, 60],  // #c9a03c
  [61, 12, 17],    // #3d0c11
  [42, 31, 10],    // #2a1f0a
];

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

interface PixelCell {
  x: number;
  y: number;
  size: number;
  colorA: number[];
  colorB: number[];
  speed: number;
  phase: number;
}

class HexBackground extends Base {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  cells: PixelCell[] = [];
  time: number = 0;
  ticker: any = null;
  tickBound: (() => void) | null = null;
  resizeBound: (() => void) | null = null;

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.canvas = canvas;
    this.ctx = ctx;

    this.resizeBound = () => this.onResize();
    this.tickBound = () => this.onTick();

    this.doResize();
    this.initGrid();
    this.startAnim();
    window.addEventListener('resize', this.resizeBound);
  }

  beforeUnmount() {
    if (this.resizeBound) window.removeEventListener('resize', this.resizeBound);
    if (this.ticker && this.tickBound) this.ticker.remove(this.tickBound);
  }

  onResize() {
    this.doResize();
    this.initGrid();
  }

  doResize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initGrid() {
    this.cells = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pxSize = 24;
    const gap = 2;
    const step = pxSize + gap;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ci = Math.floor(Math.random() * COLORS.length);
        const cj = (ci + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
        this.cells.push({
          x: col * step,
          y: row * step,
          size: pxSize,
          colorA: COLORS[ci],
          colorB: COLORS[cj],
          speed: 0.3 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  async startAnim() {
    const [{ gsap }] = await Promise.all([import('gsap')]);
    this.ticker = gsap.ticker;
    if (this.tickBound) this.ticker.add(this.tickBound);
  }

  onTick() {
    this.time += 0.012;
    this.draw();
  }

  draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);

    for (const cell of this.cells) {
      const wave = Math.sin(this.time * Math.PI * 2 * cell.speed + cell.phase + cell.x * 0.004);
      const t = wave * 0.5 + 0.5;
      const colorWave = Math.sin(this.time * Math.PI * 2 * cell.speed * 2.5 + cell.phase + cell.x * 0.006);
      const ct = colorWave * 0.5 + 0.5;
      const opacity = 0.2 + 0.16 * t;
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = lerpColor(cell.colorA, cell.colorB, ct);
      this.ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
    }
    this.ctx.globalAlpha = 1;
  }
}

Register(HexBackground);
export default toNative(HexBackground);
</script>
