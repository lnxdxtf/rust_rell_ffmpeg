var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _worker, _resolves, _rejects, _logEventCallbacks, _progressEventCallbacks, _registerHandlers, _send;
import { u as useToast } from "./index-ea9c15d2.js";
var FFMessageType;
(function(FFMessageType2) {
  FFMessageType2["LOAD"] = "LOAD";
  FFMessageType2["EXEC"] = "EXEC";
  FFMessageType2["FFPROBE"] = "FFPROBE";
  FFMessageType2["WRITE_FILE"] = "WRITE_FILE";
  FFMessageType2["READ_FILE"] = "READ_FILE";
  FFMessageType2["DELETE_FILE"] = "DELETE_FILE";
  FFMessageType2["RENAME"] = "RENAME";
  FFMessageType2["CREATE_DIR"] = "CREATE_DIR";
  FFMessageType2["LIST_DIR"] = "LIST_DIR";
  FFMessageType2["DELETE_DIR"] = "DELETE_DIR";
  FFMessageType2["ERROR"] = "ERROR";
  FFMessageType2["DOWNLOAD"] = "DOWNLOAD";
  FFMessageType2["PROGRESS"] = "PROGRESS";
  FFMessageType2["LOG"] = "LOG";
  FFMessageType2["MOUNT"] = "MOUNT";
  FFMessageType2["UNMOUNT"] = "UNMOUNT";
})(FFMessageType || (FFMessageType = {}));
const getMessageID = (() => {
  let messageID = 0;
  return () => messageID++;
})();
const ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
const ERROR_TERMINATED = new Error("called FFmpeg.terminate()");
class FFmpeg {
  constructor() {
    __privateAdd(this, _worker, null);
    /**
     * #resolves and #rejects tracks Promise resolves and rejects to
     * be called when we receive message from web worker.
     */
    __privateAdd(this, _resolves, {});
    __privateAdd(this, _rejects, {});
    __privateAdd(this, _logEventCallbacks, []);
    __privateAdd(this, _progressEventCallbacks, []);
    __publicField(this, "loaded", false);
    /**
     * register worker message event handlers.
     */
    __privateAdd(this, _registerHandlers, () => {
      if (__privateGet(this, _worker)) {
        __privateGet(this, _worker).onmessage = ({ data: { id, type, data } }) => {
          switch (type) {
            case FFMessageType.LOAD:
              this.loaded = true;
              __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.MOUNT:
            case FFMessageType.UNMOUNT:
            case FFMessageType.EXEC:
            case FFMessageType.FFPROBE:
            case FFMessageType.WRITE_FILE:
            case FFMessageType.READ_FILE:
            case FFMessageType.DELETE_FILE:
            case FFMessageType.RENAME:
            case FFMessageType.CREATE_DIR:
            case FFMessageType.LIST_DIR:
            case FFMessageType.DELETE_DIR:
              __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.LOG:
              __privateGet(this, _logEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.PROGRESS:
              __privateGet(this, _progressEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.ERROR:
              __privateGet(this, _rejects)[id](data);
              break;
          }
          delete __privateGet(this, _resolves)[id];
          delete __privateGet(this, _rejects)[id];
        };
      }
    });
    /**
     * Generic function to send messages to web worker.
     */
    __privateAdd(this, _send, ({ type, data }, trans = [], signal) => {
      if (!__privateGet(this, _worker)) {
        return Promise.reject(ERROR_NOT_LOADED);
      }
      return new Promise((resolve, reject) => {
        const id = getMessageID();
        __privateGet(this, _worker) && __privateGet(this, _worker).postMessage({ id, type, data }, trans);
        __privateGet(this, _resolves)[id] = resolve;
        __privateGet(this, _rejects)[id] = reject;
        signal == null ? void 0 : signal.addEventListener("abort", () => {
          reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
        }, { once: true });
      });
    });
    /**
     * Loads ffmpeg-core inside web worker. It is required to call this method first
     * as it initializes WebAssembly and other essential variables.
     *
     * @category FFmpeg
     * @returns `true` if ffmpeg core is loaded for the first time.
     */
    __publicField(this, "load", ({ classWorkerURL, ...config } = {}, { signal } = {}) => {
      if (!__privateGet(this, _worker)) {
        __privateSet(this, _worker, classWorkerURL ? new Worker(new URL(classWorkerURL, import.meta.url), {
          type: "module"
        }) : (
          // We need to duplicated the code here to enable webpack
          // to bundle worekr.js here.
          new Worker(new URL("/rust_rell_ffmpeg/assets/worker-75c22df8.js", self.location), {
            type: "module"
          })
        ));
        __privateGet(this, _registerHandlers).call(this);
      }
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.LOAD,
        data: config
      }, void 0, signal);
    });
    /**
     * Execute ffmpeg command.
     *
     * @remarks
     * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
     * by default.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // ffmpeg -i video.avi video.mp4
     * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
     * const data = ffmpeg.readFile("video.mp4");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    __publicField(this, "exec", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.EXEC,
      data: { args, timeout }
    }, void 0, signal));
    /**
     * Execute ffprobe command.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
     * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
     * const data = ffmpeg.readFile("output.txt");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    __publicField(this, "ffprobe", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.FFPROBE,
      data: { args, timeout }
    }, void 0, signal));
    /**
     * Terminate all ongoing API calls and terminate web worker.
     * `FFmpeg.load()` must be called again before calling any other APIs.
     *
     * @category FFmpeg
     */
    __publicField(this, "terminate", () => {
      const ids = Object.keys(__privateGet(this, _rejects));
      for (const id of ids) {
        __privateGet(this, _rejects)[id](ERROR_TERMINATED);
        delete __privateGet(this, _rejects)[id];
        delete __privateGet(this, _resolves)[id];
      }
      if (__privateGet(this, _worker)) {
        __privateGet(this, _worker).terminate();
        __privateSet(this, _worker, null);
        this.loaded = false;
      }
    });
    /**
     * Write data to ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
     * await ffmpeg.writeFile("text.txt", "hello world");
     * ```
     *
     * @category File System
     */
    __publicField(this, "writeFile", (path, data, { signal } = {}) => {
      const trans = [];
      if (data instanceof Uint8Array) {
        trans.push(data.buffer);
      }
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.WRITE_FILE,
        data: { path, data }
      }, trans, signal);
    });
    __publicField(this, "mount", (fsType, options, mountPoint) => {
      const trans = [];
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.MOUNT,
        data: { fsType, options, mountPoint }
      }, trans);
    });
    __publicField(this, "unmount", (mountPoint) => {
      const trans = [];
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.UNMOUNT,
        data: { mountPoint }
      }, trans);
    });
    /**
     * Read data from ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * const data = await ffmpeg.readFile("video.mp4");
     * ```
     *
     * @category File System
     */
    __publicField(this, "readFile", (path, encoding = "binary", { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.READ_FILE,
      data: { path, encoding }
    }, void 0, signal));
    /**
     * Delete a file.
     *
     * @category File System
     */
    __publicField(this, "deleteFile", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.DELETE_FILE,
      data: { path }
    }, void 0, signal));
    /**
     * Rename a file or directory.
     *
     * @category File System
     */
    __publicField(this, "rename", (oldPath, newPath, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.RENAME,
      data: { oldPath, newPath }
    }, void 0, signal));
    /**
     * Create a directory.
     *
     * @category File System
     */
    __publicField(this, "createDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.CREATE_DIR,
      data: { path }
    }, void 0, signal));
    /**
     * List directory contents.
     *
     * @category File System
     */
    __publicField(this, "listDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.LIST_DIR,
      data: { path }
    }, void 0, signal));
    /**
     * Delete an empty directory.
     *
     * @category File System
     */
    __publicField(this, "deleteDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.DELETE_DIR,
      data: { path }
    }, void 0, signal));
  }
  on(event, callback) {
    if (event === "log") {
      __privateGet(this, _logEventCallbacks).push(callback);
    } else if (event === "progress") {
      __privateGet(this, _progressEventCallbacks).push(callback);
    }
  }
  off(event, callback) {
    if (event === "log") {
      __privateSet(this, _logEventCallbacks, __privateGet(this, _logEventCallbacks).filter((f) => f !== callback));
    } else if (event === "progress") {
      __privateSet(this, _progressEventCallbacks, __privateGet(this, _progressEventCallbacks).filter((f) => f !== callback));
    }
  }
}
_worker = new WeakMap();
_resolves = new WeakMap();
_rejects = new WeakMap();
_logEventCallbacks = new WeakMap();
_progressEventCallbacks = new WeakMap();
_registerHandlers = new WeakMap();
_send = new WeakMap();
var FFFSType;
(function(FFFSType2) {
  FFFSType2["MEMFS"] = "MEMFS";
  FFFSType2["NODEFS"] = "NODEFS";
  FFFSType2["NODERAWFS"] = "NODERAWFS";
  FFFSType2["IDBFS"] = "IDBFS";
  FFFSType2["WORKERFS"] = "WORKERFS";
  FFFSType2["PROXYFS"] = "PROXYFS";
})(FFFSType || (FFFSType = {}));
const readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const { result } = fileReader;
    if (result instanceof ArrayBuffer) {
      resolve(new Uint8Array(result));
    } else {
      resolve(new Uint8Array());
    }
  };
  fileReader.onerror = (event) => {
    var _a, _b;
    reject(Error(`File could not be read! Code=${((_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.error) == null ? void 0 : _b.code) || -1}`));
  };
  fileReader.readAsArrayBuffer(blob);
});
const fetchFile = async (file) => {
  let data;
  if (typeof file === "string") {
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
      data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
    } else {
      data = await (await fetch(file)).arrayBuffer();
    }
  } else if (file instanceof URL) {
    data = await (await fetch(file)).arrayBuffer();
  } else if (file instanceof File || file instanceof Blob) {
    data = await readFromBlobOrFile(file);
  } else {
    return new Uint8Array();
  }
  return new Uint8Array(data);
};
const ffmpegCoreUrl = "/rust_rell_ffmpeg/assets/ffmpeg-core-67a48f11.js";
const ffmpegwasmUrl = "/rust_rell_ffmpeg/assets/ffmpeg-core-9f57947a.wasm";
class PreProcessFFMPEG {
  constructor() {
    __publicField(this, "ffmpeg");
    this.ffmpeg = new FFmpeg();
    this.ffmpeg.on("log", ({ message: msg, type: tp }) => {
      const logElement = document.getElementById("log-video");
      if (logElement) {
        logElement.textContent += `[${tp}] ${msg}
`;
        logElement.parentElement.scrollTop = logElement.parentElement.scrollHeight;
      }
    });
    this.ffmpeg.on("progress", ({ progress, time: _ }) => {
      const progressElement_width = document.getElementById("progress-width");
      const progressElement_percent = document.getElementById("progress-percent");
      if (progressElement_width) {
        progressElement_width.style.width = `${progress * 100}%`;
      }
      if (progressElement_percent) {
        progressElement_percent.textContent = `${progress.toFixed(1) * 100}%`;
      }
    });
  }
  async load() {
    var _a;
    await ((_a = this.ffmpeg) == null ? void 0 : _a.load({
      coreURL: ffmpegCoreUrl,
      wasmURL: ffmpegwasmUrl
    }));
  }
  async get_preprocessed(file_target, file_type) {
    const data = await this.ffmpeg.readFile(file_target);
    const blob = new Blob([data], { type: file_type.split("/")[0] });
    const url = URL.createObjectURL(blob);
    return { blob, url, ext: file_type };
  }
  check_type(data, msg_error) {
    if (data.type.includes("image/")) {
      return new Error(msg_error);
    }
  }
  async mute_video(data) {
    const err = this.check_type(data, "Cannot select a image for this function");
    if (err) {
      return err;
    }
    await this.load();
    const file_input = `${data.id}_input.${data.type.split("/")[1]}`;
    const file_output = `${data.id}_output.${data.type.split("/")[1]}`;
    await this.ffmpeg.writeFile(file_input, await fetchFile(data.file));
    const command = ["-i", file_input, "-an", file_output];
    this.ffmpeg.exec(command);
    const result = await this.get_preprocessed(file_output, data.type);
    this.ffmpeg.terminate();
    return { video: result };
  }
  async split_video_audio(data) {
    const err = this.check_type(data, "Cannot select a image for this function");
    if (err) {
      return err;
    }
    const command = [];
    this.ffmpeg.exec(command);
    return { audio: void 0, video: void 0 };
  }
  async watermark_video(data, watermark) {
    const err = this.check_type(data, "Cannot select a image for this function");
    if (err) {
      return err;
    }
    await this.load();
    const file_video_input = `${data.id}_input.${data.type.split("/")[1]}`;
    const file_watermark_input = `${watermark.id}_input.${watermark.type.split("/")[1]}`;
    const file_output = `${data.id}_output.${data.type.split("/")[1]}`;
    await this.ffmpeg.writeFile(file_video_input, await fetchFile(data.file));
    await this.ffmpeg.writeFile(file_watermark_input, await fetchFile(watermark.file));
    const command = [
      "-i",
      file_video_input,
      "-i",
      file_watermark_input,
      "-filter_complex",
      "[1:v]scale=100:-1[watermark];[0:v][watermark]overlay=W-w-10:H-h-10",
      "-c:a",
      "copy",
      file_output
    ];
    this.ffmpeg.exec(command);
    const result = await this.get_preprocessed(file_output, data.type);
    this.ffmpeg.terminate();
    return { video: result };
  }
  async filter_video(data, filter) {
    const err = this.check_type(data, "Cannot select a image for this function");
    if (err) {
      return err;
    }
    await this.load();
    const file_input = `${data.id}_input.${data.type.split("/")[1]}`;
    const file_output = `${data.id}_output.${data.type.split("/")[1]}`;
    await this.ffmpeg.writeFile(file_input, await fetchFile(data.file));
    const command = ["-i", file_input, "-vf", filter, "-c:a", "copy", file_output];
    this.ffmpeg.exec(command);
    const result = await this.get_preprocessed(file_output, data.type);
    this.ffmpeg.terminate();
    return { video: result };
  }
  async compress_video(data) {
    await this.load();
    const file_input = `${data.id}_input.${data.type.split("/")[1]}`;
    const file_output = `${data.id}_output.${data.type.split("/")[1]}`;
    await this.ffmpeg.writeFile(file_input, await fetchFile(data.file));
    let command = ["-i", file_input];
    if (data.opts_video) {
      if (data.opts_video.codec) {
        command.push("-vcodec", data.opts_video.codec);
      }
      if (data.opts_video.bitrate) {
        command.push("-b:v", `${data.opts_video.bitrate}k`);
      }
      if (data.opts_video.resolution) {
        command.push("-s", data.opts_video.resolution);
      }
      if (data.opts_video.framerate) {
        command.push("-r", `${data.opts_video.framerate}`);
      }
    }
    command.push(file_output);
    await this.ffmpeg.exec(command);
    const result = await this.get_preprocessed(file_output, data.type);
    this.ffmpeg.terminate();
    return { video: result };
  }
  async exec_command_dev(cmd, data) {
    await this.load();
    const file_input = `${data.id}_input.${data.type.split("/")[1]}`;
    const file_output = `${data.id}_output.${data.type.split("/")[1]}`;
    await this.ffmpeg.writeFile(file_input, await fetchFile(data.file));
    let commands = [];
    if (data.file) {
      commands.push("-i", file_input);
    }
    commands.push(...cmd);
    await this.ffmpeg.exec(commands);
    const result = await this.get_preprocessed(file_output, data.type);
    this.ffmpeg.terminate();
    return { video: result };
  }
}
const notification = (msg, type_notification) => {
  const toast = useToast();
  switch (type_notification) {
    case 0:
      toast.success(msg);
      break;
    case 1:
      toast.info(msg);
      break;
    case 2:
      toast.warning(msg);
      break;
    case 3:
      toast.error(msg);
      break;
    default:
      toast.info(msg);
      break;
  }
};
export {
  PreProcessFFMPEG as P,
  notification as n
};
