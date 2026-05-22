<template>
	<view class="page">
		<view class="login-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="float-bubble b1"></view>
			<view class="float-bubble b2"></view>
			<view class="float-bubble b3"></view>
			<view class="float-bubble b4"></view>
			<view class="float-bubble b5"></view>
			<view class="float-bubble b6"></view>
			<view class="float-bubble b7"></view>
			<view class="header-content">
				<view class="logo-wrap">
					<view class="logo-glow"></view>
					<view class="logo-circle">
						<view class="logo-ring"></view>
						<view class="logo-ring ring2"></view>
						<image class="logo-img" src="/static/1.png" mode="aspectFill"></image>
					</view>
				</view>
				<text class="app-title">AI辅导员</text>
				<view class="slogan-wrap">
					<text class="app-desc">智能问答 · 高效服务 · 伴你成长</text>
				</view>
			</view>
		</view>
		<view class="wave-separator"><view class="wave"></view><view class="wave wave2"></view></view>

		<view class="login-card">
			<view class="welcome-text">
				<text class="welcome-title">欢迎回来</text>
				<text class="welcome-sub">请登录您的账号</text>
			</view>

			<view class="role-tabs">
				<view class="tab-slider" :style="{ left: role === 'student' ? '6rpx' : '50%' }"></view>
				<view class="role-tab" :class="{ active: role === 'student' }" @click="switchRole('student')">
					<text>学生</text>
				</view>
				<view class="role-tab" :class="{ active: role === 'counselor' }" @click="switchRole('counselor')">
					<text>辅导员</text>
				</view>
			</view>

			<view class="login-form" :key="formKey" :class="{ switching: formKey > 0 }">
				<view class="input-group" :class="{ focused: focusField === 'username', filled: username }">
					<text class="input-icon iconfont icon-zhanghaoguanli"></text>
					<view class="input-wrap">
						<text class="float-label" :class="{ up: focusField === 'username' || username }">学号/工号</text>
						<input class="login-input" v-model="username" @focus="focusField = 'username'" @blur="focusField = ''" />
					</view>
				</view>
				<view class="input-group" :class="{ focused: focusField === 'password', filled: password }">
					<text class="input-icon iconfont icon-suo"></text>
					<view class="input-wrap">
						<text class="float-label" :class="{ up: focusField === 'password' || password }">密码</text>
						<input class="login-input" :password="!showPw" v-model="password" @focus="focusField = 'password'" @blur="focusField = ''" />
					</view>
					<view class="input-eye" @click="showPw = !showPw">
						<text class="iconfont" :class="showPw ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'"></text>
					</view>
				</view>

				<view class="login-btn" :class="{ loading }" @click="handleLogin">
					<view class="btn-shimmer"></view>
					<view v-if="loading" class="btn-loading">
						<view class="spinner"></view>
						<text>登录中...</text>
					</view>
					<text v-else>登 录</text>
				</view>

				<view class="forgot-link" @click="forgotPw">
					<text>忘记密码？</text>
				</view>
			</view>

			<view class="card-footer">
				<text>登录即表示同意</text>
				<text class="link" @click="showAgreement">《用户协议》</text>
				<text>和</text>
				<text class="link" @click="showPrivacy">《隐私政策》</text>
			</view>
		</view>

		<view class="feature-tags">
			<view class="feature-tag"><text>AI智能问答</text></view>
			<view class="feature-tag"><text>校园服务</text></view>
			<view class="feature-tag"><text>在线办事</text></view>
		</view>

		<view class="error-toast" v-if="errorMsg">
			<text>{{ errorMsg }}</text>
		</view>

			<view class="success-overlay" v-if="showSuccess" @click.stop>
				<view class="success-card">
					<view class="success-circle">
						<view class="success-check">
							<view class="check-stem"></view>
							<view class="check-kick"></view>
						</view>
					</view>
					<text class="success-title">登录成功</text>
					<text class="success-sub">欢迎回来，{{ successName }}</text>
				</view>
			</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			role: 'student',
			username: '',
			password: '',
			showPw: false,
			focusField: '',
			loading: false,
			errorMsg: '',
			showSuccess: false,
			successName: '',
			formKey: 0
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
	},
	methods: {
		switchRole(r) {
			if (this.role === r) return
			this.role = r
			this.formKey++
		},
			handleLogin() {
			if (!this.username || !this.password) {
				this.showError('请输入账号和密码')
				return
			}
			this.loading = true
			setTimeout(() => {
				this.loading = false
				this.successName = this.role === 'student' ? '同学' : '老师'
				this.showSuccess = true
				setTimeout(() => {
					const url = this.role === 'student'
						? '/subpackages/student/pages/home/index'
						: '/subpackages/counselor/pages/workspace/index'
					uni.reLaunch({ url })
				}, 1200)
			}, 1500)
		},
		forgotPw() {
			uni.showToast({ title: '请联系管理员重置密码', icon: 'none' })
		},
		showAgreement() {
			uni.showToast({ title: '用户协议', icon: 'none' })
		},
		showPrivacy() {
			uni.showToast({ title: '隐私政策', icon: 'none' })
		},
		showError(msg) {
			this.errorMsg = msg
			setTimeout(() => { this.errorMsg = '' }, 2000)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: linear-gradient(180deg, #E0F0FA 0%, #EAF4FD 30%, #F0F8FF 60%, #F5F6FA 100%);
	position: relative;
}

/* ===== 头部 ===== */
.login-header {
	padding-bottom: 80rpx;
	position: relative;
	overflow: hidden;
	background: linear-gradient(135deg, #4A90D9 0%, #6BA5E7 50%, #7BB8E8 100%);
	background-size: 200% 200%;
	animation: headerShimmer 6s ease infinite;
}

/* 浮动装饰气泡 */
.float-bubble {
	position: absolute;
	border-radius: 50%;
	z-index: 0;
	background: rgba(255,255,255,0.15);
	animation: floatBubble 4s ease-in-out infinite;
}
.b1 { animation-delay: 0s; animation-duration: 5s; }
.b2 { animation-delay: 0.5s; animation-duration: 4.5s; }
.b3 { animation-delay: 1s; animation-duration: 4s; }
.b4 { animation-delay: 0.3s; animation-duration: 5.5s; }
.b5 { animation-delay: 0.8s; animation-duration: 3.5s; }
.b6 { animation-delay: 1.2s; animation-duration: 4.8s; }
.b7 { animation-delay: 0.6s; animation-duration: 4.2s; }
.b1 { width: 120rpx; height: 120rpx; top: 8%; left: 3%; }
.b2 { width: 80rpx; height: 80rpx; top: 25%; right: 6%; background: rgba(255,255,255,0.12); }
.b3 { width: 50rpx; height: 50rpx; bottom: 10%; left: 15%; background: rgba(255,255,255,0.2); }
.b4 { width: 90rpx; height: 90rpx; bottom: 20%; right: 3%; }
.b5 { width: 40rpx; height: 40rpx; top: 50%; left: 60%; background: rgba(255,255,255,0.18); }
.b6 { width: 65rpx; height: 65rpx; top: 12%; left: 45%; background: rgba(255,255,255,0.1); }
.b7 { width: 35rpx; height: 35rpx; top: 35%; right: 25%; background: rgba(255,255,255,0.14); }

.header-status { background: #4A90D9; }

.header-content {
	padding: 48rpx 48rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.logo-wrap {
	margin-bottom: 24rpx;
	position: relative;
}

.logo-glow {
	position: absolute;
	top: 50%; left: 50%;
	transform: translate(-50%, -50%);
	width: 180rpx; height: 180rpx;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
	animation: logoGlow 3s ease-in-out infinite;
}

.logo-circle {
	width: 130rpx;
	height: 130rpx;
	border-radius: 50%;
	background: rgba(255,255,255,0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid rgba(255,255,255,0.9);
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(74,144,217,0.2), 0 0 40rpx rgba(255,255,255,0.3);
	position: relative;
	z-index: 1;
	animation: logoBreath 3s ease-in-out infinite;
}

.logo-ring {
	position: absolute;
	top: -14rpx; left: -14rpx; right: -14rpx; bottom: -14rpx;
	border-radius: 50%;
	border: 2rpx dashed rgba(255,255,255,0.25);
	animation: ringRotate 12s linear infinite;
}

.ring2 {
	top: -28rpx; left: -28rpx; right: -28rpx; bottom: -28rpx;
	border-color: rgba(255,255,255,0.12);
	animation-direction: reverse;
	animation-duration: 18s;
}

.logo-img {
	width: 130rpx;
	height: 130rpx;
	border-radius: 50%;
	animation: logoImgFloat 4s ease-in-out infinite;
}

.app-title {
	font-size: 58rpx;
	color: #FFF;
	font-weight: 700;
	display: block;
	margin-bottom: 12rpx;
	letter-spacing: 6rpx;

}

.slogan-wrap {
	height: 36rpx;
	overflow: hidden;

}

.app-desc {
	font-size: 26rpx;
	color: rgba(255,255,255,0.75);
	letter-spacing: 2rpx;

}

/* ===== 波浪分隔 ===== */
.wave-separator {
	height: 50rpx;
	position: relative;
	margin-top: -50rpx;
	z-index: 2;

}

.wave {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50rpx;
	background: #F5F6FA;
	border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.wave2 {
	height: 50rpx;
	background: rgba(234,244,253,0.5);
	border-radius: 40% 60% 0 0 / 100% 100% 0 0;
	animation: waveFloat 3s ease-in-out infinite;
}

/* ===== 登录卡片 ===== */
.login-card {
	margin: -20rpx 32rpx 0;
	background: #FFFFFF;
	border-radius: 28rpx;
	padding: 48rpx 36rpx;
	box-shadow: 0 12rpx 48rpx rgba(91,155,213,0.1), 0 4rpx 16rpx rgba(0,0,0,0.04);
	position: relative;
	z-index: 3;

}

.welcome-text {
	margin-bottom: 32rpx;

}

.welcome-title {
	font-size: 44rpx;
	color: #333;
	font-weight: 700;
	display: block;
	margin-bottom: 8rpx;
}

.welcome-sub {
	font-size: 26rpx;
	color: #999;
}

/* 身份切换 */
.role-tabs {
	display: flex;
	background: #F0F4FA;
	border-radius: 16rpx;
	padding: 6rpx;
	margin-bottom: 40rpx;
	position: relative;
}

.tab-slider {
	position: absolute;
	top: 6rpx;
	width: calc(50% - 12rpx);
	height: calc(100% - 12rpx);
	background: #FFFFFF;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 16rpx rgba(91,155,213,0.12);
	transition: left 0.35s cubic-bezier(0.34,1.56,0.64,1);
	z-index: 0;

}

.role-tab {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	font-size: 28rpx;
	color: #999;
	border-radius: 12rpx;
	transition: all 0.3s ease;
	position: relative;
	z-index: 1;
	&.active {
		color: #3A7CC5;
		font-weight: 600;
	}
}

/* 表单 */
.login-form {
	display: flex;
	flex-direction: column;

}

.login-form.switching {

}

.input-group {
	display: flex;
	align-items: center;
	height: 100rpx;
	background: #F7FAFE;
	border-radius: 16rpx;
	padding: 0 24rpx;
	margin-bottom: 24rpx;
	border: 2rpx solid #EDF2F7;

	transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
	&.focused {
		border-color: rgba(91,155,213,0.4);
		box-shadow: 0 0 0 4rpx rgba(91,155,213,0.08);
		background: #FFF;
	}
	&.filled {
		border-color: rgba(91,155,213,0.2);
	}
}

.input-icon {
	font-size: 34rpx;
	margin-right: 18rpx;
	width: 48rpx;
	text-align: center;
}

.input-wrap {
	flex: 1;
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;
}

.float-label {
	position: absolute;
	left: 0;
	font-size: 28rpx;
	color: #CCC;
	transition: all 0.25s ease;
	pointer-events: none;
	&.up {
		transform: translateY(-28rpx) scale(0.8);
		font-size: 20rpx;
		color: #4A90D9;
	}
}

.login-input {
	width: 100%;
	height: 100%;
	font-size: 28rpx;
	color: #333;
}

.input-eye {
	width: 56rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
	transition: transform 0.2s ease;
	&:active { transform: scale(1.2); }
}

/* 登录按钮 */
.login-btn {
	height: 96rpx;
	background: linear-gradient(135deg, #4A90D9 0%, #6BA8E4 50%, #7BB8E8 100%);
	background-size: 200% 200%;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
	color: #FFF;
	font-weight: 600;
	margin-top: 16rpx;
	letter-spacing: 12rpx;
	animation: btnGradient 4s ease infinite;
	transition: transform 0.15s ease, box-shadow 0.3s ease;
	box-shadow: 0 8rpx 24rpx rgba(74,144,217,0.35);
	position: relative;
	overflow: hidden;
	&:active {
		transform: scale(0.97);
		box-shadow: 0 4rpx 12rpx rgba(74,144,217,0.25);
	}
	&.loading {
		opacity: 0.85;
	}
}

.btn-shimmer {
	position: absolute;
	top: 0; left: -100%;
	width: 100%; height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
	animation: btnShimmer 3s ease infinite;
}

.btn-loading {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.spinner {
	width: 32rpx;
	height: 32rpx;
	border: 3rpx solid rgba(255,255,255,0.3);
	border-top-color: #FFF;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

.forgot-link {
	text-align: center;
	margin-top: 28rpx;
	font-size: 26rpx;
	color: rgba(91,155,213,0.6);

	transition: color 0.2s ease;
	&:active { color: #3A7CC5; }
}

.card-footer {
	text-align: center;
	margin-top: 36rpx;
	font-size: 22rpx;
	color: #CCC;

	.link {
		color: rgba(91,155,213,0.5);
		&:active { color: #3A7CC5; }
	}
}

/* 底部特性标签 */
.feature-tags {
	display: flex;
	justify-content: center;
	gap: 16rpx;
	padding: 32rpx 32rpx 16rpx;

}

.feature-tag {
	padding: 10rpx 20rpx;
	background: rgba(74,144,217,0.06);

	border: 1rpx solid rgba(74,144,217,0.1);
	border-radius: 20rpx;
	font-size: 22rpx;
	color: rgba(91,155,213,0.5);
}

/* 错误提示 */
.error-toast {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: rgba(0,0,0,0.8);
	color: #FFF;
	padding: 24rpx 48rpx;
	border-radius: 16rpx;
	font-size: 28rpx;
	z-index: 9999;

}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
@keyframes headerShimmer {
	0%, 100% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
}
@keyframes floatBubble {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-15rpx); }
}
@keyframes logoGlow {
	0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
	50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}
@keyframes ringRotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
@keyframes cardSlideUp {
	from { opacity: 0; transform: translateY(60rpx); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes btnShimmer {
	0% { left: -100%; }
	50%, 100% { left: 100%; }
}
@keyframes waveFloat {
	0%, 100% { transform: translateX(0); }
	50% { transform: translateX(10rpx); }
}
@keyframes fadeSlideDown {
	from { opacity: 0; transform: translateY(-30rpx); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUp {
	from { opacity: 0; transform: translateY(30rpx); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
@keyframes logoBreath {
	0%, 100% { transform: scale(1); box-shadow: 0 8rpx 32rpx rgba(74,144,217,0.2), 0 0 40rpx rgba(255,255,255,0.3); }
	50% { transform: scale(1.03); box-shadow: 0 12rpx 40rpx rgba(74,144,217,0.3), 0 0 60rpx rgba(255,255,255,0.4); }
}
@keyframes logoImgFloat {
	0%, 100% { transform: translateY(0) rotate(0deg); }
	25% { transform: translateY(-3rpx) rotate(2deg); }
	75% { transform: translateY(3rpx) rotate(-2deg); }
}
@keyframes btnGradient {
	0%, 100% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
}
@keyframes toastPop {
	from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
	to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes sliderEntry {
	from { opacity: 0; transform: scaleX(0.5); }
	to { opacity: 1; transform: scaleX(1); }
}
@keyframes waveEntry {
	from { opacity: 0; transform: translateY(20rpx); }
	to { opacity: 1; transform: translateY(0); }
}
@keyframes sloganReveal {
	from { opacity: 0; clip-path: inset(0 100% 0 0); }
	to { opacity: 1; clip-path: inset(0 0 0 0); }
}

.success-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	backdrop-filter: blur(8rpx);
}

.success-card {
	width: 400rpx;
	background: #FFF;
	border-radius: 32rpx;
	padding: 60rpx 40rpx 50rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-circle {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #4CD964, #7CE890);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(76, 217, 100, 0.3);
	animation: circlePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

.success-check {
	width: 52rpx;
	height: 32rpx;
	position: relative;
}

.check-stem {
	position: absolute;
	width: 6rpx;
	height: 0;
	background: #FFF;
	border-radius: 3rpx;
	left: 4rpx;
	bottom: 0;
	transform: rotate(-45deg);
	transform-origin: bottom left;
	animation: stemDraw 0.2s ease 0.35s forwards;
}

.check-kick {
	position: absolute;
	width: 6rpx;
	height: 0;
	background: #FFF;
	border-radius: 3rpx;
	left: 0;
	bottom: 8rpx;
	transform: rotate(45deg);
	transform-origin: bottom right;
	animation: kickDraw 0.15s ease 0.5s forwards;
}

.success-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
	margin-bottom: 12rpx;
	animation: textFade 0.3s ease 0.2s both;
}

.success-sub {
	font-size: 26rpx;
	color: #999;
	animation: textFade 0.3s ease 0.3s both;
}

@keyframes successPop {
	from { opacity: 0; transform: scale(0.7) translateY(20rpx); }
	to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes circlePop {
	from { opacity: 0; transform: scale(0.3); }
	to { opacity: 1; transform: scale(1); }
}

@keyframes stemDraw {
	from { height: 0; }
	to { height: 24rpx; }
}

@keyframes kickDraw {
	from { height: 0; }
	to { height: 44rpx; }
}

@keyframes textFade {
	from { opacity: 0; transform: translateY(10rpx); }
	to { opacity: 1; transform: translateY(0); }
}
</style>
