"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      selectedNotice: null,
      notices: [
        {
          id: 1,
          title: "2026年秋季学期开学报到须知",
          time: "2026-05-20",
          read: false,
          content: "各位同学：\n\n2026年秋季学期开学报到安排如下：\n\n一、报到时间：9月1日-9月2日\n\n二、报到地点：各学院迎新点\n\n三、所需材料：\n1. 录取通知书原件\n2. 身份证原件及复印件\n3. 一寸免冠照片8张\n4. 团组织关系介绍信\n\n四、注意事项：\n1. 请按时报到，如有特殊情况请提前请假\n2. 报到当天校园内有志愿者引导\n3. 家长可陪同入校，车辆请停在指定停车场\n\n祝同学们新学期愉快！"
        },
        {
          id: 2,
          title: "关于国庆节放假安排的通知",
          time: "2026-05-18",
          read: false,
          content: "根据国务院办公厅通知精神，结合我校实际，现将2026年国庆节放假安排通知如下：\n\n一、放假时间：10月1日至10月7日，共7天。\n\n二、调休安排：9月27日（周日）、10月10日（周六）正常上课。\n\n三、请各学院做好学生安全教育工作。"
        },
        {
          id: 3,
          title: "图书馆暑期开放时间调整",
          time: "2026-05-15",
          read: true,
          content: "图书馆暑期（7月15日-8月31日）开放时间调整如下：\n\n周一至周五：8:30-17:00\n周六、日：9:00-16:00\n\n电子资源24小时正常访问。"
        },
        {
          id: 4,
          title: "校园卡系统升级维护公告",
          time: "2026-05-12",
          read: true,
          content: "校园卡系统将于5月20日22:00至5月21日6:00进行升级维护，届时校园卡消费、充值功能将暂停服务，请提前做好安排。"
        }
      ]
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
  },
  onLoad(options) {
    if (options.id) {
      const n = this.notices.find((x) => x.id === Number(options.id));
      if (n) {
        n.read = true;
        this.selectedNotice = n;
      }
    }
  },
  methods: {
    goBack() {
      if (this.selectedNotice) {
        this.selectedNotice = null;
      } else {
        common_vendor.index.navigateBack();
      }
    },
    viewDetail(item) {
      item.read = true;
      this.selectedNotice = item;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: !$data.selectedNotice
  }, !$data.selectedNotice ? common_vendor.e({
    d: common_vendor.f($data.notices, (item, k0, i0) => {
      return common_vendor.e({
        a: !item.read
      }, !item.read ? {} : {}, {
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.time),
        d: item.id,
        e: common_vendor.o(($event) => $options.viewDetail(item), item.id)
      });
    }),
    e: $data.notices.length === 0
  }, $data.notices.length === 0 ? {} : {}) : {
    f: common_vendor.t($data.selectedNotice.title),
    g: common_vendor.t($data.selectedNotice.time),
    h: common_vendor.t($data.selectedNotice.content),
    i: common_vendor.o(($event) => $data.selectedNotice = null)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a79b0fe"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/notices/index.js.map
