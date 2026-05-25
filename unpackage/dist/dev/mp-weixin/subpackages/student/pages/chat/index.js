"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      scrollTop: 0,
      inputText: "",
      messages: [],
      isRecording: false,
      showTransfer: false,
      showFeedback: false,
      feedbackContent: "",
      currentFeedbackMsg: null,
      sessionId: ""
    };
  },
  onLoad(options) {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.sessionId = "";
    if (options.sessionId) {
      this.sessionId = options.sessionId;
      this.loadSessionDetail(options.sessionId);
    }
    if (options.question) {
      this.inputText = decodeURIComponent(options.question);
      this.$nextTick(() => this.sendMessage());
    }
  },
  onLongPress(e) {
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    goHistory() {
      common_vendor.index.navigateTo({ url: "/subpackages/student/pages/chat/history/index" });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = this.messages.length * 1e3;
      });
    },
    async loadSessionDetail(sessionId) {
      try {
        const res = await common_utils_request.api.getChatDetail(sessionId);
        if (res) {
          this.sessionId = res.sessionId;
          this.messages = (res.messages || []).map((msg) => ({
            role: msg.role === "assistant" ? "ai" : msg.role,
            content: msg.content,
            loading: false,
            liked: false,
            disliked: false,
            time: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now()
          }));
          if (this.messages.length > 0) {
            this.showTransfer = true;
          }
          this.scrollToBottom();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/chat/index.vue:186", "加载会话详情失败", e);
      }
    },
    async sendMessage() {
      const text = this.inputText.trim();
      if (!text)
        return;
      this.messages.push({
        role: "user",
        content: text,
        time: Date.now()
      });
      this.inputText = "";
      this.scrollToBottom();
      const aiMsg = {
        role: "ai",
        content: "",
        source: "",
        loading: true,
        liked: false,
        disliked: false,
        time: Date.now()
      };
      this.messages.push(aiMsg);
      this.scrollToBottom();
      try {
        const res = await common_utils_request.api.sendMessage({ message: text, sessionId: this.sessionId || void 0 });
        if (res) {
          this.sessionId = res.sessionId || this.sessionId;
          aiMsg.content = res.reply || "抱歉，暂时无法回答您的问题。";
        } else {
          aiMsg.content = "抱歉，服务暂时不可用，请稍后再试。";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/chat/index.vue:222", "发送消息失败", e);
        aiMsg.content = "网络异常，请检查网络后重试。";
      }
      aiMsg.loading = false;
      this.showTransfer = true;
      this.scrollToBottom();
    },
    async likeMsg(msg) {
      msg.liked = !msg.liked;
      if (msg.liked) {
        msg.disliked = false;
        try {
          const msgIndex = this.messages.indexOf(msg);
          await common_utils_request.api.submitFeedback({ sessionId: this.sessionId, messageIndex: msgIndex, type: "like" });
        } catch (e) {
        }
      }
    },
    dislikeMsg(msg) {
      msg.disliked = !msg.disliked;
      if (msg.disliked) {
        msg.liked = false;
        this.currentFeedbackMsg = msg;
        this.showFeedback = true;
      }
    },
    async submitFeedback() {
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({ title: "请输入反馈内容", icon: "none" });
        return;
      }
      try {
        await common_utils_request.api.submitFeedback({ sessionId: this.sessionId, messageIndex: this.messages.indexOf(this.currentFeedbackMsg), type: "dislike" });
      } catch (e) {
      }
      common_vendor.index.showToast({ title: "反馈已提交", icon: "success" });
      this.showFeedback = false;
      this.feedbackContent = "";
    },
    startVoice() {
      this.isRecording = true;
    },
    stopVoice() {
      this.isRecording = false;
      common_vendor.index.showToast({ title: "语音识别中...", icon: "loading" });
    },
    transferToHuman() {
      common_vendor.index.showModal({
        title: "转人工服务",
        content: "确认将当前对话转为人工服务？辅导员会尽快为您处理。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "已提交工单", icon: "success" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.o((...args) => $options.goHistory && $options.goHistory(...args)),
    d: common_vendor.f($data.messages, (msg, i, i0) => {
      return common_vendor.e({
        a: msg.role === "ai"
      }, msg.role === "ai" ? {} : {}, {
        b: common_vendor.t(msg.content),
        c: msg.source && msg.role === "ai"
      }, msg.source && msg.role === "ai" ? {
        d: common_vendor.t(msg.source)
      } : {}, {
        e: msg.role === "ai" && !msg.loading
      }, msg.role === "ai" && !msg.loading ? {
        f: msg.liked ? 1 : "",
        g: common_vendor.o(($event) => $options.likeMsg(msg), i),
        h: msg.disliked ? 1 : "",
        i: common_vendor.o(($event) => $options.dislikeMsg(msg), i)
      } : {}, {
        j: msg.loading
      }, msg.loading ? {} : {}, {
        k: msg.role === "user" ? 1 : "",
        l: msg.role === "user"
      }, msg.role === "user" ? {} : {}, {
        m: i,
        n: msg.role === "user" ? 1 : ""
      });
    }),
    e: $data.showTransfer
  }, $data.showTransfer ? {
    f: common_vendor.o((...args) => $options.transferToHuman && $options.transferToHuman(...args))
  } : {}, {
    g: $data.scrollTop,
    h: $data.showFeedback
  }, $data.showFeedback ? {
    i: $data.feedbackContent,
    j: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    k: common_vendor.o(($event) => $data.showFeedback = false),
    l: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    m: common_vendor.o(() => {
    }),
    n: common_vendor.o(($event) => $data.showFeedback = false)
  } : {}, {
    o: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    p: $data.inputText,
    q: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    r: common_vendor.t($data.isRecording ? "松开" : "语音"),
    s: $data.isRecording ? 1 : "",
    t: common_vendor.o((...args) => $options.startVoice && $options.startVoice(...args)),
    v: common_vendor.o((...args) => $options.stopVoice && $options.stopVoice(...args)),
    w: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    x: $data.inputText.trim() ? 1 : "",
    y: $data.isRecording
  }, $data.isRecording ? {
    z: common_vendor.f(5, (n, k0, i0) => {
      return {
        a: n
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-179ed6cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/student/pages/chat/index.js.map
