"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      semesters: [],
      currentSemester: "",
      stats: null,
      grades: []
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
    async loadData(semester) {
      this.loading = true;
      try {
        const params = semester ? { semester } : {};
        const res = await common_utils_request.api.getGrades(params);
        if (res) {
          this.semesters = res.semesters || [];
          this.currentSemester = res.currentSemester || (this.semesters.length > 0 ? this.semesters[0] : "");
          this.stats = res.stats || null;
          this.grades = (res.grades || res.list || []).map((item) => ({
            courseName: item.courseName || item.name,
            score: item.score,
            credits: item.credits || item.credit,
            courseType: item.courseType || item.type || "",
            gpa: item.gpa || ""
          }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/grades/index.vue:106", "加载成绩失败", e);
      }
      this.loading = false;
    },
    onSemesterChange(e) {
      const idx = e.detail.value;
      this.currentSemester = this.semesters[idx];
      this.loadData(this.currentSemester);
    },
    getScoreClass(score) {
      if (score >= 90)
        return "excellent";
      if (score >= 80)
        return "good";
      if (score >= 60)
        return "pass";
      return "fail";
    },
    getScoreColor(score) {
      if (score >= 90)
        return "#4CD964";
      if (score >= 80)
        return "#4A90D9";
      if (score >= 60)
        return "#F0AD4E";
      return "#DD524D";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.currentSemester || "选择学期"),
    d: $data.semesters,
    e: common_vendor.o((...args) => $options.onSemesterChange && $options.onSemesterChange(...args)),
    f: $data.stats
  }, $data.stats ? {
    g: common_vendor.t($data.stats.avgGPA || "--"),
    h: common_vendor.t($data.stats.totalCredits || "--"),
    i: common_vendor.t($data.stats.passRate || "--")
  } : {}, {
    j: common_vendor.f($data.grades, (item, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.courseName),
        b: common_vendor.t(item.score),
        c: common_vendor.n($options.getScoreClass(item.score)),
        d: common_vendor.t(item.credits),
        e: common_vendor.t(item.courseType),
        f: item.gpa
      }, item.gpa ? {
        g: common_vendor.t(item.gpa)
      } : {}, {
        h: item.score + "%",
        i: $options.getScoreColor(item.score),
        j: i
      });
    }),
    k: $data.grades.length === 0 && !$data.loading
  }, $data.grades.length === 0 && !$data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c7c4b226"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/grades/index.js.map
