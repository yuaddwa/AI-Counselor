<template>
	<view class="page">
		<view class="kb-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<text class="header-title">知识库</text>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 搜索栏 -->
			<view class="search-bar">
				<input class="search-input" v-model="keyword" placeholder="搜索知识库内容..." @input="onSearch" />
			</view>

			<!-- 检索测试 -->
			<view class="test-bar" @click="showTest = !showTest">
				<text>{{ showTest ? '收起测试' : '检索测试' }}</text>
				<view class="test-arrow" :class="{ collapsed: !showTest }"></view>
			</view>
			<view class="test-panel" v-if="showTest">
				<input class="test-input" v-model="testQuestion" placeholder="输入问题预览AI回答效果..." />
				<view class="test-btn" @click="testQuery">
					<text>测试</text>
				</view>
				<view class="test-result" v-if="testResult">
					<text class="result-label">AI回答预览：</text>
					<text class="result-text">{{ testResult }}</text>
				</view>
			</view>

			<!-- 分类管理 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">知识分类</text>
					<view class="add-btn" @click="addCategory">
						<text>+ 新增分类</text>
					</view>
				</view>
				<view class="category-list">
					<view
						class="category-item"
						v-for="(cat, i) in categories"
						:key="i"
						@click="selectCategory(cat)"
						:class="{ active: selectedCat === cat.id }"
					>
						<text class="cat-name">{{ cat.name }}</text>
						<text class="cat-count">{{ cat.count }}条</text>
					</view>
				</view>
			</view>

			<!-- 内容列表 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">知识条目</text>
					<view class="add-btn" @click="goEdit()">
						<text>+ 新建</text>
					</view>
				</view>
				<view class="import-bar">
					<view class="import-btn" @click="importFile">
						<text class="iconfont icon-zhanghaoquanxianguanli"></text>
							<text>导入文档</text>
					</view>
					<text class="import-hint">支持PDF/Word/TXT</text>
				</view>

				<view class="item-list">
					<view
						class="kb-item"
						v-for="(item, i) in filteredItems"
						:key="i"
					>
						<view class="kb-main" @click="goEdit(item)">
							<text class="kb-title">{{ item.title }}</text>
							<view class="kb-meta">
								<text class="kb-cat">{{ item.categoryName }}</text>
								<text class="kb-time">{{ item.updateTime }}</text>
							</view>
						</view>
						<view class="kb-actions">
							<view class="kb-action" @click="deleteItem(item, i)">
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>

				<empty-state v-if="filteredItems.length === 0" text="暂无知识条目" />
			</view>

			<!-- 上传进度 -->
			<view class="upload-progress" v-if="uploading">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: uploadProgress + '%' }"></view>
				</view>
				<text class="progress-text">导入中... {{ uploadProgress }}%</text>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>

		<custom-tabbar :current="1" :tabs="counselorTabs" @change="onTabChange" />

		<!-- 新增分类弹窗 -->
		<view class="modal-mask" v-if="showAddCat" @click="showAddCat = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">新增分类</text>
				<input class="modal-input" v-model="newCatName" placeholder="请输入分类名称" />
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showAddCat = false">
						<text>取消</text>
					</view>
					<view class="modal-btn confirm" @click="confirmAddCat">
						<text>确定</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomTabbar from '@/common/components/custom-tabbar.vue'
import EmptyState from '@/common/components/empty-state.vue'

export default {
	components: { CustomTabbar, EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			keyword: '',
			showTest: false,
			showAddCat: false,
			newCatName: '',
			testQuestion: '',
			testResult: '',
			selectedCat: '',
			uploading: false,
			uploadProgress: 0,
			categories: [
				{ id: '1', name: '新生报到', count: 12 },
				{ id: '2', name: '教务管理', count: 25 },
				{ id: '3', name: '后勤服务', count: 18 },
				{ id: '4', name: '奖助政策', count: 15 },
				{ id: '5', name: '军训指南', count: 8 }
			],
			items: [
				{ id: '1', title: '2026年新生报到全流程指南', categoryId: '1', categoryName: '新生报到', updateTime: '05-20' },
				{ id: '2', title: '选课系统操作说明', categoryId: '2', categoryName: '教务管理', updateTime: '05-19' },
				{ id: '3', title: '宿舍报修流程及注意事项', categoryId: '3', categoryName: '后勤服务', updateTime: '05-18' },
				{ id: '4', title: '国家奖学金评选条件及流程', categoryId: '4', categoryName: '奖助政策', updateTime: '05-17' },
				{ id: '5', title: '军训期间注意事项', categoryId: '5', categoryName: '军训指南', updateTime: '05-16' }
			],
			counselorTabs: [
				{ text: '工作台', icon: '', url: '/subpackages/counselor/pages/workspace/index' },
				{ text: '知识库', icon: '', url: '/subpackages/counselor/pages/knowledge/index' },
				{ text: '工单', icon: '', url: '/subpackages/counselor/pages/orders/index' },
				{ text: '数据', icon: '', url: '/subpackages/counselor/pages/data/index' },
				{ text: '我的', icon: '', url: '/subpackages/profile/pages/counselor/index' }
			]
		}
	},
	computed: {
		filteredItems() {
			let list = this.items
			if (this.selectedCat) {
				list = list.filter(item => item.categoryId === this.selectedCat)
			}
			if (this.keyword) {
				list = list.filter(item => item.title.includes(this.keyword))
			}
			return list
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
	},
	methods: {
		onSearch() {},
		selectCategory(cat) {
			this.selectedCat = this.selectedCat === cat.id ? '' : cat.id
		},
		addCategory() {
			this.showAddCat = true
			this.newCatName = ''
		},
		confirmAddCat() {
			if (!this.newCatName.trim()) {
				uni.showToast({ title: '请输入分类名称', icon: 'none' })
				return
			}
			this.categories.push({
				id: Date.now().toString(),
				name: this.newCatName.trim(),
				count: 0
			})
			this.showAddCat = false
			this.newCatName = ''
			uni.showToast({ title: '添加成功', icon: 'success' })
		},
		goEdit(item) {
			const url = item
				? `/subpackages/counselor/pages/knowledge/edit/index?id=${item.id}`
				: '/subpackages/counselor/pages/knowledge/edit/index'
			uni.navigateTo({ url })
		},
		deleteItem(item, index) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除"${item.title}"？`,
				success: (res) => {
					if (res.confirm) {
						this.items.splice(index, 1)
						uni.showToast({ title: '已删除', icon: 'success' })
					}
				}
			})
		},
		importFile() {
			uni.chooseMessageFile({
				count: 1,
				type: 'file',
				extension: ['pdf', 'doc', 'docx', 'txt'],
				success: (res) => {
					this.uploading = true
					this.uploadProgress = 0
					const timer = setInterval(() => {
						this.uploadProgress += 10
						if (this.uploadProgress >= 100) {
							clearInterval(timer)
							this.uploading = false
							uni.showToast({ title: '导入成功', icon: 'success' })
						}
					}, 200)
				}
			})
		},
		testQuery() {
			if (!this.testQuestion.trim()) {
				uni.showToast({ title: '请输入测试问题', icon: 'none' })
				return
			}
			this.testResult = `关于"${this.testQuestion}"，根据知识库内容，系统会从相关文档中检索并生成回答。实际回答效果取决于知识库的完善程度。`
		},
		onTabChange({ item }) {
			uni.reLaunch({ url: item.url })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #F5F6FA;
}

.kb-header {
	background: linear-gradient(135deg, #4A90D9 0%, #6BA5E7 50%, #4A90D9 100%);
	background-size: 200% 200%;
}
.header-status { background: #4A90D9; }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
}

.header-title {
	font-size: 38rpx;
	color: #FFF;
	font-weight: 600;
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 140rpx;
}

.search-bar {
	padding: 20rpx 24rpx;
}

.search-input {
	height: 72rpx;
	background: #FFF;
	border-radius: 36rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.test-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 24rpx 12rpx;
	padding: 16rpx 24rpx;
	background: #FFF;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #4A90D9;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.98); }
}

.test-arrow {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #4A90D9;
	border-bottom: 2rpx solid #4A90D9;
	transform: rotate(-45deg);
	transition: transform 0.3s ease;
	&.collapsed {
		transform: rotate(135deg);
	}
}

.test-panel {
	margin: 0 24rpx 16rpx;
	background: #FFF;
	border-radius: 12rpx;
	padding: 20rpx;
}

.test-input {
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	margin-bottom: 16rpx;
}

.test-btn {
	height: 64rpx;
	background: #4A90D9;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FFF;
	font-size: 26rpx;
	margin-bottom: 16rpx;
}

.test-result {
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 20rpx;
}

.result-label {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 8rpx;
}

.result-text {
	font-size: 26rpx;
	color: #333;
	line-height: 1.6;
}

.section {
	margin: 0 24rpx 20rpx;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.add-btn {
	padding: 10rpx 24rpx;
	background: #EEF4FB;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #4A90D9;
	transition: transform 0.2s ease;
	&:active { transform: scale(0.93); }
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.category-item {
	padding: 12rpx 24rpx;
	background: #F5F6FA;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #666;
	display: flex;
	align-items: center;
	gap: 8rpx;
	transition: transform 0.2s ease, background 0.2s ease;
	&:active { transform: scale(0.95); }
	&.active {
		background: #4A90D9;
		color: #FFF;
	}
}

.cat-count {
	font-size: 20rpx;
	opacity: 0.7;
}

.import-bar {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.import-btn {
	padding: 12rpx 24rpx;
	background: #E8F8E8;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #4CD964;
	margin-right: 16rpx;
	transition: transform 0.2s ease;
	&:active { transform: scale(0.93); }
}

.import-hint {
	font-size: 22rpx;
	color: #999;
}

.item-list {
	display: flex;
	flex-direction: column;
}

.kb-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	transition: background 0.15s ease;
	&:last-child { border-bottom: none; }
	&:active { background: #F7FAFE; }
}

.kb-main {
	flex: 1;
	margin-right: 16rpx;
}

.kb-title {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.kb-meta {
	display: flex;
	gap: 16rpx;
}

.kb-cat {
	font-size: 22rpx;
	color: #4A90D9;
	background: #EEF4FB;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.kb-time {
	font-size: 22rpx;
	color: #999;
	line-height: 32rpx;
}

.kb-actions {
	display: flex;
}

.kb-action {
	padding: 8rpx 20rpx;
	font-size: 24rpx;
	color: #DD524D;
}

.upload-progress {
	position: fixed;
	bottom: 160rpx;
	left: 24rpx;
	right: 24rpx;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
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

.bottom-space { height: 40rpx; }




@keyframes sectionSlideUp {
	0% { opacity: 0; transform: translateY(30rpx); }
	100% { opacity: 1; transform: translateY(0); }
}


@keyframes modalPop {
	0% { opacity: 0; transform: scale(0.7) translateY(20rpx); }
	60% { transform: scale(1.03) translateY(-5rpx); }
	100% { opacity: 1; transform: scale(1) translateY(0); }
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
	margin-bottom: 24rpx;
}

.modal-btns {
	display: flex;
	gap: 16rpx;
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
}
</style>
