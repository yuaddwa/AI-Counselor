<template>
	<view class="page">
		<scroll-view scroll-y class="scroll-content">
			<!-- Tab切换 -->
			<view class="tab-bar">
				<view
					class="tab-item"
					:class="{ active: activeTab === 0 }"
					@click="activeTab = 0"
				>
					<text>学生账号</text>
				</view>
				<view
					class="tab-item"
					:class="{ active: activeTab === 1 }"
					@click="activeTab = 1"
				>
					<text>辅导员子账号</text>
				</view>
			</view>

			<!-- 学生账号 -->
			<view v-if="activeTab === 0" class="tab-content">
				<!-- 班级列表视图 -->
				<view v-if="classViewMode">
					<view class="action-row">
						<view class="action-btn primary" @click="showAddStudent = true">
							<text>+ 添加账号</text>
						</view>
						<view class="action-btn" @click="downloadTemplate">
							<text>&#128196; 下载模板</text>
						</view>
						<view class="action-btn" @click="importExcel">
							<text>&#128228; 批量导入</text>
						</view>
					</view>
					<view class="class-list">
						<view class="class-row" v-for="(cls, i) in classList" :key="i" @click="selectClass(cls)">
							<text class="class-name">{{ cls.name }}</text>
							<view class="class-right">
								<text class="class-count">{{ cls.count }}人</text>
								<text class="class-arrow">›</text>
							</view>
						</view>
					</view>
					<empty-state v-if="classList.length === 0" text="暂无班级数据" />
				</view>

				<!-- 学生列表视图 -->
				<view v-else>
					<view class="class-nav">
						<view class="back-btn" @click="backToClasses">
							<text class="back-arrow">‹</text>
							<text>全部班级</text>
						</view>
						<text class="current-class">{{ selectedClass }}</text>
					</view>
					<view class="account-list">
						<view class="account-item" v-for="(acc, i) in filteredAccounts" :key="i">
							<view class="acc-main">
								<text class="acc-id">{{ acc.studentId }}</text>
								<text class="acc-name">{{ acc.name }}</text>
								<text class="acc-class">{{ acc.className }}</text>
							</view>
							<view class="acc-meta">
								<text class="acc-status" :class="{ active: acc.loginStatus }">{{ acc.loginStatus ? '已登录' : '未登录' }}</text>
								<text class="acc-time">{{ acc.createTime }}</text>
							</view>
							<view class="acc-actions">
								<view class="acc-action" @click="editAccount(acc)">编辑</view>
								<view class="acc-action warn" @click="resetPassword(acc)">重置密码</view>
								<view class="acc-action" @click="toggleDisable(acc)">{{ acc.disabled ? '启用' : '禁用' }}</view>
							</view>
						</view>
					</view>
					<empty-state v-if="filteredAccounts.length === 0" text="暂无学生账号" />
				</view>
			</view><!-- 辅导员子账号 -->
			<view v-if="activeTab === 1" class="tab-content">
				<view class="action-row">
					<view class="action-btn primary" @click="showAddCounselor = true">
						<text>+ 新增子账号</text>
					</view>
				</view>

				<view class="account-list">
					<view class="account-item" v-for="(acc, i) in subAccounts" :key="i">
						<view class="acc-main">
							<text class="acc-id">{{ acc.workId }}</text>
							<text class="acc-name">{{ acc.name }}</text>
							<text class="acc-class">{{ acc.role }}</text>
						</view>
						<view class="acc-meta">
							<text class="acc-status" :class="{ active: !acc.disabled }">{{ acc.disabled ? '已禁用' : '正常' }}</text>
						</view>
						<view class="acc-actions">
							<view class="acc-action" @click="editSubAccount(acc)">编辑权限</view>
							<view class="acc-action" @click="toggleSubDisable(acc)">{{ acc.disabled ? '启用' : '禁用' }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 添加学生弹窗 -->
		<view class="modal-mask" v-if="showAddStudent" @click="showAddStudent = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">添加学生账号</text>
				<input class="modal-input" v-model="newStudent.studentId" placeholder="学号" />
				<input class="modal-input" v-model="newStudent.name" placeholder="姓名" />
				<input class="modal-input" v-model="newStudent.className" placeholder="班级" />
				<input class="modal-input" v-model="newStudent.password" placeholder="密码（默认123456）" />
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddStudent = false">取消</view>
					<view class="modal-btn confirm" @click="addStudent">确定</view>
				</view>
			</view>
		</view>

		<!-- 添加辅导员弹窗 -->
		<view class="modal-mask" v-if="showAddCounselor" @click="showAddCounselor = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">新增辅导员子账号</text>
				<input class="modal-input" v-model="newCounselor.workId" placeholder="工号" />
				<input class="modal-input" v-model="newCounselor.name" placeholder="姓名" />
				<input class="modal-input" v-model="newCounselor.password" placeholder="密码" />
				<picker :range="roleOptions" @change="onRoleChange">
					<view class="modal-input picker-input">
						<text>{{ newCounselor.role || '选择权限' }}</text>
					</view>
				</picker>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddCounselor = false">取消</view>
					<view class="modal-btn confirm" @click="addCounselor">确定</view>
				</view>
			</view>
		</view>

		<!-- 导入结果弹窗 -->
		<view class="modal-mask" v-if="showImportResult" @click="showImportResult = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">导入结果</text>
				<view class="import-result">
					<text class="result-item success">成功：{{ importResult.success }}条</text>
					<text class="result-item fail" v-if="importResult.fail > 0">失败：{{ importResult.fail }}条</text>
					<view class="result-errors" v-if="importResult.errors.length > 0">
						<text class="error-title">错误明细：</text>
						<text class="error-item" v-for="(err, i) in importResult.errors" :key="i">{{ err }}</text>
					</view>
				</view>
				<view class="modal-btns">
					<view class="modal-btn confirm full" @click="showImportResult = false">确定</view>
				</view>
			</view>
		</view>

		<!-- 上传进度 -->
		<view class="upload-progress" v-if="uploading">
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: uploadProgress + '%' }"></view>
			</view>
			<text class="progress-text">上传中... {{ uploadProgress }}%</text>
		</view>
	</view>
</template>

<script>
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

export default {
	components: { EmptyState },
	data() {
		return {
			activeTab: 0,
			searchKeyword: '',
			showAddStudent: false,
			showAddCounselor: false,
			showImportResult: false,
			uploading: false,
			uploadProgress: 0,
			newStudent: { studentId: '', name: '', className: '', password: '123456' },
			newCounselor: { workId: '', name: '', password: '', role: '' },
			roleOptions: ['普通辅导员', '高级管理员'],
			importResult: { success: 0, fail: 0, errors: [] },
			accounts: [],
			subAccounts: [],
			classList: [],
			selectedClass: '',
			classViewMode: true
		}
	},
	computed: {
		filteredAccounts() {
			if (!this.searchKeyword) return this.accounts
			const kw = this.searchKeyword
			return this.accounts.filter(a =>
				a.studentId.includes(kw) || a.name.includes(kw) || a.className.includes(kw)
			)
		}
	},
	created() {
		this.loadAccounts()
		this.loadClasses()
	},
	onPullDownRefresh() {
		this.loadAccounts()
		this.loadClasses()
		setTimeout(() => { uni.stopPullDownRefresh() }, 500)
	},
	methods: {
		loadClasses() {
			api.getClasses().then(data => {
				const classes = data.classes || []
				this.classList = classes.map(c => ({
					name: c.className,
					count: c.studentCount ?? 0
				}))
				this.updateClassCount()
			}).catch(() => {})
		},
		updateClassCount() {
			if (this.classList.length === 0 || this.accounts.length === 0) return
			const countMap = {}
			this.accounts.forEach(a => {
				if (a.className) {
					countMap[a.className] = (countMap[a.className] || 0) + 1
				}
			})
			this.classList.forEach(c => {
				if (countMap[c.name] !== undefined) {
					c.count = countMap[c.name]
				}
			})
		},
		selectClass(cls) {
			this.selectedClass = cls.name
			this.classViewMode = false
			this.searchKeyword = cls.name
		},
		backToClasses() {
			this.classViewMode = true
			this.selectedClass = ''
			this.searchKeyword = ''
		},
		loadAccounts() {
			api.getAccounts({ type: 'student' }).then(data => {
				if (data.students) {
						this.accounts = data.students
						this.updateClassCount()
					}
			}).catch(() => {})
			api.getCounselorSubAccounts().then(data => {
				if (data.accounts) this.subAccounts = data.accounts
			}).catch(() => {})
		},
		downloadTemplate() {
			api.downloadTemplate().catch((err) => {
				console.error('下载模板失败:', JSON.stringify(err))
				uni.showToast({ title: err.msg || '模板下载失败', icon: 'none' })
			})
		},
		importExcel() {
			uni.chooseMessageFile({
				count: 1,
				type: 'file',
				extension: ['xlsx', 'xls'],
				success: (res) => {
					const filePath = res.tempFiles[0].path
					console.log("chooseFile:", filePath)
					this.uploading = true
					this.uploadProgress = 0
					api.batchImportAccounts(filePath).then(data => {
						this.uploading = false
						uni.showToast({ title: "导入成功", icon: "success" })
						this.loadAccounts()
						this.updateClassCount()
					}).catch((err) => {
						this.uploading = false
						console.error("导入失败:", JSON.stringify(err))
						uni.showToast({ title: err.msg || "导入失败", icon: "none" })
					})
				}
			})
		},
		addStudent() {
			if (!this.newStudent.studentId || !this.newStudent.name) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			const data = {
				type: 'student',
				studentId: this.newStudent.studentId,
				name: this.newStudent.name,
				className: this.newStudent.className,
				password: this.newStudent.password || '123456'
			}
			api.addAccount(data).then(() => {
				this.accounts.unshift({
					studentId: data.studentId,
					name: data.name,
					className: data.className,
					loginStatus: false,
					createTime: '刚刚',
					disabled: false
				})
				this.updateClassCount()
				this.showAddStudent = false
				this.newStudent = { studentId: '', name: '', className: '', password: '123456' }
				uni.showToast({ title: '添加成功', icon: 'success' })
			}).catch(() => {
				uni.showToast({ title: '添加失败', icon: 'none' })
			})
		},
		addCounselor() {
			if (!this.newCounselor.workId || !this.newCounselor.name) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			const data = {
				type: 'counselor',
				workId: this.newCounselor.workId,
				name: this.newCounselor.name,
				password: this.newCounselor.password,
				role: this.newCounselor.role
			}
			api.addAccount(data).then(() => {
				this.subAccounts.push({
					workId: data.workId,
					name: data.name,
					role: data.role,
					disabled: false
				})
				this.showAddCounselor = false
				this.newCounselor = { workId: '', name: '', password: '', role: '' }
				uni.showToast({ title: '添加成功', icon: 'success' })
			}).catch(() => {
				uni.showToast({ title: '添加失败', icon: 'none' })
			})
		},
		onRoleChange(e) {
			this.newCounselor.role = this.roleOptions[e.detail.value]
		},
		editAccount(acc) {
			uni.showToast({ title: '编辑功能', icon: 'none' })
		},
		resetPassword(acc) {
			uni.showModal({
				title: '重置密码',
				content: '确定将 ' + acc.name + ' 的密码重置为 123456？',
				success: (res) => {
					if (res.confirm) {
						api.resetAccountPassword(acc.studentId || acc.workId).then(() => {
							uni.showToast({ title: '已重置', icon: 'success' })
						}).catch(() => {
							uni.showToast({ title: '重置失败', icon: 'none' })
						})
					}
				}
			})
		},
		toggleDisable(acc) {
			const newState = !acc.disabled
			api.updateAccount({ id: acc.studentId, disabled: newState }).then(() => {
				acc.disabled = newState
				uni.showToast({ title: newState ? '已禁用' : '已启用', icon: 'success' })
			}).catch(() => {
				uni.showToast({ title: '操作失败', icon: 'none' })
			})
		},
		editSubAccount(acc) {
			uni.showToast({ title: '编辑权限', icon: 'none' })
		},
		toggleSubDisable(acc) {
			const newState = !acc.disabled
			api.updateAccount({ id: acc.workId, disabled: newState }).then(() => {
				acc.disabled = newState
				uni.showToast({ title: newState ? '已禁用' : '已启用', icon: 'success' })
			}).catch(() => {
				uni.showToast({ title: '操作失败', icon: 'none' })
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	background: #F5F6FA;
}

.scroll-content {
	height: 100%;
}

.tab-bar {
	display: flex;
	background: #FFF;
	margin: 24rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.tab-item {
	flex: 1;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
	&.active {
		background: #4A90D9;
		color: #FFF;
	}
}

.tab-content {
	padding: 0 24rpx;
}

.action-row {
	display: flex;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.action-btn {
	padding: 14rpx 24rpx;
	background: #FFF;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #666;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.93); }
	&.primary {
		background: #4A90D9;
		color: #FFF;
	}
}

.search-input {
	height: 72rpx;
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	margin-bottom: 16rpx;
}

.account-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.account-item {
	background: #FFF;
	border-radius: 12rpx;
	padding: 20rpx;
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
	&:active { transform: scale(0.98); box-shadow: 0 4rpx 16rpx rgba(74,144,217,0.12); }
}

.acc-main {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 8rpx;
}

.acc-id {
	font-size: 26rpx;
	color: #4A90D9;
	font-weight: 500;
}

.acc-name {
	font-size: 26rpx;
	color: #333;
}

.acc-class {
	font-size: 22rpx;
	color: #999;
	margin-left: auto;
}

.acc-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.acc-status {
	font-size: 22rpx;
	color: #999;
	&.active { color: #4CD964; }
}

.acc-time {
	font-size: 22rpx;
	color: #999;
}

.acc-actions {
	display: flex;
	gap: 20rpx;
	border-top: 1rpx solid #F5F5F5;
	padding-top: 12rpx;
}

.acc-action {
	font-size: 24rpx;
	color: #4A90D9;
	&.warn { color: #F0AD4E; }
}


.class-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.class-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFF;
	padding: 28rpx 24rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	&:active { transform: scale(0.98); box-shadow: 0 4rpx 16rpx rgba(74,144,217,0.12); }
}

.class-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.class-right {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.class-count {
	font-size: 24rpx;
	color: #999;
}

.class-arrow {
	font-size: 36rpx;
	color: #CCC;
}

.class-nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
	margin-bottom: 12rpx;
}

.back-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 28rpx;
	color: #4A90D9;
	transition: transform 0.2s ease;
	&:active { transform: translateX(-6rpx); }
}

.back-arrow {
	font-size: 40rpx;
	color: #4A90D9;
}

.current-class {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-wrap {
	width: 600rpx;
	background: #FFF;
	border-radius: 20rpx;
	padding: 40rpx;
	animation: modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 24rpx;
}

.modal-input {
	height: 76rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	margin-bottom: 16rpx;
}

.picker-input {
	display: flex;
	align-items: center;
	color: #666;
}

.modal-btns {
	display: flex;
	gap: 16rpx;
	margin-top: 16rpx;
}

.modal-btn {
	flex: 1;
	height: 76rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 28rpx;
	&.cancel { background: #F5F6FA; color: #666; }
	&.confirm { background: #4A90D9; color: #FFF; }
	&.full { flex: none; width: 100%; }
}

.import-result {
	margin-bottom: 20rpx;
}

.result-item {
	display: block;
	font-size: 28rpx;
	margin-bottom: 8rpx;
	&.success { color: #4CD964; }
	&.fail { color: #DD524D; }
}

.result-errors {
	margin-top: 16rpx;
	background: #FFF8F8;
	border-radius: 8rpx;
	padding: 16rpx;
}

.error-title {
	font-size: 24rpx;
	color: #DD524D;
	display: block;
	margin-bottom: 8rpx;
}

.error-item {
	font-size: 22rpx;
	color: #999;
	display: block;
}

.upload-progress {
	position: fixed;
	bottom: 40rpx;
	left: 24rpx;
	right: 24rpx;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	z-index: 999;
}

.progress-bar {
	height: 12rpx;
	background: #F5F6FA;
	border-radius: 6rpx;
	overflow: hidden;
	margin-bottom: 12rpx;
}

.progress-fill {
	height: 100%;
	background: #4A90D9;
	border-radius: 6rpx;
	transition: width 0.2s;
}

.progress-text {
	font-size: 24rpx;
	color: #666;
}



@keyframes modalPop {
	0% { opacity: 0; transform: scale(0.7) translateY(20rpx); }
	60% { transform: scale(1.03) translateY(-5rpx); }
	100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
