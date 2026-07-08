<template>
  <div id="noir-app">
    <HexBackground />
    <div class="relative" style="z-index: 1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Base, Component as Register, toNative } from 'vue-facing-decorator';
import HexBackground from '@/components/hero/HexBackground.vue';

class App extends Base {}
Register(App);
const Page = toNative(App);
Page.components = { HexBackground };
export default Page;
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
