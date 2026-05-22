"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      guideName: "",
      steps: [
        { title: "准备材料", desc: "携带学生证、身份证及相关申请表" },
        { title: "前往办理", desc: "到对应办公室取号排队" },
        { title: "提交申请", desc: "将材料提交给工作人员审核" },
        { title: "等待处理", desc: "一般3-5个工作日内完成办理" }
      ],
      materials: ["学生证原件及复印件", "身份证原件及复印件", "相关申请表（可在现场领取）", "一寸免冠照片2张"],
      location: "行政楼一楼综合服务大厅",
      officeHours: "周一至周五 8:30-11:30，14:00-17:00",
      phone: "010-88888888"
    };
  },
  onLoad(options) {
    if (options.name) {
      this.guideName = decodeURIComponent(options.name);
      common_vendor.index.setNavigationBarTitle({ title: this.guideName });
    }
  },
  methods: {
    goMap() {
      common_vendor.index.navigateTo({ url: "/subpackages/student/pages/services/campus-map/index" });
    },
    callPhone() {
      common_vendor.index.makePhoneCall({ phoneNumber: this.phone });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.guideName),
    b: common_vendor.f($data.steps, (step, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: common_vendor.t(step.title),
        c: common_vendor.t(step.desc),
        d: i
      };
    }),
    c: common_vendor.f($data.materials, (m, i, i0) => {
      return {
        a: common_vendor.t(m),
        b: i
      };
    }),
    d: common_vendor.t($data.location),
    e: common_vendor.o((...args) => $options.goMap && $options.goMap(...args)),
    f: common_vendor.t($data.officeHours),
    g: common_vendor.t($data.phone),
    h: common_vendor.o((...args) => $options.callPhone && $options.callPhone(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c91fe6c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/guide-detail/index.js.map
