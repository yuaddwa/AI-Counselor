<template>
	<view class="page">
		<view class="services-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">校园服务</text>
			</view>
			<!-- 浮动装饰 -->
			<view class="float-bubble b1"></view>
			<view class="float-bubble b2"></view>
			<view class="float-bubble b3"></view>
			<!-- 顶部Tab -->
			<view class="header-tabs">
				<view
					class="header-tab"
					v-for="(tab, i) in tabs"
					:key="i"
					:class="{ active: activeTab === i }"
					@click="switchTab(i)"
				>
					<text>{{ tab }}</text>
					<view class="tab-indicator" v-if="activeTab === i"></view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 办事指南 -->
			<view v-if="activeTab === 0" class="tab-content">
				<view
					class="guide-item"
					v-for="(item, i) in guides"
					:key="i"
					@click="goGuideDetail(item)"
				>
					<view class="guide-icon" :style="{ background: item.bg }">
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<view class="guide-info">
						<text class="guide-name">{{ item.name }}</text>
						<text class="guide-desc">{{ item.desc }}</text>
					</view>
					<view class="arrow-right"></view>
				</view>
			</view>

			<!-- 校园工具 -->
			<view v-if="activeTab === 1" class="tab-content">
				<view class="tool-section-title">
					<text>常用工具</text>
				</view>
				<view class="tool-grid">
					<view
						class="tool-item"
						v-for="(tool, i) in tools"
						:key="i"
						@click="goTool(tool)"

					>
						<view class="tool-icon-wrap" :style="{ background: tool.bg }">
							<text class="iconfont" :class="tool.icon"></text>
						</view>
						<text class="tool-name">{{ tool.name }}</text>
					</view>
				</view>
			</view>

			<!-- 通知中心 -->
			<view v-if="activeTab === 2" class="tab-content">
				<view
					class="notice-item"
					v-for="(item, i) in notices"
					:key="i"
					@click="goNoticeDetail(item)"

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
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

const guideIconMap = {
	checkin: 'icon-xuexiaogaikuang',
	registration: 'icon-xuexiaogaikuang',
	dormitory: 'icon-allicon_houqinfuwu',
	dorm: 'icon-allicon_houqinfuwu',
	library: 'icon-zhishi',
	book: 'icon-zhishi',
	medical: 'icon-yibaobaoxiao',
	hospital: 'icon-yibaobaoxiao',
	health: 'icon-yibaobaoxiao',
	job: 'icon-jiuyezhidaozhongxin',
	employment: 'icon-jiuyezhidaozhongxin',
	map: 'icon-ditu',
	campus: 'icon-ditu',
	phone: 'icon-changyong-dianhua',
	contact: 'icon-changyong-dianhua',
	fee: 'icon-caiwujiaofei',
	payment: 'icon-caiwujiaofei',
	leave: 'icon-renwu',
	ticket: 'icon-gongdan',
	notice: 'icon-tongzhi',
	service: 'icon-fuwu',
	feedback: 'icon-yijianfankui',
	lost: 'icon-shiwuzhaoling',
	found: 'icon-shiwuzhaoling',
	calendar: 'icon-xiaoli',
	score: 'icon-chengjichaxun-01',
	grade: 'icon-chengjichaxun-01',
	schedule: 'icon-kebiao'
}

export default {
	data() {
		return {
			statusBarHeight: 0,
			activeTab: 0,
			tabs: ['办事指南', '校园工具', '通知中心'],
			guides: [],
			tools: [
				{ name: '校园地图', icon: 'icon-ditu', bg: '#E8F4FD', url: '/subpackages/student/pages/services/campus-map/index' },
				{ name: '常用电话', icon: 'icon-changyong-dianhua', bg: '#FFF3E0', url: '/subpackages/student/pages/services/phonebook/index' },
				{ name: '校历', icon: 'icon-xiaoli', bg: '#E8F8E8', url: '/subpackages/student/pages/services/calendar/index' },
				{ name: '成绩查询', icon: 'icon-chengjichaxun-01', bg: '#F3E8FD', url: '/subpackages/student/pages/services/grades/index' },
				{ name: '课表', icon: 'icon-kebiao', bg: '#FFE8E8', url: '/subpackages/student/pages/services/schedule/index' },
				{ name: '失物招领', icon: 'icon-shiwuzhaoling', bg: '#E8FFF3', url: '/subpackages/student/pages/services/lost-found/index' }
			],
			notices: []
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.loadData()
	},
	methods: {
		async loadData() {
			try {
				const res = await api.getServiceGuides()
				if (res) {
					const colors = ['#E8F4FD', '#E8F8E8', '#FFF3E0', '#F3E8FD', '#FFE8E8', '#E8FFF3']
					this.guides = (res.guides || res.list || []).map((item, i) => ({
						id: item.id,
						name: item.title || item.name,
						desc: item.description || item.desc || '',
						icon: guideIconMap[item.icon] || 'icon-gongneng',
						bg: colors[i % colors.length]
					}))
				}
			} catch (e) {
				console.error('加载办事指南失败', e)
			}
			try {
				const res = await api.getNotices({ page: 1, pageSize: 20 })
				if (res) {
					this.notices = (res.notices || res.list || []).map(item => ({
						id: item.id,
						title: item.title,
						time: item.createTime ? item.createTime.substring(5, 10) : '',
						read: item.read
					}))
				}
			} catch (e) {
				console.error('加载通知失败', e)
			}
		},
		goBack() {
			uni.navigateBack()
		},
		switchTab(i) {
			if (this.activeTab === i) return
			this.activeTab = i
		},
		goGuideDetail(item) {
			const id = item.id || ''
			uni.navigateTo({ url: `/subpackages/student/pages/services/guide-detail/index?id=${id}&name=${encodeURIComponent(item.name)}` })
		},
		goTool(tool) {
			if (tool.url) {
				uni.navigateTo({ url: tool.url })
			} else {
				uni.showToast({ title: '功能开发中', icon: 'none' })
			}
		},
		goNoticeDetail(item) {
			item.read = true
			uni.navigateTo({ url: `/subpackages/student/pages/services/notices/index?id=${item.id}` })
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

.services-header {
	background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 50%, #E8F4FD 100%);
	flex-shrink: 0;
	position: relative;
	overflow: hidden;
}

.header-status { background: #E8F4FD; }

.float-bubble {
	position: absolute;
	border-radius: 50%;
	background: rgba(91, 155, 213, 0.08);
	z-index: 0;
}

.b1 { width: 100rpx; height: 100rpx; top: 30%; left: 3%; }
.b2 { width: 70rpx; height: 70rpx; top: 15%; right: 8%; background: rgba(91, 155, 213, 0.06); }
.b3 { width: 50rpx; height: 50rpx; bottom: 10%; left: 60%; background: rgba(91, 155, 213, 0.1); }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
	position: relative;
	z-index: 1;
}

.header-back {
	width: 60rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	margin-right: 8rpx;
	transition: transform 0.2s ease;
	&:active { transform: translateX(-6rpx) scale(1.1); }
}

.back-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #FFF;
	border-bottom: 3rpx solid #FFF;
	transform: rotate(45deg);
}

.arrow-right {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #999;
	border-bottom: 2rpx solid #999;
	transform: rotate(-45deg);
}

.back-icon {
	font-size: 48rpx;
	color: #5B9BD5;
	transition: transform 0.2s ease;
}

.header-title {
	font-size: 38rpx;
	color: #5B9BD5;
	font-weight: 600;
}

.header-tabs {
	display: flex;
	padding: 0 24rpx;
	position: relative;
	z-index: 1;
}

.header-tab {
	flex: 1;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	color: rgba(91, 155, 213, 0.6);
	position: relative;
	transition: all 0.3s ease;
	&.active {
		color: #5B9BD5;
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
	background: #5B9BD5;
	border-radius: 2rpx;
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 140rpx;
}

.tab-content {
	padding: 24rpx;
}

.guide-item {
	display: flex;
	align-items: center;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(91, 155, 213, 0.12);
	}
}

.guide-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.guide-info { flex: 1; }

.guide-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 6rpx;
}

.guide-desc {
	font-size: 24rpx;
	color: #999;
}

.guide-arrow {
	font-size: 36rpx;
	color: #CCC;
	transition: transform 0.3s ease, color 0.2s ease;
	.guide-item:active & {
		transform: translateX(6rpx);
		color: #5B9BD5;
	}
}

.tool-section-title {
	font-size: 28rpx;
	color: #666;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.tool-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.tool-item {
	width: calc(33.333% - 14rpx);
	background: #FFF;
	border-radius: 16rpx;
	padding: 28rpx 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	&:active {
		transform: scale(0.92);
		box-shadow: 0 4rpx 16rpx rgba(91, 155, 213, 0.12);
	}
}

.tool-icon-wrap {
	width: 96rpx;
	height: 96rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 44rpx;
	margin-bottom: 16rpx;
	transition: transform 0.3s ease;
	.tool-item:active & {
		transform: scale(1.15) rotate(-5deg);
	}
}

.tool-name {
	font-size: 26rpx;
	color: #333;
}

.notice-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 12rpx;
	transition: transform 0.15s ease, box-shadow 0.2s ease;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
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

.notice-content { flex: 1; }

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

.notice-arrow {
	font-size: 32rpx;
	color: #CCC;
	margin-left: 16rpx;
	transition: transform 0.3s ease, color 0.2s ease;
	.notice-item:active & {
		transform: translateX(6rpx);
		color: #5B9BD5;
	}
}
</style>
