export interface PreProcessInput {
    file_id_input: string
    file_ext_input: string
    file_data_input: any | Blob
    file_id_output?: string
    file_ext_output: string
}
export interface PreProcessOutput {
    blob: Blob,
    url?: string
    ext: string
}

export interface PreProcessOutputWrapper {
    video?: PreProcessOutput
    image?: PreProcessOutput
    audio?: PreProcessOutput
}

export interface PreProcessCommand {
    split_video_audio(data: PreProcessInput): Promise<PreProcessOutputWrapper>
    mute_video(data: PreProcessInput): Promise<PreProcessOutputWrapper>
}