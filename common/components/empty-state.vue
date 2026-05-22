<template>
	<view class="empty-wrap">
		<text class="empty-icon">{{ icon }}</text>
		<text class="empty-text">{{ text }}</text>
		<view class="empty-action" v-if="actionText" @click="$emit('action')">
			<text>{{ actionText }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'EmptyState',
	props: {
		text: { type: String, default: '暂无数据' },
		icon: { type: String, default: '' },
		actionText: { type: String, default: '' }
	},
	emits: ['action']
}
</script>

<style lang="scss" scoped>
.empty-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.empty-action {
	padding: 16rpx 40rpx;
	background: #4A90D9;
	border-radius: 32rpx;
	font-size: 26rpx;
	color: #fff;
}
</style>
