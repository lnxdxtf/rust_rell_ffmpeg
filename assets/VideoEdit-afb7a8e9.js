var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { t as toNative, V as Vue, g as decorator, C as Component, h as decorator$1, _ as _export_sfc, o as openBlock, c as createElementBlock, b as createBaseVNode, i as decorator$2, n as normalizeClass, a as createVNode, w as withCtx, r as resolveComponent, e as withDirectives, j as vModelSelect, d as toDisplayString, v as vModelText, k as createCommentVNode, l as createBlock, m as createTextVNode } from "./index-ea9c15d2.js";
import { P as PreProcessFFMPEG, n as notification } from "./notification-591f7e55.js";
import Pattern from "./Pattern-8ae1f3f2.js";
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
let VideoEditMixin = class extends Vue {
  constructor() {
    super(...arguments);
    __publicField(this, "data_input", {
      id: "",
      file: void 0,
      type: "video",
      opts_video: {
        codec: "h264",
        bitrate: 1e3,
        resolution: "1280x720",
        framerate: 30
      },
      opts_audio: {
        bitrate: void 0,
        codec: void 0,
        samplerate: void 0,
        channels: void 0
      }
    });
    __publicField(this, "watermark");
    __publicField(this, "filter");
    __publicField(this, "data_output");
    __publicField(this, "loading", false);
    __publicField(this, "edit_selected", "extract-audio");
  }
  watch_file_input() {
    var _a;
    (_a = document.getElementById("video-input")) == null ? void 0 : _a.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.data_input.type = file.type;
        const reader = new FileReader();
        reader.onload = (e2) => {
          var _a2;
          this.data_input.file = (_a2 = e2.target) == null ? void 0 : _a2.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  async start_preprocess() {
    this.loading = true;
    const ffmpeg_app = new PreProcessFFMPEG();
    this.data_input.id = `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    let data;
    switch (this.edit_selected) {
      case "extract-audio":
        data = await ffmpeg_app.mute_video(this.data_input);
        break;
      case "water-mark":
        data = await ffmpeg_app.watermark_video(this.data_input, this.watermark);
        break;
      case "filter":
        data = await ffmpeg_app.filter_video(this.data_input, this.filter);
        break;
      case "compress":
        data = await ffmpeg_app.compress_video(this.data_input);
        break;
    }
    if (data instanceof Error) {
      notification(data.message, 3);
    } else {
      this.data_output = data;
    }
    this.loading = false;
  }
  video_editing_action_handler(data) {
    this.edit_selected = data;
  }
  get_water_mark_file() {
    const el = document.getElementById("video-water-mark-input");
    el == null ? void 0 : el.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e2) => {
          var _a;
          this.watermark = { id: `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`, file: (_a = e2.target) == null ? void 0 : _a.result, type: file.type };
        };
        reader.readAsDataURL(file);
      }
    });
  }
  onEditSelectedChanged(val, _oldVal) {
    setTimeout(() => {
      if (val == "water-mark") {
        this.get_water_mark_file();
      }
    }, 100);
  }
  mounted() {
    this.watch_file_input();
  }
};
__decorateClass$5([
  decorator("edit_selected")
], VideoEditMixin.prototype, "onEditSelectedChanged", 1);
VideoEditMixin = __decorateClass$5([
  Component
], VideoEditMixin);
const VideoEditMixin$1 = toNative(VideoEditMixin);
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
let VideoView$1 = class VideoView extends Vue {
  constructor() {
    super(...arguments);
    __publicField(this, "video_data");
  }
};
__decorateClass$4([
  decorator$1
], VideoView$1.prototype, "video_data", 2);
VideoView$1 = __decorateClass$4([
  Component({})
], VideoView$1);
const _sfc_main$4 = toNative(VideoView$1);
const _hoisted_1$2 = ["id", "src"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("video", {
      id: `video-${_ctx.video_data.ref_id}`,
      src: _ctx.video_data.src,
      controls: "",
      autoplay: "",
      muted: "",
      class: "w-full h-full"
    }, null, 8, _hoisted_1$2)
  ]);
}
const VideoView2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let Loader$1 = class Loader extends Vue {
};
Loader$1 = __decorateClass$3([
  Component({})
], Loader$1);
const _sfc_main$3 = toNative(Loader$1);
const Loader_vue_vue_type_style_index_0_lang = "";
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, _cache[0] || (_cache[0] = [
    createBaseVNode("div", { class: "loader" }, [
      createBaseVNode("svg", { viewBox: "0 0 80 80" }, [
        createBaseVNode("rect", {
          x: "8",
          y: "8",
          width: "64",
          height: "64"
        })
      ])
    ], -1)
  ]));
}
const Loader2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let Progress$1 = class Progress extends Vue {
};
Progress$1 = __decorateClass$2([
  Component({})
], Progress$1);
const _sfc_main$2 = toNative(Progress$1);
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, _cache[0] || (_cache[0] = [
    createBaseVNode("span", {
      id: "ProgressLabel",
      class: "sr-only"
    }, "Loading", -1),
    createBaseVNode("span", {
      role: "progressbar",
      "aria-labelledby": "ProgressLabel",
      "aria-valuenow": "75",
      class: "relative block rounded-full bg-gray-200 dark:bg-gray-700"
    }, [
      createBaseVNode("span", { class: "absolute inset-0 flex items-center justify-center text-[10px]/4" }, [
        createBaseVNode("span", {
          id: "progress-percent",
          class: "font-bold text-white"
        })
      ]),
      createBaseVNode("span", {
        id: "progress-width",
        class: "block h-4 rounded-full bg-main-1 text-center",
        style: { "width": "0%" }
      })
    ], -1)
  ]));
}
const Progress2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let ToolBarVideoEdit$1 = class ToolBarVideoEdit extends Vue {
  constructor() {
    super(...arguments);
    __publicField(this, "edit_selected", "extract-audio");
  }
  video_editing_action(action) {
    return action;
  }
};
__decorateClass$1([
  decorator$1
], ToolBarVideoEdit$1.prototype, "edit_selected", 2);
__decorateClass$1([
  decorator$2
], ToolBarVideoEdit$1.prototype, "video_editing_action", 1);
ToolBarVideoEdit$1 = __decorateClass$1([
  Component({})
], ToolBarVideoEdit$1);
const _sfc_main$1 = toNative(ToolBarVideoEdit$1);
const _hoisted_1$1 = { class: "grid grid-cols-2 lg:flex overflow-hidden divide-x divide-main-2 rounded-lg flex-row-revers bg-black bg-opacity-50" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$1, [
      createBaseVNode("button", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.video_editing_action("extract-audio")),
        class: normalizeClass([{ "bg-main-2": _ctx.edit_selected == "extract-audio" }, "px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2"])
      }, " Extract Audio ", 2),
      createBaseVNode("button", {
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.video_editing_action("water-mark")),
        class: normalizeClass([{ "bg-main-2": _ctx.edit_selected == "water-mark" }, "px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2"])
      }, " Water Mark ", 2),
      createBaseVNode("button", {
        onClick: _cache[2] || (_cache[2] = ($event) => _ctx.video_editing_action("filter")),
        class: normalizeClass([{ "bg-main-2": _ctx.edit_selected == "filter" }, "px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2"])
      }, " Filter ", 2),
      createBaseVNode("button", {
        onClick: _cache[3] || (_cache[3] = ($event) => _ctx.video_editing_action("compress")),
        class: normalizeClass([{ "bg-main-2": _ctx.edit_selected == "compress" }, "px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 text-white hover:bg-main-2"])
      }, " Compress ", 2)
    ])
  ]);
}
const ToolBarVideoEdit2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator2; i >= 0; i--)
    if (decorator2 = decorators[i])
      result = (kind ? decorator2(target, key, result) : decorator2(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
let VideoEdit$1 = class VideoEdit extends Vue {
  get random_id() {
    return crypto.randomUUID().toString().replace(/-/g, "");
  }
};
VideoEdit$1 = __decorateClass([
  Component({
    mixins: [VideoEditMixin$1],
    components: { Pattern, VideoView: VideoView2, Loader: Loader2, Progress: Progress2, ToolBarVideoEdit: ToolBarVideoEdit2 }
  })
], VideoEdit$1);
const _sfc_main = toNative(VideoEdit$1);
const _hoisted_1 = { class: "w-full h-full p-4" };
const _hoisted_2 = { class: "flex flex-col gap-8" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { class: "w-full grid grid-cols-1 lg:grid-cols-4 items-center p-2 gap-4" };
const _hoisted_6 = { key: 2 };
const _hoisted_7 = { class: "grid grid-cols-2 lg:grid-cols-4" };
const _hoisted_8 = { class: "form-control w-full max-w-xs" };
const _hoisted_9 = { class: "form-control w-full max-w-xs" };
const _hoisted_10 = { class: "form-control w-full max-w-xs" };
const _hoisted_11 = { class: "w-full lg:w-3/4" };
const _hoisted_12 = { class: "label" };
const _hoisted_13 = { class: "label-text-alt" };
const _hoisted_14 = { class: "w-full lg:w-3/4" };
const _hoisted_15 = { class: "label" };
const _hoisted_16 = { class: "label-text-alt" };
const _hoisted_17 = { class: "w-full lg:w-3/4" };
const _hoisted_18 = { class: "label" };
const _hoisted_19 = { class: "label-text-alt" };
const _hoisted_20 = { class: "w-full flex flex-col lg:flex-row gap-4" };
const _hoisted_21 = { class: "w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50" };
const _hoisted_22 = { class: "w-full flex flex-col gap-4 items-center p-6 rounded-md bg-black bg-opacity-50" };
const _hoisted_23 = { key: 1 };
const _hoisted_24 = { class: "w-full flex justify-center p-4 items-center" };
const _hoisted_25 = ["href", "download"];
const _hoisted_26 = { key: 1 };
const _hoisted_27 = {
  key: 0,
  class: ""
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ToolBarVideoEdit = resolveComponent("ToolBarVideoEdit");
  const _component_VideoView = resolveComponent("VideoView");
  const _component_Loader = resolveComponent("Loader");
  const _component_Progress = resolveComponent("Progress");
  const _component_Pattern = resolveComponent("Pattern");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_Pattern, null, {
      default: withCtx(() => {
        var _a, _b, _c, _d;
        return [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", _hoisted_2, [
              _cache[28] || (_cache[28] = createBaseVNode("div", { class: "form-control w-full max-w-xs" }, [
                createBaseVNode("label", { class: "label" }, [
                  createBaseVNode("span", { class: "label-text" }, "Select a Video Input"),
                  createBaseVNode("span", { class: "label-text-alt" }, "*")
                ]),
                createBaseVNode("input", {
                  id: "video-input",
                  type: "file",
                  class: "file-input file-input-bordered w-full max-w-xs bg-black bg-opacity-50"
                })
              ], -1)),
              createVNode(_component_ToolBarVideoEdit, {
                onVideo_editing_action: _ctx.video_editing_action_handler,
                edit_selected: _ctx.edit_selected
              }, null, 8, ["onVideo_editing_action", "edit_selected"]),
              _ctx.edit_selected == "water-mark" ? (openBlock(), createElementBlock("div", _hoisted_3, _cache[13] || (_cache[13] = [
                createBaseVNode("div", { class: "w-fit" }, [
                  createBaseVNode("label", {
                    for: "video-water-mark-input",
                    class: "block text-sm text-white"
                  }, "Water Mark Image(.png) with background transparent"),
                  createBaseVNode("input", {
                    id: "video-water-mark-input",
                    type: "file",
                    class: "block w-full px-3 py-2 mt-2 text-sm border border-main-2 rounded-lg file:text-sm file:text-white file:px-4 file:py-1 file:border-none file:rounded-full file:bg-main-2 file:bg-opacity-20 text-white"
                  })
                ], -1)
              ]))) : _ctx.edit_selected == "filter" ? (openBlock(), createElementBlock("div", _hoisted_4, [
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("div", {
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.filter = "hue=s=0"),
                    class: "w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer"
                  }, " Black & White "),
                  createBaseVNode("div", {
                    onClick: _cache[1] || (_cache[1] = ($event) => _ctx.filter = "hue=h=60"),
                    class: "w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer"
                  }, " HUE ROTATE 60 "),
                  createBaseVNode("div", {
                    onClick: _cache[2] || (_cache[2] = ($event) => _ctx.filter = "curves=b=0.2"),
                    class: "w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer"
                  }, " Blue "),
                  createBaseVNode("div", {
                    onClick: _cache[3] || (_cache[3] = ($event) => _ctx.filter = "curves=r=0.2"),
                    class: "w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer"
                  }, " Red "),
                  createBaseVNode("div", {
                    onClick: _cache[4] || (_cache[4] = ($event) => _ctx.filter = "negate"),
                    class: "w-full p-4 text-center rounded-md bg-black bg-opacity-50 text-white font-bold text-xl hover:bg-main-2 transition-all duration-200 ease-in cursor-pointer"
                  }, " Negative ")
                ])
              ])) : _ctx.edit_selected == "compress" ? (openBlock(), createElementBlock("div", _hoisted_6, [
                createBaseVNode("div", _hoisted_7, [
                  createBaseVNode("div", _hoisted_8, [
                    _cache[15] || (_cache[15] = createBaseVNode("label", { class: "label" }, [
                      createBaseVNode("span", { class: "label-text" }, "Codec Video"),
                      createBaseVNode("span", { class: "label-text-alt" }, "*")
                    ], -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.data_input.opts_video.codec = $event),
                      class: "select select-bordered bg-black bg-opacity-50"
                    }, _cache[14] || (_cache[14] = [
                      createBaseVNode("option", {
                        value: "h264",
                        selected: ""
                      }, "H264", -1),
                      createBaseVNode("option", {
                        value: "hevc",
                        selected: ""
                      }, "H265/HEVC", -1),
                      createBaseVNode("option", {
                        value: "hnm4video",
                        selected: ""
                      }, "hnm4video", -1),
                      createBaseVNode("option", {
                        value: "mpeg1video",
                        selected: ""
                      }, "mpeg1video", -1),
                      createBaseVNode("option", {
                        value: "mpeg4",
                        selected: ""
                      }, "mpeg4", -1)
                    ]), 512), [
                      [vModelSelect, _ctx.data_input.opts_video.codec]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_9, [
                    _cache[17] || (_cache[17] = createBaseVNode("label", { class: "label" }, [
                      createBaseVNode("span", { class: "label-text" }, "Codec Audio"),
                      createBaseVNode("span", { class: "label-text-alt" }, "*disabled")
                    ], -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.data_input.opts_audio.codec = $event),
                      disabled: "",
                      class: "select select-bordered bg-black bg-opacity-50"
                    }, _cache[16] || (_cache[16] = [
                      createBaseVNode("option", {
                        value: "",
                        selected: ""
                      }, "H256", -1)
                    ]), 512), [
                      [vModelSelect, _ctx.data_input.opts_audio.codec]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_10, [
                    _cache[19] || (_cache[19] = createBaseVNode("label", { class: "label" }, [
                      createBaseVNode("span", { class: "label-text" }, "Resolution"),
                      createBaseVNode("span", { class: "label-text-alt" }, "*")
                    ], -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => _ctx.data_input.opts_video.resolution = $event),
                      class: "select select-bordered bg-black bg-opacity-50"
                    }, _cache[18] || (_cache[18] = [
                      createBaseVNode("option", {
                        value: "1280x720",
                        selected: ""
                      }, "720p - HD (1280X720)", -1),
                      createBaseVNode("option", { value: "854x480" }, "480p - SD (854X480)", -1),
                      createBaseVNode("option", { value: "640x360" }, "360p - SD (640X360)", -1)
                    ]), 512), [
                      [vModelSelect, _ctx.data_input.opts_video.resolution]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_11, [
                    createBaseVNode("label", _hoisted_12, [
                      _cache[20] || (_cache[20] = createBaseVNode("span", { class: "label-text" }, "Bit Rate Video", -1)),
                      createBaseVNode("span", _hoisted_13, toDisplayString(_ctx.data_input.opts_video.bitrate) + "kbps", 1)
                    ]),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.data_input.opts_video.bitrate = $event),
                      type: "range",
                      min: "150",
                      max: "50000",
                      class: "range range-sm",
                      step: "50"
                    }, null, 512), [
                      [vModelText, _ctx.data_input.opts_video.bitrate]
                    ]),
                    _cache[21] || (_cache[21] = createBaseVNode("div", { class: "w-full flex justify-between text-xs px-2" }, [
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|")
                    ], -1))
                  ]),
                  createBaseVNode("div", _hoisted_14, [
                    createBaseVNode("label", _hoisted_15, [
                      _cache[22] || (_cache[22] = createBaseVNode("span", { class: "label-text" }, "Bit Rate Audio", -1)),
                      createBaseVNode("span", _hoisted_16, "*disabled " + toDisplayString(_ctx.data_input.opts_audio.bitrate) + "kbps", 1)
                    ]),
                    withDirectives(createBaseVNode("input", {
                      disabled: "",
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.data_input.opts_audio.bitrate = $event),
                      type: "range",
                      min: "150",
                      max: "320",
                      class: "range range-sm",
                      step: "50"
                    }, null, 512), [
                      [vModelText, _ctx.data_input.opts_audio.bitrate]
                    ]),
                    _cache[23] || (_cache[23] = createBaseVNode("div", { class: "w-full flex justify-between text-xs px-2" }, [
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|")
                    ], -1))
                  ]),
                  createBaseVNode("div", _hoisted_17, [
                    createBaseVNode("label", _hoisted_18, [
                      _cache[24] || (_cache[24] = createBaseVNode("span", { class: "label-text" }, "Frame Rate", -1)),
                      createBaseVNode("span", _hoisted_19, toDisplayString(_ctx.data_input.opts_video.framerate) + "fps", 1)
                    ]),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.data_input.opts_video.framerate = $event),
                      type: "range",
                      min: "5",
                      max: "120",
                      class: "range range-sm",
                      step: "5"
                    }, null, 512), [
                      [vModelText, _ctx.data_input.opts_video.framerate]
                    ]),
                    _cache[25] || (_cache[25] = createBaseVNode("div", { class: "w-full flex justify-between text-xs px-2" }, [
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|"),
                      createBaseVNode("span", null, "|")
                    ], -1))
                  ])
                ])
              ])) : createCommentVNode("", true),
              !_ctx.data_output ? (openBlock(), createElementBlock("div", {
                key: 3,
                class: normalizeClass(["flex items-center justify-center px-4 py-2 font-bold text-white rounded-md", { "bg-green-600 cursor-pointer": _ctx.data_input.file && !_ctx.loading, "bg-amber-600 cursor-not-allowed": !_ctx.data_input.file || _ctx.loading || !_ctx.data_input.file && _ctx.loading }]),
                onClick: _cache[11] || (_cache[11] = ($event) => _ctx.data_input.file && !_ctx.loading ? _ctx.start_preprocess() : null)
              }, toDisplayString(!_ctx.data_input.file ? "Choose a Video Input" : "Start"), 3)) : (openBlock(), createElementBlock("div", {
                key: 4,
                class: "flex items-center justify-center px-4 py-2 font-bold text-white rounded-md bg-gray-500 cursor-pointer",
                onClick: _cache[12] || (_cache[12] = ($event) => _ctx.data_output = null)
              }, " Clear ")),
              createBaseVNode("div", _hoisted_20, [
                createBaseVNode("div", _hoisted_21, [
                  _cache[26] || (_cache[26] = createBaseVNode("span", { class: "text-xl font-bold text-white" }, "Input Video", -1)),
                  createVNode(_component_VideoView, {
                    class: "w-[240px] h-[180px] lg:w-[480px] lg:h-[240px]",
                    video_data: { ref_id: `${_ctx.random_id}-input`, src: _ctx.data_input.file }
                  }, null, 8, ["video_data"])
                ]),
                createBaseVNode("div", _hoisted_22, [
                  _cache[27] || (_cache[27] = createBaseVNode("span", { class: "text-xl font-bold text-white" }, "Output Video", -1)),
                  _ctx.loading && !_ctx.data_output ? (openBlock(), createBlock(_component_Loader, { key: 0 })) : (openBlock(), createElementBlock("div", _hoisted_23, [
                    _ctx.data_output ? (openBlock(), createBlock(_component_VideoView, {
                      key: 0,
                      class: "w-[240px] h-[180px] lg:w-[480px] lg:h-[240px]",
                      video_data: { ref_id: `${_ctx.random_id}-output`, src: _ctx.data_output.video.url }
                    }, null, 8, ["video_data"])) : createCommentVNode("", true),
                    createBaseVNode("div", _hoisted_24, [
                      ((_b = (_a = _ctx.data_output) == null ? void 0 : _a.video) == null ? void 0 : _b.url) ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        href: (_d = (_c = _ctx.data_output) == null ? void 0 : _c.video) == null ? void 0 : _d.url,
                        download: `video_output.${_ctx.data_output.video.ext.split("/")[1]}`,
                        class: "cursor-pointer px-4 py-2 rounded-md bg-green-600 text-white font-bold"
                      }, "Download Video " + toDisplayString(), 9, _hoisted_25)) : createCommentVNode("", true),
                      _ctx.edit_selected == "audio-extract" ? (openBlock(), createElementBlock("div", _hoisted_26, [
                        _ctx.audio_output ? (openBlock(), createElementBlock("a", _hoisted_27)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ])
                  ]))
                ])
              ]),
              _ctx.loading ? (openBlock(), createBlock(_component_Progress, { key: 5 })) : createCommentVNode("", true),
              _cache[29] || (_cache[29] = createBaseVNode("div", { class: "w-full h-full flex flex-col gap-4 items-center text-white" }, [
                createBaseVNode("span", null, "LOG"),
                createBaseVNode("pre", { class: "w-full h-[300px] overflow-auto p-2 rounded-md bg-black bg-opacity-50" }, [
                  createTextVNode("                            "),
                  createBaseVNode("div", {
                    id: "log-video",
                    class: "w-[300px] text-xs"
                  }),
                  createTextVNode("    \n                        ")
                ])
              ], -1))
            ])
          ])
        ];
      }),
      _: 1
    })
  ]);
}
const VideoEdit2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  VideoEdit2 as default
};
