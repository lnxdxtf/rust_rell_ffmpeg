<template>
  <button
    class="effect-item rounded-xl font-mono text-xs text-primary tracking-wider uppercase transition-all duration-300 active:scale-[0.97] flex items-center justify-center text-center leading-tight px-2 border"
    :style="{
      width: '100%',
      height: '52px',
      background: active ? '#1f1f2e' : hover ? '#1a1a2a' : '#16161f',
      borderColor: active ? 'rgb(184 48 69 / 0.6)' : hover ? 'rgb(122 26 42 / 0.6)' : 'rgb(61 12 17 / 0.5)',
      boxShadow: active ? '0 0 12px rgb(122 26 42 / 0.3)' : 'none',
      opacity: 1,
    }"
    @click="$emit('select')"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class EffectItem extends Base {
  hover: boolean = false;
}

Register(EffectItem);
const Component = toNative(EffectItem);
Component.props = { label: { type: String, required: true }, active: { type: Boolean, default: false } };
Component.emits = ['select'];
export default Component;
</script>
