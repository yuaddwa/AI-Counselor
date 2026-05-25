"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      guideName: "",
      steps: [],
      materials: [],
      location: "",
      officeHours: "",
      phone: ""
    };
  },
  onLoad(options) {
    if (options.id) {
      common_utils_request.api.getGuideDetail(options.id).then((res) => {
        if (res) {
          const d = res;
          this.guideName = d.name || this.guideName;
          this.steps = d.steps || this.steps;
          this.materials = d.materials || this.materials;
          this.location = d.location || this.location;
          this.officeHours = d.officeHours || this.officeHours;
          this.phone = d.phone || this.phone;
          common_vendor.index.setNavigationBarTitle({ title: this.guideName });
        }
      }).catch(() => {
      });
    } else if (options.name) {
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
