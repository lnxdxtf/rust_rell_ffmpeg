<template>
  <div class="border rounded-xl overflow-hidden" style="background: #0d0d14; border-color: rgb(61 12 17 / 0.5)">
    <div class="flex items-center justify-between px-4 py-2 border-b" style="border-color: rgb(61 12 17 / 0.5); background: #16161f">
      <span class="font-mono text-[10px] text-muted uppercase tracking-wider">Log FFmpeg</span>
      <button v-if="entries.length" @click="clearLog" class="font-mono text-[9px] text-muted hover:text-secondary uppercase tracking-wider transition-colors">
        Limpar
      </button>
    </div>
    <div ref="logContainer" class="overflow-y-auto p-3 font-mono text-[11px] leading-relaxed" style="height: 300px">
      <div v-if="!entries.length" class="text-muted italic">Nenhum comando executado ainda.</div>
      <div v-for="(entry, i) in entries" :key="i" class="whitespace-pre-wrap break-all text-secondary">
        {{ entry.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import { FFmpegService, type LogEntry } from '@/services/ffmpeg';

class LogPanel extends Base {
  entries: LogEntry[] = [];
  private logCb: ((e: LogEntry) => void) | null = null;

  mounted() {
    const svc = FFmpegService.get();
    this.logCb = (entry) => this.onLog(entry);
    svc.addLogCb(this.logCb);
  }

  beforeUnmount() {
    if (this.logCb) {
      FFmpegService.get().removeLogCb(this.logCb);
    }
  }

  onLog(entry: LogEntry) {
    this.entries.push(entry);
    if (this.entries.length > 200) this.entries.shift();
    this.$nextTick(() => {
      const el = this.$refs.logContainer as HTMLElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  clearLog() {
    this.entries = [];
  }
}

Register(LogPanel);
const C = toNative(LogPanel);
export default C;
</script>
