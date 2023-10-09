import { Vue, Component, toNative } from 'vue-facing-decorator';
import PreProcessFFMPEG from '../ffmpeg/ffmpeg_cmd';

@Component
class VideoEditMixin extends Vue {

    video_input: any
    video_output: any
    loading: boolean = false

    watch_file_input() {
        document.getElementById('video-input')?.addEventListener('change', (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.video_input = e.target?.result
                }
                reader.readAsDataURL(file)
            }
        })
    }

    public async start_preprocess() {
        this.loading = true
        const ffmpeg_app = new PreProcessFFMPEG()
        const file_id = "ffmpeg_test"
        const data = await ffmpeg_app.mute_video(
            {
                file_data_input: this.video_input!,
                file_ext_input: 'mp4',
                file_id_input: file_id,
                file_ext_output: 'mp4',
                file_id_output: file_id
            }
        )
        this.video_output = data.video?.url
        this.loading = false
    }


    mounted() {
        this.watch_file_input()
    }


}

export default toNative(VideoEditMixin)