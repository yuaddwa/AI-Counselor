"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      orderId: "",
      order: {
        id: "",
        studentId: "",
        studentName: "",
        className: "",
        question: "",
        status: "pending",
        createTime: "",
        aiReply: "",
        chatHistory: []
      },
      tags: [],
      selectedTag: "",
      replyContent: ""
    };
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id;
      this.loadDetail(options.id);
    }
  },
  methods: {
    async loadDetail(id) {
      try {
        const res = await common_utils_request.api.getOrderDetail(id);
        const data = res;
        this.order = {
          id: data.id,
          studentId: data.studentId || "",
          studentName: data.studentName || "",
          className: data.className || "",
          question: data.question || "",
          status: data.status || "pending",
          createTime: data.createTime || "",
          aiReply: data.aiReply || "",
          chatHistory: data.chatHistory || []
        };
        if (data.tags) {
          this.selectedTag = data.tags;
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "加载详情失败", icon: "none" });
      }
    },
    attachImage() {
      common_vendor.index.chooseImage({
        count: 3,
        success: (res) => {
          common_vendor.index.showToast({ title: "已选择" + res.tempFilePaths.length + "张图片", icon: "success" });
        }
      });
    },
    async handleAccept() {
      try {
        await common_utils_request.api.updateOrderStatus({ orderId: this.orderId, status: "processing" });
        this.order.status = "processing";
        common_vendor.index.showToast({ title: "已受理", icon: "success" });
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    handleComplete() {
      if (!this.replyContent.trim()) {
        common_vendor.index.showToast({ title: "请先填写回复", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "确认完结",
        content: "确定完结此工单？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.replyOrder({ orderId: this.orderId, content: this.replyContent });
              await common_utils_request.api.updateOrderStatus({ orderId: this.orderId, status: "completed" });
              this.order.status = "completed";
              common_vendor.index.showToast({ title: "已完结", icon: "success" });
              setTimeout(() => common_vendor.index.navigateBack(), 1500);
            } catch (e) {
              common_vendor.index.showToast({ title: "操作失败", icon: "none" });
            }
          }
        }
      });
    },
    handleReject() {
      common_vendor.index.showModal({
        title: "确认退回",
        content: "确定退回此工单？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.updateOrderStatus({ orderId: this.orderId, status: "pending" });
              this.order.status = "pending";
              common_vendor.index.showToast({ title: "已退回", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "操作失败", icon: "none" });
            }
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.order.studentId),
    b: common_vendor.t($data.order.studentName),
    c: common_vendor.t($data.order.className),
    d: common_vendor.t($data.order.createTime),
    e: common_vendor.t($data.order.question),
    f: common_vendor.t($data.order.aiReply),
    g: common_vendor.f($data.order.chatHistory, (msg, i, i0) => {
      return {
        a: common_vendor.t(msg.content),
        b: i,
        c: msg.role === "student" ? 1 : ""
      };
    }),
    h: common_vendor.f($data.tags, (tag, i, i0) => {
      return {
        a: common_vendor.t(tag),
        b: i,
        c: $data.selectedTag === tag ? 1 : "",
        d: common_vendor.o(($event) => $data.selectedTag = tag, i)
      };
    }),
    i: $data.replyContent,
    j: common_vendor.o(($event) => $data.replyContent = $event.detail.value),
    k: common_vendor.o((...args) => $options.attachImage && $options.attachImage(...args)),
    l: $data.order.status === "pending"
  }, $data.order.status === "pending" ? {
    m: common_vendor.o((...args) => $options.handleAccept && $options.handleAccept(...args))
  } : {}, {
    n: common_vendor.o((...args) => $options.handleComplete && $options.handleComplete(...args)),
    o: $data.order.status !== "completed"
  }, $data.order.status !== "completed" ? {
    p: common_vendor.o((...args) => $options.handleReject && $options.handleReject(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-43e0d5bb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/orders/detail/index.js.map
