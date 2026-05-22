"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      settings: {
        chatNotify: true,
        orderNotify: true,
        systemNotify: false
      },
      cacheSize: "2.3MB"
    };
  },
  methods: {
    clearCache() {
      common_vendor.index.showModal({
        title: "清除缓存",
        content: "确定清除本地缓存数据？",
        success: (res) => {
          if (res.confirm) {
            this.cacheSize = "0B";
            common_vendor.index.showToast({ title: "已清除", icon: "success" });
          }
        }
      });
    },
    saveSettings() {
      common_vendor.index.showToast({ title: "保存成功", icon: "success" });
      setTimeout(() => common_vendor.index.navigateBack(), 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.settings.chatNotify,
    b: common_vendor.o(($event) => $data.settings.chatNotify = $event.detail.value),
    c: $data.settings.orderNotify,
    d: common_vendor.o(($event) => $data.settings.orderNotify = $event.detail.value),
    e: $data.settings.systemNotify,
    f: common_vendor.o(($event) => $data.settings.systemNotify = $event.detail.value),
    g: common_vendor.t($data.cacheSize),
    h: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    i: common_vendor.o((...args) => $options.saveSettings && $options.saveSettings(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ee9cebd5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/profile/pages/settings/index.js.map
