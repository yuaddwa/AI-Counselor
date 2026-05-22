"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      centerLat: 39.908823,
      centerLng: 116.39747,
      keyword: "",
      activePoi: -1,
      pois: [
        { name: "图书馆", category: "教学设施", icon: "", color: "#E8F4FD", lat: 39.909223, lng: 116.39707 },
        { name: "第一食堂", category: "餐饮", icon: "", color: "#FFF3E0", lat: 39.908523, lng: 116.39787 },
        { name: "第二食堂", category: "餐饮", icon: "", color: "#FFF3E0", lat: 39.908023, lng: 116.39657 },
        { name: "校医院", category: "医疗", icon: "", color: "#FFE8E8", lat: 39.909523, lng: 116.39827 },
        { name: "体育馆", category: "运动设施", icon: "", color: "#E8F8E8", lat: 39.908723, lng: 116.39607 },
        { name: "快递驿站", category: "服务", icon: "", color: "#F3E8FD", lat: 39.907823, lng: 116.39727 },
        { name: "行政楼", category: "办公", icon: "", color: "#EEF4FB", lat: 39.909423, lng: 116.39657 },
        { name: "学生宿舍1号楼", category: "宿舍", icon: "", color: "#FFF8E0", lat: 39.908123, lng: 116.39837 }
      ]
    };
  },
  computed: {
    markers() {
      return this.pois.map((poi, i) => ({
        id: i,
        latitude: poi.lat,
        longitude: poi.lng,
        title: poi.name,
        width: 30,
        height: 30
      }));
    },
    filteredPois() {
      if (!this.keyword)
        return this.pois;
      return this.pois.filter((p) => p.name.includes(this.keyword) || p.category.includes(this.keyword));
    }
  },
  methods: {
    onSearch() {
    },
    focusPoi(poi) {
      this.centerLat = poi.lat;
      this.centerLng = poi.lng;
      this.activePoi = this.pois.indexOf(poi);
    },
    onMarkerTap(e) {
      const poi = this.pois[e.detail.markerId];
      if (poi)
        this.focusPoi(poi);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.centerLat,
    b: $data.centerLng,
    c: $options.markers,
    d: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    e: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onSearch && $options.onSearch(...args)]),
    f: $data.keyword,
    g: common_vendor.f($options.filteredPois, (poi, i, i0) => {
      return {
        a: common_vendor.t(poi.icon),
        b: poi.color,
        c: common_vendor.t(poi.name),
        d: common_vendor.t(poi.category),
        e: i,
        f: common_vendor.o(($event) => $options.focusPoi(poi), i),
        g: $data.activePoi === i ? 1 : ""
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9b7f27d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/campus-map/index.js.map
