"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      activeTab: 0,
      tabs: ["办事指南", "校园工具", "通知中心"],
      guides: [
        { name: "教务办理", desc: "选课、成绩查询、学籍变动", icon: "", bg: "#E8F4FD" },
        { name: "财务缴费", desc: "学费、住宿费在线缴费", icon: "", bg: "#E8F8E8" },
        { name: "后勤服务", desc: "宿舍报修、水电充值", icon: "", bg: "#FFF3E0" },
        { name: "社团申请", desc: "社团创建、活动审批", icon: "", bg: "#F3E8FD" },
        { name: "医保报销", desc: "就医报销、医保卡办理", icon: "", bg: "#FFE8E8" },
        { name: "就业服务", desc: "就业协议、简历指导", icon: "", bg: "#E8FFF3" }
      ],
      tools: [
        { name: "校园地图", icon: "", bg: "#E8F4FD", url: "/subpackages/student/pages/services/campus-map/index" },
        { name: "常用电话", icon: "", bg: "#FFF3E0", url: "/subpackages/student/pages/services/phonebook/index" },
        { name: "校历", icon: "", bg: "#E8F8E8", url: "" },
        { name: "成绩查询", icon: "", bg: "#F3E8FD", url: "" },
        { name: "课表", icon: "", bg: "#FFE8E8", url: "" },
        { name: "失物招领", icon: "", bg: "#E8FFF3", url: "" }
      ],
      notices: [
        { id: 1, title: "2026年秋季学期开学报到须知", time: "05-20", read: false },
        { id: 2, title: "关于国庆节放假安排的通知", time: "05-18", read: false },
        { id: 3, title: "图书馆暑期开放时间调整", time: "05-15", read: true },
        { id: 4, title: "校园卡系统升级维护公告", time: "05-12", read: true }
      ]
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    switchTab(i) {
      if (this.activeTab === i)
        return;
      this.activeTab = i;
    },
    goGuideDetail(item) {
      common_vendor.index.navigateTo({ url: `/subpackages/student/pages/services/guide-detail/index?name=${encodeURIComponent(item.name)}` });
    },
    goTool(tool) {
      if (tool.url) {
        common_vendor.index.navigateTo({ url: tool.url });
      } else {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
      }
    },
    goNoticeDetail(item) {
      item.read = true;
      common_vendor.index.navigateTo({ url: `/subpackages/student/pages/services/notices/index?id=${item.id}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.f($data.tabs, (tab, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab),
        b: $data.activeTab === i
      }, $data.activeTab === i ? {} : {}, {
        c: i,
        d: $data.activeTab === i ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(i), i)
      });
    }),
    d: $data.activeTab === 0
  }, $data.activeTab === 0 ? {
    e: common_vendor.f($data.guides, (item, i, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: item.bg,
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.desc),
        e: i,
        f: common_vendor.o(($event) => $options.goGuideDetail(item), i)
      };
    })
  } : {}, {
    f: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    g: common_vendor.f($data.tools, (tool, i, i0) => {
      return {
        a: common_vendor.t(tool.icon),
        b: tool.bg,
        c: common_vendor.t(tool.name),
        d: i,
        e: common_vendor.o(($event) => $options.goTool(tool), i)
      };
    })
  } : {}, {
    h: $data.activeTab === 2
  }, $data.activeTab === 2 ? {
    i: common_vendor.f($data.notices, (item, i, i0) => {
      return common_vendor.e({
        a: !item.read
      }, !item.read ? {} : {}, {
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.time),
        d: i,
        e: common_vendor.o(($event) => $options.goNoticeDetail(item), i)
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-88607ee8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/index.js.map
