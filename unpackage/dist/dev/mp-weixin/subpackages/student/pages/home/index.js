"use strict";
const common_vendor = require("../../../../common/vendor.js");
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
      quickTags: ["新生报到", "宿舍后勤", "缴费", "奖助", "请假", "军训"],
      announcements: [
        { id: 1, title: "2026年秋季学期开学报到须知", time: "05-20", read: false },
        { id: 2, title: "关于国庆节放假安排的通知", time: "05-18", read: false },
        { id: 3, title: "图书馆暑期开放时间调整", time: "05-15", read: true }
      ]
    };
  },
  computed: {
    unreadCount() {
      return this.announcements.filter((a) => !a.read).length;
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
            this.inputText = "[语音消息] 请后端接入语音识别后自动转换文字";
          }
        });
        this.recorderManager.onError((err) => {
          common_vendor.index.__f__("error", "at subpackages/student/pages/home/index.vue:199", "录音失败", err);
          common_vendor.index.showToast({ title: "录音失败，请重试", icon: "none" });
        });
      }
    } catch (e) {
    }
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
      this.messages.push({
        role: "user",
        content: tag,
        time: Date.now()
      });
      const aiMsg = {
        role: "ai",
        content: "",
        source: "新生入学指南",
        loading: true,
        liked: false,
        disliked: false,
        time: Date.now()
      };
      this.messages.push(aiMsg);
      this.inputText = "";
      this.scrollToBottom();
      setTimeout(() => {
        this.activeTag = "";
        const reply = '关于"' + tag + '"的问题，根据学校相关规定：\n\n1. 请携带相关证件到对应部门办理\n2. 办公时间：周一至周五 8:30-17:00\n3. 如需进一步帮助，可联系辅导员\n\n更多详情请查看办事指南或联系人工客服。';
        let index = 0;
        const timer = setInterval(() => {
          if (index < reply.length) {
            aiMsg.content += reply[index];
            index++;
            this.scrollToBottom();
          } else {
            clearInterval(timer);
            aiMsg.loading = false;
            this.showTransfer = true;
          }
        }, 30);
      }, 500);
    },
    sendMessage() {
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
      this.scrollToBottom();
      const aiMsg = {
        role: "ai",
        content: "",
        source: "新生入学指南",
        loading: true,
        liked: false,
        disliked: false,
        time: Date.now()
      };
      this.messages.push(aiMsg);
      this.scrollToBottom();
      const reply = '关于"' + text + '"的问题，根据学校相关规定：\n\n1. 请携带相关证件到对应部门办理\n2. 办公时间：周一至周五 8:30-17:00\n3. 如需进一步帮助，可联系辅导员\n\n更多详情请查看办事指南或联系人工客服。';
      let index = 0;
      const timer = setInterval(() => {
        if (index < reply.length) {
          aiMsg.content += reply[index];
          index++;
          this.scrollToBottom();
        } else {
          clearInterval(timer);
          aiMsg.loading = false;
          this.showTransfer = true;
        }
      }, 30);
    },
    likeMsg(msg) {
      msg.liked = !msg.liked;
      if (msg.liked)
        msg.disliked = false;
    },
    dislikeMsg(msg) {
      msg.disliked = !msg.disliked;
      if (msg.disliked)
        msg.liked = false;
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
      this.scrollToBottom();
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
      this.scrollToBottom();
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
      this.scrollToBottom();
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
      this.scrollToBottom();
    },
    onDateColumnChange(e, msg) {
    },
    onDateConfirm(e, msg) {
      if (msg.extra && msg.extra.dateField) {
        this.onLeaveDate(e, msg.extra.dateField);
      }
    },
    onLeaveConfirm() {
      this.messages.forEach((m) => {
        if (m.extra && m.extra.buttons && !m.answered)
          m.answered = true;
      });
      this.messages.push({ role: "user", content: "确认提交", time: Date.now() });
      try {
        const store = require("@/common/store/index.js").default;
        const userInfo = store.state.userInfo || {};
        store.mutations.addLeaveRequest({
          studentName: userInfo.name || "同学",
          studentId: userInfo.id || "2026001",
          className: userInfo.className || "",
          leaveType: this.leaveForm.type,
          reason: this.leaveForm.reason,
          startTime: this.leaveForm.startTime,
          endTime: this.leaveForm.endTime
        });
      } catch (e) {
      }
      this.messages.push({
        role: "ai",
        content: "请假申请已提交，请等待辅导员审批。",
        loading: false,
        liked: false,
        disliked: false,
        time: Date.now()
      });
      this.leaveState = "idle";
      this.showTransfer = true;
      this.scrollToBottom();
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
      this.scrollToBottom();
    },
    formatDateDisplay(d) {
      if (!d)
        return "";
      return d.replace(/\//g, "-");
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
  }, $data.messages.length === 0 ? {
    g: common_vendor.f($data.quickTags, (tag, i, i0) => {
      return {
        a: common_vendor.t(tag),
        b: $data.activeTag === tag ? 1 : "",
        c: i,
        d: common_vendor.o(($event) => $options.sendQuick(tag), i)
      };
    })
  } : {}, {
    h: common_vendor.f($data.messages, (msg, i, i0) => {
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
    o: $data.messages.length > 0
  }, $data.messages.length > 0 ? {
    p: common_vendor.f($data.quickTags, (tag, i, i0) => {
      return {
        a: common_vendor.t(tag),
        b: i,
        c: common_vendor.o(($event) => $options.sendQuick(tag), i)
      };
    })
  } : {}, {
    q: $data.voiceMode ? "/static/jianpan.svg" : "/static/saying.svg",
    r: common_vendor.o((...args) => $options.toggleVoiceMode && $options.toggleVoiceMode(...args)),
    s: !$data.voiceMode
  }, !$data.voiceMode ? {
    t: $options.leavePlaceholder,
    v: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    w: $data.inputText,
    x: common_vendor.o(($event) => $data.inputText = $event.detail.value)
  } : {
    y: common_vendor.t($data.isRecording ? $data.willCancel ? "松开取消" : "松开发送" : "按住说话"),
    z: $data.isRecording ? 1 : "",
    A: $data.willCancel ? 1 : "",
    B: common_vendor.o((...args) => $options.startVoice && $options.startVoice(...args)),
    C: common_vendor.o((...args) => $options.moveVoice && $options.moveVoice(...args)),
    D: common_vendor.o((...args) => $options.stopVoice && $options.stopVoice(...args))
  }, {
    E: !$data.voiceMode
  }, !$data.voiceMode ? {
    F: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    G: $data.inputText.trim() ? 1 : ""
  } : {}, {
    H: $data.isRecording
  }, $data.isRecording ? common_vendor.e({
    I: common_vendor.f(5, (n, k0, i0) => {
      return {
        a: n
      };
    }),
    J: common_vendor.t($data.willCancel ? "松开取消" : "正在识别..."),
    K: $data.recognizedText
  }, $data.recognizedText ? {
    L: common_vendor.t($data.recognizedText)
  } : {}, {
    M: common_vendor.t($data.willCancel ? "松开取消发送" : "上滑取消发送"),
    N: $data.willCancel ? 1 : ""
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ec17f086"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/student/pages/home/index.js.map
