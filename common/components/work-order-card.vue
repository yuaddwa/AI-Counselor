<template>
	<view class="order-card" @click="$emit('click', order)">
		<view class="order-header">
			<text class="order-student">{{ order.studentId }} {{ order.studentName }}</text>
			<view class="order-status" :style="{ color: statusColor }">
				<text>{{ statusText }}</text>
			</view>
		</view>
		<view class="order-body">
			<text class="order-desc">{{ order.question }}</text>
		</view>
		<view class="order-footer">
			<text class="order-class">{{ order.className }}</text>
			<text class="order-time">{{ order.createTime }}</text>
		</view>
	</view>
</template>

<script>
import { ticketStatusMap } from '../utils/helper.js'

export default {
	name: 'WorkOrderCard',
	props: {
		order: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['click'],
	computed: {
		statusText() {
			return ticketStatusMap[this.order.status]?.text || '未知'
		},
		statusColor() {
			return ticketStatusMap[this.order.status]?.color || '#999'
		}
	}
}
</script>

<style lang="scss" scoped>
.order-card {
	background: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.order-student {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.order-status {
	font-size: 24rpx;
	font-weight: 500;
}

.order-body {
	margin-bottom: 16rpx;
}

.order-desc {
	font-size: 26rpx;
	color: #666;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-class {
	font-size: 22rpx;
	color: #999;
}

.order-time {
	font-size: 22rpx;
	color: #999;
}
</style>
