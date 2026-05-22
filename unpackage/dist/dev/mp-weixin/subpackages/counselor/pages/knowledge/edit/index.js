"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        id: "",
        title: "",
        content: "",
        categoryId: "",
        categoryName: ""
      },
      categories: [
        { id: "1", name: "新生报到" },
        { id: "2", name: "教务管理" },
        { id: "3", name: "后勤服务" },
        { id: "4", name: "奖助政策" },
        { id: "5", name: "军训指南" }
      ]
    };
  },
  computed: {
    categoryNames() {
      return this.categories.map((c) => c.name);
    }
  },
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id;
      this.form.title = "2026年新生报到全流程指南";
      this.form.categoryId = "1";
      this.form.categoryName = "新生报到";
      this.form.content = "新生报到详细流程内容...";
      common_vendor.index.setNavigationBarTitle({ title: "编辑知识库" });
    } else {
      common_vendor.index.setNavigationBarTitle({ title: "新建知识库" });
    }
  },
  methods: {
    onCategoryChange(e) {
      const index = e.detail.value;
      this.form.categoryId = this.categories[index].id;
      this.form.categoryName = this.categories[index].name;
    },
    handleSave() {
      if (!this.form.title.trim()) {
        common_vendor.index.showToast({ title: "请输入标题", icon: "none" });
        return;
      }
      if (!this.form.categoryId) {
        common_vendor.index.showToast({ title: "请选择分类", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "保存中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      }, 1e3);
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.form.categoryName || "请选择分类"),
    b: $options.categoryNames,
    c: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    d: $data.form.title,
    e: common_vendor.o(($event) => $data.form.title = $event.detail.value),
    f: $data.form.content,
    g: common_vendor.o(($event) => $data.form.content = $event.detail.value),
    h: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    i: common_vendor.o((...args) => $options.handleSave && $options.handleSave(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97170c64"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/knowledge/edit/index.js.map
