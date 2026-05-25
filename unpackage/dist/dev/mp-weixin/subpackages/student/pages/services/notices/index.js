"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      selectedNotice: null,
      notices: []
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.loadNotices();
  },
  onLoad(options) {
    if (options.id) {
      this.loadNoticeDetail(Number(options.id));
    }
  },
  methods: {
    async loadNotices() {
      try {
        const res = await common_utils_request.api.getNotices({ page: 1, pageSize: 20 });
        if (res) {
          this.notices = (res.notices || res.list || []).map((item) => ({
            id: item.id,
            title: item.title,
            time: item.createTime ? item.createTime.substring(0, 10) : "",
            read: item.read,
            content: item.content || ""
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/notices/index.vue:84", "加载通知失败", e);
      }
    },
    async loadNoticeDetail(id) {
      try {
        const res = await common_utils_request.api.getNoticeDetail(id);
        if (res) {
          this.selectedNotice = {
            id: res.id,
            title: res.title,
            time: res.createTime ? res.createTime.substring(0, 10) : "",
            content: res.content
          };
          const n = this.notices.find((x) => x.id === id);
          if (n)
            n.read = true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/notices/index.vue:101", "加载通知详情失败", e);
      }
    },
    goBack() {
      if (this.selectedNotice) {
        this.selectedNotice = null;
      } else {
        common_vendor.index.navigateBack();
      }
    },
    viewDetail(item) {
      item.read = true;
      this.loadNoticeDetail(item.id);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: !$data.selectedNotice
  }, !$data.selectedNotice ? common_vendor.e({
    d: common_vendor.f($data.notices, (item, k0, i0) => {
      return common_vendor.e({
        a: !item.read
      }, !item.read ? {} : {}, {
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.time),
        d: item.id,
        e: common_vendor.o(($event) => $options.viewDetail(item), item.id)
      });
    }),
    e: $data.notices.length === 0
  }, $data.notices.length === 0 ? {} : {}) : {
    f: common_vendor.t($data.selectedNotice.title),
    g: common_vendor.t($data.selectedNotice.time),
    h: common_vendor.t($data.selectedNotice.content),
    i: common_vendor.o(($event) => $data.selectedNotice = null)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a79b0fe"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/notices/index.js.map
