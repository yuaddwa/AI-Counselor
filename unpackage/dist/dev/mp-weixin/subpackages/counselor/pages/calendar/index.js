"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const TYPE_CONFIG = {
  holiday: { label: "假期", color: "#4CD964", bg: "#E8F8E8" },
  exam: { label: "考试", color: "#DD524D", bg: "#FFE8E8" },
  event: { label: "活动", color: "#4A90D9", bg: "#E8F4FD" },
  register: { label: "注册", color: "#F0AD4E", bg: "#FFF3E0" },
  default: { label: "日程", color: "#9B59B6", bg: "#F3E8FD" }
};
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      semesterName: "",
      semesterDateRange: "",
      events: [],
      showAddEvent: false,
      typeOptions: [
        { label: "假期", value: "holiday" },
        { label: "考试", value: "exam" },
        { label: "活动", value: "event" },
        { label: "注册", value: "register" },
        { label: "其他", value: "default" }
      ],
      eventForm: {
        type: "event",
        date: "",
        title: "",
        desc: ""
      }
    };
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.loadData();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadData() {
      this.loading = true;
      try {
        const res = await common_utils_request.api.getCounselorCalendar();
        if (res) {
          this.semesterName = res.semesterName || res.semester || "";
          this.semesterDateRange = res.dateRange || "";
          this.events = (res.events || res.items || []).map((item) => ({
            id: item.id,
            date: item.date,
            title: item.title,
            type: item.type || "default",
            desc: item.description || item.desc || ""
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/calendar/index.vue:169", "加载校历失败", e);
      }
      this.loading = false;
    },
    getTypeLabel(type) {
      return (TYPE_CONFIG[type] || TYPE_CONFIG.default).label;
    },
    getTypeColor(type) {
      return (TYPE_CONFIG[type] || TYPE_CONFIG.default).color;
    },
    getTypeBg(type) {
      return (TYPE_CONFIG[type] || TYPE_CONFIG.default).bg;
    },
    onDateChange(e) {
      this.eventForm.date = e.detail.value;
    },
    async submitEvent() {
      if (!this.eventForm.date) {
        common_vendor.index.showToast({ title: "请选择日期", icon: "none" });
        return;
      }
      if (!this.eventForm.title.trim()) {
        common_vendor.index.showToast({ title: "请输入标题", icon: "none" });
        return;
      }
      try {
        await common_utils_request.api.addCalendarEvent({
          type: this.eventForm.type,
          date: this.eventForm.date,
          title: this.eventForm.title,
          description: this.eventForm.desc
        });
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
        this.showAddEvent = false;
        this.eventForm = { type: "event", date: "", title: "", desc: "" };
        this.loadData();
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "添加失败", icon: "none" });
      }
    },
    deleteEvent(evt, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定删除"${evt.title}"？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.deleteCalendarEvent(evt.id);
              this.events.splice(index, 1);
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
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
    c: common_vendor.o(($event) => $data.showAddEvent = true),
    d: $data.semesterName
  }, $data.semesterName ? {
    e: common_vendor.t($data.semesterName),
    f: common_vendor.t($data.semesterDateRange)
  } : {}, {
    g: common_vendor.t($data.events.length),
    h: common_vendor.f($data.events, (evt, i, i0) => {
      return common_vendor.e({
        a: $options.getTypeColor(evt.type),
        b: common_vendor.t(evt.date),
        c: common_vendor.t(evt.title),
        d: evt.desc
      }, evt.desc ? {
        e: common_vendor.t(evt.desc)
      } : {}, {
        f: common_vendor.t($options.getTypeLabel(evt.type)),
        g: $options.getTypeBg(evt.type),
        h: $options.getTypeColor(evt.type),
        i: common_vendor.o(($event) => $options.deleteEvent(evt, i), i),
        j: i
      });
    }),
    i: $data.events.length === 0 && !$data.loading
  }, $data.events.length === 0 && !$data.loading ? {
    j: common_vendor.p({
      text: "暂无日程事件"
    })
  } : {}, {
    k: $data.showAddEvent
  }, $data.showAddEvent ? {
    l: common_vendor.f($data.typeOptions, (t, k0, i0) => {
      return {
        a: common_vendor.t(t.label),
        b: t.value,
        c: $data.eventForm.type === t.value ? 1 : "",
        d: common_vendor.o(($event) => $data.eventForm.type = t.value, t.value)
      };
    }),
    m: common_vendor.t($data.eventForm.date || "选择日期"),
    n: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    o: $data.eventForm.title,
    p: common_vendor.o(($event) => $data.eventForm.title = $event.detail.value),
    q: $data.eventForm.desc,
    r: common_vendor.o(($event) => $data.eventForm.desc = $event.detail.value),
    s: common_vendor.o(($event) => $data.showAddEvent = false),
    t: common_vendor.o((...args) => $options.submitEvent && $options.submitEvent(...args)),
    v: common_vendor.o(() => {
    }),
    w: common_vendor.o(($event) => $data.showAddEvent = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dda8ce9a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/calendar/index.js.map
