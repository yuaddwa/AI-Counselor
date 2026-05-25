"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      activeTab: 0,
      tabs: [
        { label: "全部", value: "all" },
        { label: "寻物", value: "lost" },
        { label: "招领", value: "found" }
      ],
      typeOptions: [
        { label: "寻物启事", value: "lost" },
        { label: "拾物招领", value: "found" }
      ],
      items: [],
      page: 1,
      hasMore: true,
      showPublish: false,
      publishForm: {
        type: "lost",
        title: "",
        description: "",
        location: "",
        contact: "",
        image: ""
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
      this.page = 1;
      try {
        const type = this.tabs[this.activeTab].value;
        const params = { page: 1, pageSize: 20 };
        if (type !== "all")
          params.type = type;
        const res = await common_utils_request.api.getLostFound(params);
        if (res) {
          this.items = this.formatItems(res.list || res.items || []);
          this.hasMore = (res.list || res.items || []).length >= 20;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/student/pages/services/lost-found/index.vue:177", "加载失物招领失败", e);
      }
      this.loading = false;
    },
    async loadMore() {
      if (this.loading || !this.hasMore)
        return;
      this.page++;
      this.loading = true;
      try {
        const type = this.tabs[this.activeTab].value;
        const params = { page: this.page, pageSize: 20 };
        if (type !== "all")
          params.type = type;
        const res = await common_utils_request.api.getLostFound(params);
        if (res) {
          const newItems = this.formatItems(res.list || res.items || []);
          this.items = [...this.items, ...newItems];
          this.hasMore = newItems.length >= 20;
        }
      } catch (e) {
      }
      this.loading = false;
    },
    formatItems(list) {
      return list.map((item) => ({
        id: item.id,
        title: item.title || item.name,
        description: item.description || item.desc || "",
        location: item.location || "",
        time: item.time || item.createTime || "",
        type: item.type,
        typeLabel: item.type === "found" ? "招领" : "寻物",
        typeColor: item.type === "found" ? "#E8F8E8" : "#FFE8E8",
        image: item.image || item.imageUrl || ""
      }));
    },
    switchTab(i) {
      if (this.activeTab === i)
        return;
      this.activeTab = i;
      this.loadData();
    },
    goDetail(item) {
      common_vendor.index.showToast({ title: item.title, icon: "none" });
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempPath = res.tempFilePaths[0];
          try {
            const uploadRes = await common_utils_request.api.uploadImage(tempPath);
            if (uploadRes && uploadRes.url) {
              this.publishForm.image = uploadRes.url;
            } else {
              this.publishForm.image = tempPath;
            }
          } catch (e) {
            this.publishForm.image = tempPath;
          }
        }
      });
    },
    async submitPublish() {
      if (!this.publishForm.title.trim()) {
        common_vendor.index.showToast({ title: "请输入物品名称", icon: "none" });
        return;
      }
      if (!this.publishForm.description.trim()) {
        common_vendor.index.showToast({ title: "请输入描述", icon: "none" });
        return;
      }
      try {
        await common_utils_request.api.publishLostFound({
          type: this.publishForm.type,
          title: this.publishForm.title,
          description: this.publishForm.description,
          location: this.publishForm.location,
          contact: this.publishForm.contact,
          image: this.publishForm.image
        });
        common_vendor.index.showToast({ title: "发布成功", icon: "success" });
        this.showPublish = false;
        this.publishForm = { type: "lost", title: "", description: "", location: "", contact: "", image: "" };
        this.loadData();
      } catch (e) {
        common_vendor.index.showToast({ title: e.msg || "发布失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.o(($event) => $data.showPublish = true),
    d: common_vendor.f($data.tabs, (tab, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab.label),
        b: $data.activeTab === i
      }, $data.activeTab === i ? {} : {}, {
        c: i,
        d: $data.activeTab === i ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(i), i)
      });
    }),
    e: common_vendor.f($data.items, (item, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.typeLabel),
        b: item.typeColor,
        c: common_vendor.t(item.title),
        d: common_vendor.t(item.description),
        e: common_vendor.t(item.location),
        f: common_vendor.t(item.time),
        g: item.image
      }, item.image ? {
        h: item.image
      } : {}, {
        i,
        j: common_vendor.o(($event) => $options.goDetail(item), i)
      });
    }),
    f: $data.items.length === 0 && !$data.loading
  }, $data.items.length === 0 && !$data.loading ? {
    g: common_vendor.t($data.tabs[$data.activeTab].label)
  } : {}, {
    h: $data.loading
  }, $data.loading ? {} : {}, {
    i: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    j: $data.showPublish
  }, $data.showPublish ? common_vendor.e({
    k: common_vendor.f($data.typeOptions, (t, k0, i0) => {
      return {
        a: common_vendor.t(t.label),
        b: t.value,
        c: $data.publishForm.type === t.value ? 1 : "",
        d: common_vendor.o(($event) => $data.publishForm.type = t.value, t.value)
      };
    }),
    l: $data.publishForm.title,
    m: common_vendor.o(($event) => $data.publishForm.title = $event.detail.value),
    n: $data.publishForm.description,
    o: common_vendor.o(($event) => $data.publishForm.description = $event.detail.value),
    p: $data.publishForm.location,
    q: common_vendor.o(($event) => $data.publishForm.location = $event.detail.value),
    r: $data.publishForm.contact,
    s: common_vendor.o(($event) => $data.publishForm.contact = $event.detail.value),
    t: $data.publishForm.image
  }, $data.publishForm.image ? {
    v: $data.publishForm.image
  } : {}, {
    w: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    x: common_vendor.o(($event) => $data.showPublish = false),
    y: common_vendor.o((...args) => $options.submitPublish && $options.submitPublish(...args)),
    z: common_vendor.o(() => {
    }),
    A: common_vendor.o(($event) => $data.showPublish = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-583a82c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/lost-found/index.js.map
