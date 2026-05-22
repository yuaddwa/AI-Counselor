<template>
	<view class="tabbar">
		<view
			class="tabbar-item"
			v-for="(item, index) in tabs"
			:key="index"
			@click="switchTab(item, index)"
		>
			<view class="tabbar-icon" :class="{ active: current === index }">
				<text class="iconfont">{{ item.icon }}</text>
			</view>
			<text class="tabbar-text" :class="{ active: current === index }">{{ item.text }}</text>
			<view class="badge" v-if="item.badge && item.badge > 0">
				<text>{{ item.badge > 99 ? '99+' : item.badge }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	props: {
		current: {
			type: Number,
			default: 0
		},
		tabs: {
			type: Array,
			default: () => []
		}
	},
	emits: ['change'],
	methods: {
		switchTab(item, index) {
			if (this.current === index) return
			this.$emit('change', { index, item })
		}
	}
}
</script>

<style lang="scss" scoped>
.tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
	z-index: 999;
}

.tabbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 10rpx 0;
}

.tabbar-icon {
	font-size: 44rpx;
	color: #999999;
	margin-bottom: 4rpx;
	transition: color 0.2s;

	&.active {
		color: #4A90D9;
	}
}

.tabbar-text {
	font-size: 20rpx;
	color: #999999;
	&.active {
		color: #4A90D9;
	}
}

.badge {
	position: absolute;
	top: 4rpx;
	right: 50%;
	margin-right: -36rpx;
	min-width: 28rpx;
	height: 28rpx;
	line-height: 28rpx;
	text-align: center;
	background: #DD524D;
	border-radius: 14rpx;
	padding: 0 6rpx;
	font-size: 18rpx;
	color: #FFFFFF;
}
</style>
