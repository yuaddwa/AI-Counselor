"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        title: "",
        content: "",
        scope: "all",
        selectedClasses: []
      },
      scopeOptions: [
        { label: "全体学生", value: "all" },
        { label: "指定班级", value: "class" }
      ],
      classList: ["计算机2601", "计算机2602", "经管2601", "经管2602", "外语2601", "机械2601"]
    };
  },
  methods: {
    toggleClass(cls) {
      const idx = this.form.selectedClasses.indexOf(cls);
      if (idx > -1) {
        this.form.selectedClasses.splice(idx, 1);
      } else {
        this.form.selectedClasses.push(cls);
      }
    },
    saveDraft() {
      if (!this.form.title.trim()) {
        common_vendor.index.showToast({ title: "请输入标题", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "草稿已保存", icon: "success" });
    },
    publish() {
      if (!this.form.title.trim() || !this.form.content.trim()) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      if (this.form.scope === "class" && this.form.selectedClasses.length === 0) {
        common_vendor.index.showToast({ title: "请选择接收班级", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "确认发布",
        content: "确定发布此通知？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "发布中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "发布成功", icon: "success" });
              setTimeout(() => common_vendor.index.navigateBack(), 1500);
            }, 1e3);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.title,
    b: common_vendor.o(($event) => $data.form.title = $event.detail.value),
    c: $data.form.content,
    d: common_vendor.o(($event) => $data.form.content = $event.detail.value),
    e: common_vendor.f($data.scopeOptions, (opt, i, i0) => {
      return {
        a: common_vendor.t(opt.label),
        b: i,
        c: $data.form.scope === opt.value ? 1 : "",
        d: common_vendor.o(($event) => $data.form.scope = opt.value, i)
      };
    }),
    f: $data.form.scope === "class"
  }, $data.form.scope === "class" ? {
    g: common_vendor.f($data.classList, (cls, i, i0) => {
      return {
        a: common_vendor.t(cls),
        b: i,
        c: $data.form.selectedClasses.includes(cls) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleClass(cls), i)
      };
    })
  } : {}, {
    h: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    i: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c9b1cc8b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/notifications/create/index.js.map
