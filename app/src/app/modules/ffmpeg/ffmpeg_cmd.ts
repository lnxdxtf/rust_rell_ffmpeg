import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from '@ffmpeg/util';
import ffmpegCoreUrl from '../../../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core?url'
import ffmpegwasmUrl from '../../../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm?url'
import { PreProcessCommand, DataOutput, DataOutputWrapper, DataInput } from "./preprocess_interfaces";

export default class PreProcessFFMPEG implements PreProcessCommand {
    ffmpeg?: FFmpeg

    constructor() {
        this.ffmpeg = new FFmpeg()
        this.ffmpeg.on('log', ({ message: msg, type: tp }: any) => {
            const logElement = document.getElementById("log-video")
            if (logElement) {
                logElement.textContent += `[${tp}] ${msg}\n`
                logElement.parentElement!.scrollTop = logElement.parentElement!.scrollHeight;
            }
        })
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

    private async load() {
        await this.ffmpeg?.load({
            coreURL: ffmpegCoreUrl,
            wasmURL: ffmpegwasmUrl,
        })
    }

    private async get_preprocessed(file_target: string, file_type: string): Promise<DataOutput> {
        const data = await this.ffmpeg!.readFile(file_target)
        const blob = new Blob([data], { type: file_type.split('/')[0] })
        const url = URL.createObjectURL(blob)
        return { blob: blob, url: url, ext: file_type }
    }

    public async mute_video(data: DataInput): Promise<DataOutputWrapper> {
        await this.load()
        const file_input = `${data.id}_input.${data.type.split('/')[1]}`
        const file_output = `${data.id}_output.${data.type.split('/')[1]}`
        await this.ffmpeg!.writeFile(file_input, await fetchFile(data.file))
        const command: string[] = ['-i', file_input, '-an', file_output]
        this.ffmpeg!.exec(command)
        const result = await this.get_preprocessed(file_output, data.type)
        this.ffmpeg!.terminate
        return { video: result }
    }

    public async split_video_audio(_data: DataInput): Promise<DataOutputWrapper> {
        const command: string[] = []
        this.ffmpeg!.exec(command)
        return { audio: undefined, video: undefined }
    }

    public async watermark_video(data: DataInput, watermark: DataInput): Promise<DataOutputWrapper> {
        await this.load()
        const file_video_input = `${data.id}_input.${data.type.split('/')[1]}`
        const file_watermark_input = `${watermark.id}_input.${watermark.type.split('/')[1]}`
        const file_output = `${data.id}_output.${data.type.split('/')[1]}`
        await this.ffmpeg!.writeFile(file_video_input, await fetchFile(data.file))
        await this.ffmpeg!.writeFile(file_watermark_input, await fetchFile(watermark.file))

        // const command: string[] = [
        //     "-i", file_video_input,           // Input video file
        //     "-i", file_watermark_input,       // Input watermark file
        //     "-filter_complex", "overlay=W-w-10:H-h-10",  // Position of watermark. Here it's top right corner
        //     "-c:a", "copy",                   // Copy audio without re-encoding
        //     file_output                       // Output video file
        // ];
        const command: string[] = [
            "-i", file_video_input,           // Input video file
            "-i", file_watermark_input,       // Input watermark file
            "-filter_complex", "[1:v]scale=100:-1[watermark];[0:v][watermark]overlay=W-w-10:H-h-10",
            // Scale the watermark's width to 100 and maintain aspect ratio, then overlay it
            "-c:a", "copy",                   // Copy audio without re-encoding
            file_output                       // Output video file
        ];

        this.ffmpeg!.exec(command)
        const result = await this.get_preprocessed(file_output, data.type)
        this.ffmpeg!.terminate
        return { video: result }
    }

}