"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      order: {
        id: 1,
        studentId: "2026001",
        studentName: "张同学",
        className: "计算机2601",
        question: "关于休学申请的流程咨询，需要准备什么材料？一般需要多长时间能办理完成？",
        status: "pending",
        createTime: "2026-05-20 14:30",
        aiReply: "关于休学申请：\n1. 需要填写《休学申请表》\n2. 提供相关证明材料（如医院证明）\n3. 辅导员签字审批\n4. 学院审批\n5. 教务处备案\n\n一般需要5-10个工作日完成审批。",
        chatHistory: [
          { role: "student", content: "我想办理休学，需要什么手续？" },
          { role: "ai", content: "办理休学需要以下材料：1. 休学申请表 2. 相关证明材料。请到教务处领取申请表。" },
          { role: "student", content: "一般多久能办完？需要辅导员签字吗？" }
        ]
      },
      tags: ["政策咨询", "后勤报修", "心理问题", "教务问题", "其他"],
      selectedTag: "",
      replyContent: ""
    };
  },
  onLoad(options) {
    if (options.id)
      ;
  },
  methods: {
    attachImage() {
      common_vendor.index.chooseImage({
        count: 3,
        success: (res) => {
          common_vendor.index.showToast({ title: "已选择" + res.tempFilePaths.length + "张图片", icon: "success" });
        }
      });
    },
    handleAccept() {
      this.order.status = "processing";
      common_vendor.index.showToast({ title: "已受理", icon: "success" });
    },
    handleComplete() {
      if (!this.replyContent.trim()) {
        common_vendor.index.showToast({ title: "请先填写回复", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "确认完结",
        content: "确定完结此工单？",
        success: (res) => {
          if (res.confirm) {
            this.order.status = "completed";
            common_vendor.index.showToast({ title: "已完结", icon: "success" });
            setTimeout(() => common_vendor.index.navigateBack(), 1500);
          }
        }
      });
    },
    handleReject() {
      common_vendor.index.showModal({
        title: "确认退回",
        content: "确定退回此工单？",
        success: (res) => {
          if (res.confirm) {
            this.order.status = "pending";
            common_vendor.index.showToast({ title: "已退回", icon: "success" });
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
