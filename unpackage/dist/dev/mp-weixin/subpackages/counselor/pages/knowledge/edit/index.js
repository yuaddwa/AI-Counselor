"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
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
      categories: []
    };
  },
  computed: {
    categoryNames() {
      return this.categories.map((c) => c.name);
    }
  },
  onLoad(options) {
    this.loadCategories();
    if (options.id) {
      this.form.id = options.id;
      this.loadDetail(options.id);
      common_vendor.index.setNavigationBarTitle({ title: "编辑知识库" });
    } else {
      common_vendor.index.setNavigationBarTitle({ title: "新建知识库" });
    }
  },
  methods: {
    async loadCategories() {
      try {
        const res = await common_utils_request.api.getKnowledgeCategories();
        const list = res.list || res || [];
        if (list.length) {
          this.categories = list;
        }
      } catch (e) {
      }
    },
    async loadDetail(id) {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        const res = await common_utils_request.api.getKnowledgeList({ id });
        const list = res;
        const item = Array.isArray(list) ? list.find((k) => k.id == id) : list;
        if (item) {
          this.form.title = item.title || "";
          this.form.content = item.content || "";
          this.form.categoryId = item.categoryId || item.category || "";
          const cat = this.categories.find((c) => c.id == this.form.categoryId);
          if (cat) {
            this.form.categoryName = cat.name;
          }
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
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
      this.doSave();
    },
    async doSave() {
      common_vendor.index.showLoading({ title: "保存中..." });
      try {
        await common_utils_request.api.saveKnowledge({
          title: this.form.title,
          content: this.form.content,
          category: this.form.categoryId
        });
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: e.msg || "保存失败", icon: "none" });
      }
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
