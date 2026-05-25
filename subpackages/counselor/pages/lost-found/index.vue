<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">失物招领管理</text>
				<view class="header-placeholder"></view>
			</view>
			<!-- 筛选Tab -->
			<view class="filter-tabs">
				<view
					class="filter-tab"
					v-for="(tab, i) in filterTabs"
					:key="i"
					:class="{ active: activeFilter === i }"
					@click="switchFilter(i)"
				>
					<text>{{ tab.label }}</text>
					<view class="tab-indicator" v-if="activeFilter === i"></view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
			<view class="item-list">
				<view class="lf-card" v-for="(item, i) in items" :key="i">
					<view class="lf-header">
						<view class="lf-type-tag" :style="{ background: item.type === 'found' ? '#E8F8E8' : '#FFE8E8' }">
							<text>{{ item.type === 'found' ? '招领' : '寻物' }}</text>
						</view>
						<text class="lf-time">{{ item.time }}</text>
						<view class="lf-delete" @click="deleteItem(item, i)">
							<text>删除</text>
						</view>
					</view>
					<view class="lf-body">
						<text class="lf-title">{{ item.title }}</text>
						<text class="lf-desc">{{ item.description }}</text>
						<view class="lf-meta">
							<text class="meta-item" v-if="item.location">
								<text class="iconfont icon-ditu meta-icon"></text>
								{{ item.location }}
							</text>
							<text class="meta-item" v-if="item.publisher">
								<text class="iconfont icon-wode meta-icon"></text>
								{{ item.publisher }}
							</text>
							<text class="meta-item" v-if="item.contact">
								<text class="iconfont icon-changyong-dianhua meta-icon"></text>
								{{ item.contact }}
							</text>
						</view>
						<view class="lf-image" v-if="item.image">
							<image :src="item.image" mode="aspectFill" @click="previewImage(item.image)" />
						</view>
					</view>
				</view>
			</view>

			<empty-state v-if="items.length === 0 && !loading" text="暂无失物招领信息" />
			<view class="loading-more" v-if="loading">
				<text>加载中...</text>
			</view>
			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script>
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

export default {
	components: { EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			loading: false,
			activeFilter: 0,
			filterTabs: [
				{ label: '全部', value: 'all' },
				{ label: '寻物', value: 'lost' },
				{ label: '招领', value: 'found' }
			],
			items: [],
			page: 1,
			hasMore: true
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.loadData()
	},
	methods: {
		goBack() { uni.navigateBack() },
		async loadData() {
			this.loading = true
			this.page = 1
			try {
				const type = this.filterTabs[this.activeFilter].value
				const params = { page: 1, pageSize: 20 }
				if (type !== 'all') params.type = type
				const res = await api.getCounselorLostFound(params)
				if (res) {
					this.items = this.formatItems(res.list || res.items || [])
					this.hasMore = (res.list || res.items || []).length >= 20
				}
			} catch (e) {
				console.error('加载失物招领失败', e)
			}
			this.loading = false
		},
		async loadMore() {
			if (this.loading || !this.hasMore) return
			this.page++
			this.loading = true
			try {
				const type = this.filterTabs[this.activeFilter].value
				const params = { page: this.page, pageSize: 20 }
				if (type !== 'all') params.type = type
				const res = await api.getCounselorLostFound(params)
				if (res) {
					const newItems = this.formatItems(res.list || res.items || [])
					this.items = [...this.items, ...newItems]
					this.hasMore = newItems.length >= 20
				}
			} catch (e) {}
			this.loading = false
		},
		formatItems(list) {
			return list.map(item => ({
				id: item.id,
				title: item.title || item.name,
				description: item.description || item.desc || '',
				location: item.location || '',
				time: item.time || item.createTime || '',
				type: item.type,
				publisher: item.publisher || item.userName || item.studentName || '',
				contact: item.contact || '',
				image: item.image || item.imageUrl || ''
			}))
		},
		switchFilter(i) {
			if (this.activeFilter === i) return
			this.activeFilter = i
			this.loadData()
		},
		deleteItem(item, index) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除"${item.title}"？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await api.deleteCounselorLostFound(item.id)
							this.items.splice(index, 1)
							uni.showToast({ title: '已删除', icon: 'success' })
						} catch (e) {
							uni.showToast({ title: '删除失败', icon: 'none' })
						}
					}
				}
			})
		},
		previewImage(url) {
			uni.previewImage({ urls: [url], current: url })
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

.page-header {
	background: linear-gradient(135deg, #E8FFF3 0%, #F0FFF8 50%, #E8FFF3 100%);
	flex-shrink: 0;
}

.header-status { background: #E8FFF3; }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
}

.header-back {
	width: 60rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	transition: transform 0.2s ease;
	&:active { transform: translateX(-6rpx) scale(1.1); }
}

.back-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #1ABC9C;
	border-bottom: 3rpx solid #1ABC9C;
	transform: rotate(45deg);
}

.header-title {
	font-size: 36rpx;
	color: #1ABC9C;
	font-weight: 600;
}

.header-placeholder { width: 60rpx; }

.filter-tabs {
	display: flex;
	padding: 0 24rpx;
}

.filter-tab {
	flex: 1;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	color: rgba(26, 188, 156, 0.6);
	position: relative;
	&.active {
		color: #1ABC9C;
		font-weight: 500;
	}
}

.tab-indicator {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 4rpx;
	background: #1ABC9C;
	border-radius: 2rpx;
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 40rpx;
}

.item-list {
	padding: 24rpx;
}

.lf-card {
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.lf-header {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.lf-type-tag {
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
	margin-right: 12rpx;
	text { font-size: 22rpx; color: #1ABC9C; font-weight: 500; }
}

.lf-time {
	font-size: 22rpx;
	color: #999;
	flex: 1;
}

.lf-delete {
	padding: 8rpx 20rpx;
	background: #FDECEA;
	border-radius: 8rpx;
	text { font-size: 22rpx; color: #DD524D; }
	transition: transform 0.15s ease;
	&:active { transform: scale(0.93); }
}

.lf-body {}

.lf-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.lf-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 12rpx;
	line-height: 1.6;
}

.lf-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 12rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 22rpx;
	color: #999;
}

.meta-icon {
	font-size: 22rpx;
	color: #CCC;
}

.lf-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	overflow: hidden;
	image { width: 100%; height: 100%; }
}

.loading-more {
	text-align: center;
	padding: 24rpx;
	text { font-size: 24rpx; color: #999; }
}

.bottom-space { height: 40rpx; }
</style>
