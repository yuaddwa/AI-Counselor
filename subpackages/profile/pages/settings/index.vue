<template>
	<view class="page">
		<scroll-view scroll-y class="settings-scroll">
			<view class="settings-section">
				<view class="setting-item">
					<text class="setting-label">问答消息通知</text>
					<switch :checked="settings.chatNotify" @change="onToggle('chatNotify', $event)" color="#4A90D9" />
				</view>
				<view class="setting-item">
					<text class="setting-label">工单状态提醒</text>
					<switch :checked="settings.orderNotify" @change="onToggle('orderNotify', $event)" color="#4A90D9" />
				</view>
				<view class="setting-item">
					<text class="setting-label">系统消息通知</text>
					<switch :checked="settings.systemNotify" @change="onToggle('systemNotify', $event)" color="#4A90D9" />
				</view>
			</view>

			<view class="settings-section">
				<view class="setting-item" @click="clearCache">
					<text class="setting-label">清除缓存</text>
					<view class="setting-right">
						<text class="setting-value">{{ cacheSize }}</text>
						<view class="setting-arrow-right"></view>
					</view>
				</view>
				<view class="setting-item">
					<text class="setting-label">当前版本</text>
					<text class="setting-value">v1.0.0</text>
				</view>
			</view>

			<view class="save-btn" @click="saveSettings">
				<text>保存设置</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			settings: {
				chatNotify: true,
				orderNotify: true,
				systemNotify: false
			},
			cacheSize: '0B'
		}
	},
	onLoad() {
		this.loadSettings()
	},
	methods: {
		async loadSettings() {
			try {
				const res = await api.getNotificationSettings()
				if (res) {
					this.settings = { ...this.settings, ...res }
				}
			} catch (e) {
				console.error('加载通知设置失败', e)
			}
		},
		async updateSettings() {
			try {
				await api.updateNotificationSettings(this.settings)
			} catch (e) {
				console.error('更新通知设置失败', e)
				uni.showToast({ title: '保存失败', icon: 'none' })
			}
		},
		onToggle(key, event) {
			this.settings[key] = event.detail.value
			this.updateSettings()
		},
		clearCache() {
			uni.showModal({
				title: '清除缓存',
				content: '确定清除本地缓存数据？',
				success: (res) => {
					if (res.confirm) {
						uni.clearStorageSync()
						this.cacheSize = '0B'
						uni.showToast({ title: '已清除', icon: 'success' })
					}
				}
			})
		},
		async saveSettings() {
			await this.updateSettings()
			uni.showToast({ title: '保存成功', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 1500)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	background: #F5F6FA;
}

.settings-scroll {
	height: 100%;
	padding: 24rpx;
}

.settings-section {
	background: #FFF;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #F5F5F5;
	&:last-child { border-bottom: none; }
}

.setting-label {
	font-size: 28rpx;
	color: #333;
}

.setting-value {
	font-size: 26rpx;
	color: #999;
}

.setting-right {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.setting-arrow-right {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #CCC;
	border-bottom: 2rpx solid #CCC;
	transform: rotate(-45deg);
}

.save-btn {
	height: 88rpx;
	background: #4A90D9;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FFF;
	font-size: 30rpx;
	margin-top: 40rpx;
}
</style>
