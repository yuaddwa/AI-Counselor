"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const guideIconMap = {
  checkin: "icon-xuexiaogaikuang",
  registration: "icon-xuexiaogaikuang",
  dormitory: "icon-allicon_houqinfuwu",
  dorm: "icon-allicon_houqinfuwu",
  library: "icon-zhishi",
  book: "icon-zhishi",
  medical: "icon-yibaobaoxiao",
  hospital: "icon-yibaobaoxiao",
  health: "icon-yibaobaoxiao",
  job: "icon-jiuyezhidaozhongxin",
  employment: "icon-jiuyezhidaozhongxin",
  map: "icon-ditu",
  campus: "icon-ditu",
  phone: "icon-changyong-dianhua",
  contact: "icon-changyong-dianhua",
  fee: "icon-caiwujiaofei",
  payment: "icon-caiwujiaofei",
  leave: "icon-renwu",
  ticket: "icon-gongdan",
  notice: "icon-tongzhi",
  service: "icon-fuwu",
  feedback: "icon-yijianfankui",
  lost: "icon-shiwuzhaoling",
  found: "icon-shiwuzhaoling",
  calendar: "icon-xiaoli",
  score: "icon-chengjichaxun-01",
  grade: "icon-chengjichaxun-01",
  schedule: "icon-kebiao"
};
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      activeTab: 0,
      tabs: ["办事指南", "校园工具", "通知中心"],
      guides: [],
      tools: [
        { name: "校园地图", icon: "icon-ditu", bg: "#E8F4FD", url: "/subpackages/student/pages/services/campus-map/index" },
        { name: "常用电话", icon: "icon-changyong-dianhua", bg: "#FFF3E0", url: "/subpackages/student/pages/services/phonebook/index" },
        { name: "校历", icon: "icon-xiaoli", bg: "#E8F8E8", url: "/subpackages/student/pages/services/calendar/index" },
        { name: "成绩查询", icon: "icon-chengjichaxun-01", bg: "#F3E8FD", url: "/subpackages/student/pages/services/grades/index" },
        { name: "课表", icon: "icon-kebiao", bg: "#FFE8E8", url: "/subpackages/student/pages/services/schedule/index" },
        { name: "失物招领", icon: "icon-shiwuzhaoling", bg: "#E8FFF3", url: "/subpackages/student/pages/services/lost-found/index" }
      ],
      notices: []
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
        const res = await common_utils_request.api.getServiceGuides();
        if (res) {
          const colors = ["#E8F4FD", "#E8F8E8", "#FFF3E0", "#F3E8FD", "#FFE8E8", "#E8FFF3"];
          this.guides = (res.guides || res.list || []).map((item, i) => ({
            id: item.id,
            name: item.title || item.name,
            desc: item.description || item.desc || "",
            icon: guideIconMap[item.icon] || "icon-gongneng",
            bg: colors[i % colors.length]
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/index.vue:166", "加载办事指南失败", e);
      }
      try {
        const res = await common_utils_request.api.getNotices({ page: 1, pageSize: 20 });
        if (res) {
          this.notices = (res.notices || res.list || []).map((item) => ({
            id: item.id,
            title: item.title,
            time: item.createTime ? item.createTime.substring(5, 10) : "",
            read: item.read
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/index.vue:179", "加载通知失败", e);
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    switchTab(i) {
      if (this.activeTab === i)
        return;
      this.activeTab = i;
    },
    goGuideDetail(item) {
      const id = item.id || "";
      common_vendor.index.navigateTo({ url: `/subpackages/student/pages/services/guide-detail/index?id=${id}&name=${encodeURIComponent(item.name)}` });
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
        a: common_vendor.n(item.icon),
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
        a: common_vendor.n(tool.icon),
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
