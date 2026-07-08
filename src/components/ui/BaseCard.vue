<template>
  <div class="glass rounded-2xl p-6 transition-all duration-300 hover:glow-wine">
    <slot />
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';

class BaseCard extends Base {}

Register(BaseCard);
export default toNative(BaseCard);
</script>
