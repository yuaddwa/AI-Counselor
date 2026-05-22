"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_store_index = require("../../../../common/store/index.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { CustomTabbar, EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      stats: [
        { label: "今日咨询量", value: "128", bg: "linear-gradient(135deg, #4A90D9, #6BA5E7)" },
        { label: "待处理工单", value: "5", bg: "linear-gradient(135deg, #F0AD4E, #F5C97D)" },
        { label: "累计工单", value: "1,024", bg: "linear-gradient(135deg, #4CD964, #7CE890)" },
        { label: "AI解答率", value: "92%", bg: "linear-gradient(135deg, #9B59B6, #B07CC6)" }
      ],
      pendingOrders: [
        { id: 1, studentId: "2026001", studentName: "张同学", question: "关于休学申请的流程咨询", tagName: "政策咨询", tagColor: "#4A90D9" },
        { id: 2, studentId: "2026002", studentName: "李同学", question: "宿舍空调漏水需要报修", tagName: "后勤报修", tagColor: "#F0AD4E" },
        { id: 3, studentId: "2026003", studentName: "王同学", question: "近期情绪低落，想找人聊聊", tagName: "心理问题", tagColor: "#DD524D" }
      ],
      quickOps: [
        { name: "导入账号", icon: "", bg: "#E8F4FD", path: "/subpackages/counselor/pages/accounts/index" },
        { name: "发布通知", icon: "", bg: "#FFF3E0", path: "/subpackages/counselor/pages/notifications/create/index" },
        { name: "知识库", icon: "", bg: "#E8F8E8", path: "/subpackages/counselor/pages/knowledge/index" },
        { name: "请假申请", icon: "", bg: "#F3E8FD", path: "/subpackages/counselor/pages/orders/index" }
      ],
      sysMessages: [
        { text: "知识库已更新：新增报到指南文档", time: "10分钟前", read: false },
        { text: "有3个新工单待处理", time: "30分钟前", read: false },
        { text: "数据统计报告已生成", time: "2小时前", read: true }
      ],
      counselorTabs: [
        { text: "工作台", icon: "", url: "/subpackages/counselor/pages/workspace/index" },
        { text: "知识库", icon: "", url: "/subpackages/counselor/pages/knowledge/index" },
        { text: "工单", icon: "", url: "/subpackages/counselor/pages/orders/index" },
        { text: "数据", icon: "", url: "/subpackages/counselor/pages/data/index" },
        { text: "我的", icon: "", url: "/subpackages/profile/pages/counselor/index" }
      ]
    };
  },
  computed: {
    pendingLeaves() {
      return common_store_index.store.state.leaveRequests.filter((r) => r.status === "pending");
    }
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
  },
  methods: {
    goNotifications() {
      common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/notifications/index" });
    },
    goOrders() {
      common_vendor.index.reLaunch({ url: "/subpackages/counselor/pages/orders/index" });
    },
    goOrderDetail(item) {
      common_vendor.index.navigateTo({ url: `/subpackages/counselor/pages/orders/detail/index?id=${item.id}` });
    },
    goQuick(op) {
      common_vendor.index.navigateTo({ url: op.path });
    },
    approveLeave(item, status) {
      common_store_index.store.mutations.updateLeaveStatus(item.id, status);
      common_vendor.index.showToast({ title: status === "approved" ? "已批准" : "已拒绝", icon: "success" });
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  const _component_custom_tabbar = common_vendor.resolveComponent("custom-tabbar");
  (_component_empty_state + _component_custom_tabbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goNotifications && $options.goNotifications(...args)),
    c: common_vendor.f($data.stats, (s, i, i0) => {
      return {
        a: common_vendor.t(s.value),
        b: common_vendor.t(s.label),
        c: i,
        d: s.bg
      };
    }),
    d: $options.pendingLeaves.length > 0
  }, $options.pendingLeaves.length > 0 ? {
    e: common_vendor.t($options.pendingLeaves.length),
    f: common_vendor.f($options.pendingLeaves, (item, i, i0) => {
      return {
        a: common_vendor.t(item.studentId),
        b: common_vendor.t(item.studentName),
        c: common_vendor.t(item.leaveType),
        d: common_vendor.t(item.reason),
        e: common_vendor.t(item.startTime),
        f: common_vendor.t(item.endTime),
        g: common_vendor.o(($event) => $options.approveLeave(item, "approved"), "leave" + i),
        h: common_vendor.o(($event) => $options.approveLeave(item, "rejected"), "leave" + i),
        i: "leave" + i
      };
    })
  } : {}, {
    g: common_vendor.o((...args) => $options.goOrders && $options.goOrders(...args)),
    h: common_vendor.f($data.pendingOrders, (item, i, i0) => {
      return {
        a: common_vendor.t(item.studentId),
        b: common_vendor.t(item.studentName),
        c: common_vendor.t(item.question),
        d: common_vendor.t(item.tagName),
        e: item.tagColor,
        f: item.tagBg,
        g: i,
        h: common_vendor.o(($event) => $options.goOrderDetail(item), i)
      };
    }),
    i: $data.pendingOrders.length === 0
  }, $data.pendingOrders.length === 0 ? {
    j: common_vendor.p({
      text: "暂无待处理工单"
    })
  } : {}, {
    k: common_vendor.f($data.quickOps, (op, i, i0) => {
      return {
        a: common_vendor.t(op.icon),
        b: op.bg,
        c: common_vendor.t(op.name),
        d: i,
        e: common_vendor.o(($event) => $options.goQuick(op), i)
      };
    }),
    l: common_vendor.f($data.sysMessages, (msg, i, i0) => {
      return common_vendor.e({
        a: !msg.read
      }, !msg.read ? {} : {}, {
        b: common_vendor.t(msg.text),
        c: common_vendor.t(msg.time),
        d: i
      });
    }),
    m: common_vendor.o($options.onTabChange),
    n: common_vendor.p({
      current: 0,
      tabs: $data.counselorTabs
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13d4374c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/workspace/index.js.map
