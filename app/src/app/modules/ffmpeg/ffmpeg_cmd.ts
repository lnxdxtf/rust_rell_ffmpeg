import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from '@ffmpeg/util';
import ffmpegCoreUrl from '../../../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core?url'
import ffmpegwasmUrl from '../../../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm?url'
import { PreProcessCommand, PreProcessInput, PreProcessOutputWrapper, PreProcessOutput } from "./preprocess_interfaces";

export default class PreProcessFFMPEG implements PreProcessCommand {
    ffmpeg?: FFmpeg

    constructor() {
        this.ffmpeg = new FFmpeg()
        if (import.meta.env.VITE_PREPROCESS_LOG) {
            this.ffmpeg.on('log', ({ message: msg, type: tp }: any) => {
                const logElement = document.getElementById("log-video")
                if (logElement) {
                    logElement.textContent += `[${tp}] ${msg}\n`
                    logElement.parentElement!.scrollTop = logElement.parentElement!.scrollHeight;
                }
            })
        }
        if (import.meta.env.VITE_PREPROCESS_PROGRESS) {
            this.ffmpeg.on("progress", ({ progress: progress, time: _ }: any) => {
                const progressElement_width = document.getElementById("progress-width")
                const progressElement_percent = document.getElementById("progress-percent")
                if (progressElement_width) {
                    progressElement_width.style.width = `${progress * 100}%`
                }
                if (progressElement_percent) {
                    progressElement_percent.textContent = `${progress.toFixed(1) * 100}%`
                }
            })
        }
    }

    private async load() {
        await this.ffmpeg?.load({
            coreURL: ffmpegCoreUrl,
            wasmURL: ffmpegwasmUrl,
        })
    }

    private async get_preprocessed(file_target: string, file_type: string): Promise<PreProcessOutput> {
        const data = await this.ffmpeg!.readFile(file_target)
        const blob = new Blob([data], { type: file_type })
        const url = URL.createObjectURL(blob)
        return { blob: blob, url: url, ext: file_type }
    }

    public async mute_video(data: PreProcessInput): Promise<PreProcessOutputWrapper> {
        await this.load()
        const file_input = `${data.file_id_input}_input.${data.file_ext_input}`
        const file_output = `${data.file_id_output ?? data.file_id_input}.${data.file_ext_output}`
        await this.ffmpeg!.writeFile(file_input, await fetchFile(data.file_data_input))
        const command: string[] = ['-i', file_input, '-an', file_output]
        this.ffmpeg!.exec(command)
        const result = await this.get_preprocessed(file_output, data.file_ext_output)
        this.ffmpeg!.terminate
        return { video: result }
    }

    public async split_video_audio(_data: PreProcessInput): Promise<PreProcessOutputWrapper> {
        const command: string[] = []
        this.ffmpeg!.exec(command)
        return { audio: undefined }
    }

}


