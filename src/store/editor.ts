import type { Module } from 'vuex';
import type { EditorState, FileType, Operation } from '@/types/editor';
import { detectFileType } from '@/utils/detectFileType';

const state: EditorState = {
  file: null,
  fileType: null,
  fileUrl: null,
  fileName: null,
  operations: [],
};

const mutations = {
  setFile(s: EditorState, file: File | null) {
    s.file = file;
    if (file) {
      s.fileType = detectFileType(file);
      s.fileName = file.name;
      if (s.fileUrl) URL.revokeObjectURL(s.fileUrl);
      s.fileUrl = URL.createObjectURL(file);
    } else {
      s.fileType = null;
      s.fileName = null;
      if (s.fileUrl) URL.revokeObjectURL(s.fileUrl);
      s.fileUrl = null;
    }
  },
  clearFile(s: EditorState) {
    if (s.fileUrl) URL.revokeObjectURL(s.fileUrl);
    s.file = null;
    s.fileType = null;
    s.fileUrl = null;
    s.fileName = null;
    s.operations = [];
  },
  addOperation(s: EditorState, op: Operation) {
    s.operations.push(op);
  },
  removeOperation(s: EditorState, index: number) {
    s.operations.splice(index, 1);
  },
  clearOperations(s: EditorState) {
    s.operations = [];
  },
};

export const editorModule: Module<EditorState, unknown> = {
  namespaced: true,
  state,
  mutations,
};
