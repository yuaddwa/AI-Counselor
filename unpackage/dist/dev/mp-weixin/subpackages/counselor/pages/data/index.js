"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const _sfc_main = {
  components: { CustomTabbar },
  data() {
    return {
      statusBarHeight: 0,
      activeTime: 0,
      timeTabs: ["周", "月", "学期"],
      trendData: [],
      categoryData: [],
      rankData: [],
      hotQuestions: [],
      feedbackList: [],
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
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 0;
    this.loadStatistics();
  },
  watch: {
    activeTime() {
      this.loadStatistics();
    }
  },
  methods: {
    async loadStatistics() {
      this.loading = true;
      try {
        const timeMap = { 0: "week", 1: "month", 2: "semester" };
        const params = { period: timeMap[this.activeTime] };
        const res = await common_utils_request.api.getStatistics(params);
        const data = res;
        if (data.trendData && data.trendData.length) {
          this.trendData = data.trendData;
        }
        if (data.categoryData && data.categoryData.length) {
          this.categoryData = data.categoryData;
        }
        if (data.rankData && data.rankData.length) {
          this.rankData = data.rankData;
        }
        if (data.hotQuestions && data.hotQuestions.length) {
          this.hotQuestions = data.hotQuestions;
        }
        if (data.feedbackList && data.feedbackList.length) {
          this.feedbackList = data.feedbackList;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/data/index.vue:160", "加载统计数据失败", e);
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    viewFeedback(item) {
      common_vendor.index.showModal({
        title: "反馈详情",
        content: item.content,
        showCancel: false
      });
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  }
};
if (!Array) {
  const _component_custom_tabbar = common_vendor.resolveComponent("custom-tabbar");
  _component_custom_tabbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.statusBarHeight + "px",
    b: common_vendor.f($data.timeTabs, (tab, i, i0) => {
      return {
        a: common_vendor.t(tab),
        b: i,
        c: $data.activeTime === i ? 1 : "",
        d: common_vendor.o(($event) => $data.activeTime = i, i)
      };
    }),
    c: common_vendor.f($data.trendData, (d, i, i0) => {
      return {
        a: common_vendor.t(d.value),
        b: i,
        c: d.height + "%"
      };
    }),
    d: common_vendor.f($data.trendData, (d, i, i0) => {
      return {
        a: common_vendor.t(d.label),
        b: i
      };
    }),
    e: common_vendor.f($data.categoryData, (item, i, i0) => {
      return {
        a: item.color,
        b: common_vendor.t(item.name),
        c: item.percent + "%",
        d: item.color,
        e: common_vendor.t(item.percent),
        f: i
      };
    }),
    f: common_vendor.f($data.rankData, (item, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: i < 3 ? 1 : "",
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.count),
        e: i
      };
    }),
    g: common_vendor.f($data.hotQuestions, (item, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: common_vendor.t(item.question),
        c: common_vendor.t(item.count),
        d: i
      };
    }),
    h: common_vendor.f($data.feedbackList, (item, i, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: common_vendor.t(item.time),
        c: i,
        d: common_vendor.o(($event) => $options.viewFeedback(item), i)
      };
    }),
    i: common_vendor.o($options.onTabChange),
    j: common_vendor.p({
      current: 3,
      tabs: $data.counselorTabs
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c61ec925"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/data/index.js.map
