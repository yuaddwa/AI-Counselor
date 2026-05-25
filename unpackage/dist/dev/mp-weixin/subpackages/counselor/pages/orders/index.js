"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
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
      orders: [],
      archivedOrders: [],
      classOptions: ["全部班级"],
      classIndex: 0,
      typeOptions: ["全部类型"],
      typeIndex: 0,
      counselorTabs: [
        { text: "工作台", icon: "icon-gongzuotai", url: "/subpackages/counselor/pages/workspace/index" },
        { text: "知识库", icon: "icon-zhishi", url: "/subpackages/counselor/pages/knowledge/index" },
        { text: "工单", icon: "icon-gongdan", url: "/subpackages/counselor/pages/orders/index" },
        { text: "数据", icon: "icon-shuju", url: "/subpackages/counselor/pages/data/index" },
        { text: "我的", icon: "icon-wode", url: "/subpackages/profile/pages/counselor/index" }
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
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      const params = { page: 1, pageSize: 50 };
      if (this.activeStatus !== "all")
        params.status = this.activeStatus;
      if (this.selectedClass)
        params.className = this.selectedClass;
      if (this.selectedType)
        params.type = this.selectedType;
      if (this.searchKeyword)
        params.keyword = this.searchKeyword;
      try {
        const res = await common_utils_request.api.getOrders(params);
        if (res) {
          this.orders = (res.orders || []).map((item) => ({
            id: item.id,
            studentId: item.studentId,
            studentName: item.studentName,
            className: item.className,
            question: item.question || item.title || item.content,
            status: item.status,
            createTime: item.createTime ? item.createTime.substring(5, 16).replace("T", " ") : "",
            type: item.type || ""
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/orders/index.vue:157", "加载工单失败", e);
      }
    },
    goDetail(order) {
      common_vendor.index.navigateTo({ url: `/subpackages/counselor/pages/orders/detail/index?id=${order.id}` });
    },
    onTypeChange(e) {
      const idx = e.detail.value;
      this.selectedType = idx === 0 ? "" : this.typeOptions[idx];
      this.loadOrders();
    },
    onClassChange(e) {
      const idx = e.detail.value;
      this.selectedClass = idx === 0 ? "" : this.classOptions[idx];
      this.showClassFilter = false;
      this.loadOrders();
    },
    toggleArchive() {
      this.showArchive = !this.showArchive;
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  },
  watch: {
    activeStatus() {
      this.loadOrders();
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
