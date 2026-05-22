"use strict";
const common_vendor = require("../vendor.js");
const _sfc_main = {
  name: "EmptyState",
  props: {
    text: { type: String, default: "暂无数据" },
    icon: { type: String, default: "" },
    actionText: { type: String, default: "" }
  },
  emits: ["action"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.icon),
    b: common_vendor.t($props.text),
    c: $props.actionText
  }, $props.actionText ? {
    d: common_vendor.t($props.actionText),
    e: common_vendor.o(($event) => _ctx.$emit("action"))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e695b945"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/components/empty-state.js.map
