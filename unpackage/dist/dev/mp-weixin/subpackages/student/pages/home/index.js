"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      actionsRight: 20,
      scrollIntoView: "",
      showScrollBtn: false,
      inputText: "",
      messages: [],
      isRecording: false,
      voiceMode: false,
      activeTag: "",
      willCancel: false,
      voiceStartY: 0,
      recognizedText: "",
      showTransfer: false,
      recorderManager: null,
      voicePath: "",
      leaveState: "idle",
      leaveForm: { type: "", reason: "", startTime: "", endTime: "" },
      sessionId: null,
      quickTags: ["新生报到", "宿舍后勤", "奖助", "请假", "军训"],
      announcements: []
    };
  },
  computed: {
    unreadCount() {
      return this.announcements.filter((a) => !a.read).length;
    },
    lastMessages() {
      const msgs = this.messages;
      if (msgs.length === 0)
        return [];
      const last = msgs[msgs.length - 1];
      if (last.role === "user" || msgs.length === 1)
        return [last];
      const prev = msgs[msgs.length - 2];
      if (prev && prev.role === "user")
        return [prev, last];
      return [last];
    },
    leavePlaceholder() {
      if (this.leaveState === "askReason")
        return "请输入请假原因...";
      return "请输入您的问题...";
    }
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    try {
      const menuRect = common_vendor.index.getMenuButtonBoundingClientRect();
      if (menuRect && menuRect.width) {
        const windowWidth = windowInfo.windowWidth || 375;
        this.actionsRight = windowWidth - menuRect.left + 12;
      }
    } catch (e) {
    }
    try {
      const recorderManager = common_vendor.index.getRecorderManager && common_vendor.index.getRecorderManager();
      if (recorderManager) {
        this.recorderManager = recorderManager;
        this.recorderManager.onStop((res) => {
          if (!this.willCancel && res.tempFilePath) {
            this.voicePath = res.tempFilePath;
            this.recognizeSpeech(res.tempFilePath);
          }
        });
        this.recorderManager.onError((err) => {
          common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:218", "录音失败", err);
          common_vendor.index.showToast({ title: "录音失败，请重试", icon: "none" });
        });
      }
    } catch (e) {
    }
  },
  onShow() {
    setTimeout(() => {
      this.loadData();
    }, 100);
  },
  onLoad(options) {
    if (options.sessionId) {
      this.sessionId = options.sessionId;
      this.loadSessionDetail(options.sessionId);
    }
  },
  beforeDestroy() {
    this.destroyDigitalHuman();
  },
  methods: {
    scrollToBottom() {
      this.scrollIntoView = "";
      this.$nextTick(() => {
        this.scrollIntoView = "msg-bottom";
      });
    },
    onChatScroll(e) {
      const { scrollTop, scrollHeight } = e.detail;
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".chat-area").boundingClientRect((rect) => {
        if (rect) {
          this.showScrollBtn = scrollHeight - scrollTop - rect.height > 200;
        }
      }).exec();
    },
    sendQuick(tag) {
      if (tag === "请假") {
        this.startLeaveFlow(tag);
        return;
      }
      this.activeTag = tag;
      this.inputText = tag;
      this.sendMessage();
      this.activeTag = "";
    },
    async sendMessage() {
      const text = this.inputText.trim();
      if (!text)
        return;
      if (/请假|休假|请个假/.test(text) && this.leaveState === "idle") {
        this.startLeaveFlow(text);
        this.inputText = "";
        return;
      }
      if (this.leaveState === "askType") {
        this.onLeaveType(text);
        return;
      }
      if (this.leaveState === "askReason") {
        this.onLeaveReason(text);
        return;
      }
      if (this.leaveState !== "idle")
        return;
      this.messages.push({
        role: "user",
        content: text,
        time: Date.now()
      });
      this.inputText = "";
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
      try {
        const res = await common_utils_request.api.sendMessage({ message: text, sessionId: this.sessionId });
        if (res) {
          this.sessionId = res.sessionId || this.sessionId;
          aiMsg.content = res.reply || "抱歉，暂时无法回答您的问题。";
          this.dhSpeak(aiMsg.content);
        } else {
          aiMsg.content = "抱歉，服务暂时不可用，请稍后再试。";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:305", "发送消息失败", e);
        aiMsg.content = "网络异常，请检查网络后重试。";
      }
      aiMsg.loading = false;
      this.showTransfer = true;
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
    async dislikeMsg(msg) {
      msg.disliked = !msg.disliked;
      if (msg.disliked) {
        msg.liked = false;
        try {
          const msgIndex = this.messages.indexOf(msg);
          await common_utils_request.api.submitFeedback({ sessionId: this.sessionId, messageIndex: msgIndex, type: "dislike" });
        } catch (e) {
        }
      }
    },
    toggleVoiceMode() {
      if (!this.voiceMode) {
        common_vendor.index.authorize({
          scope: "scope.record",
          success: () => {
            this.voiceMode = true;
          },
          fail: () => {
            common_vendor.index.showToast({ title: "请允许麦克风权限", icon: "none" });
          }
        });
      } else {
        this.voiceMode = false;
      }
    },
    startVoice(e) {
      if (this.isRecording)
        return;
      this.willCancel = false;
      this.voiceStartY = e.touches[0].clientY;
      this.recognizedText = "";
      this.voicePath = "";
      this.isRecording = true;
      try {
        const manager = common_vendor.index.getRecorderManager();
        if (manager) {
          manager.start({
            duration: 6e4,
            sampleRate: 16e3,
            numberOfChannels: 1,
            encodeBitRate: 48e3,
            format: "mp3"
          });
        } else {
          this.isRecording = false;
          common_vendor.index.showToast({ title: "当前环境不支持语音", icon: "none" });
        }
      } catch (err) {
        this.isRecording = false;
        common_vendor.index.showToast({ title: "当前环境不支持语音", icon: "none" });
      }
    },
    stopVoice() {
      if (!this.isRecording)
        return;
      const cancelled = this.willCancel;
      this.isRecording = false;
      this.willCancel = false;
      try {
        const manager = common_vendor.index.getRecorderManager();
        if (manager) {
          manager.stop();
          if (cancelled) {
            common_vendor.index.showToast({ title: "已取消", icon: "none" });
          }
        }
      } catch (e) {
      }
    },
    moveVoice(e) {
      if (!this.isRecording)
        return;
      const moveY = e.touches[0].clientY;
      if (this.voiceStartY - moveY > 60) {
        this.willCancel = true;
      } else {
        this.willCancel = false;
      }
    },
    recognizeSpeech(tempFilePath) {
      this.inputText = "";
      this.recognizedText = "正在识别...";
      common_vendor.index.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: "base64",
        success: (res) => {
          try {
            const plugin = requirePlugin("WechatSI");
            if (plugin && plugin.translate) {
              plugin.translate({
                from: "zh_CN",
                to: "zh_CN",
                audio: { data: res.data, sampleRate: 16e3 },
                success: (r) => {
                  if (r.result) {
                    this.recognizedText = r.result;
                    this.inputText = r.result;
                  }
                },
                fail: (err) => {
                  common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:418", "微信语音识别失败", err);
                  this.fallbackSpeechToText(tempFilePath);
                }
              });
              return;
            }
          } catch (e) {
            common_vendor.index.__f__("log", "at subpackages/student/pages/home/index.vue:425", "WechatSI插件不可用，使用后端识别");
          }
          this.fallbackSpeechToText(tempFilePath);
        },
        fail: () => {
          this.fallbackSpeechToText(tempFilePath);
        }
      });
    },
    async fallbackSpeechToText(tempFilePath) {
      try {
        const res = await common_utils_request.api.speechToText(tempFilePath);
        if (res && res.text) {
          this.recognizedText = res.text;
          this.inputText = res.text;
        } else {
          this.recognizedText = "";
          common_vendor.index.showToast({ title: "识别失败，请手动输入", icon: "none" });
        }
      } catch (e) {
        this.recognizedText = "";
        common_vendor.index.showToast({ title: "识别失败，请手动输入", icon: "none" });
      }
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
    },
    goNotices() {
      common_vendor.index.navigateTo({ url: "/subpackages/student/pages/services/notices/index" });
    },
    goServices() {
      common_vendor.index.navigateTo({ url: "/subpackages/student/pages/services/index" });
    },
    goProfile() {
      common_vendor.index.navigateTo({ url: "/subpackages/profile/pages/student/index" });
    },
    startLeaveFlow(text) {
      this.leaveState = "askType";
      this.leaveForm = { type: "", reason: "", startTime: "", endTime: "" };
      this.messages.push({ role: "user", content: text || "请假", time: Date.now() });
      this.messages.push({
        role: "ai",
        content: "请问您要请什么类型的假？",
        loading: false,
        liked: false,
        disliked: false,
        time: Date.now(),
        extra: {
          buttons: [
            { label: "事假", value: "事假" },
            { label: "病假", value: "病假" }
          ]
        }
      });
    },
    onExtraBtn(msg, btn) {
      if (this.leaveState === "askType") {
        this.onLeaveType(btn.value);
      } else if (this.leaveState === "confirm") {
        if (btn.value === "confirm") {
          this.onLeaveConfirm();
        } else {
          this.onLeaveCancel();
        }
      }
    },
    onLeaveType(type) {
      this.leaveForm.type = type;
      this.leaveState = "askReason";
      this.messages.forEach((m) => {
        if (m.extra && m.extra.buttons && !m.answered)
          m.answered = true;
      });
      this.messages.push({ role: "user", content: type, time: Date.now() });
      this.messages.push({
        role: "ai",
        content: "请说明请假原因：",
        loading: false,
        liked: false,
        disliked: false,
        time: Date.now()
      });
      this.inputText = "";
    },
    onLeaveReason(reason) {
      this.leaveForm.reason = reason;
      this.leaveState = "askTime";
      this.pendingDateField = "startTime";
      this.messages.push({ role: "user", content: reason, time: Date.now() });
      this.messages.push({
        role: "ai",
        content: "请选择请假开始日期：",
        loading: false,
        liked: false,
        disliked: false,
        time: Date.now(),
        extra: {
          isDatePicker: true,
          dateField: "startTime",
          dateLabel: "开始日期"
        }
      });
      this.inputText = "";
    },
    onLeaveDate(e, field) {
      const date = e.detail.value;
      this.leaveForm[field] = date;
      this.messages.forEach((m) => {
        if (m.extra && m.extra.isDatePicker && m.extra.dateField === field && !m.answered)
          m.answered = true;
      });
      this.messages.push({ role: "user", content: date, time: Date.now() });
      if (field === "startTime") {
        this.pendingDateField = "endTime";
        this.messages.push({
          role: "ai",
          content: "请选择请假结束日期：",
          loading: false,
          liked: false,
          disliked: false,
          time: Date.now(),
          extra: {
            isDatePicker: true,
            dateField: "endTime",
            dateLabel: "结束日期"
          }
        });
      } else {
        this.leaveState = "confirm";
        this.messages.push({
          role: "ai",
          content: "请假信息确认：\n类型：" + this.leaveForm.type + "\n原因：" + this.leaveForm.reason + "\n时间：" + this.leaveForm.startTime + " 至 " + this.leaveForm.endTime,
          loading: false,
          liked: false,
          disliked: false,
          time: Date.now(),
          extra: {
            buttons: [
              { label: "确认提交", value: "confirm" },
              { label: "取消", value: "cancel" }
            ]
          }
        });
      }
    },
    onDateColumnChange(e, msg) {
    },
    onDateConfirm(e, msg) {
      if (msg.extra && msg.extra.dateField) {
        this.onLeaveDate(e, msg.extra.dateField);
      }
    },
    async onLeaveConfirm() {
      this.messages.forEach((m) => {
        if (m.extra && m.extra.buttons && !m.answered)
          m.answered = true;
      });
      this.messages.push({ role: "user", content: "确认提交", time: Date.now() });
      try {
        const res = await common_utils_request.api.submitLeave({
          leaveType: this.leaveForm.type,
          reason: this.leaveForm.reason,
          startTime: this.leaveForm.startTime,
          endTime: this.leaveForm.endTime
        });
        if (res) {
          this.messages.push({
            role: "ai",
            content: "请假申请已提交，请等待辅导员审批。",
            loading: false,
            liked: false,
            disliked: false,
            time: Date.now()
          });
        } else {
          this.messages.push({
            role: "ai",
            content: "请假申请提交失败：" + (res.msg || "未知错误"),
            loading: false,
            liked: false,
            disliked: false,
            time: Date.now()
          });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:616", "提交请假失败", e);
        this.messages.push({
          role: "ai",
          content: "网络异常，请假申请提交失败，请重试。",
          loading: false,
          liked: false,
          disliked: false,
          time: Date.now()
        });
      }
      this.leaveState = "idle";
      this.showTransfer = true;
    },
    onLeaveCancel() {
      this.messages.forEach((m) => {
        if (m.extra && m.extra.buttons && !m.answered)
          m.answered = true;
      });
      this.messages.push({ role: "user", content: "取消", time: Date.now() });
      this.messages.push({
        role: "ai",
        content: "已取消请假申请，有其他问题可以继续问我。",
        loading: false,
        liked: false,
        disliked: false,
        time: Date.now()
      });
      this.leaveState = "idle";
    },
    formatDateDisplay(d) {
      if (!d)
        return "";
      return d.replace(/\//g, "-");
    },
    initDigitalHuman() {
    },
    destroyDigitalHuman() {
    },
    async dhSpeak(text) {
      if (!text)
        return;
      try {
        await common_utils_request.api.digitalHumanSpeak({ sessionId: "0", text, interrupt: true });
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:655", "数字人播报失败", e);
      }
    },
    async dhInterrupt() {
      try {
        await common_utils_request.api.digitalHumanInterrupt({ sessionId: "0" });
      } catch (e) {
      }
    },
    async loadData() {
      try {
        const res = await common_utils_request.api.getStudentHome();
        if (res) {
          if (res.quickTags && res.quickTags.length > 0) {
            this.quickTags = res.quickTags;
          }
          if (res.recentSessionId) {
            this.sessionId = res.recentSessionId;
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:675", "加载首页数据失败", e);
      }
      try {
        const res = await common_utils_request.api.getNotices({ page: 1, pageSize: 20 });
        if (res) {
          this.announcements = (res.notices || res.list || []).map((item) => ({
            id: item.id,
            title: item.title,
            time: item.createTime ? item.createTime.substring(5, 10) : "",
            read: item.read
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:688", "加载通知失败", e);
      }
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
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:709", "加载会话详情失败", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goServices && $options.goServices(...args)),
    c: common_vendor.o((...args) => $options.goNotices && $options.goNotices(...args)),
    d: common_vendor.o((...args) => $options.goProfile && $options.goProfile(...args)),
    e: $data.actionsRight + "px",
    f: $data.messages.length === 0
  }, $data.messages.length === 0 ? {} : {}, {
    g: $data.messages.length > 0
  }, $data.messages.length > 0 ? {} : {}, {
    h: common_vendor.f($options.lastMessages, (msg, i, i0) => {
      return common_vendor.e({
        a: msg.role === "ai"
      }, msg.role === "ai" ? {} : {}, {
        b: common_vendor.t(msg.content),
        c: msg.source && msg.role === "ai"
      }, msg.source && msg.role === "ai" ? {
        d: common_vendor.t(msg.source)
      } : {}, {
        e: msg.extra && msg.extra.buttons && !msg.answered
      }, msg.extra && msg.extra.buttons && !msg.answered ? {
        f: common_vendor.f(msg.extra.buttons, (btn, bi, i1) => {
          return {
            a: common_vendor.t(btn.label),
            b: bi,
            c: common_vendor.o(($event) => $options.onExtraBtn(msg, btn), bi)
          };
        })
      } : {}, {
        g: msg.extra && msg.extra.isDatePicker && !msg.answered
      }, msg.extra && msg.extra.isDatePicker && !msg.answered ? {
        h: common_vendor.t(msg.extra.dateLabel || "选择日期时间"),
        i: msg.extra.pickerColumns,
        j: msg.extra.pickerValue,
        k: common_vendor.o(($event) => $options.onDateColumnChange($event, msg), i),
        l: common_vendor.o(($event) => $options.onDateConfirm($event, msg), i)
      } : {}, {
        m: msg.role === "ai" && !msg.loading && !msg.extra
      }, msg.role === "ai" && !msg.loading && !msg.extra ? {
        n: msg.liked ? 1 : "",
        o: common_vendor.o(($event) => $options.likeMsg(msg), i),
        p: msg.disliked ? 1 : "",
        q: common_vendor.o(($event) => $options.dislikeMsg(msg), i)
      } : {}, {
        r: msg.loading
      }, msg.loading ? {} : {}, {
        s: msg.role === "user" ? 1 : "",
        t: msg.role === "user"
      }, msg.role === "user" ? {} : {}, {
        v: i,
        w: msg.role === "user" ? 1 : ""
      });
    }),
    i: $data.showTransfer
  }, $data.showTransfer ? {
    j: common_vendor.o((...args) => $options.transferToHuman && $options.transferToHuman(...args))
  } : {}, {
    k: $data.scrollIntoView,
    l: common_vendor.o((...args) => $options.onChatScroll && $options.onChatScroll(...args)),
    m: $data.showScrollBtn
  }, $data.showScrollBtn ? {
    n: common_vendor.o((...args) => $options.scrollToBottom && $options.scrollToBottom(...args))
  } : {}, {
    o: common_vendor.f($data.quickTags, (tag, i, i0) => {
      return {
        a: common_vendor.t(tag),
        b: i,
        c: common_vendor.o(($event) => $options.sendQuick(tag), i)
      };
    }),
    p: $data.voiceMode ? "/static/jianpan.svg" : "/static/saying.svg",
    q: common_vendor.o((...args) => $options.toggleVoiceMode && $options.toggleVoiceMode(...args)),
    r: !$data.voiceMode
  }, !$data.voiceMode ? {
    s: $options.leavePlaceholder,
    t: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    v: $data.inputText,
    w: common_vendor.o(($event) => $data.inputText = $event.detail.value)
  } : {
    x: common_vendor.t($data.isRecording ? $data.willCancel ? "松开取消" : "松开发送" : "按住说话"),
    y: $data.isRecording ? 1 : "",
    z: $data.willCancel ? 1 : "",
    A: common_vendor.o((...args) => $options.startVoice && $options.startVoice(...args)),
    B: common_vendor.o((...args) => $options.moveVoice && $options.moveVoice(...args)),
    C: common_vendor.o((...args) => $options.stopVoice && $options.stopVoice(...args))
  }, {
    D: !$data.voiceMode
  }, !$data.voiceMode ? {
    E: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    F: $data.inputText.trim() ? 1 : ""
  } : {}, {
    G: $data.isRecording
  }, $data.isRecording ? common_vendor.e({
    H: common_vendor.f(5, (n, k0, i0) => {
      return {
        a: n
      };
    }),
    I: common_vendor.t($data.willCancel ? "松开取消" : "正在识别..."),
    J: $data.recognizedText
  }, $data.recognizedText ? {
    K: common_vendor.t($data.recognizedText)
  } : {}, {
    L: common_vendor.t($data.willCancel ? "松开取消发送" : "上滑取消发送"),
    M: $data.willCancel ? 1 : ""
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ec17f086"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/student/pages/home/index.js.map
