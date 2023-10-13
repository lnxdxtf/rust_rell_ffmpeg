<template>
    <div>
        <Pattern>
            <span>CLI FFMPEG</span>
            <div class="grid grid-cols-2 p-4">

                <div class="form-control w-full max-w-sm">
                    <label class="label">
                        <span class="label-text">Select a Video Input</span>
                        <span class="label-text-alt text-xs">*To use file in cmd, uses: {{ data_input.id }}.{{ data_input.type.split('/')[1] }} </span>
                    </label>
                    <input id="video-input-dev" type="file"
                        class="file-input file-input-bordered w-full max-w-sm bg-black bg-opacity-50" />
                </div>
            </div>
            <div class="w-full h-full bg-black bg-opacity-50 p-4 rounded-md text-sm">
                <pre id="log-video" class="w-[80vh] h-[70vh] overflow-auto "></pre>
                <div class="w-full flex gap-2 border-t border-main-1 py-2">
                    <div class="w-fit whitespace-nowrap flex items-center gap-2 text-green-500">
                        <i class="fa-solid fa-bolt"></i>
                        <span class="text-cyan-500">ffmpeg</span>
                    </div>
                    <input @keyup.enter="exec" v-model="cmd_input" autofocus class="w-full bg-transparent outline-none"
                        type="text">
                </div>
                <div class="w-fullbg-transparent text-xs text-opacity-10">CMD: {{ cmd_ffmpeg }}</div>
            </div>
        </Pattern>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
import Pattern from './Pattern.vue';
import DevMixin from '../app/modules/dev/dev_mixin';
@Component({
    components: { Pattern },
    mixins: [DevMixin]
})
class Dev extends Vue { }
// @ts-ignore
export default toNative(Dev as typeof Vue & { new(): DevMixin });
</script>