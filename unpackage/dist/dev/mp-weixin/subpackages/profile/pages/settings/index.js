"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      settings: {
        chatNotify: true,
        orderNotify: true,
        systemNotify: false
      },
      cacheSize: "0B"
    };
  },
  onLoad() {
    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        const res = await common_utils_request.api.getNotificationSettings();
        if (res) {
          this.settings = { ...this.settings, ...res };
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/profile/pages/settings/index.vue:65", "加载通知设置失败", e);
      }
    },
    async updateSettings() {
      try {
        await common_utils_request.api.updateNotificationSettings(this.settings);
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/profile/pages/settings/index.vue:72", "更新通知设置失败", e);
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      }
    },
    onToggle(key, event) {
      this.settings[key] = event.detail.value;
      this.updateSettings();
    },
    clearCache() {
      common_vendor.index.showModal({
        title: "清除缓存",
        content: "确定清除本地缓存数据？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            this.cacheSize = "0B";
            common_vendor.index.showToast({ title: "已清除", icon: "success" });
          }
        }
      });
    },
    async saveSettings() {
      await this.updateSettings();
      common_vendor.index.showToast({ title: "保存成功", icon: "success" });
      setTimeout(() => common_vendor.index.navigateBack(), 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.settings.chatNotify,
    b: common_vendor.o(($event) => $options.onToggle("chatNotify", $event)),
    c: $data.settings.orderNotify,
    d: common_vendor.o(($event) => $options.onToggle("orderNotify", $event)),
    e: $data.settings.systemNotify,
    f: common_vendor.o(($event) => $options.onToggle("systemNotify", $event)),
    g: common_vendor.t($data.cacheSize),
    h: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    i: common_vendor.o((...args) => $options.saveSettings && $options.saveSettings(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ee9cebd5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/profile/pages/settings/index.js.map
