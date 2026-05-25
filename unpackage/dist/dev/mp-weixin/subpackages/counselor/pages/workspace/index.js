"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { CustomTabbar, EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      stats: [
        { label: "今日咨询量", value: "0", bg: "linear-gradient(135deg, #4A90D9, #6BA5E7)" },
        { label: "待处理工单", value: "0", bg: "linear-gradient(135deg, #F0AD4E, #F5C97D)" },
        { label: "累计工单", value: "0", bg: "linear-gradient(135deg, #4CD964, #7CE890)" },
        { label: "AI解答率", value: "0%", bg: "linear-gradient(135deg, #9B59B6, #B07CC6)" }
      ],
      pendingOrders: [],
      pendingLeaves: [],
      quickOps: [
        { name: "导入账号", icon: "icon-zhanghaoguanli", bg: "#E8F4FD", path: "/subpackages/counselor/pages/accounts/index" },
        { name: "发布通知", icon: "icon-tongzhi", bg: "#FFF3E0", path: "/subpackages/counselor/pages/notifications/create/index" },
        { name: "知识库", icon: "icon-zhishi", bg: "#E8F8E8", path: "/subpackages/counselor/pages/knowledge/index" },
        { name: "请假申请", icon: "icon-renwu", bg: "#F3E8FD", path: "/subpackages/counselor/pages/orders/index" },
        { name: "校历管理", icon: "icon-xiaoli", bg: "#E8FFF3", path: "/subpackages/counselor/pages/calendar/index" },
        { name: "失物招领", icon: "icon-shiwuzhaoling", bg: "#FFF8E8", path: "/subpackages/counselor/pages/lost-found/index" }
      ],
      sysMessages: [],
      counselorTabs: [
        { text: "工作台", icon: "icon-gongzuotai", url: "/subpackages/counselor/pages/workspace/index" },
        { text: "知识库", icon: "icon-zhishi", url: "/subpackages/counselor/pages/knowledge/index" },
        { text: "工单", icon: "icon-gongdan", url: "/subpackages/counselor/pages/orders/index" },
        { text: "数据", icon: "icon-shuju", url: "/subpackages/counselor/pages/data/index" },
        { text: "我的", icon: "icon-wode", url: "/subpackages/profile/pages/counselor/index" }
      ]
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const res = await common_utils_request.api.getWorkspaceData();
        if (res) {
          common_vendor.index.__f__("log", "at subpackages/counselor/pages/workspace/index.vue:174", "workspace data:", JSON.stringify(res));
          const s = res.stats || {};
          this.stats[0].value = String(s.todayConsult || 0);
          this.stats[1].value = String(s.pendingOrders || 0);
          this.stats[2].value = String(s.totalOrders || 0);
          this.stats[3].value = s.aiRate || "0%";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/workspace/index.vue:182", "加载工作台数据失败", e);
      }
      try {
        const res = await common_utils_request.api.getOrders({ status: "pending", page: 1, pageSize: 10 });
        if (res) {
          this.pendingOrders = (res.orders || []).map((item) => ({
            id: item.id,
            studentId: item.studentId,
            studentName: item.studentName,
            question: item.question || item.title || item.content,
            tagName: item.type || "待处理",
            tagColor: "#4A90D9",
            tagBg: "#E8F4FD"
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/workspace/index.vue:198", "加载工单失败", e);
      }
      try {
        const res = await common_utils_request.api.getCounselorLeaveList({ status: "pending", page: 1, pageSize: 10 });
        if (res) {
          this.pendingLeaves = (res.records || []).map((item) => ({
            id: item.id,
            studentId: item.studentId,
            studentName: item.studentName,
            leaveType: item.leaveType,
            reason: item.reason,
            startTime: item.startTime,
            endTime: item.endTime
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/workspace/index.vue:214", "加载请假列表失败", e);
      }
    },
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
    async approveLeave(item, status) {
      try {
        const res = await common_utils_request.api.approveLeave(item.id, { status });
        if (res) {
          this.pendingLeaves = this.pendingLeaves.filter((l) => l.id !== item.id);
          common_vendor.index.showToast({ title: status === "approved" ? "已批准" : "已拒绝", icon: "success" });
        } else {
          common_vendor.index.showToast({ title: res.msg || "操作失败", icon: "none" });
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
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
    d: $data.pendingLeaves.length > 0
  }, $data.pendingLeaves.length > 0 ? {
    e: common_vendor.t($data.pendingLeaves.length),
    f: common_vendor.f($data.pendingLeaves, (item, i, i0) => {
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
    g: $data.pendingOrders.length > 0
  }, $data.pendingOrders.length > 0 ? {
    h: common_vendor.t($data.pendingOrders.length)
  } : {}, {
    i: common_vendor.o((...args) => $options.goOrders && $options.goOrders(...args)),
    j: common_vendor.f($data.pendingOrders, (item, i, i0) => {
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
    k: $data.pendingOrders.length === 0
  }, $data.pendingOrders.length === 0 ? {
    l: common_vendor.p({
      text: "暂无待处理工单"
    })
  } : {}, {
    m: common_vendor.f($data.quickOps, (op, i, i0) => {
      return common_vendor.e($data.pendingOrders.length > 0 ? {
        a: common_vendor.t($data.pendingOrders.length)
      } : {}, {
        b: common_vendor.n(op.icon),
        c: op.bg,
        d: common_vendor.t(op.name),
        e: i,
        f: common_vendor.o(($event) => $options.goQuick(op), i)
      });
    }),
    n: $data.pendingOrders.length > 0,
    o: common_vendor.f($data.sysMessages, (msg, i, i0) => {
      return common_vendor.e({
        a: !msg.read
      }, !msg.read ? {} : {}, {
        b: common_vendor.t(msg.text),
        c: common_vendor.t(msg.time),
        d: i
      });
    }),
    p: common_vendor.o($options.onTabChange),
    q: common_vendor.p({
      current: 0,
      tabs: $data.counselorTabs
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13d4374c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/workspace/index.js.map
