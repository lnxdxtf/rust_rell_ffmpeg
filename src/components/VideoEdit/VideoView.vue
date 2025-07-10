<template>
    <div>
        <video :id="`video-${video_data.ref_id}`" :src="video_data.src" controls autoplay muted class="w-full h-full">
        </video>
    </div>
</template>
<script lang="ts">
import { Component, Vue, toNative, Prop } from 'vue-facing-decorator';
@Component({})
class VideoView extends Vue {
    @Prop
    video_data!: any
}
export default toNative(VideoView);
</script>