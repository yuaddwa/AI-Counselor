"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const CustomTabbar = () => "../../../../common/components/custom-tabbar.js";
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { CustomTabbar, EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      keyword: "",
      showTest: false,
      showAddCat: false,
      newCatName: "",
      testQuestion: "",
      testResult: "",
      selectedCat: "",
      uploading: false,
      uploadProgress: 0,
      categories: [],
      items: [],
      counselorTabs: [
        { text: "工作台", icon: "icon-gongzuotai", url: "/subpackages/counselor/pages/workspace/index" },
        { text: "知识库", icon: "icon-zhishi", url: "/subpackages/counselor/pages/knowledge/index" },
        { text: "工单", icon: "icon-gongdan", url: "/subpackages/counselor/pages/orders/index" },
        { text: "数据", icon: "icon-shuju", url: "/subpackages/counselor/pages/data/index" },
        { text: "我的", icon: "icon-wode", url: "/subpackages/profile/pages/counselor/index" }
      ]
    };
  },
  computed: {
    filteredItems() {
      let list = this.items;
      if (this.selectedCat) {
        list = list.filter((item) => item.categoryId === this.selectedCat);
      }
      if (this.keyword) {
        list = list.filter((item) => item.title.includes(this.keyword));
      }
      return list;
    }
  },
  created() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const params = {};
        if (this.keyword)
          params.keyword = this.keyword;
        if (this.selectedCat)
          params.categoryId = this.selectedCat;
        const res = await common_utils_request.api.getKnowledgeList(params);
        common_vendor.index.__f__("log", "at subpackages/counselor/pages/knowledge/index.vue:179", "knowledgeList:", JSON.stringify(res));
        if (res) {
          const list = res.items || [];
          this.items = list.map((item) => ({
            id: item.id,
            title: item.title,
            categoryId: item.categoryId,
            categoryName: item.categoryName || "",
            updateTime: item.updateTime ? item.updateTime.substring(5, 10) : ""
          }));
          this.categories = (res.categories || []).map((c) => ({ id: c.id, name: c.name, count: c.count || 0 }));
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/knowledge/index.vue:192", "加载知识库失败", e);
      }
    },
    selectCategory(cat) {
      this.selectedCat = this.selectedCat === cat.id ? "" : cat.id;
    },
    onSearch() {
      this.loadData();
    },
    addCategory() {
      this.categories.push({
        id: Date.now().toString(),
        name: this.newCatName.trim(),
        count: 0
      });
      this.showAddCat = false;
      this.newCatName = "";
      common_vendor.index.showToast({ title: "添加成功", icon: "success" });
    },
    goEdit(item) {
      const url = item ? `/subpackages/counselor/pages/knowledge/edit/index?id=${item.id}` : "/subpackages/counselor/pages/knowledge/edit/index";
      common_vendor.index.navigateTo({ url });
    },
    deleteItem(item, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定删除"${item.title}"？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.deleteKnowledge(item.id);
              this.items.splice(index, 1);
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
          }
        }
      });
    },
    importFile() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["xlsx", "pdf", "doc", "docx", "txt"],
        success: async (res) => {
          this.uploading = true;
          this.uploadProgress = 0;
          try {
            const result = await common_utils_request.api.uploadKnowledgeFile(res.tempFiles[0].path);
            this.uploading = false;
            if (result) {
              common_vendor.index.showToast({ title: "导入成功", icon: "success" });
              this.loadData();
            } else {
              common_vendor.index.showToast({ title: result.msg || "导入失败", icon: "none" });
            }
          } catch (e) {
            this.uploading = false;
            common_vendor.index.showToast({ title: "导入失败", icon: "none" });
          }
        }
      });
    },
    async testQuery() {
      if (!this.testQuestion.trim()) {
        common_vendor.index.showToast({ title: "请输入测试问题", icon: "none" });
        return;
      }
      try {
        const res = await common_utils_request.api.testKnowledge({ question: this.testQuestion });
        if (res) {
          this.testResult = res.answer || "未找到匹配答案";
        } else {
          this.testResult = "测试失败：" + (res.msg || "未知错误");
        }
      } catch (e) {
        this.testResult = "网络异常，请重试";
      }
    },
    onTabChange({ item }) {
      common_vendor.index.reLaunch({ url: item.url });
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  const _component_custom_tabbar = common_vendor.resolveComponent("custom-tabbar");
  (_component_empty_state + _component_custom_tabbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onSearch && $options.onSearch(...args)]),
    c: $data.keyword,
    d: common_vendor.t($data.showTest ? "收起测试" : "检索测试"),
    e: !$data.showTest ? 1 : "",
    f: common_vendor.o(($event) => $data.showTest = !$data.showTest),
    g: $data.showTest
  }, $data.showTest ? common_vendor.e({
    h: $data.testQuestion,
    i: common_vendor.o(($event) => $data.testQuestion = $event.detail.value),
    j: common_vendor.o((...args) => $options.testQuery && $options.testQuery(...args)),
    k: $data.testResult
  }, $data.testResult ? {
    l: common_vendor.t($data.testResult)
  } : {}) : {}, {
    m: common_vendor.o((...args) => $options.addCategory && $options.addCategory(...args)),
    n: common_vendor.f($data.categories, (cat, i, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: common_vendor.t(cat.count),
        c: i,
        d: common_vendor.o(($event) => $options.selectCategory(cat), i),
        e: $data.selectedCat === cat.id ? 1 : ""
      };
    }),
    o: common_vendor.o(($event) => $options.goEdit()),
    p: common_vendor.o((...args) => $options.importFile && $options.importFile(...args)),
    q: common_vendor.f($options.filteredItems, (item, i, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.categoryName),
        c: common_vendor.t(item.updateTime),
        d: common_vendor.o(($event) => $options.goEdit(item), i),
        e: common_vendor.o(($event) => $options.deleteItem(item, i), i),
        f: i
      };
    }),
    r: $options.filteredItems.length === 0
  }, $options.filteredItems.length === 0 ? {
    s: common_vendor.p({
      text: "暂无知识条目"
    })
  } : {}, {
    t: $data.uploading
  }, $data.uploading ? {
    v: $data.uploadProgress + "%",
    w: common_vendor.t($data.uploadProgress)
  } : {}, {
    x: common_vendor.o($options.onTabChange),
    y: common_vendor.p({
      current: 1,
      tabs: $data.counselorTabs
    }),
    z: $data.showAddCat
  }, $data.showAddCat ? {
    A: $data.newCatName,
    B: common_vendor.o(($event) => $data.newCatName = $event.detail.value),
    C: common_vendor.o(($event) => $data.showAddCat = false),
    D: common_vendor.o((...args) => _ctx.confirmAddCat && _ctx.confirmAddCat(...args)),
    E: common_vendor.o(() => {
    }),
    F: common_vendor.o(($event) => $data.showAddCat = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b3856824"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/knowledge/index.js.map
