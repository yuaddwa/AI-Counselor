"use strict";
const common_utils_request = require("../../../../../common/utils/request.js");
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      centerLat: 0,
      centerLng: 0,
      keyword: "",
      activePoi: -1,
      pois: []
    };
  },
  created() {
    common_utils_request.api.getCampusMap().then((res) => {
      if (res) {
        const d = res;
        if (d.centerLat)
          this.centerLat = d.centerLat;
        if (d.centerLng)
          this.centerLng = d.centerLng;
        if (d.pois && d.pois.length)
          this.pois = d.pois;
      }
    }).catch(() => {
    });
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
        a: common_vendor.n(poi.icon || "icon-ditu"),
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
