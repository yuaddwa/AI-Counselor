<template>
	<view class="page">
		<view class="ws-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<!-- 浮动装饰 -->
			<view class="float-bubble b1"></view>
			<view class="float-bubble b2"></view>
			<view class="float-bubble b3"></view>
			<view class="header-bar">
				<text class="header-title">工作台</text>
				<view class="header-right">
					<view class="header-notice" @click="goNotifications">
						<text class="notice-icon"><text class="iconfont icon-tongzhi"></text></text>
					</view>
				</view>
			</view>
			<!-- 数据概览 -->
			<view class="stat-cards">
				<view class="stat-card" v-for="(s, i) in stats" :key="i" :style="{background: s.bg}">
					<text class="stat-value">{{ s.value }}</text>
					<text class="stat-label">{{ s.label }}</text>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 请假审批 -->
			<view class="section" v-if="pendingLeaves.length > 0">
				<view class="section-header">
					<view class="section-title-wrap">
						<view class="title-bar"></view>
						<text class="section-title">请假审批</text>
					</view>
					<view class="leave-badge">
						<text>{{ pendingLeaves.length }} 待审批</text>
					</view>
				</view>
				<view
					class="leave-item"
					v-for="(item, i) in pendingLeaves"
					:key="'leave' + i"
				>
					<view class="todo-left">
						<text class="todo-student">{{ item.studentId }} {{ item.studentName }}</text>
						<text class="todo-question">{{ item.leaveType }} · {{ item.reason }}</text>
						<text class="leave-time">{{ item.startTime }} ~ {{ item.endTime }}</text>
					</view>
					<view class="leave-actions">
						<view class="leave-approve" @click="approveLeave(item, 'approved')">批准</view>
						<view class="leave-reject" @click="approveLeave(item, 'rejected')">拒绝</view>
					</view>
				</view>
			</view>

			<!-- 待办提醒 -->
			<view class="section">
				<view class="section-header">
					<view class="section-title-wrap">
						<view class="title-bar"></view>
						<text class="section-title">待办提醒</text>
					
							<view class="leave-badge" v-if="pendingOrders.length > 0">
								<text>{{ pendingOrders.length }} 待处理</text>
							</view>
						</view>
					<view class="section-more" @click="goOrders">
						<text>查看全部</text>
						<view class="more-arrow-right"></view>
					</view>
				</view>
				<view
					class="todo-item"
					v-for="(item, i) in pendingOrders"
					:key="i"
					@click="goOrderDetail(item)"

				>
					<view class="todo-left">
						<text class="todo-student">{{ item.studentId }} {{ item.studentName }}</text>
						<text class="todo-question">{{ item.question }}</text>
					</view>
					<view class="todo-tag" :style="{ color: item.tagColor, background: item.tagBg }">{{ item.tagName }}</view>
				</view>
				<empty-state v-if="pendingOrders.length === 0" text="暂无待处理工单" />
			</view>

			<!-- 快捷操作 -->
			<view class="section">
				<view class="section-title-wrap">
					<view class="title-bar"></view>
					<text class="section-title">快捷操作</text>
				</view>
				<view class="quick-grid">
					<view class="quick-item" v-for="(op, i) in quickOps" :key="i" @click="goQuick(op)" >
						<view class="quick-icon" :style="{ background: op.bg }">
							<text class="iconfont" :class="op.icon">
						<view class="leave-badge" v-if="pendingOrders.length > 0">
							<text>{{ pendingOrders.length }} 待处理</text>
						</view></text>
						</view>
						<text class="quick-name">{{ op.name }}</text>
					</view>
				</view>
			</view>

			<!-- 系统消息 -->
			<view class="section">
				<view class="section-title-wrap">
					<view class="title-bar"></view>
					<text class="section-title">系统消息</text>
				</view>
				<view class="sys-msg" v-for="(msg, i) in sysMessages" :key="i" >
					<view class="msg-dot" v-if="!msg.read"></view>
					<view class="msg-content">
						<text class="msg-text">{{ msg.text }}</text>
						<text class="msg-time">{{ msg.time }}</text>
					</view>
				</view>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>

		<custom-tabbar :current="0" :tabs="counselorTabs" @change="onTabChange" />
	</view>
</template>

<script>
import CustomTabbar from '@/common/components/custom-tabbar.vue'
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

export default {
	components: { CustomTabbar, EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			stats: [
				{ label: '今日咨询量', value: '0', bg: 'linear-gradient(135deg, #4A90D9, #6BA5E7)' },
				{ label: '待处理工单', value: '0', bg: 'linear-gradient(135deg, #F0AD4E, #F5C97D)' },
				{ label: '累计工单', value: '0', bg: 'linear-gradient(135deg, #4CD964, #7CE890)' },
				{ label: 'AI解答率', value: '0%', bg: 'linear-gradient(135deg, #9B59B6, #B07CC6)' }
			],
			pendingOrders: [],
			pendingLeaves: [],
			quickOps: [
				{ name: '导入账号', icon: 'icon-zhanghaoguanli', bg: '#E8F4FD', path: '/subpackages/counselor/pages/accounts/index' },
				{ name: '发布通知', icon: 'icon-tongzhi', bg: '#FFF3E0', path: '/subpackages/counselor/pages/notifications/create/index' },
				{ name: '知识库', icon: 'icon-zhishi', bg: '#E8F8E8', path: '/subpackages/counselor/pages/knowledge/index' },
				{ name: '请假申请', icon: 'icon-renwu', bg: '#F3E8FD', path: '/subpackages/counselor/pages/orders/index' },
				{ name: '校历管理', icon: 'icon-xiaoli', bg: '#E8FFF3', path: '/subpackages/counselor/pages/calendar/index' },
				{ name: '失物招领', icon: 'icon-shiwuzhaoling', bg: '#FFF8E8', path: '/subpackages/counselor/pages/lost-found/index' }
			],
			sysMessages: [],
			counselorTabs: [
					{ text: '工作台', icon: 'icon-gongzuotai', url: '/subpackages/counselor/pages/workspace/index' },
					{ text: '知识库', icon: 'icon-zhishi', url: '/subpackages/counselor/pages/knowledge/index' },
					{ text: '工单', icon: 'icon-gongdan', url: '/subpackages/counselor/pages/orders/index' },
					{ text: '数据', icon: 'icon-shuju', url: '/subpackages/counselor/pages/data/index' },
					{ text: '我的', icon: 'icon-wode', url: '/subpackages/profile/pages/counselor/index' }
				]
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
				const res = await api.getWorkspaceData()
				if (res) {
					console.log('workspace data:', JSON.stringify(res))
					const s = res.stats || {}
					this.stats[0].value = String(s.todayConsult || 0)
					this.stats[1].value = String(s.pendingOrders || 0)
					this.stats[2].value = String(s.totalOrders || 0)
					this.stats[3].value = s.aiRate || '0%'
				}
			} catch (e) {
				console.error('加载工作台数据失败', e)
			}
			try {
				const res = await api.getOrders({ status: 'pending', page: 1, pageSize: 10 })
				if (res) {
					this.pendingOrders = (res.orders || []).map(item => ({
						id: item.id,
						studentId: item.studentId,
						studentName: item.studentName,
						question: item.question || item.title || item.content,
						tagName: item.type || '待处理',
						tagColor: '#4A90D9',
							tagBg: '#E8F4FD'
					}))
				}
			} catch (e) {
				console.error('加载工单失败', e)
			}
			try {
				const res = await api.getCounselorLeaveList({ status: 'pending', page: 1, pageSize: 10 })
				if (res) {
					this.pendingLeaves = (res.records || []).map(item => ({
						id: item.id,
						studentId: item.studentId,
						studentName: item.studentName,
						leaveType: item.leaveType,
						reason: item.reason,
						startTime: item.startTime,
						endTime: item.endTime
					}))
				}
			} catch (e) {
				console.error('加载请假列表失败', e)
			}
		},
		goNotifications() {
			uni.navigateTo({ url: '/subpackages/counselor/pages/notifications/index' })
		},
		goOrders() {
			uni.reLaunch({ url: '/subpackages/counselor/pages/orders/index' })
		},
		goOrderDetail(item) {
			uni.navigateTo({ url: `/subpackages/counselor/pages/orders/detail/index?id=${item.id}` })
		},
		goQuick(op) {
			uni.navigateTo({ url: op.path })
		},
		async approveLeave(item, status) {
			try {
				const res = await api.approveLeave(item.id, { status })
				if (res) {
					this.pendingLeaves = this.pendingLeaves.filter(l => l.id !== item.id)
					uni.showToast({ title: status === 'approved' ? '已批准' : '已拒绝', icon: 'success' })
				} else {
					uni.showToast({ title: res.msg || '操作失败', icon: 'none' })
				}
			} catch (e) {
				uni.showToast({ title: '操作失败', icon: 'none' })
			}
		},
		onTabChange({ item }) {
			uni.reLaunch({ url: item.url })
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

.ws-header {
	background: linear-gradient(135deg, #4A90D9 0%, #6BA5E7 50%, #4A90D9 100%);
	background-size: 200% 200%;
	position: relative;
	overflow: hidden;
	padding-bottom: 24rpx;
}

/* 浮动装饰 */
.float-bubble {
	position: absolute;
	border-radius: 50%;
	background: rgba(255,255,255,0.1);
	z-index: 0;
}
.b1 {
	width: 120rpx; height: 120rpx;
	top: 30%; left: 3%;
}
.b2 {
	width: 70rpx; height: 70rpx;
	top: 15%; right: 8%;
	background: rgba(255,255,255,0.08);
}
.b3 {
	width: 50rpx; height: 50rpx;
	bottom: 10%; left: 60%;
	background: rgba(255,255,255,0.12);
}

.header-status { background: #4A90D9; }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	position: relative;
	z-index: 1;
}

.header-title {
	font-size: 38rpx;
	color: #FFF;
	font-weight: 600;
}

.header-right {
	display: flex;
	align-items: center;
}

.header-notice {
	padding: 10rpx 14rpx;
	border-radius: 50%;
	transition: all 0.2s ease;
	&:active { transform: scale(0.9); }
}

.notice-icon {
	font-size: 40rpx;
}

/* 数据卡片 - 现在在header内 */
.stat-cards {
	display: flex;
	padding: 0 24rpx 8rpx;
	gap: 12rpx;
	position: relative;
	z-index: 1;
}

.stat-card {
	flex: 1;
	border-radius: 16rpx;
	padding: 20rpx 12rpx;
	display: flex;
	flex-direction: column;
	background: rgba(255,255,255,0.15) !important;
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255,255,255,0.2);
	transition: transform 0.2s ease;
	&:active { transform: scale(0.96); }
}

.stat-value {
	font-size: 36rpx;
	color: #FFF;
	font-weight: 700;
	margin-bottom: 6rpx;
	animation: numBounce 2.5s ease-in-out 1s infinite;
}

.stat-label {
	font-size: 20rpx;
	color: rgba(255,255,255,0.85);
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 160rpx;
}

.section {
	margin: 20rpx 24rpx 0;
	background: #FFF;
	border-radius: 20rpx;
	padding: 28rpx 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-title-wrap {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.title-bar {
	width: 6rpx;
	height: 28rpx;
	background: linear-gradient(180deg, #4A90D9, #6BA5E7);
	border-radius: 3rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.section-header .section-title-wrap { margin-bottom: 0; }

.section-more {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #4A90D9;
	transition: color 0.2s ease;
	&:active { color: #3A7CC5; }
}

.more-arrow-right {
	width: 12rpx;
	height: 12rpx;
	border-right: 2rpx solid #4A90D9;
	border-bottom: 2rpx solid #4A90D9;
	transform: rotate(-45deg);
	margin-left: 6rpx;
}

.todo-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	transition: background 0.15s ease;
	&:last-child { border-bottom: none; }
	&:active { background: #F7FAFE; }
}

.todo-left {
	flex: 1;
	margin-right: 16rpx;
}

.todo-student {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 6rpx;
}

.todo-question {
	font-size: 24rpx;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.todo-tag {
	font-size: 22rpx;
	padding: 8rpx 18rpx;
	border-radius: 20rpx;
	flex-shrink: 0;
	font-weight: 500;
}

.leave-badge {
	font-size: 22rpx;
	color: #DD524D;
	background: #FDECEA;
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
	font-weight: 500;
}

.leave-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	&:last-child { border-bottom: none; }
}

.leave-time {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
	display: block;
}

.leave-actions {
	display: flex;
	gap: 12rpx;
	flex-shrink: 0;
}

.leave-approve {
	padding: 10rpx 24rpx;
	background: #4CD964;
	color: #FFF;
	border-radius: 12rpx;
	font-size: 24rpx;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.93); }
}

.leave-reject {
	padding: 10rpx 24rpx;
	background: #DD524D;
	color: #FFF;
	border-radius: 12rpx;
	font-size: 24rpx;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.93); }
}

.quick-grid {
	display: flex;
	flex-wrap: wrap;
}

.quick-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
	transition: transform 0.2s ease;
	&:active { transform: scale(0.9); }
}

.quick-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	margin-bottom: 14rpx;
	transition: transform 0.3s ease;
	.quick-item:active & { transform: scale(1.15) rotate(-5deg); }
}

.quick-name {
	font-size: 24rpx;
	color: #333;
}

.sys-msg {
	display: flex;
	align-items: flex-start;
	padding: 18rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	transition: background 0.15s ease;
	&:last-child { border-bottom: none; }
	&:active { background: #F7FAFE; }
}

.msg-dot {
	width: 12rpx;
	height: 12rpx;
	background: #DD524D;
	border-radius: 50%;
	margin-right: 14rpx;
	margin-top: 8rpx;
	flex-shrink: 0;
	animation: dotPulse 2s ease infinite;
}

@keyframes dotPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.3); }
}

.msg-content {
	flex: 1;
}

.msg-text {
	font-size: 26rpx;
	color: #333;
	display: block;
	margin-bottom: 6rpx;
}

.msg-time {
	font-size: 22rpx;
	color: #999;
}

.bottom-space {
	height: 40rpx;
}

/* ====== 关键帧动画 ====== */




@keyframes statPop {
	0% { opacity: 0; transform: scale(0.5) translateY(20rpx); }
	60% { transform: scale(1.06) translateY(-4rpx); }
	100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes numBounce {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-4rpx); }
}

@keyframes sectionSlideUp {
	0% { opacity: 0; transform: translateY(40rpx); }
	100% { opacity: 1; transform: translateY(0); }
}



</style>
