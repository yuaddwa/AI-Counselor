"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      selectedNotice: null,
      page: 1,
      pageSize: 20,
      notices: []
    };
  },
  onLoad() {
    this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      try {
        const res = await common_utils_request.api.getNotifications({ page: this.page, pageSize: this.pageSize });
        const list = res || [];
        this.notices = list.map((item) => ({
          id: item.id,
          title: item.title,
          time: item.time || item.createdAt,
          scope: item.scope,
          readCount: item.readCount || 0,
          totalCount: item.totalCount || 0,
          content: item.content,
          readList: item.readList || []
        }));
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/notifications/index.vue:90", "加载通知列表失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    deleteNotification(id) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除此通知吗？",
        success: (res) => {
          if (res.confirm) {
            common_utils_request.api.deleteNotification(id).then(() => {
              this.notices = this.notices.filter((n) => n.id !== id);
              if (this.selectedNotice && this.selectedNotice.id === id) {
                this.selectedNotice = null;
              }
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
            }).catch((e) => {
              common_vendor.index.__f__("error", "at subpackages/counselor/pages/notifications/index.vue:107", "删除通知失败", e);
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            });
          }
        }
      });
    },
    goCreate() {
      common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/notifications/create/index" });
    },
    viewDetail(item) {
      this.selectedNotice = item;
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  _component_empty_state();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goCreate && $options.goCreate(...args)),
    b: common_vendor.f($data.notices, (item, i, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.scope),
        c: common_vendor.t(item.time),
        d: common_vendor.t(item.readCount),
        e: common_vendor.t(item.totalCount),
        f: i,
        g: common_vendor.o(($event) => $options.viewDetail(item), i)
      };
    }),
    c: $data.notices.length === 0
  }, $data.notices.length === 0 ? {
    d: common_vendor.p({
      text: "暂无通知"
    })
  } : {}, {
    e: $data.selectedNotice
  }, $data.selectedNotice ? {
    f: common_vendor.o(($event) => $data.selectedNotice = null),
    g: common_vendor.t($data.selectedNotice.title),
    h: common_vendor.t($data.selectedNotice.time),
    i: common_vendor.t($data.selectedNotice.content),
    j: common_vendor.f($data.selectedNotice.readList, (p, i, i0) => {
      return {
        a: common_vendor.t(p.name),
        b: common_vendor.t(p.read ? "已读" : "未读"),
        c: p.read ? 1 : "",
        d: i
      };
    }),
    k: common_vendor.o(($event) => $data.selectedNotice = null)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c930e4fd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/notifications/index.js.map
