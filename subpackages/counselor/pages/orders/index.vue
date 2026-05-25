<template>
	<view class="page">
		<view class="orders-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<text class="header-title">工单管理</text>
			</view>
			<!-- 状态筛选 -->
			<view class="filter-tabs">
				<view
					class="filter-tab"
					v-for="(tab, i) in statusTabs"
					:key="i"
					:class="{ active: activeStatus === tab.value }"
					@click="activeStatus = tab.value"
				>
					<text>{{ tab.label }}</text>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<picker :range="classOptions" @change="onClassChange" :value="classIndex">
					<view class="filter-item">
						<text>{{ selectedClass || '班级筛选' }}</text>
						<text class="filter-arrow">‹</text>
					</view>
				</picker>
				<picker :range="typeOptions" @change="onTypeChange" :value="typeIndex">
					<view class="filter-item">
						<text>{{ selectedType || '问题类型' }}</text>
						<text class="filter-arrow">‹</text>
					</view>
				</picker>
				<input class="filter-search" v-model="searchKeyword" placeholder="关键词搜索" />
			</view>

			<!-- 工单列表 -->
			<view class="order-list">
				<work-order-card
					v-for="(order, i) in filteredOrders"
					:key="i"
					:order="order"
					@click="goDetail(order)"
				/>
			</view>

			<empty-state v-if="filteredOrders.length === 0" text="暂无工单" />

			<!-- 历史归档 -->
			<view class="archive-bar" @click="toggleArchive">
				<text>{{ showArchive ? '收起历史' : '查看历史归档' }}</text>
			</view>

			<view class="order-list" v-if="showArchive">
				<work-order-card
					v-for="(order, i) in archivedOrders"
					:key="'a' + i"
					:order="order"
					@click="goDetail(order)"
				/>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>

		<custom-tabbar :current="2" :tabs="counselorTabs" @change="onTabChange" />
	</view>
</template>

<script>
import CustomTabbar from '@/common/components/custom-tabbar.vue'
import WorkOrderCard from '@/common/components/work-order-card.vue'
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

export default {
	components: { CustomTabbar, WorkOrderCard, EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			activeStatus: 'all',
			searchKeyword: '',
			selectedClass: '',
			selectedType: '',
			showClassFilter: false,
			showTypeFilter: false,
			showArchive: false,
			statusTabs: [
				{ label: '全部', value: 'all' },
				{ label: '待处理', value: 'pending' },
				{ label: '处理中', value: 'processing' },
				{ label: '已完结', value: 'completed' }
			],
			orders: [],
			archivedOrders: [],
			classOptions: ['全部班级'],
			classIndex: 0,
			typeOptions: ['全部类型'],
			typeIndex: 0,
			counselorTabs: [
					{ text: '工作台', icon: 'icon-gongzuotai', url: '/subpackages/counselor/pages/workspace/index' },
					{ text: '知识库', icon: 'icon-zhishi', url: '/subpackages/counselor/pages/knowledge/index' },
					{ text: '工单', icon: 'icon-gongdan', url: '/subpackages/counselor/pages/orders/index' },
					{ text: '数据', icon: 'icon-shuju', url: '/subpackages/counselor/pages/data/index' },
					{ text: '我的', icon: 'icon-wode', url: '/subpackages/profile/pages/counselor/index' }
				]
		}
	},
	computed: {
		filteredOrders() {
			let list = this.orders
			if (this.activeStatus !== 'all') {
				list = list.filter(o => o.status === this.activeStatus)
			}
			if (this.selectedClass) {
				list = list.filter(o => o.className === this.selectedClass)
			}
			if (this.selectedType) {
				list = list.filter(o => o.type === this.selectedType)
			}
			if (this.searchKeyword) {
				list = list.filter(o => o.question.includes(this.searchKeyword) || o.studentName.includes(this.searchKeyword))
			}
			return list
		}
	},
	created() {
		const sysInfo = uni.getSystemInfoSync()
		this.statusBarHeight = sysInfo.statusBarHeight || 0
		this.loadOrders()
	},
	methods: {
		async loadOrders() {
			const params = { page: 1, pageSize: 50 }
			if (this.activeStatus !== 'all') params.status = this.activeStatus
			if (this.selectedClass) params.className = this.selectedClass
			if (this.selectedType) params.type = this.selectedType
			if (this.searchKeyword) params.keyword = this.searchKeyword
			try {
				const res = await api.getOrders(params)
				if (res) {
					this.orders = (res.orders || []).map(item => ({
						id: item.id,
						studentId: item.studentId,
						studentName: item.studentName,
						className: item.className,
						question: item.question || item.title || item.content,
						status: item.status,
						createTime: item.createTime ? item.createTime.substring(5, 16).replace('T', ' ') : '',
						type: item.type || ''
					}))
				}
			} catch (e) {
				console.error('加载工单失败', e)
			}
		},
		goDetail(order) {
			uni.navigateTo({ url: `/subpackages/counselor/pages/orders/detail/index?id=${order.id}` })
		},
		onTypeChange(e) {
			const idx = e.detail.value
			this.selectedType = idx === 0 ? "" : this.typeOptions[idx]
			this.loadOrders()
		},
		onClassChange(e) {
			const idx = e.detail.value
			this.selectedClass = idx === 0 ? '' : this.classOptions[idx]
			this.showClassFilter = false
			this.loadOrders()
		},
		toggleArchive() {
			this.showArchive = !this.showArchive
		},
		onTabChange({ item }) {
			uni.reLaunch({ url: item.url })
		}
	},
	watch: {
		activeStatus() {
			this.loadOrders()
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

.orders-header {
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

.filter-tabs {
	display: flex;
	padding: 0 24rpx 16rpx;
}

.filter-tab {
	flex: 1;
	text-align: center;
	height: 64rpx;
	line-height: 64rpx;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.7);
	border-radius: 8rpx;
	transition: all 0.3s ease;
	&.active {
		background: rgba(255, 255, 255, 0.2);
		color: #FFF;
	}
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 140rpx;
}

.filter-bar {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	gap: 12rpx;
}

.filter-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 20rpx;
	background: #FFF;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #666;
	min-width: 160rpx;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.96); }
}

.filter-arrow-down {
	width: 16rpx;
	height: 16rpx;
	border-right: 2rpx solid rgba(255,255,255,0.7);
	border-bottom: 2rpx solid rgba(255,255,255,0.7);
	transform: rotate(45deg);
	transition: transform 0.3s ease;
}

.filter-arrow {
	color: #CCC;
	font-size: 28rpx;
	transform: rotate(-90deg);
}

.filter-search {
	flex: 1;
	height: 64rpx;
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 24rpx;
}

.order-list {
	padding: 0 24rpx;
}

.archive-bar {
	text-align: center;
	padding: 24rpx;
	font-size: 26rpx;
	color: #4A90D9;
	transition: color 0.2s ease;
	&:active { color: #3A7CC5; }
}

.bottom-space { height: 40rpx; }



</style>
