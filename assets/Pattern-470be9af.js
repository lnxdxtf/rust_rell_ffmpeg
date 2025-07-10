import { t as toNative, V as Vue, C as Component, _ as _export_sfc, c as createElementBlock, b as createBaseVNode, p as renderSlot, o as openBlock } from "./index-3feecbd7.js";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
let Pattern$1 = class Pattern extends Vue {
};
Pattern$1 = __decorateClass([
  Component({})
], Pattern$1);
const _sfc_main = toNative(Pattern$1);
const _hoisted_1 = { class: "p-4 rounded-md w-full h-full" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "default")
    ])
  ]);
}
const Pattern2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  Pattern2 as default
};
