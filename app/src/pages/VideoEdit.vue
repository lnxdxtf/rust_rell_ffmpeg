<template>
    <div>
        <Pattern>
            <div class="w-full h-full p-4">
                <div class="flex flex-col gap-8">
                    <div class="w-fit">
                        <label for="video-input" class="block text-sm text-white">Video</label>
                        <input id="video-input" type="file"
                            class="block w-full px-3 py-2 mt-2 text-sm border border-main-2 rounded-lg file:text-sm file:text-white file:px-4 file:py-1 file:border-none file:rounded-full file:bg-main-2 file:bg-opacity-20   text-white" />
                    </div>
                    <div class="w-full flex gap-4">
                        <div class="w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50">
                            <span class="text-xl font-bold text-white">Input Video</span>
                            <VideoView class="w-[480px] h-[240px]"
                                :video_data="{ ref_id: `${random_id}-input`, src: video_input }" />
                        </div>
                        <div class="w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50">
                            <span class="text-xl font-bold text-white">Output Video</span>
                            <Loader v-if="loading && !video_output" />
                            <div v-else>
                                <VideoView v-if="video_output" class="w-[480px] h-[240px]"
                                    :video_data="{ ref_id: `${random_id}-output`, src: video_output }" />
                                <div class="w-full flex justify-center p-4 items-center">
                                    <a v-if="video_output" :href="video_output" download="video_output.mp4"
                                        class="cursor-pointer px-4 py-2 rounded-md bg-green-600 text-white font-bold">Download</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-4 rounded-md py-2  w-fit bg-red-500 text-white" @click="start_preprocess">TESTE</div>
                    <Progress v-if="loading" />
                    <div class="w-full h-full flex flex-col gap-4 items-center text-white">
                        <span>LOG</span>
                        <pre class="w-full h-[300px] overflow-auto p-2 rounded-md bg-black bg-opacity-50">
                            <div id="log-video" class="w-[300px] text-xs"></div>    
                        </pre>
                    </div>
                </div>
            </div>
        </Pattern>
    </div>
</template>
<script lang="ts">
import { Component, toNative, Vue } from 'vue-facing-decorator';
import VideoEditMixin from '../app/modules/video/video_edit_mixin'
import Pattern from './Pattern.vue';
import VideoView from '../components/VideoEdit/VideoView.vue';
import Loader from '../components/Loader.vue';
import Progress from '../components/Progress.vue'

@Component({
    mixins: [VideoEditMixin],
    components: { Pattern, VideoView, Loader, Progress }
})
class VideoEdit extends Vue {

    get random_id() {
        return crypto.randomUUID().toString().replace(/-/g, '')
    }
}
// @ts-ignore
export default toNative(VideoEdit as typeof Vue & { new(): VideoEditMixin });
</script>
