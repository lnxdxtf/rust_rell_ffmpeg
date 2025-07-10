import { t as toNative, V as Vue, C as Component, _ as _export_sfc, r as resolveComponent, c as createElementBlock, a as createVNode, o as openBlock } from "./index-3feecbd7.js";
import Pattern from "./Pattern-470be9af.js";
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
let ImageEdit$1 = class ImageEdit extends Vue {
};
ImageEdit$1 = __decorateClass([
  Component({
    components: { Pattern }
  })
], ImageEdit$1);
const _sfc_main = toNative(ImageEdit$1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Pattern = resolveComponent("Pattern");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_Pattern)
  ]);
}
const ImageEdit2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  ImageEdit2 as default
};
