<template>
	<view class="page">
		<scroll-view scroll-y class="detail-scroll">
			<view class="detail-header">
				<text class="detail-title">{{ guideName }}</text>
			</view>

			<view class="detail-section">
				<text class="section-label">办理步骤</text>
				<view class="steps">
					<view class="step-item" v-for="(step, i) in steps" :key="i">
						<view class="step-num">{{ i + 1 }}</view>
						<view class="step-info">
							<text class="step-title">{{ step.title }}</text>
							<text class="step-desc">{{ step.desc }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="detail-section">
				<text class="section-label">所需材料</text>
				<view class="material-list">
					<view class="material-item" v-for="(m, i) in materials" :key="i">
						<text class="material-dot">•</text>
						<text class="material-text">{{ m }}</text>
					</view>
				</view>
			</view>

			<view class="detail-section">
				<text class="section-label">办理地点</text>
				<view class="info-row">
					<text class="info-text">{{ location }}</text>
					<view class="info-btn" @click="goMap">
						<text>导航</text>
					</view>
				</view>
			</view>

			<view class="detail-section">
				<text class="section-label">办公时间</text>
				<text class="info-text">{{ officeHours }}</text>
			</view>

			<view class="detail-section">
				<text class="section-label">联系电话</text>
				<view class="info-row" @click="callPhone">
					<text class="info-text phone">{{ phone }}</text>
					<view class="info-btn call">
						<text>拨打</text>
					</view>
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
			guideName: '',
			steps: [],
			materials: [],
			location: '',
			officeHours: '',
			phone: ''
		}
	},
	onLoad(options) {
		if (options.id) {
			api.getGuideDetail(options.id).then(res => {
				if (res) {
					const d = res
					this.guideName = d.name || this.guideName
					this.steps = d.steps || this.steps
					this.materials = d.materials || this.materials
					this.location = d.location || this.location
					this.officeHours = d.officeHours || this.officeHours
					this.phone = d.phone || this.phone
					uni.setNavigationBarTitle({ title: this.guideName })
				}
			}).catch(() => {})
		} else if (options.name) {
			this.guideName = decodeURIComponent(options.name)
			uni.setNavigationBarTitle({ title: this.guideName })
		}
	},
	methods: {
		goMap() {
			uni.navigateTo({ url: '/subpackages/student/pages/services/campus-map/index' })
		},
		callPhone() {
			uni.makePhoneCall({ phoneNumber: this.phone })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	background: #F5F6FA;
}

.detail-scroll {
	height: 100%;
}

.detail-header {
	background: linear-gradient(135deg, #4A90D9, #6BA5E7);
	padding: 48rpx 32rpx;
}

.detail-title {
	font-size: 36rpx;
	color: #FFF;
	font-weight: 600;
}

.detail-section {
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin: 24rpx;
}

.section-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.steps {
	display: flex;
	flex-direction: column;
}

.step-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
	&:last-child { margin-bottom: 0; }
}

.step-num {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background: #4A90D9;
	color: #FFF;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.step-info {
	flex: 1;
}

.step-title {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 4rpx;
}

.step-desc {
	font-size: 24rpx;
	color: #999;
}

.material-list {
	display: flex;
	flex-direction: column;
}

.material-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.material-dot {
	color: #4A90D9;
	margin-right: 12rpx;
	font-size: 28rpx;
}

.material-text {
	font-size: 26rpx;
	color: #666;
}

.info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.info-text {
	font-size: 26rpx;
	color: #666;
	flex: 1;
	&.phone { color: #4A90D9; }
}

.info-btn {
	padding: 10rpx 28rpx;
	background: #EEF4FB;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #4A90D9;
	&.call { background: #E8F8E8; color: #4CD964; }
}
</style>
