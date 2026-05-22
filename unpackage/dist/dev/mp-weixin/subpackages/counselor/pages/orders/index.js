"use strict";
const common_vendor = require("../../../../common/vendor.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const WorkOrderCard = () => "../../../../common/components/work-order-card.js";
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { CustomTabbar, WorkOrderCard, EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      activeStatus: "all",
      searchKeyword: "",
      selectedClass: "",
      selectedType: "",
      showClassFilter: false,
      showTypeFilter: false,
      showArchive: false,
      statusTabs: [
        { label: "全部", value: "all" },
        { label: "待处理", value: "pending" },
        { label: "处理中", value: "processing" },
        { label: "已完结", value: "completed" }
      ],
      orders: [
        { id: 1, studentId: "2026001", studentName: "张同学", className: "计算机2601", question: "关于休学申请的流程咨询", status: "pending", createTime: "05-20 14:30", type: "政策咨询" },
        { id: 2, studentId: "2026002", studentName: "李同学", className: "计算机2602", question: "宿舍空调漏水需要报修", status: "pending", createTime: "05-20 13:15", type: "后勤报修" },
        { id: 3, studentId: "2026003", studentName: "王同学", className: "经管2601", question: "近期情绪低落，想找人聊聊", status: "processing", createTime: "05-20 10:00", type: "心理问题" },
        { id: 4, studentId: "2026004", studentName: "赵同学", className: "外语2601", question: "助学金申请需要哪些材料", status: "completed", createTime: "05-19 16:00", type: "政策咨询" }
      ],
      archivedOrders: [
        { id: 100, studentId: "2025001", studentName: "陈同学", className: "计算机2501", question: "考试成绩复核申请", status: "completed", createTime: "04-20 10:00", type: "教务问题" }
      ],
      classOptions: ["全部班级", "计算机2601", "计算机2602", "经管2601", "外语2601"],
      classIndex: 0,
      typeOptions: ["全部类型", "政策咨询", "后勤报修", "心理问题", "教务问题"],
      typeIndex: 0,
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
    filteredOrders() {
      let list = this.orders;
      if (this.activeStatus !== "all") {
        list = list.filter((o) => o.status === this.activeStatus);
      }
      if (this.selectedClass) {
        list = list.filter((o) => o.className === this.selectedClass);
      }
      if (this.selectedType) {
        list = list.filter((o) => o.type === this.selectedType);
      }
      if (this.searchKeyword) {
        list = list.filter((o) => o.question.includes(this.searchKeyword) || o.studentName.includes(this.searchKeyword));
      }
      return list;
    }
  },
  created() {
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 0;
  },
  methods: {
    goDetail(order) {
      common_vendor.index.navigateTo({ url: `/subpackages/counselor/pages/orders/detail/index?id=${order.id}` });
    },
    onTypeChange(e) {
      const idx = e.detail.value;
      this.selectedType = idx === 0 ? "" : this.typeOptions[idx];
    },
    onClassChange(e) {
      const idx = e.detail.value;
      this.selectedClass = idx === 0 ? "" : this.classOptions[idx];
      this.showClassFilter = false;
    },
    toggleArchive() {
      this.showArchive = !this.showArchive;
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  }
};
if (!Array) {
  const _component_work_order_card = common_vendor.resolveComponent("work-order-card");
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  const _component_custom_tabbar = common_vendor.resolveComponent("custom-tabbar");
  (_component_work_order_card + _component_empty_state + _component_custom_tabbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.f($data.statusTabs, (tab, i, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: i,
        c: $data.activeStatus === tab.value ? 1 : "",
        d: common_vendor.o(($event) => $data.activeStatus = tab.value, i)
      };
    }),
    c: common_vendor.t($data.selectedClass || "班级筛选"),
    d: $data.classOptions,
    e: common_vendor.o((...args) => $options.onClassChange && $options.onClassChange(...args)),
    f: $data.classIndex,
    g: common_vendor.t($data.selectedType || "问题类型"),
    h: $data.typeOptions,
    i: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    j: $data.typeIndex,
    k: $data.searchKeyword,
    l: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    m: common_vendor.f($options.filteredOrders, (order, i, i0) => {
      return {
        a: i,
        b: common_vendor.o(($event) => $options.goDetail(order), i),
        c: "3a0afccf-0-" + i0,
        d: common_vendor.p({
          order
        })
      };
    }),
    n: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {
    o: common_vendor.p({
      text: "暂无工单"
    })
  } : {}, {
    p: common_vendor.t($data.showArchive ? "收起历史" : "查看历史归档"),
    q: common_vendor.o((...args) => $options.toggleArchive && $options.toggleArchive(...args)),
    r: $data.showArchive
  }, $data.showArchive ? {
    s: common_vendor.f($data.archivedOrders, (order, i, i0) => {
      return {
        a: "a" + i,
        b: common_vendor.o(($event) => $options.goDetail(order), "a" + i),
        c: "3a0afccf-2-" + i0,
        d: common_vendor.p({
          order
        })
      };
    })
  } : {}, {
    t: common_vendor.o($options.onTabChange),
    v: common_vendor.p({
      current: 2,
      tabs: $data.counselorTabs
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3a0afccf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/orders/index.js.map
