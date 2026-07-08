<template>
  <button
    class="rounded-xl px-6 py-3 font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.97]"
    :class="variantClass"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class BaseButton extends Base {
  get variantClass() {
    const v = (this as any).variant;
    return {
      'bg-gradient-to-r from-wine-500 to-gold-600 text-primary hover:glow-wine': v === 'primary',
      'glass text-primary hover:border-wine-500/60': v === 'secondary',
      'text-secondary hover:text-primary': v === 'ghost',
    }[v] || '';
  }
}

Register(BaseButton);
const Component = toNative(BaseButton);
Component.props = { variant: { type: String, default: 'primary' } };
export default Component;
</script>
