"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_store_index = require("../../../../common/store/index.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { CustomTabbar, EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      showPassword: false,
      showLogs: false,
      avatarSpin: false,
      passwordForm: { oldPwd: "", newPwd: "", confirmPwd: "" },
      userInfo: {},
      stats: [
        { num: 48, label: "学生" },
        { num: 15, label: "工单" },
        { num: 32, label: "知识库" }
      ],
      operationLogs: [
        { action: "导入了48个学生账号", time: "05-20 14:30" },
        { action: "发布了通知：开学报到须知", time: "05-20 10:00" },
        { action: "完结了工单 #1024", time: "05-19 16:30" },
        { action: "新增了知识库条目", time: "05-19 10:15" },
        { action: "修改了系统设置", time: "05-18 09:00" }
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
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.userInfo = common_store_index.store.state.userInfo || { name: "李老师", id: "T001", role: "辅导员" };
  },
  methods: {
    onAvatarTap() {
      this.avatarSpin = true;
      setTimeout(() => {
        this.avatarSpin = false;
      }, 800);
    },
    goPage(type) {
      switch (type) {
        case "password":
          this.showPassword = true;
          break;
        case "logs":
          this.showLogs = true;
          break;
        case "accounts":
          common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/accounts/index" });
          break;
        case "settings":
          common_vendor.index.navigateTo({ url: "/subpackages/profile/pages/settings/index" });
          break;
      }
    },
    changePassword() {
      if (!this.passwordForm.oldPwd || !this.passwordForm.newPwd) {
        common_vendor.index.showToast({ title: "请填写完整", icon: "none" });
        return;
      }
      if (this.passwordForm.newPwd !== this.passwordForm.confirmPwd) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "修改成功", icon: "success" });
      this.showPassword = false;
      this.passwordForm = { oldPwd: "", newPwd: "", confirmPwd: "" };
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_store_index.store.mutations.logout();
            common_vendor.index.reLaunch({ url: "/subpackages/login/pages/login" });
          }
        }
      });
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  }
};
if (!Array) {
  const _component_custom_tabbar = common_vendor.resolveComponent("custom-tabbar");
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  (_component_custom_tabbar + _component_empty_state)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.t($data.userInfo.name ? $data.userInfo.name.charAt(0) : "师"),
    c: common_vendor.o((...args) => $options.onAvatarTap && $options.onAvatarTap(...args)),
    d: $data.avatarSpin ? 1 : "",
    e: common_vendor.t($data.userInfo.name || "未登录"),
    f: common_vendor.t($data.userInfo.id),
    g: common_vendor.t($data.userInfo.role),
    h: common_vendor.f($data.stats, (stat, i, i0) => {
      return {
        a: common_vendor.t(stat.num),
        b: common_vendor.t(stat.label),
        c: i
      };
    }),
    i: common_vendor.o(($event) => $options.goPage("password")),
    j: common_vendor.o(($event) => $options.goPage("logs")),
    k: common_vendor.o(($event) => $options.goPage("accounts")),
    l: common_vendor.o(($event) => $options.goPage("settings")),
    m: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    n: common_vendor.o($options.onTabChange),
    o: common_vendor.p({
      current: 4,
      tabs: $data.counselorTabs
    }),
    p: $data.showPassword
  }, $data.showPassword ? {
    q: $data.passwordForm.oldPwd,
    r: common_vendor.o(($event) => $data.passwordForm.oldPwd = $event.detail.value),
    s: $data.passwordForm.newPwd,
    t: common_vendor.o(($event) => $data.passwordForm.newPwd = $event.detail.value),
    v: $data.passwordForm.confirmPwd,
    w: common_vendor.o(($event) => $data.passwordForm.confirmPwd = $event.detail.value),
    x: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    y: common_vendor.o(() => {
    }),
    z: common_vendor.o(($event) => $data.showPassword = false)
  } : {}, {
    A: $data.showLogs
  }, $data.showLogs ? common_vendor.e({
    B: common_vendor.f($data.operationLogs, (log, i, i0) => {
      return {
        a: common_vendor.t(log.action),
        b: common_vendor.t(log.time),
        c: i
      };
    }),
    C: $data.operationLogs.length === 0
  }, $data.operationLogs.length === 0 ? {
    D: common_vendor.p({
      text: "暂无操作记录"
    })
  } : {}, {
    E: common_vendor.o(($event) => $data.showLogs = false),
    F: common_vendor.o(() => {
    }),
    G: common_vendor.o(($event) => $data.showLogs = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-04cc8ff7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/profile/pages/counselor/index.js.map
