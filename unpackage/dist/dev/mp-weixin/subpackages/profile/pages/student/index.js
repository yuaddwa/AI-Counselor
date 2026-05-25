"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_store_index = require("../../../../common/store/index.js");
const common_utils_helper = require("../../../../common/utils/helper.js");
const common_utils_request = require("../../../../common/utils/request.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      showNotification: false,
      showPassword: false,
      showFeedback: false,
      showTickets: false,
      avatarSpin: false,
      settings: { chatNotify: true, humanNotify: true },
      passwordForm: { oldPwd: "", newPwd: "", confirmPwd: "" },
      feedbackContent: "",
      userInfo: {},
      stats: [
        { num: 0, label: "工单" },
        { num: 0, label: "提问" },
        { num: 0, label: "收藏" }
      ],
      myTickets: []
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.userInfo = common_store_index.store.state.userInfo || { name: "", id: "", className: "" };
    this.loadStats();
    this.loadNotificationSettings();
    this.loadTickets();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    onAvatarTap() {
      this.avatarSpin = true;
      setTimeout(() => {
        this.avatarSpin = false;
      }, 800);
    },
    async loadStats() {
      try {
        const res = await common_utils_request.api.getUserStats();
        if (res) {
          this.stats = [
            { num: res.questionCount ?? 0, label: "工单" },
            { num: res.sessionCount ?? 0, label: "提问" },
            { num: res.favoriteCount ?? 0, label: "收藏" }
          ];
        }
      } catch (e) {
      }
    },
    goPage(type) {
      switch (type) {
        case "password":
          this.showPassword = true;
          break;
        case "notification":
          this.showNotification = true;
          break;
        case "tickets":
          this.showTickets = true;
          break;
        case "feedback":
          this.showFeedback = true;
          break;
        case "about":
          common_vendor.index.showModal({
            title: "关于AI辅导员",
            content: "版本：v1.0.0\nAI辅导员小程序为学生提供智能问答、校园服务等功能。",
            showCancel: false
          });
          break;
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
        await common_utils_request.api.updatePassword({ oldPassword: this.passwordForm.oldPwd, newPassword: this.passwordForm.newPwd, confirmPassword: this.passwordForm.confirmPwd });
        common_vendor.index.showToast({ title: "修改成功", icon: "success" });
        this.showPassword = false;
        this.passwordForm = { oldPwd: "", newPwd: "", confirmPwd: "" };
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "修改失败", icon: "none" });
      }
    },
    async submitFeedback() {
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({ title: "请输入反馈内容", icon: "none" });
        return;
      }
      try {
        await common_utils_request.api.submitUserFeedback({ content: this.feedbackContent });
        common_vendor.index.showToast({ title: "提交成功", icon: "success" });
        this.showFeedback = false;
        this.feedbackContent = "";
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "提交失败", icon: "none" });
      }
    },
    async loadNotificationSettings() {
      try {
        const res = await common_utils_request.api.getNotificationSettings();
        this.settings = { chatNotify: !!res.chatNotify, humanNotify: !!res.humanNotify };
      } catch (e) {
      }
    },
    async loadTickets() {
      try {
        const res = await common_utils_request.api.getMyTickets();
        const list = res.tickets || res.list || [];
        this.myTickets = list.map((t) => {
          const info = common_utils_helper.ticketStatusMap[t.status] || { text: t.status, color: "#999" };
          return { question: t.question || t.title, status: t.status, statusText: info.text, statusColor: info.color, time: t.time || t.createdAt };
        });
      } catch (e) {
      }
    },
    async onSettingChange(key, value) {
      this.settings[key] = value;
      try {
        await common_utils_request.api.updateNotificationSettings(this.settings);
      } catch (e) {
        this.settings[key] = !value;
        common_vendor.index.showToast({ title: "设置失败", icon: "none" });
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
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  _component_empty_state();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.userInfo.name ? $data.userInfo.name.charAt(0) : "我"),
    d: common_vendor.o((...args) => $options.onAvatarTap && $options.onAvatarTap(...args)),
    e: $data.avatarSpin ? 1 : "",
    f: common_vendor.t($data.userInfo.name || "未登录"),
    g: common_vendor.t($data.userInfo.id),
    h: common_vendor.t($data.userInfo.className),
    i: common_vendor.f($data.stats, (stat, i, i0) => {
      return {
        a: common_vendor.t(stat.num),
        b: common_vendor.t(stat.label),
        c: i
      };
    }),
    j: common_vendor.o(($event) => $options.goPage("password")),
    k: common_vendor.o(($event) => $options.goPage("notification")),
    l: $data.myTickets.length > 0
  }, $data.myTickets.length > 0 ? {
    m: common_vendor.t($data.myTickets.length)
  } : {}, {
    n: common_vendor.o(($event) => $options.goPage("tickets")),
    o: common_vendor.o(($event) => $options.goPage("feedback")),
    p: common_vendor.o(($event) => $options.goPage("about")),
    q: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    r: $data.showNotification
  }, $data.showNotification ? {
    s: $data.settings.chatNotify,
    t: common_vendor.o(($event) => $options.onSettingChange("chatNotify", $event.detail.value)),
    v: $data.settings.humanNotify,
    w: common_vendor.o(($event) => $options.onSettingChange("humanNotify", $event.detail.value)),
    x: common_vendor.o(($event) => $data.showNotification = false),
    y: common_vendor.o(() => {
    }),
    z: common_vendor.o(($event) => $data.showNotification = false)
  } : {}, {
    A: $data.showPassword
  }, $data.showPassword ? {
    B: $data.passwordForm.oldPwd,
    C: common_vendor.o(($event) => $data.passwordForm.oldPwd = $event.detail.value),
    D: $data.passwordForm.newPwd,
    E: common_vendor.o(($event) => $data.passwordForm.newPwd = $event.detail.value),
    F: $data.passwordForm.confirmPwd,
    G: common_vendor.o(($event) => $data.passwordForm.confirmPwd = $event.detail.value),
    H: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    I: common_vendor.o(() => {
    }),
    J: common_vendor.o(($event) => $data.showPassword = false)
  } : {}, {
    K: $data.showFeedback
  }, $data.showFeedback ? {
    L: $data.feedbackContent,
    M: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    N: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    O: common_vendor.o(() => {
    }),
    P: common_vendor.o(($event) => $data.showFeedback = false)
  } : {}, {
    Q: $data.showTickets
  }, $data.showTickets ? common_vendor.e({
    R: common_vendor.f($data.myTickets, (t, i, i0) => {
      return {
        a: common_vendor.t(t.question),
        b: common_vendor.t(t.statusText),
        c: t.statusColor,
        d: common_vendor.t(t.time),
        e: i
      };
    }),
    S: $data.myTickets.length === 0
  }, $data.myTickets.length === 0 ? {
    T: common_vendor.p({
      text: "暂无工单"
    })
  } : {}, {
    U: common_vendor.o(($event) => $data.showTickets = false),
    V: common_vendor.o(() => {
    }),
    W: common_vendor.o(($event) => $data.showTickets = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8d788b36"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/profile/pages/student/index.js.map
