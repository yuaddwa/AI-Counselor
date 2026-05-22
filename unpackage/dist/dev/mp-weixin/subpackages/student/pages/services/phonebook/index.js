"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      groups: [
        {
          category: "职能部门",
          items: [
            { name: "教务处", phone: "010-88880001" },
            { name: "学生处", phone: "010-88880002" },
            { name: "财务处", phone: "010-88880003" },
            { name: "后勤管理处", phone: "010-88880004" },
            { name: "图书馆", phone: "010-88880005" }
          ]
        },
        {
          category: "辅导员",
          items: [
            { name: "张老师（计算机系）", phone: "010-88881001" },
            { name: "李老师（经管系）", phone: "010-88881002" },
            { name: "王老师（外语系）", phone: "010-88881003" }
          ]
        },
        {
          category: "宿管",
          items: [
            { name: "1号楼值班室", phone: "010-88882001" },
            { name: "2号楼值班室", phone: "010-88882002" },
            { name: "3号楼值班室", phone: "010-88882003" }
          ]
        }
      ]
    };
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
