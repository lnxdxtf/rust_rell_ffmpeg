import type { FileType, Operation } from './editor';

export interface EditorState {
  file: File | null;
  fileType: FileType;
  fileUrl: string | null;
  fileName: string | null;
  operations: Operation[];
}
