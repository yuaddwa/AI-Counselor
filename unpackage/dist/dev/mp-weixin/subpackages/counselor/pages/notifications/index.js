"use strict";
const common_vendor = require("../../../../common/vendor.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      selectedNotice: null,
      notices: [
        {
          id: 1,
          title: "2026年秋季学期开学报到须知",
          time: "05-20 10:00",
          scope: "全体学生",
          readCount: 356,
          totalCount: 500,
          content: "各位同学：2026年秋季学期开学报到安排如下...",
          readList: [
            { name: "张同学 (2026001)", read: true },
            { name: "李同学 (2026002)", read: true },
            { name: "王同学 (2026003)", read: false }
          ]
        },
        {
          id: 2,
          title: "关于国庆节放假安排的通知",
          time: "05-18 14:00",
          scope: "计算机2601",
          readCount: 45,
          totalCount: 48,
          content: "根据国务院办公厅通知...",
          readList: [
            { name: "张同学 (2026001)", read: true },
            { name: "赵同学 (2026004)", read: false }
          ]
        }
      ]
    };
  },
  methods: {
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
