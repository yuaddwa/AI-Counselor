"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_store_index = require("../../../../common/store/index.js");
const common_utils_request = require("../../../../common/utils/request.js");
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
        { num: 0, label: "学生" },
        { num: 0, label: "工单" },
        { num: 0, label: "知识库" }
      ],
      operationLogs: [],
      notificationSettings: null,
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
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.userInfo = common_store_index.store.state.userInfo || { name: "", id: "", role: "" };
    this.loadStats();
    this.loadOperationLogs();
    this.loadNotificationSettings();
  },
  methods: {
    async loadStats() {
      try {
        const res = await common_utils_request.api.getCounselorStats();
        if (res) {
          this.stats = [
            { num: res.studentCount ?? 0, label: "学生" },
            { num: res.todayOrders ?? 0, label: "工单" },
            { num: res.knowledgeCount ?? 0, label: "知识库" }
          ];
        }
      } catch (e) {
      }
    },
    onAvatarTap() {
      this.avatarSpin = true;
      setTimeout(() => {
        this.avatarSpin = false;
      }, 800);
    },
    goStatPage(label) {
      const map = { "学生": "accounts", "工单": "orders", "知识库": "knowledge" };
      const type = map[label];
      if (type)
        this.goPage(type);
    },
    goPage(type) {
      switch (type) {
        case "password":
          this.showPassword = true;
          break;
        case "logs":
          this.showLogs = true;
          this.loadOperationLogs();
          break;
        case "accounts":
          common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/accounts/index" });
          break;
        case "knowledge":
          common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/knowledge/index" });
          break;
        case "orders":
          common_vendor.index.navigateTo({ url: "/subpackages/counselor/pages/orders/index" });
          break;
        case "settings":
          common_vendor.index.navigateTo({ url: "/subpackages/profile/pages/settings/index" });
          break;
      }
    },
    async loadOperationLogs() {
      try {
        const res = await common_utils_request.api.getOperationLogs({ page: 1, pageSize: 20 });
        this.operationLogs = (res.logs || []).map((item) => ({
          action: item.action || item.content,
          time: item.time || item.createdAt
        }));
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/profile/pages/counselor/index.vue:192", "加载操作日志失败", e);
      }
    },
    async loadNotificationSettings() {
      try {
        const res = await common_utils_request.api.getCounselorNotificationSettings();
        this.notificationSettings = res;
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/profile/pages/counselor/index.vue:200", "加载通知设置失败", e);
      }
    },
    async saveNotificationSettings() {
      try {
        await common_utils_request.api.updateCounselorNotificationSettings(this.notificationSettings);
        common_vendor.index.showToast({ title: "设置已保存", icon: "success" });
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "保存失败", icon: "none" });
      }
    },
    async changePassword() {
      if (!this.passwordForm.oldPwd || !this.passwordForm.newPwd) {
        common_vendor.index.showToast({ title: "请填写完整", icon: "none" });
        return;
      }
      if (this.passwordForm.newPwd !== this.passwordForm.confirmPwd) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      try {
        await common_utils_request.api.updatePassword({
          oldPassword: this.passwordForm.oldPwd,
          newPassword: this.passwordForm.newPwd,
          confirmPassword: this.passwordForm.confirmPwd
        });
        common_vendor.index.showToast({ title: "修改成功", icon: "success" });
        this.showPassword = false;
        this.passwordForm = { oldPwd: "", newPwd: "", confirmPwd: "" };
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "修改失败", icon: "none" });
      }
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
        c: i,
        d: common_vendor.o(($event) => $options.goStatPage(stat.label), i)
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
