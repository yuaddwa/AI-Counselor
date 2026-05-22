"use strict";
const common_vendor = require("../../../../common/vendor.js");
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
      categories: [
        { id: "1", name: "新生报到", count: 12 },
        { id: "2", name: "教务管理", count: 25 },
        { id: "3", name: "后勤服务", count: 18 },
        { id: "4", name: "奖助政策", count: 15 },
        { id: "5", name: "军训指南", count: 8 }
      ],
      items: [
        { id: "1", title: "2026年新生报到全流程指南", categoryId: "1", categoryName: "新生报到", updateTime: "05-20" },
        { id: "2", title: "选课系统操作说明", categoryId: "2", categoryName: "教务管理", updateTime: "05-19" },
        { id: "3", title: "宿舍报修流程及注意事项", categoryId: "3", categoryName: "后勤服务", updateTime: "05-18" },
        { id: "4", title: "国家奖学金评选条件及流程", categoryId: "4", categoryName: "奖助政策", updateTime: "05-17" },
        { id: "5", title: "军训期间注意事项", categoryId: "5", categoryName: "军训指南", updateTime: "05-16" }
      ],
      counselorTabs: [
        { text: "工作台", icon: "", url: "/subpackages/counselor/pages/workspace/index" },
        { text: "知识库", icon: "", url: "/subpackages/counselor/pages/knowledge/index" },
        { text: "工单", icon: "", url: "/subpackages/counselor/pages/orders/index" },
        { text: "数据", icon: "", url: "/subpackages/counselor/pages/data/index" },
        { text: "我的", icon: "", url: "/subpackages/profile/pages/counselor/index" }
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
  },
  methods: {
    onSearch() {
    },
    selectCategory(cat) {
      this.selectedCat = this.selectedCat === cat.id ? "" : cat.id;
    },
    addCategory() {
      this.showAddCat = true;
      this.newCatName = "";
    },
    confirmAddCat() {
      if (!this.newCatName.trim()) {
        common_vendor.index.showToast({ title: "请输入分类名称", icon: "none" });
        return;
      }
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
        success: (res) => {
          if (res.confirm) {
            this.items.splice(index, 1);
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
          }
        }
      });
    },
    importFile() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["pdf", "doc", "docx", "txt"],
        success: (res) => {
          this.uploading = true;
          this.uploadProgress = 0;
          const timer = setInterval(() => {
            this.uploadProgress += 10;
            if (this.uploadProgress >= 100) {
              clearInterval(timer);
              this.uploading = false;
              common_vendor.index.showToast({ title: "导入成功", icon: "success" });
            }
          }, 200);
        }
      });
    },
    testQuery() {
      if (!this.testQuestion.trim()) {
        common_vendor.index.showToast({ title: "请输入测试问题", icon: "none" });
        return;
      }
      this.testResult = `关于"${this.testQuestion}"，根据知识库内容，系统会从相关文档中检索并生成回答。实际回答效果取决于知识库的完善程度。`;
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
    D: common_vendor.o((...args) => $options.confirmAddCat && $options.confirmAddCat(...args)),
    E: common_vendor.o(() => {
    }),
    F: common_vendor.o(($event) => $data.showAddCat = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b3856824"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/knowledge/index.js.map
