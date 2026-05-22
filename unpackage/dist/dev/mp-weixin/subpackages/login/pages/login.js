"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      role: "student",
      username: "",
      password: "",
      showPw: false,
      focusField: "",
      loading: false,
      errorMsg: "",
      showSuccess: false,
      successName: "",
      formKey: 0
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
  },
  methods: {
    switchRole(r) {
      if (this.role === r)
        return;
      this.role = r;
      this.formKey++;
    },
    handleLogin() {
      if (!this.username || !this.password) {
        this.showError("请输入账号和密码");
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.successName = this.role === "student" ? "同学" : "老师";
        this.showSuccess = true;
        setTimeout(() => {
          const url = this.role === "student" ? "/subpackages/student/pages/home/index" : "/subpackages/counselor/pages/workspace/index";
          common_vendor.index.reLaunch({ url });
        }, 1200);
      }, 1500);
    },
    forgotPw() {
      common_vendor.index.showToast({ title: "请联系管理员重置密码", icon: "none" });
    },
    showAgreement() {
      common_vendor.index.showToast({ title: "用户协议", icon: "none" });
    },
    showPrivacy() {
      common_vendor.index.showToast({ title: "隐私政策", icon: "none" });
    },
    showError(msg) {
      this.errorMsg = msg;
      setTimeout(() => {
        this.errorMsg = "";
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_assets._imports_0,
    c: $data.role === "student" ? "6rpx" : "50%",
    d: $data.role === "student" ? 1 : "",
    e: common_vendor.o(($event) => $options.switchRole("student")),
    f: $data.role === "counselor" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchRole("counselor")),
    h: $data.focusField === "username" || $data.username ? 1 : "",
    i: common_vendor.o(($event) => $data.focusField = "username"),
    j: common_vendor.o(($event) => $data.focusField = ""),
    k: $data.username,
    l: common_vendor.o(($event) => $data.username = $event.detail.value),
    m: $data.focusField === "username" ? 1 : "",
    n: $data.username ? 1 : "",
    o: $data.focusField === "password" || $data.password ? 1 : "",
    p: !$data.showPw,
    q: common_vendor.o(($event) => $data.focusField = "password"),
    r: common_vendor.o(($event) => $data.focusField = ""),
    s: $data.password,
    t: common_vendor.o(($event) => $data.password = $event.detail.value),
    v: common_vendor.n($data.showPw ? "icon-yanjing_xianshi_o" : "icon-yanjing_yincang_o"),
    w: common_vendor.o(($event) => $data.showPw = !$data.showPw),
    x: $data.focusField === "password" ? 1 : "",
    y: $data.password ? 1 : "",
    z: $data.loading
  }, $data.loading ? {} : {}, {
    A: $data.loading ? 1 : "",
    B: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    C: common_vendor.o((...args) => $options.forgotPw && $options.forgotPw(...args)),
    D: $data.formKey,
    E: $data.formKey > 0 ? 1 : "",
    F: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    G: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    H: $data.errorMsg
  }, $data.errorMsg ? {
    I: common_vendor.t($data.errorMsg)
  } : {}, {
    J: $data.showSuccess
  }, $data.showSuccess ? {
    K: common_vendor.t($data.successName),
    L: common_vendor.o(() => {
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-64c905d2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/subpackages/login/pages/login.js.map
