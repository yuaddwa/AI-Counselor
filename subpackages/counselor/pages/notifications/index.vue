<template>
	<view class="page">
		<scroll-view scroll-y class="scroll-content">
			<view class="action-header">
				<view class="create-btn" @click="goCreate">
					<text>+ 新建通知</text>
				</view>
			</view>

			<view class="notice-list">
				<view
					class="notice-item"
					v-for="(item, i) in notices"
					:key="i"
					@click="viewDetail(item)"
				>
					<view class="notice-main">
						<text class="notice-title">{{ item.title }}</text>
						<view class="notice-meta">
							<text class="notice-scope">{{ item.scope }}</text>
							<text class="notice-time">{{ item.time }}</text>
						</view>
					</view>
					<view class="notice-stats">
						<text class="read-count">已读 {{ item.readCount }}/{{ item.totalCount }}</text>
					</view>
				</view>
			</view>

			<empty-state v-if="notices.length === 0" text="暂无通知" />

			<!-- 通知详情 -->
			<view class="detail-panel" v-if="selectedNotice">
				<view class="detail-mask" @click="selectedNotice = null"></view>
				<view class="detail-wrap">
					<text class="detail-title">{{ selectedNotice.title }}</text>
					<text class="detail-time">{{ selectedNotice.time }}</text>
					<text class="detail-body">{{ selectedNotice.content }}</text>
					<view class="read-list">
						<text class="read-label">已读/未读清单</text>
						<view class="read-item" v-for="(p, i) in selectedNotice.readList" :key="i">
							<text class="read-name">{{ p.name }}</text>
							<text class="read-status" :class="{ read: p.read }">{{ p.read ? '已读' : '未读' }}</text>
						</view>
					</view>
					<view class="detail-close" @click="selectedNotice = null">
						<text>关闭</text>
					</view>
				</view>
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
			selectedNotice: null,
			page: 1,
			pageSize: 20,
			notices: []
		}
	},
	onLoad() {
		this.loadNotifications()
	},
	methods: {
		async loadNotifications() {
			try {
				const res = await api.getNotifications({ page: this.page, pageSize: this.pageSize })
				const list = res || []
				this.notices = list.map(item => ({
					id: item.id,
					title: item.title,
					time: item.time || item.createdAt,
					scope: item.scope,
					readCount: item.readCount || 0,
					totalCount: item.totalCount || 0,
					content: item.content,
					readList: item.readList || []
				}))
			} catch (e) {
				console.error('加载通知列表失败', e)
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		deleteNotification(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除此通知吗？',
				success: (res) => {
					if (res.confirm) {
						api.deleteNotification(id).then(() => {
							this.notices = this.notices.filter(n => n.id !== id)
							if (this.selectedNotice && this.selectedNotice.id === id) {
								this.selectedNotice = null
							}
							uni.showToast({ title: '删除成功', icon: 'success' })
						}).catch((e) => {
							console.error('删除通知失败', e)
							uni.showToast({ title: '删除失败', icon: 'none' })
						})
					}
				}
			})
		},
		goCreate() {
			uni.navigateTo({ url: '/subpackages/counselor/pages/notifications/create/index' })
		},
		viewDetail(item) {
			this.selectedNotice = item
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
	padding: 24rpx;
}

.action-header {
	margin-bottom: 16rpx;
}

.create-btn {
	padding: 16rpx 32rpx;
	background: linear-gradient(135deg, #4A90D9, #6BA5E7);
	border-radius: 12rpx;
	text-align: center;
	color: #FFF;
	font-size: 28rpx;
	box-shadow: 0 4rpx 16rpx rgba(74,144,217,0.3);
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	&:active { transform: scale(0.96); box-shadow: 0 2rpx 8rpx rgba(74,144,217,0.2); }
}

.notice-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.notice-item {
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	&:active { transform: scale(0.98); box-shadow: 0 4rpx 16rpx rgba(74,144,217,0.12); }
}

.notice-main {
	flex: 1;
	margin-right: 16rpx;
}

.notice-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.notice-meta {
	display: flex;
	gap: 16rpx;
}

.notice-scope {
	font-size: 22rpx;
	color: #4A90D9;
	background: #EEF4FB;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.notice-time {
	font-size: 22rpx;
	color: #999;
	line-height: 32rpx;
}

.notice-stats {
	flex-shrink: 0;
}

.read-count {
	font-size: 22rpx;
	color: #999;
}

.detail-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
}

.detail-wrap {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	max-height: 80vh;
	background: #FFF;
	border-radius: 24rpx 24rpx 0 0;
	padding: 40rpx;
	z-index: 1;
	overflow-y: auto;
}

.detail-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 12rpx;
}

.detail-time {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 24rpx;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.detail-body {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	margin-bottom: 24rpx;
}

.read-list {
	margin-bottom: 24rpx;
}

.read-label {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 16rpx;
}

.read-item {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.read-name {
	font-size: 24rpx;
	color: #666;
}

.read-status {
	font-size: 22rpx;
	color: #DD524D;
	&.read { color: #4CD964; }
}

.detail-close {
	text-align: center;
	padding: 20rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	color: #666;
	font-size: 28rpx;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.96); }
}

.bottom-space { height: 40rpx; }



</style>
