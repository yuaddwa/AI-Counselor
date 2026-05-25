<template>
	<view class="page">
		<view class="notices-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">通知中心</text>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<view v-if="!selectedNotice" class="tab-content">
				<view
					class="notice-item"
					v-for="item in notices"
					:key="item.id"
					@click="viewDetail(item)"
				>
					<view class="notice-left">
						<view class="notice-dot" v-if="!item.read"></view>
						<view class="notice-content">
							<text class="notice-title">{{ item.title }}</text>
							<text class="notice-time">{{ item.time }}</text>
						</view>
					</view>
					<view class="arrow-right"></view>
				</view>
				<view v-if="notices.length === 0" class="empty">
					<text>暂无通知</text>
				</view>
			</view>

			<view v-else class="tab-content">
				<view class="detail-card">
					<text class="detail-title">{{ selectedNotice.title }}</text>
					<text class="detail-time">{{ selectedNotice.time }}</text>
					<text class="detail-body">{{ selectedNotice.content }}</text>
				</view>
				<view class="back-btn" @click="selectedNotice = null">
					<text>返回列表</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			selectedNotice: null,
			notices: []
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.loadNotices()
	},
	onLoad(options) {
		if (options.id) {
			this.loadNoticeDetail(Number(options.id))
		}
	},
	methods: {
		async loadNotices() {
			try {
				const res = await api.getNotices({ page: 1, pageSize: 20 })
				if (res) {
					this.notices = (res.notices || res.list || []).map(item => ({
						id: item.id,
						title: item.title,
						time: item.createTime ? item.createTime.substring(0, 10) : '',
						read: item.read,
						content: item.content || ''
					}))
				}
			} catch (e) {
				console.error('加载通知失败', e)
			}
		},
		async loadNoticeDetail(id) {
			try {
				const res = await api.getNoticeDetail(id)
				if (res) {
					this.selectedNotice = {
						id: res.id,
						title: res.title,
						time: res.createTime ? res.createTime.substring(0, 10) : '',
						content: res.content
					}
					const n = this.notices.find(x => x.id === id)
					if (n) n.read = true
				}
			} catch (e) {
				console.error('加载通知详情失败', e)
			}
		},
		goBack() {
			if (this.selectedNotice) {
				this.selectedNotice = null
			} else {
				uni.navigateBack()
			}
		},
		viewDetail(item) {
			item.read = true
			this.loadNoticeDetail(item.id)
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

.notices-header {
	background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 50%, #E8F4FD 100%);
	flex-shrink: 0;
}

.header-status { background: #E8F4FD; }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
}

.header-back {
	width: 60rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	margin-right: 8rpx;
	&:active { transform: translateX(-6rpx); }
}

.back-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #5B9BD5;
	border-bottom: 3rpx solid #5B9BD5;
	transform: rotate(45deg);
}

.arrow-right {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #999;
	border-bottom: 2rpx solid #999;
	transform: rotate(-45deg);
}

.header-title {
	font-size: 38rpx;
	color: #5B9BD5;
	font-weight: 600;
}

.scroll-content {
	flex: 1;
	height: 0;
}

.tab-content {
	padding: 24rpx;
}

.notice-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(91, 155, 213, 0.12);
	}
}

.notice-left {
	flex: 1;
	display: flex;
	align-items: flex-start;
}

.notice-dot {
	width: 12rpx;
	height: 12rpx;
	background: #DD524D;
	border-radius: 50%;
	margin-right: 16rpx;
	margin-top: 8rpx;
	flex-shrink: 0;
}

.notice-content {
	flex: 1;
}

.notice-title {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.notice-time {
	font-size: 22rpx;
	color: #999;
}

.empty {
	text-align: center;
	padding: 120rpx 0;
	color: #999;
	font-size: 28rpx;
}

.detail-card {
	background: #FFF;
	border-radius: 16rpx;
	padding: 32rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.detail-title {
	font-size: 34rpx;
	color: #333;
	font-weight: 600;
	display: block;
	margin-bottom: 16rpx;
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
	line-height: 1.8;
}

.back-btn {
	text-align: center;
	padding: 32rpx 20rpx;
	color: #4A90D9;
	font-size: 28rpx;
}
</style>
