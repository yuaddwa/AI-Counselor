"use strict";
const common_utils_helper = require("../utils/helper.js");
const common_vendor = require("../vendor.js");
const _sfc_main = {
  name: "WorkOrderCard",
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["click"],
  computed: {
    statusText() {
      var _a;
      return ((_a = common_utils_helper.ticketStatusMap[this.order.status]) == null ? void 0 : _a.text) || "未知";
    },
    statusColor() {
      var _a;
      return ((_a = common_utils_helper.ticketStatusMap[this.order.status]) == null ? void 0 : _a.color) || "#999";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.order.studentId),
    b: common_vendor.t($props.order.studentName),
    c: common_vendor.t($options.statusText),
    d: $options.statusColor,
    e: common_vendor.t($props.order.question),
    f: common_vendor.t($props.order.className),
    g: common_vendor.t($props.order.createTime),
    h: common_vendor.o(($event) => _ctx.$emit("click", $props.order))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bacb5727"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/components/work-order-card.js.map
