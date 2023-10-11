import { Vue, Component, toNative, Watch } from 'vue-facing-decorator';
import PreProcessFFMPEG from '../ffmpeg/ffmpeg_cmd';
import { DataInput, DataOutputWrapper } from '../ffmpeg/preprocess_interfaces';
import notification from '../notification';

@Component
class VideoEditMixin extends Vue {
    data_input: DataInput = {
        id: '',
        file: undefined,
        type: "video",
    }
    watermark?: DataInput
    filter?: string
    data_output: DataOutputWrapper | undefined
    loading: boolean = false
    edit_selected: string = 'extract-audio'

    watch_file_input() {
        document.getElementById('video-input')?.addEventListener('change', (e: any) => {
            const file = e.target.files[0]
            if (file) {
                this.data_input!.type = file.type
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.data_input!.file = (e.target?.result as string)
                }
                reader.readAsDataURL(file)
            }
        })
    }

    public async start_preprocess() {
        this.loading = true
        const ffmpeg_app = new PreProcessFFMPEG()
        this.data_input.id = `${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`
        let data: DataOutputWrapper | undefined | Error
        switch (this.edit_selected) {
            case 'extract-audio':
                data = await ffmpeg_app.mute_video(this.data_input)
                break

            case 'water-mark':
                data = await ffmpeg_app.watermark_video(this.data_input, this.watermark!)
                break

            case 'filter':
                data = await ffmpeg_app.filter_video(this.data_input, this.filter!)
                break
        }
        if (data instanceof Error) {
            notification(data.message, 3)
        } else {
            this.data_output = data
        }
        this.loading = false
    }

    video_editing_action_handler(data: string) {
        this.edit_selected = data
    }

    get_water_mark_file() {
        const el = document.getElementById('video-water-mark-input')
        el?.addEventListener('change', (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.watermark! = { id: `${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`, file: (e.target?.result as string), type: file.type }

                }
                reader.readAsDataURL(file)
            }
        })
    }

    @Watch('edit_selected')
    onEditSelectedChanged(val: string, _oldVal: string) {
        setTimeout(() => {
            if (val == 'water-mark') {
                this.get_water_mark_file()
            }
        }, 100);
    }

    mounted() {
        this.watch_file_input()
    }


}

export default toNative(VideoEditMixin)