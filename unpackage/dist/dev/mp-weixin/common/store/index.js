"use strict";
const common_vendor = require("../vendor.js");
const state = common_vendor.reactive({
  userInfo: null,
  userType: "",
  // student | counselor
  isLogin: false,
  token: "",
  notifications: [],
  leaveRequests: []
});
const mutations = {
  setUserInfo(info) {
    state.userInfo = info;
    state.isLogin = true;
  },
  setUserType(type) {
    state.userType = type;
  },
  setToken(token) {
    state.token = token;
    common_vendor.index.setStorageSync("token", token);
  },
  logout() {
    state.userInfo = null;
    state.userType = "";
    state.isLogin = false;
    state.token = "";
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
    common_vendor.index.removeStorageSync("userType");
  },
  addNotification(msg) {
    state.notifications.unshift({
      id: Date.now(),
      ...msg,
      read: false
    });
  },
  markNotificationRead(id) {
    const item = state.notifications.find((n) => n.id === id);
    if (item)
      item.read = true;
  },
  addLeaveRequest(req) {
    state.leaveRequests.unshift({
      id: Date.now(),
      status: "pending",
      createTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-"),
      ...req
    });
  },
  updateLeaveStatus(id, status) {
    const item = state.leaveRequests.find((r) => r.id === id);
    if (item)
      item.status = status;
  }
};
const getters = {
  unreadCount: common_vendor.computed(() => state.notifications.filter((n) => !n.read).length),
  isStudent: common_vendor.computed(() => state.userType === "student"),
  isCounselor: common_vendor.computed(() => state.userType === "counselor"),
  pendingLeaveCount: common_vendor.computed(() => state.leaveRequests.filter((r) => r.status === "pending").length)
};
function restoreLogin() {
  const token = common_vendor.index.getStorageSync("token");
  const userInfo = common_vendor.index.getStorageSync("userInfo");
  const userType = common_vendor.index.getStorageSync("userType");
  if (token && userInfo && userType) {
    state.token = token;
    state.userInfo = userInfo;
    state.userType = userType;
    state.isLogin = true;
  }
}
restoreLogin();
const store = {
  state,
  mutations,
  getters
};
exports.store = store;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/store/index.js.map
