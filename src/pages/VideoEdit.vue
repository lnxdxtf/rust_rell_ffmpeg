<template>
    <div>
        <Pattern>
            <div class="w-full h-full p-4">
                <div class="flex flex-col gap-8">

                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Select a Video Input</span>
                            <span class="label-text-alt">*</span>
                        </label>
                        <input id="video-input" type="file"
                            class="file-input file-input-bordered w-full max-w-xs bg-black bg-opacity-50" />
                    </div>

                    <ToolBarVideoEdit @video_editing_action="video_editing_action_handler" :edit_selected="edit_selected" />

                    <template v-if="edit_selected == 'water-mark'">
                        <div>
                            <div class="w-fit">
                                <label for="video-water-mark-input" class="block text-sm text-white">Water Mark
                                    Image(.png)
                                    with background transparent</label>
                                <input id="video-water-mark-input" type="file"
                                    class="block w-full px-3 py-2 mt-2 text-sm border border-main-2 rounded-lg file:text-sm file:text-white file:px-4 file:py-1 file:border-none file:rounded-full file:bg-main-2 file:bg-opacity-20 text-white" />
                            </div>
                        </div>
                    </template>

                    <template v-else-if="edit_selected == 'filter'">
                        <div>
                            <div class="w-full grid grid-cols-1 lg:grid-cols-4 items-center p-2 gap-4">

                                <div @click="filter = 'hue=s=0'"
                                    class="w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer">
                                    Black & White
                                </div>
                                <div @click="filter = 'hue=h=60'"
                                    class="w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer">
                                    HUE ROTATE 60
                                </div>
                                <div @click="filter = 'curves=b=0.2'"
                                    class="w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer">
                                    Blue
                                </div>
                                <div @click="filter = 'curves=r=0.2'"
                                    class="w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer">
                                    Red
                                </div>
                                <div @click="filter = 'negate'"
                                    class="w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer">
                                    Negative
                                </div>

                            </div>
                        </div>
                    </template>

                    <template v-else-if="edit_selected == 'compress'">
                        <div>
                            <div class="grid grid-cols-2 lg:grid-cols-4">
                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text">Codec Video</span>
                                        <span class="label-text-alt">*</span>
                                    </label>
                                    <select v-model="data_input.opts_video.codec"
                                        class="select select-bordered bg-black bg-opacity-50">
                                        <option value="h264" selected>H264</option>
                                        <option value="hevc" selected>H265/HEVC</option>
                                        <option value="hnm4video" selected>hnm4video</option>
                                        <option value="mpeg1video" selected>mpeg1video</option>
                                        <option value="mpeg4" selected>mpeg4</option>
                                    </select>
                                </div>

                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text">Codec Audio</span>
                                        <span class="label-text-alt">*disabled</span>
                                    </label>
                                    <select v-model="data_input.opts_audio.codec" disabled
                                        class="select select-bordered bg-black bg-opacity-50">
                                        <option value="" selected>H256</option>
                                    </select>
                                </div>

                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text">Resolution</span>
                                        <span class="label-text-alt">*</span>
                                    </label>
                                    <select v-model="data_input.opts_video.resolution"
                                        class="select select-bordered bg-black bg-opacity-50">
                                        <option value="1280x720" selected>720p - HD (1280X720)</option>
                                        <option value="854x480">480p - SD (854X480)</option>
                                        <option value="640x360">360p - SD (640X360)</option>
                                    </select>
                                </div>

                                <div class="w-full lg:w-3/4">
                                    <label class="label">
                                        <span class="label-text">Bit Rate Video</span>
                                        <span class="label-text-alt">{{ data_input.opts_video.bitrate }}kbps</span>
                                    </label>
                                    <input v-model="data_input.opts_video.bitrate" type="range" min="150" max="50000"
                                        class="range range-sm" step="50" />
                                    <div class="w-full flex justify-between text-xs px-2">
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                    </div>
                                </div>
                                <div class="w-full lg:w-3/4">
                                    <label class="label">
                                        <span class="label-text">Bit Rate Audio</span>
                                        <span class="label-text-alt">*disabled {{ data_input.opts_audio.bitrate
                                        }}kbps</span>
                                    </label>
                                    <input disabled v-model="data_input.opts_audio.bitrate" type="range" min="150" max="320"
                                        class="range range-sm" step="50" />
                                    <div class="w-full flex justify-between text-xs px-2">
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                    </div>
                                </div>

                                <div class="w-full lg:w-3/4">
                                    <label class="label">
                                        <span class="label-text">Frame Rate</span>
                                        <span class="label-text-alt">{{ data_input.opts_video.framerate }}fps</span>
                                    </label>
                                    <input v-model="data_input.opts_video.framerate" type="range" min="5" max="120"
                                        class="range range-sm" step="5" />
                                    <div class="w-full flex justify-between text-xs px-2">
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </template>

                    <div v-if="!data_output"
                        class="flex items-center justify-center px-4 py-2 font-bold text-white rounded-md"
                        @click="data_input.file && !loading ? start_preprocess() : null"
                        :class="{ 'bg-green-600 cursor-pointer': data_input.file && !loading, 'bg-amber-600 cursor-not-allowed': !data_input.file || loading || !data_input.file && loading }">
                        {{ !data_input.file ? 'Choose a Video Input' : 'Start' }}
                    </div>
                    <div v-else
                        class="flex items-center justify-center px-4 py-2 font-bold text-white rounded-md bg-gray-500 cursor-pointer"
                        @click="data_output = null">
                        Clear
                    </div>

                    <div class="w-full flex flex-col lg:flex-row gap-4">
                        <div class="w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50">
                            <span class="text-xl font-bold text-white">Input Video</span>
                            <VideoView class="w-[240px] h-[180px] lg:w-[480px] lg:h-[240px]"
                                :video_data="{ ref_id: `${random_id}-input`, src: data_input.file }" />
                        </div>
                        <div class="w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50">
                            <span class="text-xl font-bold text-white">Output Video</span>
                            <Loader v-if="loading && !data_output" />

                            <div v-else>
                                <VideoView v-if="data_output" class="w-[240px] h-[180px] lg:w-[480px] lg:h-[240px]"
                                    :video_data="{ ref_id: `${random_id}-output`, src: data_output.video.url }" />
                                <div class="w-full flex justify-center p-4 items-center">
                                    <a v-if="data_output?.video?.url" :href="data_output?.video?.url"
                                        :download="`video_output.${data_output.video.ext.split('/')[1]}`"
                                        class="cursor-pointer px-4 py-2 rounded-md bg-green-600 text-white font-bold">Download
                                        Video {{ }}</a>
                                    <template v-if="edit_selected == 'audio-extract'">
                                        <div>
                                            <a v-if="audio_output" class=""></a>
                                        </div>
                                    </template>
                                </div>
                            </div>

                        </div>
                    </div>

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
import ToolBarVideoEdit from '../components/VideoEdit/ToolBarVideoEdit.vue';

@Component({
    mixins: [VideoEditMixin],
    components: { Pattern, VideoView, Loader, Progress, ToolBarVideoEdit }
})
class VideoEdit extends Vue {

    get random_id() {
        return crypto.randomUUID().toString().replace(/-/g, '')
    }
}
// @ts-ignore
export default toNative(VideoEdit as typeof Vue & { new(): VideoEditMixin });
</script>
