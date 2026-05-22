"use strict";
const common_vendor = require("../../../../common/vendor.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const _sfc_main = {
  components: { CustomTabbar },
  data() {
    return {
      statusBarHeight: 0,
      activeTime: 0,
      timeTabs: ["日", "周", "月"],
      trendData: [
        { label: "周一", value: 45, height: 60 },
        { label: "周二", value: 62, height: 82 },
        { label: "周三", value: 38, height: 50 },
        { label: "周四", value: 75, height: 100 },
        { label: "周五", value: 55, height: 73 },
        { label: "周六", value: 28, height: 37 },
        { label: "周日", value: 20, height: 27 }
      ],
      categoryData: [
        { name: "教务问题", percent: 35, color: "#4A90D9" },
        { name: "后勤服务", percent: 25, color: "#4CD964" },
        { name: "政策咨询", percent: 20, color: "#F0AD4E" },
        { name: "心理辅导", percent: 12, color: "#DD524D" },
        { name: "其他", percent: 8, color: "#9B59B6" }
      ],
      rankData: [
        { name: "计算机2601", count: 156 },
        { name: "经管2601", count: 132 },
        { name: "计算机2602", count: 118 },
        { name: "外语2601", count: 96 },
        { name: "机械2601", count: 85 }
      ],
      hotQuestions: [
        { question: "如何办理缓缴学费", count: 89 },
        { question: "宿舍报修流程", count: 76 },
        { question: "奖学金评选条件", count: 65 },
        { question: "选课系统使用", count: 52 },
        { question: "医保报销流程", count: 48 }
      ],
      feedbackList: [
        { content: "AI回答不够详细，希望补充更多细节", time: "05-20" },
        { content: "查不到图书馆的开放时间", time: "05-19" },
        { content: "转人工等待时间太长", time: "05-18" }
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
  created() {
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 0;
  },
  methods: {
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
