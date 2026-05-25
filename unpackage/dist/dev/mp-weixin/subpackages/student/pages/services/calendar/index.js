"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
      currentMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      semesterName: "",
      semesterDateRange: "",
      events: []
    };
  },
  computed: {
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth - 1;
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      const today = /* @__PURE__ */ new Date();
      const days = [];
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: daysInPrevMonth - i, current: false, isToday: false });
      }
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const evt = this.events.find((e) => e.date === dateStr);
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i;
        days.push({
          day: i,
          current: true,
          isToday,
          date: dateStr,
          event: evt ? evt.title : null,
          type: evt ? evt.type : null
        });
      }
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, current: false, isToday: false });
      }
      return days;
    },
    todayEvents() {
      const today = /* @__PURE__ */ new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      return this.events.filter((e) => e.date === dateStr).map((e) => this.formatEvent(e));
    },
    monthEvents() {
      const prefix = `${this.currentYear}-${String(this.currentMonth).padStart(2, "0")}`;
      return this.events.filter((e) => e.date && e.date.startsWith(prefix)).map((e) => {
        const formatted = this.formatEvent(e);
        const day = parseInt(e.date.split("-")[2]);
        return { ...formatted, dateLabel: `${this.currentMonth}月${day}日` };
      });
    }
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
        const res = await common_utils_request.api.getCalendar();
        if (res) {
          this.semesterName = res.semesterName || res.semester || "";
          this.semesterDateRange = res.dateRange || "";
          this.events = (res.events || res.items || []).map((item) => ({
            date: item.date,
            title: item.title,
            type: item.type || "default",
            desc: item.description || item.desc || ""
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/calendar/index.vue:180", "加载校历失败", e);
      }
      this.loading = false;
    },
    formatEvent(evt) {
      const typeMap = {
        holiday: { tag: "假期", tagBg: "#E8F8E8", tagColor: "#4CD964", dotColor: "#4CD964" },
        exam: { tag: "考试", tagBg: "#FFE8E8", tagColor: "#DD524D", dotColor: "#DD524D" },
        event: { tag: "活动", tagBg: "#E8F4FD", tagColor: "#4A90D9", dotColor: "#4A90D9" },
        register: { tag: "注册", tagBg: "#FFF3E0", tagColor: "#F0AD4E", dotColor: "#F0AD4E" },
        default: { tag: "日程", tagBg: "#F3E8FD", tagColor: "#9B59B6", dotColor: "#9B59B6" }
      };
      const info = typeMap[evt.type] || typeMap.default;
      return { ...evt, ...info };
    },
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    onDayClick(day) {
      if (!day.current || !day.event)
        return;
      common_vendor.index.showToast({ title: day.event, icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: $data.semesterName
  }, $data.semesterName ? {
    d: common_vendor.t($data.semesterName),
    e: common_vendor.t($data.semesterDateRange)
  } : {}, {
    f: common_vendor.o((...args) => $options.prevMonth && $options.prevMonth(...args)),
    g: common_vendor.t($data.currentYear),
    h: common_vendor.t($data.currentMonth),
    i: common_vendor.o((...args) => $options.nextMonth && $options.nextMonth(...args)),
    j: common_vendor.f($data.weekdays, (d, k0, i0) => {
      return {
        a: common_vendor.t(d),
        b: d
      };
    }),
    k: common_vendor.f($options.calendarDays, (day, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day),
        b: day.event
      }, day.event ? {} : {}, {
        c: i,
        d: !day.current ? 1 : "",
        e: day.isToday ? 1 : "",
        f: day.event ? 1 : "",
        g: day.type === "holiday" ? 1 : "",
        h: day.type === "exam" ? 1 : "",
        i: common_vendor.o(($event) => $options.onDayClick(day), i)
      });
    }),
    l: $options.todayEvents.length > 0
  }, $options.todayEvents.length > 0 ? {
    m: common_vendor.f($options.todayEvents, (evt, i, i0) => {
      return {
        a: common_vendor.t(evt.tag),
        b: evt.tagBg,
        c: evt.tagColor,
        d: common_vendor.t(evt.title),
        e: i
      };
    })
  } : {}, {
    n: common_vendor.t($data.currentMonth),
    o: common_vendor.f($options.monthEvents, (evt, i, i0) => {
      return common_vendor.e({
        a: evt.dotColor,
        b: i < $options.monthEvents.length - 1
      }, i < $options.monthEvents.length - 1 ? {} : {}, {
        c: common_vendor.t(evt.dateLabel),
        d: common_vendor.t(evt.tag),
        e: evt.tagBg,
        f: evt.tagColor,
        g: common_vendor.t(evt.title),
        h: evt.desc
      }, evt.desc ? {
        i: common_vendor.t(evt.desc)
      } : {}, {
        j: i
      });
    }),
    p: $options.monthEvents.length === 0 && !$data.loading
  }, $options.monthEvents.length === 0 && !$data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-43a095b1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/calendar/index.js.map
