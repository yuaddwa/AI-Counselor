"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_utils_request = require("../../../../../common/utils/request.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      groups: []
    };
  },
  created() {
    common_utils_request.api.getPhonebook().then((res) => {
      if (res && res.groups && res.groups.length) {
        this.groups = res.groups;
      }
    }).catch(() => {
    });
  },
  computed: {
    filteredGroups() {
      if (!this.keyword)
        return this.groups;
      const kw = this.keyword;
      return this.groups.map((g) => ({
        ...g,
        items: g.items.filter((item) => item.name.includes(kw) || item.phone.includes(kw))
      })).filter((g) => g.items.length > 0);
    }
  },
  methods: {
    callPhone(phone) {
      common_vendor.index.makePhoneCall({ phoneNumber: phone });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.keyword,
    b: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    c: common_vendor.f($options.filteredGroups, (group, gi, i0) => {
      return {
        a: common_vendor.t(group.category),
        b: common_vendor.f(group.items, (item, i, i1) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.phone),
            c: i,
            d: common_vendor.o(($event) => $options.callPhone(item.phone), i)
          };
        }),
        c: gi
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ff83cd5a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/subpackages/student/pages/services/phonebook/index.js.map
