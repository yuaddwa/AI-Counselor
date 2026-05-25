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
      accounts: [],
      subAccounts: [],
      classList: [],
      selectedClass: "",
      classViewMode: true
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
    this.loadClasses();
  },
  onPullDownRefresh() {
    this.loadAccounts();
    this.loadClasses();
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 500);
  },
  methods: {
    loadClasses() {
      common_utils_request.api.getClasses().then((data) => {
        const classes = data.classes || [];
        this.classList = classes.map((c) => ({
          name: c.className,
          count: c.studentCount ?? 0
        }));
        this.updateClassCount();
      }).catch(() => {
      });
    },
    updateClassCount() {
      if (this.classList.length === 0 || this.accounts.length === 0)
        return;
      const countMap = {};
      this.accounts.forEach((a) => {
        if (a.className) {
          countMap[a.className] = (countMap[a.className] || 0) + 1;
        }
      });
      this.classList.forEach((c) => {
        if (countMap[c.name] !== void 0) {
          c.count = countMap[c.name];
        }
      });
    },
    selectClass(cls) {
      this.selectedClass = cls.name;
      this.classViewMode = false;
      this.searchKeyword = cls.name;
    },
    backToClasses() {
      this.classViewMode = true;
      this.selectedClass = "";
      this.searchKeyword = "";
    },
    loadAccounts() {
      common_utils_request.api.getAccounts({ type: "student" }).then((data) => {
        if (data.students) {
          this.accounts = data.students;
          this.updateClassCount();
        }
      }).catch(() => {
      });
      common_utils_request.api.getCounselorSubAccounts().then((data) => {
        if (data.accounts)
          this.subAccounts = data.accounts;
      }).catch(() => {
      });
    },
    downloadTemplate() {
      common_utils_request.api.downloadTemplate().catch((err) => {
        common_vendor.index.__f__("error", "at subpackages/counselor/pages/accounts/index.vue:259", "下载模板失败:", JSON.stringify(err));
        common_vendor.index.showToast({ title: err.msg || "模板下载失败", icon: "none" });
      });
    },
    importExcel() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["xlsx", "xls"],
        success: (res) => {
          const filePath = res.tempFiles[0].path;
          common_vendor.index.__f__("log", "at subpackages/counselor/pages/accounts/index.vue:270", "chooseFile:", filePath);
          this.uploading = true;
          this.uploadProgress = 0;
          common_utils_request.api.batchImportAccounts(filePath).then((data) => {
            this.uploading = false;
            common_vendor.index.showToast({ title: "导入成功", icon: "success" });
            this.loadAccounts();
            this.updateClassCount();
          }).catch((err) => {
            this.uploading = false;
            common_vendor.index.__f__("error", "at subpackages/counselor/pages/accounts/index.vue:280", "导入失败:", JSON.stringify(err));
            common_vendor.index.showToast({ title: err.msg || "导入失败", icon: "none" });
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
        this.updateClassCount();
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
    f: $data.classViewMode
  }, $data.classViewMode ? common_vendor.e({
    g: common_vendor.o(($event) => $data.showAddStudent = true),
    h: common_vendor.o((...args) => $options.downloadTemplate && $options.downloadTemplate(...args)),
    i: common_vendor.o((...args) => $options.importExcel && $options.importExcel(...args)),
    j: common_vendor.f($data.classList, (cls, i, i0) => {
      return {
        a: common_vendor.t(cls.name),
        b: common_vendor.t(cls.count),
        c: i,
        d: common_vendor.o(($event) => $options.selectClass(cls), i)
      };
    }),
    k: $data.classList.length === 0
  }, $data.classList.length === 0 ? {
    l: common_vendor.p({
      text: "暂无班级数据"
    })
  } : {}) : common_vendor.e({
    m: common_vendor.o((...args) => $options.backToClasses && $options.backToClasses(...args)),
    n: common_vendor.t($data.selectedClass),
    o: common_vendor.f($options.filteredAccounts, (acc, i, i0) => {
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
    p: $options.filteredAccounts.length === 0
  }, $options.filteredAccounts.length === 0 ? {
    q: common_vendor.p({
      text: "暂无学生账号"
    })
  } : {})) : {}, {
    r: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    s: common_vendor.o(($event) => $data.showAddCounselor = true),
    t: common_vendor.f($data.subAccounts, (acc, i, i0) => {
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
    v: $data.showAddStudent
  }, $data.showAddStudent ? {
    w: $data.newStudent.studentId,
    x: common_vendor.o(($event) => $data.newStudent.studentId = $event.detail.value),
    y: $data.newStudent.name,
    z: common_vendor.o(($event) => $data.newStudent.name = $event.detail.value),
    A: $data.newStudent.className,
    B: common_vendor.o(($event) => $data.newStudent.className = $event.detail.value),
    C: $data.newStudent.password,
    D: common_vendor.o(($event) => $data.newStudent.password = $event.detail.value),
    E: common_vendor.o(($event) => $data.showAddStudent = false),
    F: common_vendor.o((...args) => $options.addStudent && $options.addStudent(...args)),
    G: common_vendor.o(() => {
    }),
    H: common_vendor.o(($event) => $data.showAddStudent = false)
  } : {}, {
    I: $data.showAddCounselor
  }, $data.showAddCounselor ? {
    J: $data.newCounselor.workId,
    K: common_vendor.o(($event) => $data.newCounselor.workId = $event.detail.value),
    L: $data.newCounselor.name,
    M: common_vendor.o(($event) => $data.newCounselor.name = $event.detail.value),
    N: $data.newCounselor.password,
    O: common_vendor.o(($event) => $data.newCounselor.password = $event.detail.value),
    P: common_vendor.t($data.newCounselor.role || "选择权限"),
    Q: $data.roleOptions,
    R: common_vendor.o((...args) => $options.onRoleChange && $options.onRoleChange(...args)),
    S: common_vendor.o(($event) => $data.showAddCounselor = false),
    T: common_vendor.o((...args) => $options.addCounselor && $options.addCounselor(...args)),
    U: common_vendor.o(() => {
    }),
    V: common_vendor.o(($event) => $data.showAddCounselor = false)
  } : {}, {
    W: $data.showImportResult
  }, $data.showImportResult ? common_vendor.e({
    X: common_vendor.t($data.importResult.success),
    Y: $data.importResult.fail > 0
  }, $data.importResult.fail > 0 ? {
    Z: common_vendor.t($data.importResult.fail)
  } : {}, {
    aa: $data.importResult.errors.length > 0
  }, $data.importResult.errors.length > 0 ? {
    ab: common_vendor.f($data.importResult.errors, (err, i, i0) => {
      return {
        a: common_vendor.t(err),
        b: i
      };
    })
  } : {}, {
    ac: common_vendor.o(($event) => $data.showImportResult = false),
    ad: common_vendor.o(() => {
    }),
    ae: common_vendor.o(($event) => $data.showImportResult = false)
  }) : {}, {
    af: $data.uploading
  }, $data.uploading ? {
    ag: $data.uploadProgress + "%",
    ah: common_vendor.t($data.uploadProgress)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fda82e13"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/subpackages/counselor/pages/accounts/index.js.map
