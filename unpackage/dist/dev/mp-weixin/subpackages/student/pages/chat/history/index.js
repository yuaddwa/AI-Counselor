"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const EmptyState = () => "../../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      sessions: [
        { id: "1", lastMessage: "如何办理缓缴学费手续？", time: "05-20 14:30", msgCount: 5 },
        { id: "2", lastMessage: "宿舍报修流程是什么？", time: "05-19 10:15", msgCount: 3 },
        { id: "3", lastMessage: "奖学金评选条件有哪些？", time: "05-18 16:45", msgCount: 8 }
      ]
    };
  },
  methods: {
    openSession(item) {
      common_vendor.index.navigateTo({ url: `/subpackages/student/pages/chat/index?sessionId=${item.id}` });
    },
    deleteSession(item, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后不可恢复，确认删除该对话？",
        success: (res) => {
          if (res.confirm) {
            this.sessions.splice(index, 1);
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
          }
        }
      });
    },
    clearAll() {
      if (this.sessions.length === 0)
        return;
      common_vendor.index.showModal({
        title: "确认清空",
        content: "将清空所有历史对话，确认继续？",
        success: (res) => {
          if (res.confirm) {
            this.sessions = [];
            common_vendor.index.showToast({ title: "已清空", icon: "success" });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  _component_empty_state();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.clearAll && $options.clearAll(...args)),
    b: common_vendor.f($data.sessions, (item, i, i0) => {
      return {
        a: common_vendor.t(item.lastMessage),
        b: common_vendor.t(item.time),
        c: common_vendor.o(($event) => $options.deleteSession(item, i), i),
        d: i,
        e: common_vendor.o(($event) => $options.openSession(item), i)
      };
    }),
    c: $data.sessions.length === 0
  }, $data.sessions.length === 0 ? {
    d: common_vendor.p({
      text: "暂无历史对话"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-69661507"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/chat/history/index.js.map
