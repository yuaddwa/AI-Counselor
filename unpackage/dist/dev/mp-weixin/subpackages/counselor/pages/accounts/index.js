"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_request = require("../../../../common/utils/request.js");
const EmptyState = () => "../../../../common/components/empty-state.js";
const _sfc_main = {
  components: { EmptyState },
  data() {
    return {
      activeTab: 0,
      searchKeyword: "",
      showAddStudent: false,
      showAddCounselor: false,
      showImportResult: false,
      uploading: false,
      uploadProgress: 0,
      newStudent: { studentId: "", name: "", className: "", password: "123456" },
      newCounselor: { workId: "", name: "", password: "", role: "" },
      roleOptions: ["普通辅导员", "高级管理员"],
      importResult: { success: 0, fail: 0, errors: [] },
      accounts: [
        { studentId: "2026001", name: "张同学", className: "计算机2601", loginStatus: true, createTime: "05-15", disabled: false },
        { studentId: "2026002", name: "李同学", className: "计算机2602", loginStatus: false, createTime: "05-15", disabled: false },
        { studentId: "2026003", name: "王同学", className: "经管2601", loginStatus: true, createTime: "05-14", disabled: false },
        { studentId: "2026004", name: "赵同学", className: "外语2601", loginStatus: false, createTime: "05-14", disabled: true }
      ],
      subAccounts: [
        { workId: "T001", name: "李老师", role: "普通辅导员", disabled: false },
        { workId: "T002", name: "王老师", role: "高级管理员", disabled: false }
      ]
    };
  },
  computed: {
    filteredAccounts() {
      if (!this.searchKeyword)
        return this.accounts;
      const kw = this.searchKeyword;
      return this.accounts.filter(
        (a) => a.studentId.includes(kw) || a.name.includes(kw) || a.className.includes(kw)
      );
    }
  },
  created() {
    this.loadAccounts();
  },
  methods: {
    loadAccounts() {
      common_utils_request.api.getAccounts({ type: "student" }).then((data) => {
        if (data.students)
          this.accounts = data.students;
      }).catch(() => {
      });
      common_utils_request.api.getCounselorSubAccounts().then((data) => {
        if (data.accounts)
          this.subAccounts = data.accounts;
      }).catch(() => {
      });
    },
    downloadTemplate() {
      common_utils_request.api.downloadTemplate().catch(() => {
        common_vendor.index.showToast({ title: "模板下载失败", icon: "none" });
      });
    },
    importExcel() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["xlsx", "xls"],
        success: (res) => {
          const filePath = res.tempFiles[0].path;
          this.uploading = true;
          this.uploadProgress = 0;
          common_utils_request.api.batchImportAccounts(filePath).then((data) => {
            this.uploading = false;
            this.importResult = {
              success: data.success || 0,
              fail: data.fail || 0,
              errors: data.errors || []
            };
            this.showImportResult = true;
            this.loadAccounts();
          }).catch(() => {
            this.uploading = false;
            common_vendor.index.showToast({ title: "导入失败", icon: "none" });
          });
        }
      });
    },
    addStudent() {
      if (!this.newStudent.studentId || !this.newStudent.name) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      const data = {
        type: "student",
        studentId: this.newStudent.studentId,
        name: this.newStudent.name,
        className: this.newStudent.className,
        password: this.newStudent.password || "123456"
      };
      common_utils_request.api.addAccount(data).then(() => {
        this.accounts.unshift({
          studentId: data.studentId,
          name: data.name,
          className: data.className,
          loginStatus: false,
          createTime: "刚刚",
          disabled: false
        });
        this.showAddStudent = false;
        this.newStudent = { studentId: "", name: "", className: "", password: "123456" };
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
      }).catch(() => {
        common_vendor.index.showToast({ title: "添加失败", icon: "none" });
      });
    },
    addCounselor() {
      if (!this.newCounselor.workId || !this.newCounselor.name) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      const data = {
        type: "counselor",
        workId: this.newCounselor.workId,
        name: this.newCounselor.name,
        password: this.newCounselor.password,
        role: this.newCounselor.role
      };
      common_utils_request.api.addAccount(data).then(() => {
        this.subAccounts.push({
          workId: data.workId,
          name: data.name,
          role: data.role,
          disabled: false
        });
        this.showAddCounselor = false;
        this.newCounselor = { workId: "", name: "", password: "", role: "" };
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
      }).catch(() => {
        common_vendor.index.showToast({ title: "添加失败", icon: "none" });
      });
    },
    onRoleChange(e) {
      this.newCounselor.role = this.roleOptions[e.detail.value];
    },
    editAccount(acc) {
      common_vendor.index.showToast({ title: "编辑功能", icon: "none" });
    },
    resetPassword(acc) {
      common_vendor.index.showModal({
        title: "重置密码",
        content: "确定将 " + acc.name + " 的密码重置为 123456？",
        success: (res) => {
          if (res.confirm) {
            common_utils_request.api.resetAccountPassword(acc.studentId || acc.workId).then(() => {
              common_vendor.index.showToast({ title: "已重置", icon: "success" });
            }).catch(() => {
              common_vendor.index.showToast({ title: "重置失败", icon: "none" });
            });
          }
        }
      });
    },
    toggleDisable(acc) {
      const newState = !acc.disabled;
      common_utils_request.api.updateAccount({ id: acc.studentId, disabled: newState }).then(() => {
        acc.disabled = newState;
        common_vendor.index.showToast({ title: newState ? "已禁用" : "已启用", icon: "success" });
      }).catch(() => {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      });
    },
    editSubAccount(acc) {
      common_vendor.index.showToast({ title: "编辑权限", icon: "none" });
    },
    toggleSubDisable(acc) {
      const newState = !acc.disabled;
      common_utils_request.api.updateAccount({ id: acc.workId, disabled: newState }).then(() => {
        acc.disabled = newState;
        common_vendor.index.showToast({ title: newState ? "已禁用" : "已启用", icon: "success" });
      }).catch(() => {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      });
    }
  }
};
if (!Array) {
  const _component_empty_state = common_vendor.resolveComponent("empty-state");
  _component_empty_state();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.activeTab === 0 ? 1 : "",
    b: common_vendor.o(($event) => $data.activeTab = 0),
    c: $data.activeTab === 1 ? 1 : "",
    d: common_vendor.o(($event) => $data.activeTab = 1),
    e: $data.activeTab === 0
  }, $data.activeTab === 0 ? common_vendor.e({
    f: common_vendor.o(($event) => $data.showAddStudent = true),
    g: common_vendor.o((...args) => $options.downloadTemplate && $options.downloadTemplate(...args)),
    h: common_vendor.o((...args) => $options.importExcel && $options.importExcel(...args)),
    i: $data.searchKeyword,
    j: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    k: common_vendor.f($options.filteredAccounts, (acc, i, i0) => {
      return {
        a: common_vendor.t(acc.studentId),
        b: common_vendor.t(acc.name),
        c: common_vendor.t(acc.className),
        d: common_vendor.t(acc.loginStatus ? "已登录" : "未登录"),
        e: acc.loginStatus ? 1 : "",
        f: common_vendor.t(acc.createTime),
        g: common_vendor.o(($event) => $options.editAccount(acc), i),
        h: common_vendor.o(($event) => $options.resetPassword(acc), i),
        i: common_vendor.t(acc.disabled ? "启用" : "禁用"),
        j: common_vendor.o(($event) => $options.toggleDisable(acc), i),
        k: i
      };
    }),
    l: $options.filteredAccounts.length === 0
  }, $options.filteredAccounts.length === 0 ? {
    m: common_vendor.p({
      text: "暂无学生账号"
    })
  } : {}) : {}, {
    n: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    o: common_vendor.o(($event) => $data.showAddCounselor = true),
    p: common_vendor.f($data.subAccounts, (acc, i, i0) => {
      return {
        a: common_vendor.t(acc.workId),
        b: common_vendor.t(acc.name),
        c: common_vendor.t(acc.role),
        d: common_vendor.t(acc.disabled ? "已禁用" : "正常"),
        e: !acc.disabled ? 1 : "",
        f: common_vendor.o(($event) => $options.editSubAccount(acc), i),
        g: common_vendor.t(acc.disabled ? "启用" : "禁用"),
        h: common_vendor.o(($event) => $options.toggleSubDisable(acc), i),
        i
      };
    })
  } : {}, {
    q: $data.showAddStudent
  }, $data.showAddStudent ? {
    r: $data.newStudent.studentId,
    s: common_vendor.o(($event) => $data.newStudent.studentId = $event.detail.value),
    t: $data.newStudent.name,
    v: common_vendor.o(($event) => $data.newStudent.name = $event.detail.value),
    w: $data.newStudent.className,
    x: common_vendor.o(($event) => $data.newStudent.className = $event.detail.value),
    y: $data.newStudent.password,
    z: common_vendor.o(($event) => $data.newStudent.password = $event.detail.value),
    A: common_vendor.o(($event) => $data.showAddStudent = false),
    B: common_vendor.o((...args) => $options.addStudent && $options.addStudent(...args)),
    C: common_vendor.o(() => {
    }),
    D: common_vendor.o(($event) => $data.showAddStudent = false)
  } : {}, {
    E: $data.showAddCounselor
  }, $data.showAddCounselor ? {
    F: $data.newCounselor.workId,
    G: common_vendor.o(($event) => $data.newCounselor.workId = $event.detail.value),
    H: $data.newCounselor.name,
    I: common_vendor.o(($event) => $data.newCounselor.name = $event.detail.value),
    J: $data.newCounselor.password,
    K: common_vendor.o(($event) => $data.newCounselor.password = $event.detail.value),
    L: common_vendor.t($data.newCounselor.role || "选择权限"),
    M: $data.roleOptions,
    N: common_vendor.o((...args) => $options.onRoleChange && $options.onRoleChange(...args)),
    O: common_vendor.o(($event) => $data.showAddCounselor = false),
    P: common_vendor.o((...args) => $options.addCounselor && $options.addCounselor(...args)),
    Q: common_vendor.o(() => {
    }),
    R: common_vendor.o(($event) => $data.showAddCounselor = false)
  } : {}, {
    S: $data.showImportResult
  }, $data.showImportResult ? common_vendor.e({
    T: common_vendor.t($data.importResult.success),
    U: $data.importResult.fail > 0
  }, $data.importResult.fail > 0 ? {
    V: common_vendor.t($data.importResult.fail)
  } : {}, {
    W: $data.importResult.errors.length > 0
  }, $data.importResult.errors.length > 0 ? {
    X: common_vendor.f($data.importResult.errors, (err, i, i0) => {
      return {
        a: common_vendor.t(err),
        b: i
      };
    })
  } : {}, {
    Y: common_vendor.o(($event) => $data.showImportResult = false),
    Z: common_vendor.o(() => {
    }),
    aa: common_vendor.o(($event) => $data.showImportResult = false)
  }) : {}, {
    ab: $data.uploading
  }, $data.uploading ? {
    ac: $data.uploadProgress + "%",
    ad: common_vendor.t($data.uploadProgress)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fda82e13"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/accounts/index.js.map
