<template>
  <div>
    <div class="w-screen h-screen bg-gradient-to-tr from-bg-1 to-bg-2 flex overflow-hidden hidden-scroll">
      <SideBar class="w-fit h-full" />
      <div class="w-full h-full block">
        <TopBar />
        <router-view v-slot="{ Component }">
          <component :is="Component" class="w-full h-[95vh] animate__animated animate__fadeIn overflow-y-auto" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
import SideBar from './components/SideBar.vue';
import TopBar from './components/TopBar.vue';
@Component({
  components: { SideBar, TopBar }
})
class App extends Vue { }
export default toNative(App);
</script>