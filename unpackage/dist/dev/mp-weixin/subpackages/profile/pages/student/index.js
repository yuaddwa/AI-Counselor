"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_store_index = require("../../../../common/store/index.js");
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
        { num: 3, label: "工单" },
        { num: 12, label: "提问" },
        { num: 5, label: "收藏" }
      ],
      myTickets: [
        { question: "关于休学申请流程咨询", status: "pending", statusText: "待受理", statusColor: "#F0AD4E", time: "05-20" },
        { question: "宿舍空调报修", status: "processing", statusText: "处理中", statusColor: "#4A90D9", time: "05-19" },
        { question: "奖学金申请条件", status: "completed", statusText: "已完结", statusColor: "#4CD964", time: "05-18" }
      ]
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.userInfo = common_store_index.store.state.userInfo || { name: "学生", id: "2026001", className: "计算机2601" };
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
    submitFeedback() {
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({ title: "请输入反馈内容", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "提交成功", icon: "success" });
      this.showFeedback = false;
      this.feedbackContent = "";
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
    l: common_vendor.o(($event) => $options.goPage("tickets")),
    m: common_vendor.o(($event) => $options.goPage("feedback")),
    n: common_vendor.o(($event) => $options.goPage("about")),
    o: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    p: $data.showNotification
  }, $data.showNotification ? {
    q: $data.settings.chatNotify,
    r: common_vendor.o(($event) => $data.settings.chatNotify = $event.detail.value),
    s: $data.settings.humanNotify,
    t: common_vendor.o(($event) => $data.settings.humanNotify = $event.detail.value),
    v: common_vendor.o(($event) => $data.showNotification = false),
    w: common_vendor.o(() => {
    }),
    x: common_vendor.o(($event) => $data.showNotification = false)
  } : {}, {
    y: $data.showPassword
  }, $data.showPassword ? {
    z: $data.passwordForm.oldPwd,
    A: common_vendor.o(($event) => $data.passwordForm.oldPwd = $event.detail.value),
    B: $data.passwordForm.newPwd,
    C: common_vendor.o(($event) => $data.passwordForm.newPwd = $event.detail.value),
    D: $data.passwordForm.confirmPwd,
    E: common_vendor.o(($event) => $data.passwordForm.confirmPwd = $event.detail.value),
    F: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    G: common_vendor.o(() => {
    }),
    H: common_vendor.o(($event) => $data.showPassword = false)
  } : {}, {
    I: $data.showFeedback
  }, $data.showFeedback ? {
    J: $data.feedbackContent,
    K: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    L: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    M: common_vendor.o(() => {
    }),
    N: common_vendor.o(($event) => $data.showFeedback = false)
  } : {}, {
    O: $data.showTickets
  }, $data.showTickets ? common_vendor.e({
    P: common_vendor.f($data.myTickets, (t, i, i0) => {
      return {
        a: common_vendor.t(t.question),
        b: common_vendor.t(t.statusText),
        c: t.statusColor,
        d: common_vendor.t(t.time),
        e: i
      };
    }),
    Q: $data.myTickets.length === 0
  }, $data.myTickets.length === 0 ? {
    R: common_vendor.p({
      text: "暂无工单"
    })
  } : {}, {
    S: common_vendor.o(($event) => $data.showTickets = false),
    T: common_vendor.o(() => {
    }),
    U: common_vendor.o(($event) => $data.showTickets = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8d788b36"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/profile/pages/student/index.js.map
