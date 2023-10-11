// interface DataInputVideoOpts {
//     codec?: string
//     bitrate?: string
//     resolution?: string
//     framerate?: string
// }
// interface DataInputAudioOpts {
//     codec?: string
//     bitrate?: string
//     samplerate?: string
//     channels?: string
// }

export interface DataInput {
    id: string
    file: string | Blob | File | undefined // string == url or base64
    type: string
    // opts_video?: DataInputVideoOpts
    // opts_audio?: DataInputAudioOpts
}


export interface DataOutput {
    blob: Blob,
    url?: string
    ext: string
}

export interface DataOutputWrapper {
    video?: DataOutput
    image?: DataOutput
    audio?: DataOutput
}

export interface PreProcessCommand {
    split_video_audio(data: DataInput): Promise<DataOutputWrapper | Error>
    mute_video(data: DataInput): Promise<DataOutputWrapper | Error>
    watermark_video(data: DataInput, watermark: DataInput): Promise<DataOutputWrapper | Error>
    filter_video(data: DataInput, filter: string): Promise<DataOutputWrapper | Error>
    compress_video(data: DataInput): Promise<DataOutputWrapper | Error>
}