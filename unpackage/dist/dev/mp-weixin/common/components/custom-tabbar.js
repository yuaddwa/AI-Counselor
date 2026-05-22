"use strict";
const common_vendor = require("../vendor.js");
const _sfc_main = {
  name: "CustomTabbar",
  props: {
    current: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  emits: ["change"],
  methods: {
    switchTab(item, index) {
      if (this.current === index)
        return;
      this.$emit("change", { index, item });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tabs, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.icon),
        b: $props.current === index ? 1 : "",
        c: common_vendor.t(item.text),
        d: $props.current === index ? 1 : "",
        e: item.badge && item.badge > 0
      }, item.badge && item.badge > 0 ? {
        f: common_vendor.t(item.badge > 99 ? "99+" : item.badge)
      } : {}, {
        g: index,
        h: common_vendor.o(($event) => $options.switchTab(item, index), index)
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6cf46d38"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/components/custom-tabbar.js.map
