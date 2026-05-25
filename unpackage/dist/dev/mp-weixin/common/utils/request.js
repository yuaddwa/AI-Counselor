"use strict";
const common_vendor = require("../vendor.js");
const BASE_URL = "https://xhztest.xyz";
function request(options) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token") || "";
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        ...options.header
      },
      success(res) {
        if (res.statusCode === 200) {
          const body = res.data;
          if (body.code === 200) {
            resolve(body.data);
          } else {
            reject({ code: body.code, msg: body.msg || "请求失败" });
          }
        } else if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.reLaunch({ url: "/subpackages/login/pages/login" });
          reject({ code: 401, msg: "登录已过期" });
        } else {
          reject(res.data || { code: res.statusCode, msg: "请求失败" });
        }
      },
      fail(err) {
        reject({ code: -1, msg: "网络异常" });
      }
    });
  });
}
const api = {
  login: (data) => request({ url: "/api/login", method: "POST", data }),
  getStudentHome: () => request({ url: "/api/student/home" }),
  getAnnouncements: () => request({ url: "/api/announcements" }),
  getQuickQuestions: () => request({ url: "/api/quick-questions" }),
  sendMessage: (data) => request({ url: "/api/chat/send", method: "POST", data }),
  getChatHistory: (params) => request({ url: "/api/chat/history", data: params }),
  getChatDetail: (id) => request({ url: `/api/chat/session/${id}` }),
  deleteChatSession: (id) => request({ url: `/api/chat/session/${id}`, method: "DELETE" }),
  clearAllChat: () => request({ url: "/api/chat/clear", method: "DELETE" }),
  submitFeedback: (data) => request({ url: "/api/feedback", method: "POST", data }),
  getServiceGuides: () => request({ url: "/api/services/guides" }),
  getGuideDetail: (id) => request({ url: `/api/services/guides/${id}` }),
  getCampusMap: () => request({ url: "/api/services/map" }),
  getPhonebook: () => request({ url: "/api/services/phonebook" }),
  getNotices: (params) => request({ url: "/api/notices", data: params }),
  getNoticeDetail: (id) => request({ url: `/api/notices/${id}` }),
  getUserProfile: () => request({ url: "/api/user/profile" }),
  updatePassword: (data) => request({ url: "/api/user/password", method: "PUT", data }),
  submitUserFeedback: (data) => request({ url: "/api/user/feedback", method: "POST", data }),
  getMyTickets: (params) => request({ url: "/api/user/tickets", data: params }),
  getFavorites: (params) => request({ url: "/api/user/favorites", data: params }),
  addFavorite: (data) => request({ url: "/api/user/favorites", method: "POST", data }),
  removeFavorite: (id) => request({ url: `/api/user/favorites/${id}`, method: "DELETE" }),
  getNotificationSettings: () => request({ url: "/api/user/notification-settings" }),
  updateNotificationSettings: (data) => request({ url: "/api/user/notification-settings", method: "PUT", data }),
  uploadImage: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token") || "";
      common_vendor.index.uploadFile({
        url: BASE_URL + "/api/upload/image",
        filePath,
        name: "file",
        header: { "Authorization": `Bearer ${token}` },
        success: (res) => {
          const body = JSON.parse(res.data);
          if (body.code === 200) {
            resolve(body.data);
          } else {
            reject({ code: body.code, msg: body.msg || "上传失败" });
          }
        },
        fail: reject
      });
    });
  },
  // 请假模块
  submitLeave: (data) => request({ url: "/api/leave", method: "POST", data }),
  getMyLeaveRecords: (params) => request({ url: "/api/leave/my", data: params }),
  // 辅导员端
  getWorkspaceData: () => request({ url: "/api/counselor/workspace" }),
  getKnowledgeList: (params) => request({ url: "/api/counselor/knowledge", data: params }),
  saveKnowledge: (data) => request({ url: "/api/counselor/knowledge", method: "POST", data }),
  deleteKnowledge: (id) => request({ url: `/api/counselor/knowledge/${id}`, method: "DELETE" }),
  uploadKnowledgeFile: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token") || "";
      common_vendor.index.uploadFile({
        url: BASE_URL + "/api/counselor/knowledge/import",
        filePath,
        name: "file",
        header: { "Authorization": `Bearer ${token}` },
        success: (res) => {
          const body = JSON.parse(res.data);
          if (body.code === 200) {
            resolve(body.data);
          } else {
            reject({ code: body.code, msg: body.msg || "上传失败" });
          }
        },
        fail: reject
      });
    });
  },
  testKnowledge: (data) => request({ url: "/api/counselor/knowledge/test", method: "POST", data }),
  getOrders: (params) => request({ url: "/api/counselor/orders", data: params }),
  getOrderDetail: (id) => request({ url: `/api/counselor/orders/${id}` }),
  replyOrder: (data) => request({ url: "/api/counselor/orders/reply", method: "POST", data }),
  updateOrderStatus: (data) => request({ url: "/api/counselor/orders/status", method: "PUT", data }),
  getStatistics: (params) => request({ url: "/api/counselor/statistics", data: params }),
  getAccounts: (params) => request({ url: "/api/counselor/accounts", data: params }),
  addAccount: (data) => request({ url: "/api/counselor/accounts", method: "POST", data }),
  updateAccount: (data) => request({ url: "/api/counselor/accounts", method: "PUT", data }),
  resetAccountPassword: (id) => request({ url: `/api/counselor/accounts/${id}/reset`, method: "POST" }),
  batchImportAccounts: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token") || "";
      common_vendor.index.uploadFile({
        url: BASE_URL + "/api/counselor/accounts/import",
        filePath,
        name: "file",
        header: { "Authorization": `Bearer ${token}` },
        success: (res) => {
          common_vendor.index.__f__("log", "at common/utils/request.js:131", "batchImport status:", res.statusCode, "data:", res.data);
          if (res.statusCode === 200) {
            try {
              const body = JSON.parse(res.data);
              if (body.code === 200) {
                resolve(body.data);
              } else {
                reject({ code: body.code, msg: body.msg || "导入失败" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at common/utils/request.js:141", "parse fail:", res.data);
              reject({ code: -2, msg: "解析响应失败" });
            }
          } else if (res.statusCode === 401) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.reLaunch({ url: "/subpackages/login/pages/login" });
            reject({ code: 401, msg: "登录已过期" });
          } else {
            reject({ code: res.statusCode, msg: "导入失败(" + res.statusCode + ")" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at common/utils/request.js:153", "uploadFile fail:", JSON.stringify(err));
          reject({ code: -1, msg: "网络异常，导入失败" });
        }
      });
    });
  },
  downloadTemplate: () => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token") || "";
      const filePath = `${common_vendor.wx$1.env.USER_DATA_PATH}/template.xlsx`;
      common_vendor.index.request({
        url: BASE_URL + "/api/counselor/accounts/template",
        method: "GET",
        responseType: "arraybuffer",
        header: {
          "Authorization": `Bearer ${token}`
        },
        success(res) {
          common_vendor.index.__f__("log", "at common/utils/request.js:171", "downloadTemplate status:", res.statusCode);
          if (res.statusCode === 200) {
            const fs = common_vendor.index.getFileSystemManager();
            fs.writeFile({
              filePath,
              data: res.data,
              encoding: "binary",
              success() {
                common_vendor.index.openDocument({
                  filePath,
                  fileType: "xlsx",
                  showMenu: true,
                  success: resolve,
                  fail: (err) => {
                    common_vendor.index.__f__("error", "at common/utils/request.js:185", "openDocument fail:", JSON.stringify(err));
                    reject({ code: -2, msg: "打开文件失败" });
                  }
                });
              },
              fail(err) {
                common_vendor.index.__f__("error", "at common/utils/request.js:191", "writeFile fail:", JSON.stringify(err));
                reject({ code: -3, msg: "保存文件失败" });
              }
            });
          } else if (res.statusCode === 401) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.reLaunch({ url: "/subpackages/login/pages/login" });
            reject({ code: 401, msg: "登录已过期" });
          } else {
            reject({ code: res.statusCode, msg: "下载失败(" + res.statusCode + ")" });
          }
        },
        fail(err) {
          common_vendor.index.__f__("error", "at common/utils/request.js:204", "request fail:", JSON.stringify(err));
          reject({ code: -1, msg: "网络异常，下载失败" });
        }
      });
    });
  },
  getNotifications: (params) => request({ url: "/api/counselor/notifications", data: params }),
  createNotification: (data) => request({ url: "/api/counselor/notifications", method: "POST", data }),
  deleteNotification: (id) => request({ url: `/api/counselor/notifications/${id}`, method: "DELETE" }),
  getCounselorNotificationSettings: () => request({ url: "/api/counselor/notification-settings" }),
  updateCounselorNotificationSettings: (data) => request({ url: "/api/counselor/notification-settings", method: "PUT", data }),
  getCounselorLeaveList: (params) => request({ url: "/api/counselor/leave", data: params }),
  approveLeave: (id, data) => request({ url: `/api/counselor/leave/${id}`, method: "PUT", data }),
  getCounselorSubAccounts: () => request({ url: "/api/counselor/sub-accounts" }),
  getKnowledgeCategories: () => request({ url: "/api/counselor/knowledge/categories" }),
  getClasses: (params) => request({ url: "/api/counselor/accounts/classes", data: params }),
  getCounselorStats: () => request({ url: "/api/counselor/stats" }),
  getUserStats: () => request({ url: "/api/user/stats" }),
  getOperationLogs: (params) => request({ url: "/api/counselor/logs", data: params }),
  // 校历
  getCalendar: () => request({ url: "/api/services/calendar" }),
  // 成绩查询
  getGrades: (params) => request({ url: "/api/student/grades", data: params }),
  // 课表
  getSchedule: (params) => request({ url: "/api/student/schedule", data: params }),
  // 失物招领
  getLostFound: (params) => request({ url: "/api/services/lost-found", data: params }),
  getLostFoundDetail: (id) => request({ url: `/api/services/lost-found/${id}` }),
  publishLostFound: (data) => request({ url: "/api/services/lost-found", method: "POST", data }),
  // 辅导员端 - 失物招领管理
  getCounselorLostFound: (params) => request({ url: "/api/counselor/lost-found", data: params }),
  deleteCounselorLostFound: (id) => request({ url: `/api/counselor/lost-found/${id}`, method: "DELETE" }),
  // 辅导员端 - 校历管理
  getCounselorCalendar: () => request({ url: "/api/counselor/calendar" }),
  addCalendarEvent: (data) => request({ url: "/api/counselor/calendar", method: "POST", data }),
  deleteCalendarEvent: (id) => request({ url: `/api/counselor/calendar/${id}`, method: "DELETE" }),
  speechToText: (filePath) => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token") || "";
      common_vendor.index.uploadFile({
        url: BASE_URL + "/api/chat/speech-to-text",
        filePath,
        name: "file",
        header: { "Authorization": `Bearer ${token}` },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data.data);
          } else {
            reject({ code: data.code, msg: data.msg || "语音识别失败" });
          }
        },
        fail: reject
      });
    });
  },
  // 数字人
  digitalHumanOffer: (data) => request({ url: "/api/digital-human/offer", method: "POST", data }),
  digitalHumanSpeak: (data) => request({ url: "/api/digital-human/speak", method: "POST", data }),
  digitalHumanInterrupt: (data) => request({ url: "/api/digital-human/interrupt", method: "POST", data })
};
exports.api = api;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/utils/request.js.map
