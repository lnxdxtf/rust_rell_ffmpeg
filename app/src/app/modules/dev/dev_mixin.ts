import { Vue, Component, toNative, Watch } from 'vue-facing-decorator';
import PreProcessFFMPEG from '../ffmpeg/ffmpeg_cmd';
import { DataInput, DataOutputWrapper } from '../ffmpeg/preprocess_interfaces';
import notification from '../notification';

@Component
class DevMixin extends Vue {
    loading: boolean = false
    ffmpeg?: PreProcessFFMPEG
    cmd_input: string = ""
    cmd_ffmpeg: string[] = []
    data_input: DataInput = {
        id: '',
        file: undefined,
        type: "video",
        opts_video: {
            codec: 'h264',
            bitrate: 1000,
            resolution: '1280x720',
            framerate: 30
        },
        opts_audio: {
            bitrate: undefined,
            codec: undefined,
            samplerate: undefined,
            channels: undefined
        }
    }
    data_output: DataOutputWrapper | undefined

    public async exec() {
        if (this.cmd_input == '') {
            this.cmd_ffmpeg = []
            return
        }
        if (this.cmd_keys_handler()) { return }
        this.cmd_ffmpeg.push(this.cmd_input)
        this.loading = true
        let data: DataOutputWrapper | undefined | Error

        data = await this.ffmpeg?.exec_command_dev(this.cmd_ffmpeg, this.data_input!)
        if (data instanceof Error) {
            notification(data.message, 3)
        } else {
            this.data_output = data
        }
        this.loading = false
        this.cmd_input = ""
    }

    private cmd_keys_handler() {
        if (this.cmd_input == 'cleaer' || this.cmd_input == 'cls') {
            document.getElementById('log-video')!.textContent = ""
            this.cmd_input = ""
            return true
        }
        if (this.cmd_input == 'help' || this.cmd_input == '-h') {
            document.getElementById('log-video')!.textContent = "Access: \nhttps://ffmpegwasm.netlify.app/\nhttps://github.com/ffmpegwasm/ffmpeg.wasm"
            this.cmd_input = ""
            return true
        }
    }

    mounted() {
        this.ffmpeg = new PreProcessFFMPEG()
        document.getElementById('video-input-dev')?.addEventListener('change', (e: any) => {
            const file = e.target.files[0]
            if (file) {
                this.data_input!.type = file.type
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.data_input!.file = (e.target?.result as string)
                    this.data_input!.id = "dev"
                }
                reader.readAsDataURL(file)
            }
        })
    }
}
export default toNative(DevMixin)
