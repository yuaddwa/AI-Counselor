"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const COLORS = ["#4A90D9", "#4CD964", "#F0AD4E", "#DD524D", "#9B59B6", "#E67E22", "#1ABC9C"];
const SECTION_TIMES = [
  { start: "08:00", end: "08:45", section: "第1节" },
  { start: "08:55", end: "09:40", section: "第2节" },
  { start: "10:00", end: "10:45", section: "第3节" },
  { start: "10:55", end: "11:40", section: "第4节" },
  { start: "14:00", end: "14:45", section: "第5节" },
  { start: "14:55", end: "15:40", section: "第6节" },
  { start: "16:00", end: "16:45", section: "第7节" },
  { start: "16:55", end: "17:40", section: "第8节" },
  { start: "19:00", end: "19:45", section: "第9节" },
  { start: "19:55", end: "20:40", section: "第10节" }
];
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      currentWeek: 1,
      activeDay: (/* @__PURE__ */ new Date()).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date()).getDay() - 1,
      scheduleData: [],
      startDate: ""
    };
  },
  computed: {
    weekDays() {
      const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      const today = /* @__PURE__ */ new Date();
      const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - todayIdx - (this.currentWeek - 1) * 7 + (today.getDay() === 0 ? -6 : 1 - today.getDay()));
      const baseMonday = new Date(today);
      baseMonday.setDate(today.getDate() - todayIdx);
      return dayNames.map((name, i) => {
        const d = new Date(baseMonday);
        d.setDate(baseMonday.getDate() + i + (this.currentWeek - getWeekOfSemester(today, this.startDate)) * 7);
        const hasClass = this.scheduleData.some((c) => c.dayOfWeek === i + 1);
        return {
          name,
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          isToday: i === todayIdx && this.currentWeek === getWeekOfSemester(today, this.startDate),
          hasClass
        };
      });
    },
    dayCourses() {
      const day = this.activeDay + 1;
      return this.scheduleData.filter((c) => c.dayOfWeek === day).map((c, idx) => {
        const sectionIdx = (c.startSection || 1) - 1;
        const timeInfo = SECTION_TIMES[Math.min(sectionIdx, SECTION_TIMES.length - 1)] || SECTION_TIMES[0];
        return {
          name: c.courseName || c.name,
          location: c.location || c.classroom || "",
          teacher: c.teacher || "",
          startTime: c.startTime || timeInfo.start,
          endTime: c.endTime || timeInfo.end,
          section: c.section || timeInfo.section,
          color: COLORS[idx % COLORS.length]
        };
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
        const res = await common_utils_request.api.getSchedule({ week: this.currentWeek });
        if (res) {
          this.scheduleData = res.courses || res.schedule || res.list || [];
          this.startDate = res.startDate || "";
          if (res.currentWeek)
            this.currentWeek = res.currentWeek;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/schedule/index.vue:163", "加载课表失败", e);
      }
      this.loading = false;
    },
    prevWeek() {
      if (this.currentWeek > 1) {
        this.currentWeek--;
        this.loadData();
      }
    },
    nextWeek() {
      if (this.currentWeek < 25) {
        this.currentWeek++;
        this.loadData();
      }
    }
  }
};
function getWeekOfSemester(today, startDate) {
  if (!startDate)
    return 1;
  const start = new Date(startDate);
  const diff = Math.floor((today - start) / (7 * 24 * 60 * 60 * 1e3));
  return Math.max(1, Math.min(25, diff + 1));
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.o((...args) => $options.prevWeek && $options.prevWeek(...args)),
    d: common_vendor.t($data.currentWeek),
    e: common_vendor.o((...args) => $options.nextWeek && $options.nextWeek(...args)),
    f: common_vendor.f($options.weekDays, (day, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.name),
        b: common_vendor.t(day.date),
        c: day.hasClass
      }, day.hasClass ? {} : {}, {
        d: i,
        e: $data.activeDay === i ? 1 : "",
        f: day.isToday ? 1 : "",
        g: common_vendor.o(($event) => $data.activeDay = i, i)
      });
    }),
    g: common_vendor.f($options.dayCourses, (course, i, i0) => {
      return {
        a: common_vendor.t(course.startTime),
        b: common_vendor.t(course.endTime),
        c: common_vendor.t(course.section),
        d: common_vendor.t(course.name),
        e: common_vendor.t(course.location),
        f: common_vendor.t(course.teacher),
        g: i,
        h: course.color
      };
    }),
    h: $options.dayCourses.length === 0 && !$data.loading
  }, $options.dayCourses.length === 0 && !$data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-411084b8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/schedule/index.js.map
