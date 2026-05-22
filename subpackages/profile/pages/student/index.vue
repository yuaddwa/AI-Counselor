<template>
	<view class="page">
		<view class="profile-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-back-bar">
				<view class="header-back" @click="goBack">
					<text class="back-icon">‹</text>
				</view>
				<text class="header-bar-title">我的</text>
			</view>
			<view class="header-content">
				<!-- 浮动装饰气泡 -->
				<view class="float-bubble b1"></view>
				<view class="float-bubble b2"></view>
				<view class="float-bubble b3"></view>
				<view class="float-bubble b4"></view>
				<view class="float-bubble b5"></view>
				<view class="avatar-wrap">
					<view class="avatar" @click="onAvatarTap" :class="{ spinning: avatarSpin }">
						<text class="avatar-text">{{ userInfo.name ? userInfo.name.charAt(0) : '我' }}</text>
					</view>
					<view class="avatar-ring"></view>
					<view class="avatar-ring ring2"></view>
				</view>
				<text class="user-name">{{ userInfo.name || '未登录' }}</text>
				<text class="user-info">{{ userInfo.id }} · {{ userInfo.className }}</text>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 数据统计卡片 -->
			<view class="stats-card">
				<view class="stat-item" v-for="(stat, i) in stats" :key="i" >
					<text class="stat-num">{{ stat.num }}</text>
					<text class="stat-label">{{ stat.label }}</text>
				</view>
			</view>

			<!-- 功能菜单 -->
			<view class="menu-section">
				<view class="menu-item" @click="goPage('password')">
					<text class="menu-icon iconfont icon-suo"></text>
					<text class="menu-text">修改登录密码</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goPage('notification')">
					<text class="menu-icon iconfont icon-tongzhi"></text>
					<text class="menu-text">消息设置</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goPage('tickets')">
					<text class="menu-icon iconfont icon-gongdan"></text>
					<text class="menu-text">我的工单</text>
					<view class="menu-badge">
						<text>3</text>
					</view>
					<text class="menu-arrow">›</text>
				</view>
			</view>

			<view class="menu-section">
				<view class="menu-item" @click="goPage('feedback')">
					<text class="menu-icon iconfont icon-yijianfankui"></text>
					<text class="menu-text">意见反馈</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goPage('about')">
					<text class="menu-icon iconfont icon-guanyuwomen"></text>
					<text class="menu-text">关于我们</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>

			<view class="logout-btn" @click="handleLogout">
				<text>退出登录</text>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>

		<!-- 消息设置弹窗 -->
		<view class="modal-mask" v-if="showNotification" @click="showNotification = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">消息设置</text>
				<view class="setting-row">
					<text>问答提醒</text>
					<switch :checked="settings.chatNotify" @change="settings.chatNotify = $event.detail.value" color="#4A90D9" />
				</view>
				<view class="setting-row">
					<text>人工回复提醒</text>
					<switch :checked="settings.humanNotify" @change="settings.humanNotify = $event.detail.value" color="#4A90D9" />
				</view>
				<view class="modal-btn" @click="showNotification = false">
					<text>确定</text>
				</view>
			</view>
		</view>

		<!-- 修改密码弹窗 -->
		<view class="modal-mask" v-if="showPassword" @click="showPassword = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">修改密码</text>
				<input class="modal-input" v-model="passwordForm.oldPwd" placeholder="当前密码" :password="true" />
				<input class="modal-input" v-model="passwordForm.newPwd" placeholder="新密码" :password="true" />
				<input class="modal-input" v-model="passwordForm.confirmPwd" placeholder="确认新密码" :password="true" />
				<view class="modal-btn" @click="changePassword">
					<text>确认修改</text>
				</view>
			</view>
		</view>

		<!-- 意见反馈弹窗 -->
		<view class="modal-mask" v-if="showFeedback" @click="showFeedback = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">意见反馈</text>
				<textarea class="modal-textarea" v-model="feedbackContent" placeholder="请输入您的意见或建议..." />
				<view class="modal-btn" @click="submitFeedback">
					<text>提交</text>
				</view>
			</view>
		</view>

		<!-- 我的工单 -->
		<view class="modal-mask" v-if="showTickets" @click="showTickets = false">
			<view class="modal-wrap large" @click.stop>
				<text class="modal-title">我的工单</text>
				<view class="ticket-list">
					<view class="ticket-item" v-for="(t, i) in myTickets" :key="i">
						<text class="ticket-q">{{ t.question }}</text>
						<view class="ticket-meta">
							<text class="ticket-status" :style="{ color: t.statusColor }">{{ t.statusText }}</text>
							<text class="ticket-time">{{ t.time }}</text>
						</view>
					</view>
				</view>
				<empty-state v-if="myTickets.length === 0" text="暂无工单" />
				<view class="modal-btn" @click="showTickets = false">
					<text>关闭</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import EmptyState from '@/common/components/empty-state.vue'
import store from '@/common/store/index.js'
import { ticketStatusMap } from '@/common/utils/helper.js'

export default {
	components: { EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			showNotification: false,
			showPassword: false,
			showFeedback: false,
			showTickets: false,
			avatarSpin: false,
			settings: { chatNotify: true, humanNotify: true },
			passwordForm: { oldPwd: '', newPwd: '', confirmPwd: '' },
			feedbackContent: '',
			userInfo: {},
			stats: [
				{ num: 3, label: '工单' },
				{ num: 12, label: '提问' },
				{ num: 5, label: '收藏' }
			],
			myTickets: [
				{ question: '关于休学申请流程咨询', status: 'pending', statusText: '待受理', statusColor: '#F0AD4E', time: '05-20' },
				{ question: '宿舍空调报修', status: 'processing', statusText: '处理中', statusColor: '#4A90D9', time: '05-19' },
				{ question: '奖学金申请条件', status: 'completed', statusText: '已完结', statusColor: '#4CD964', time: '05-18' }
			],
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.userInfo = store.state.userInfo || { name: '学生', id: '2026001', className: '计算机2601' }
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		onAvatarTap() {
			this.avatarSpin = true
			setTimeout(() => { this.avatarSpin = false }, 800)
		},
		goPage(type) {
			switch (type) {
				case 'password': this.showPassword = true; break
				case 'notification': this.showNotification = true; break
				case 'tickets': this.showTickets = true; break
				case 'feedback': this.showFeedback = true; break
				case 'about':
					uni.showModal({
						title: '关于AI辅导员',
						content: '版本：v1.0.0\nAI辅导员小程序为学生提供智能问答、校园服务等功能。',
						showCancel: false
					})
					break
			}
		},
		changePassword() {
			if (!this.passwordForm.oldPwd || !this.passwordForm.newPwd) {
				uni.showToast({ title: '请填写完整', icon: 'none' })
				return
			}
			if (this.passwordForm.newPwd !== this.passwordForm.confirmPwd) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return
			}
			uni.showToast({ title: '修改成功', icon: 'success' })
			this.showPassword = false
			this.passwordForm = { oldPwd: '', newPwd: '', confirmPwd: '' }
		},
		submitFeedback() {
			if (!this.feedbackContent.trim()) {
				uni.showToast({ title: '请输入反馈内容', icon: 'none' })
				return
			}
			uni.showToast({ title: '提交成功', icon: 'success' })
			this.showFeedback = false
			this.feedbackContent = ''
		},
		handleLogout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						store.mutations.logout()
						uni.reLaunch({ url: '/subpackages/login/pages/login' })
					}
				}
			})
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

.profile-header {
	background: linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 50%, #E8F4FD 100%);
	background-size: 200% 200%;
	overflow: hidden;
	position: relative;
}

.header-status { background: #E8F4FD; }

/* 浮动装饰气泡 */
.float-bubble {
	position: absolute;
	border-radius: 50%;
	background: rgba(91, 155, 213, 0.08);
	z-index: 0;
}

.b1 {
	width: 120rpx; height: 120rpx;
	top: 10%; left: 5%;
}
.b2 {
	width: 80rpx; height: 80rpx;
	top: 20%; right: 10%;
	background: rgba(91, 155, 213, 0.06);
}
.b3 {
	width: 60rpx; height: 60rpx;
	bottom: 15%; left: 15%;
	background: rgba(91, 155, 213, 0.1);
}
.b4 {
	width: 100rpx; height: 100rpx;
	bottom: 10%; right: 5%;
	background: rgba(91, 155, 213, 0.05);
}
.b5 {
	width: 40rpx; height: 40rpx;
	top: 50%; left: 50%;
	background: rgba(91, 155, 213, 0.12);
}

.header-back-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
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

.back-icon {
	font-size: 48rpx;
	color: #5B9BD5;
	transition: transform 0.2s ease;
}

.header-bar-title {
	font-size: 34rpx;
	color: #5B9BD5;
	font-weight: 500;
}

.header-content {
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.avatar-wrap {
	margin-bottom: 16rpx;
	position: relative;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: rgba(91, 155, 213, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid rgba(91, 155, 213, 0.3);
	animation: avatarGlow 2.5s ease-in-out 1s infinite, avatarIdle 3s ease-in-out 2s infinite;
	transition: transform 0.3s ease;
	&.spinning {
	}
}

.avatar-ring {
	position: absolute;
	top: -10rpx;
	left: -10rpx;
	right: -10rpx;
	bottom: -10rpx;
	border-radius: 50%;
	border: 2rpx dashed rgba(91, 155, 213, 0.2);
	animation: ringRotate 12s linear infinite;
}

.ring2 {
	top: -20rpx;
	left: -20rpx;
	right: -20rpx;
	bottom: -20rpx;
	border-color: rgba(91, 155, 213, 0.1);
	animation: ringRotate 18s linear infinite reverse;
}

.avatar-text {
	font-size: 44rpx;
	color: #5B9BD5;
	font-weight: 600;
}

.user-name {
	font-size: 34rpx;
	color: #5B9BD5;
	font-weight: 600;
	margin-bottom: 8rpx;
}

.user-info {
	font-size: 24rpx;
	color: rgba(91, 155, 213, 0.7);
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 140rpx;
}

/* 数据统计卡片 */
.stats-card {
	display: flex;
	margin: 24rpx 24rpx 0;
	background: #FFF;
	border-radius: 16rpx;
	padding: 28rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(91, 155, 213, 0.08);
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	opacity: 0;
		animation: statPop 0.5s ease forwards;
		&:nth-child(1) { animation-delay: 0.1s; }
		&:nth-child(2) { animation-delay: 0.2s; }
		&:nth-child(3) { animation-delay: 0.3s; }
	&:not(:last-child)::after {
		content: '';
		position: absolute;
		right: 0;
		top: 20%;
		height: 60%;
		width: 1rpx;
		background: rgba(91, 155, 213, 0.15);
		transform: scaleY(0);
	}
}

.stat-num {
	font-size: 40rpx;
	color: #5B9BD5;
	font-weight: 700;
	margin-bottom: 8rpx;
	animation: numBounce 2s ease-in-out 1s infinite;
}

.stat-label {
	font-size: 24rpx;
	color: #999;
}

.menu-section {
	margin: 24rpx 24rpx 0;
	background: #FFF;
	border-radius: 16rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #F5F5F5;
	transition: all 0.2s ease;
	&:last-child { border-bottom: none; }
	&:active {
		background: #F0F8FF;
		padding-left: 40rpx;
		.menu-icon { transform: scale(1.3) rotate(-10deg); }
		.menu-arrow-right {
			width: 14rpx;
			height: 14rpx;
			border-right: 2rpx solid #CCC;
			border-bottom: 2rpx solid #CCC;
			transform: rotate(-45deg);
		}

.menu-arrow { transform: translateX(6rpx); color: #5B9BD5; }
	}
}

.menu-icon {
	font-size: 36rpx;
	width: 48rpx;
	text-align: center;
	margin-right: 16rpx;
	transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.menu-badge {
	background: #DD524D;
	border-radius: 16rpx;
	min-width: 36rpx;
	height: 36rpx;
	padding: 0 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;
	animation: badgePulse 2s ease infinite;
	text {
		font-size: 20rpx;
		color: #FFF;
		font-weight: 600;
	}
}

.menu-arrow-right {
			width: 14rpx;
			height: 14rpx;
			border-right: 2rpx solid #CCC;
			border-bottom: 2rpx solid #CCC;
			transform: rotate(-45deg);
		}

.menu-arrow {
	font-size: 32rpx;
	color: #CCC;
	transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
}

.logout-btn {
	margin: 40rpx 24rpx 0;
	height: 88rpx;
	background: #FFF;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	color: #DD524D;
	transition: transform 0.15s ease, opacity 0.15s ease;
	&:active { transform: scale(0.97); opacity: 0.8; }
}

.bottom-space { height: 40rpx; }

.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-wrap {
	width: 600rpx;
	max-height: 80vh;
	background: #FFF;
	border-radius: 20rpx;
	padding: 40rpx;
	overflow-y: auto;
	animation: modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
	&.large { width: 660rpx; }
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 24rpx;
}

.modal-input {
	height: 76rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	margin-bottom: 16rpx;
	transition: box-shadow 0.3s ease;
	&:focus { box-shadow: 0 0 0 2rpx rgba(91, 155, 213, 0.3); }
}

.modal-textarea {
	width: 100%;
	height: 200rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	margin-bottom: 16rpx;
	box-sizing: border-box;
	transition: box-shadow 0.3s ease;
}

.setting-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	font-size: 28rpx;
	color: #333;
}

.modal-btn {
	height: 76rpx;
	background: linear-gradient(135deg, #5B9BD5, #7BB8E8);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FFF;
	font-size: 28rpx;
	font-weight: 500;
	margin-top: 16rpx;
	transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.3s ease;
	&:active { transform: scale(0.97); opacity: 0.85; }
	&:hover { box-shadow: 0 4rpx 16rpx rgba(91, 155, 213, 0.3); }
}

.ticket-list {
	margin-bottom: 16rpx;
}

.ticket-item {
	padding: 16rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.ticket-q {
	font-size: 26rpx;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.ticket-meta {
	display: flex;
	justify-content: space-between;
}

.ticket-status {
	font-size: 22rpx;
}

.ticket-time {
	font-size: 22rpx;
	color: #999;
}

/* ====== 关键帧动画 ====== */



@keyframes avatarPop {
	0% { opacity: 0; transform: scale(0.3) rotate(-15deg); }
	50% { transform: scale(1.15) rotate(5deg); }
	70% { transform: scale(0.95) rotate(-2deg); }
	100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes avatarGlow {
	0%, 100% { box-shadow: 0 0 0 0 rgba(91, 155, 213, 0.3); }
	50% { box-shadow: 0 0 0 16rpx rgba(91, 155, 213, 0); }
}

@keyframes avatarIdle {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-6rpx); }
}

@keyframes avatarSpin {
	0% { transform: scale(1) rotate(0deg); }
	50% { transform: scale(1.1) rotate(180deg); }
	100% { transform: scale(1) rotate(360deg); }
}

@keyframes ringRotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}




@keyframes modalPop {
	0% { opacity: 0; transform: scale(0.7) translateY(20rpx); }
	60% { transform: scale(1.03) translateY(-5rpx); }
	100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes menuItemSlide {
	0% { opacity: 0; transform: translateX(-40rpx); }
	60% { transform: translateX(8rpx); }
	100% { opacity: 1; transform: translateX(0); }
}

@keyframes sectionSlideUp {
	0% { opacity: 0; transform: translateY(40rpx); }
	100% { opacity: 1; transform: translateY(0); }
}

@keyframes statPop {
	0% { opacity: 0; transform: scale(0.5) translateY(20rpx); }
	60% { transform: scale(1.08) translateY(-5rpx); }
	100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes lineGrow {
	from { transform: scaleY(0); }
	to { transform: scaleY(1); }
}

@keyframes numBounce {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-4rpx); }
}

@keyframes badgePulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.15); }
}
</style>
