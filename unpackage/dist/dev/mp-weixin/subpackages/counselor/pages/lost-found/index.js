"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      activeFilter: 0,
      filterTabs: [
        { label: "全部", value: "all" },
        { label: "寻物", value: "lost" },
        { label: "招领", value: "found" }
      ],
      items: [],
      page: 1,
      hasMore: true
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
        const type = this.filterTabs[this.activeFilter].value;
        const params = { page: 1, pageSize: 20 };
        if (type !== "all")
          params.type = type;
        const res = await common_utils_request.api.getCounselorLostFound(params);
        if (res) {
          this.items = this.formatItems(res.list || res.items || []);
          this.hasMore = (res.list || res.items || []).length >= 20;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/lost-found/index.vue:113", "加载失物招领失败", e);
      }
      this.loading = false;
    },
    async loadMore() {
      if (this.loading || !this.hasMore)
        return;
      this.page++;
      this.loading = true;
      try {
        const type = this.filterTabs[this.activeFilter].value;
        const params = { page: this.page, pageSize: 20 };
        if (type !== "all")
          params.type = type;
        const res = await common_utils_request.api.getCounselorLostFound(params);
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
        publisher: item.publisher || item.userName || item.studentName || "",
        contact: item.contact || "",
        image: item.image || item.imageUrl || ""
      }));
    },
    switchFilter(i) {
      if (this.activeFilter === i)
        return;
      this.activeFilter = i;
      this.loadData();
    },
    deleteItem(item, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定删除"${item.title}"？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_utils_request.api.deleteCounselorLostFound(item.id);
              this.items.splice(index, 1);
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
            } catch (e) {
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
          }
        }
      });
    },
    previewImage(url) {
      common_vendor.index.previewImage({ urls: [url], current: url });
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
    c: common_vendor.f($data.filterTabs, (tab, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab.label),
        b: $data.activeFilter === i
      }, $data.activeFilter === i ? {} : {}, {
        c: i,
        d: $data.activeFilter === i ? 1 : "",
        e: common_vendor.o(($event) => $options.switchFilter(i), i)
      });
    }),
    d: common_vendor.f($data.items, (item, i, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.type === "found" ? "招领" : "寻物"),
        b: item.type === "found" ? "#E8F8E8" : "#FFE8E8",
        c: common_vendor.t(item.time),
        d: common_vendor.o(($event) => $options.deleteItem(item, i), i),
        e: common_vendor.t(item.title),
        f: common_vendor.t(item.description),
        g: item.location
      }, item.location ? {
        h: common_vendor.t(item.location)
      } : {}, {
        i: item.publisher
      }, item.publisher ? {
        j: common_vendor.t(item.publisher)
      } : {}, {
        k: item.contact
      }, item.contact ? {
        l: common_vendor.t(item.contact)
      } : {}, {
        m: item.image
      }, item.image ? {
        n: item.image,
        o: common_vendor.o(($event) => $options.previewImage(item.image), i)
      } : {}, {
        p: i
      });
    }),
    e: $data.items.length === 0 && !$data.loading
  }, $data.items.length === 0 && !$data.loading ? {
    f: common_vendor.p({
      text: "暂无失物招领信息"
    })
  } : {}, {
    g: $data.loading
  }, $data.loading ? {} : {}, {
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7ec29132"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/lost-found/index.js.map
