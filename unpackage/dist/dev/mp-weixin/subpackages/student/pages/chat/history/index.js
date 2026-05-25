"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const EmptyState = () => "../../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      sessions: [],
      page: 1,
      pageSize: 20,
      hasMore: true
    };
  },
  created() {
    this.loadHistory();
  },
  methods: {
    async loadHistory() {
      try {
        const res = await common_utils_request.api.getChatHistory({ page: this.page, pageSize: this.pageSize });
        if (res) {
          this.sessions = (res.list || []).map((item) => ({
            id: item.sessionId,
            lastMessage: item.title || item.lastMessage || "",
            time: item.updateTime ? item.updateTime.substring(5, 16).replace("T", " ") : "",
            msgCount: 0
          }));
          this.hasMore = this.sessions.length >= this.pageSize;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/chat/history/index.vue:61", "加载聊天历史失败", e);
      }
    },
    openSession(item) {
      common_vendor.index.navigateTo({ url: `/subpackages/student/pages/home/index?sessionId=${item.id}` });
    },
    deleteSession(item, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后不可恢复，确认删除该对话？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.deleteChatSession(item.id);
              this.sessions.splice(index, 1);
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
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
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.clearAllChat();
              this.sessions = [];
              common_vendor.index.showToast({ title: "已清空", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "清空失败", icon: "none" });
            }
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
