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
export default {
	data() {
		return {
			statusBarHeight: 0,
			selectedNotice: null,
			notices: [
				{
					id: 1,
					title: '2026年秋季学期开学报到须知',
					time: '2026-05-20',
					read: false,
					content: '各位同学：\n\n2026年秋季学期开学报到安排如下：\n\n一、报到时间：9月1日-9月2日\n\n二、报到地点：各学院迎新点\n\n三、所需材料：\n1. 录取通知书原件\n2. 身份证原件及复印件\n3. 一寸免冠照片8张\n4. 团组织关系介绍信\n\n四、注意事项：\n1. 请按时报到，如有特殊情况请提前请假\n2. 报到当天校园内有志愿者引导\n3. 家长可陪同入校，车辆请停在指定停车场\n\n祝同学们新学期愉快！'
				},
				{
					id: 2,
					title: '关于国庆节放假安排的通知',
					time: '2026-05-18',
					read: false,
					content: '根据国务院办公厅通知精神，结合我校实际，现将2026年国庆节放假安排通知如下：\n\n一、放假时间：10月1日至10月7日，共7天。\n\n二、调休安排：9月27日（周日）、10月10日（周六）正常上课。\n\n三、请各学院做好学生安全教育工作。'
				},
				{
					id: 3,
					title: '图书馆暑期开放时间调整',
					time: '2026-05-15',
					read: true,
					content: '图书馆暑期（7月15日-8月31日）开放时间调整如下：\n\n周一至周五：8:30-17:00\n周六、日：9:00-16:00\n\n电子资源24小时正常访问。'
				},
				{
					id: 4,
					title: '校园卡系统升级维护公告',
					time: '2026-05-12',
					read: true,
					content: '校园卡系统将于5月20日22:00至5月21日6:00进行升级维护，届时校园卡消费、充值功能将暂停服务，请提前做好安排。'
				}
			]
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
	},
	onLoad(options) {
		if (options.id) {
			const n = this.notices.find(x => x.id === Number(options.id))
			if (n) {
				n.read = true
				this.selectedNotice = n
			}
		}
	},
	methods: {
		goBack() {
			if (this.selectedNotice) {
				this.selectedNotice = null
			} else {
				uni.navigateBack()
			}
		},
		viewDetail(item) {
			item.read = true
			this.selectedNotice = item
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
