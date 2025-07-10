var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { t as toNative, V as Vue, C as Component, _ as _export_sfc, r as resolveComponent, c as createElementBlock, a as createVNode, w as withCtx, o as openBlock, b as createBaseVNode, d as toDisplayString, e as withDirectives, v as vModelText, f as withKeys } from "./index-3feecbd7.js";
import Pattern from "./Pattern-470be9af.js";
import { n as notification, P as PreProcessFFMPEG } from "./notification-efe5fb65.js";
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let DevMixin = class extends Vue {
  constructor() {
    super(...arguments);
    __publicField(this, "loading", false);
    __publicField(this, "ffmpeg");
    __publicField(this, "cmd_input", "");
    __publicField(this, "cmd_ffmpeg", []);
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
    __publicField(this, "data_output");
  }
  async exec() {
    var _a;
    if (this.cmd_input == "") {
      this.cmd_ffmpeg = [];
      return;
    }
    if (this.cmd_keys_handler()) {
      return;
    }
    this.cmd_ffmpeg.push(this.cmd_input);
    this.loading = true;
    let data;
    data = await ((_a = this.ffmpeg) == null ? void 0 : _a.exec_command_dev(this.cmd_ffmpeg, this.data_input));
    if (data instanceof Error) {
      notification(data.message, 3);
    } else {
      this.data_output = data;
    }
    this.loading = false;
    this.cmd_input = "";
  }
  cmd_keys_handler() {
    if (this.cmd_input == "cleaer" || this.cmd_input == "cls") {
      document.getElementById("log-video").textContent = "";
      this.cmd_input = "";
      return true;
    }
    if (this.cmd_input == "help" || this.cmd_input == "-h") {
      document.getElementById("log-video").textContent = "Access: \nhttps://ffmpegwasm.netlify.app/\nhttps://github.com/ffmpegwasm/ffmpeg.wasm";
      this.cmd_input = "";
      return true;
    }
  }
  mounted() {
    var _a;
    this.ffmpeg = new PreProcessFFMPEG();
    (_a = document.getElementById("video-input-dev")) == null ? void 0 : _a.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.data_input.type = file.type;
        const reader = new FileReader();
        reader.onload = (e2) => {
          var _a2;
          this.data_input.file = (_a2 = e2.target) == null ? void 0 : _a2.result;
          this.data_input.id = "dev";
        };
        reader.readAsDataURL(file);
      }
    });
  }
};
DevMixin = __decorateClass$1([
  Component
], DevMixin);
const DevMixin$1 = toNative(DevMixin);
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
let Dev$1 = class Dev extends Vue {
};
Dev$1 = __decorateClass([
  Component({
    components: { Pattern },
    mixins: [DevMixin$1]
  })
], Dev$1);
const _sfc_main = toNative(Dev$1);
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("span", null, "CLI FFMPEG", -1);
const _hoisted_2 = { class: "grid grid-cols-2 p-4" };
const _hoisted_3 = { class: "form-control w-full max-w-sm" };
const _hoisted_4 = { class: "label" };
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("span", { class: "label-text" }, "Select a Video Input", -1);
const _hoisted_6 = { class: "label-text-alt text-xs" };
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("input", {
  id: "video-input-dev",
  type: "file",
  class: "file-input file-input-bordered w-full max-w-sm bg-black bg-opacity-50"
}, null, -1);
const _hoisted_8 = { class: "w-full h-full bg-black bg-opacity-50 p-4 rounded-md text-sm" };
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("pre", {
  id: "log-video",
  class: "w-[80vh] h-[70vh] overflow-auto"
}, null, -1);
const _hoisted_10 = { class: "w-full flex gap-2 border-t border-main-1 py-2" };
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("div", { class: "w-fit whitespace-nowrap flex items-center gap-2 text-green-500" }, [
  /* @__PURE__ */ createBaseVNode("i", { class: "fa-solid fa-bolt" }),
  /* @__PURE__ */ createBaseVNode("span", { class: "text-cyan-500" }, "ffmpeg")
], -1);
const _hoisted_12 = { class: "w-fullbg-transparent text-xs text-opacity-10" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Pattern = resolveComponent("Pattern");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_Pattern, null, {
      default: withCtx(() => [
        _hoisted_1,
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("label", _hoisted_4, [
              _hoisted_5,
              createBaseVNode("span", _hoisted_6, "*To use file in cmd, uses: " + toDisplayString(_ctx.data_input.id) + "." + toDisplayString(_ctx.data_input.type.split("/")[1]), 1)
            ]),
            _hoisted_7
          ])
        ]),
        createBaseVNode("div", _hoisted_8, [
          _hoisted_9,
          createBaseVNode("div", _hoisted_10, [
            _hoisted_11,
            withDirectives(createBaseVNode("input", {
              onKeyup: _cache[0] || (_cache[0] = withKeys((...args) => _ctx.exec && _ctx.exec(...args), ["enter"])),
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.cmd_input = $event),
              autofocus: "",
              class: "w-full bg-transparent outline-none",
              type: "text"
            }, null, 544), [
              [vModelText, _ctx.cmd_input]
            ])
          ]),
          createBaseVNode("div", _hoisted_12, "CMD: " + toDisplayString(_ctx.cmd_ffmpeg), 1)
        ])
      ]),
      _: 1
    })
  ]);
}
const Dev2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  Dev2 as default
};
