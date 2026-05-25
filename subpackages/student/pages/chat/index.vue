<template>
	<view class="page">
		<view class="chat-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">智能问答</text>
				<view class="header-right" @click="goHistory">
					<text class="history-icon iconfont icon-caozuorizhi"></text>
				</view>
			</view>
		</view>

		<scroll-view
			scroll-y
			class="chat-list"
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			ref="chatList"
		>
			<view class="chat-messages">
				<view
					class="message-item"
					v-for="(msg, i) in messages"
					:key="i"
					:class="{ 'message-self': msg.role === 'user' }"
				>
					<view class="message-avatar" v-if="msg.role === 'ai'">
						<text class="avatar-ai">AI</text>
					</view>
					<view class="message-bubble" :class="{ 'bubble-self': msg.role === 'user' }">
						<text class="message-text">{{ msg.content }}</text>
						<view class="message-source" v-if="msg.source && msg.role === 'ai'">
							<text>来源：{{ msg.source }}</text>
						</view>
						<view class="message-actions" v-if="msg.role === 'ai' && !msg.loading">
							<view class="action-btn" @click="likeMsg(msg)">
								<text class="iconfont icon-gongneng" :class="{ liked: msg.liked }"></text>
							</view>
							<view class="action-btn" @click="dislikeMsg(msg)">
								<text class="iconfont icon-yijianfankui" :class="{ disliked: msg.disliked }"></text>
							</view>
						</view>
						<view class="typing-indicator" v-if="msg.loading">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
					</view>
					<view class="message-avatar" v-if="msg.role === 'user'">
						<text class="avatar-user">我</text>
					</view>
				</view>
			</view>

			<!-- 转人工入口 -->
			<view class="transfer-human" v-if="showTransfer">
				<text class="transfer-text">没有找到答案？</text>
				<view class="transfer-btn" @click="transferToHuman">
					<text>转人工服务</text>
				</view>
			</view>
		</scroll-view>

		<!-- 反馈弹窗 -->
		<view class="feedback-mask" v-if="showFeedback" @click="showFeedback = false">
			<view class="feedback-popup" @click.stop>
				<text class="feedback-title">问题反馈</text>
				<textarea
					class="feedback-input"
					v-model="feedbackContent"
					placeholder="请描述您的问题..."
					maxlength="200"
				/>
				<view class="feedback-btns">
					<view class="feedback-cancel" @click="showFeedback = false">
						<text>取消</text>
					</view>
					<view class="feedback-submit" @click="submitFeedback">
						<text>提交</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 输入区 -->
		<view class="input-bar">
			<view class="input-wrap">
				<input
					class="chat-input"
					v-model="inputText"
					placeholder="请输入您的问题..."
					confirm-type="send"
					@confirm="sendMessage"
					:adjust-position="false"
				/>
			</view>
			<view class="voice-btn" @touchstart="startVoice" @touchend="stopVoice">
				<text :class="{ recording: isRecording }">{{ isRecording ? '松开' : '语音' }}</text>
			</view>
			<view class="send-btn" @click="sendMessage" :class="{ active: inputText.trim() }">
				<text>发送</text>
			</view>
		</view>

		<!-- 录音动画 -->
		<view class="recording-overlay" v-if="isRecording">
			<view class="recording-popup">
				<view class="recording-wave">
					<view class="wave-bar" v-for="n in 5" :key="n"></view>
				</view>
				<text class="recording-text">正在录音...</text>
			</view>
		</view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			scrollTop: 0,
			inputText: '',
			messages: [],
			isRecording: false,
			showTransfer: false,
			showFeedback: false,
			feedbackContent: '',
			currentFeedbackMsg: null,
			sessionId: ''
		}
	},
	onLoad(options) {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.sessionId = ''

		if (options.sessionId) {
			this.sessionId = options.sessionId
			this.loadSessionDetail(options.sessionId)
		}
		if (options.question) {
			this.inputText = decodeURIComponent(options.question)
			this.$nextTick(() => this.sendMessage())
		}
	},
	onLongPress(e) {
		// 长按复制由各平台原生支持
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		goHistory() {
			uni.navigateTo({ url: '/subpackages/student/pages/chat/history/index' })
		},
		scrollToBottom() {
			this.$nextTick(() => {
				this.scrollTop = this.messages.length * 1000
			})
		},
		async loadSessionDetail(sessionId) {
			try {
				const res = await api.getChatDetail(sessionId)
				if (res) {
					this.sessionId = res.sessionId
					this.messages = (res.messages || []).map(msg => ({
						role: msg.role === 'assistant' ? 'ai' : msg.role,
						content: msg.content,
						loading: false,
						liked: false,
						disliked: false,
						time: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now()
					}))
					if (this.messages.length > 0) {
						this.showTransfer = true
					}
					this.scrollToBottom()
				}
			} catch (e) {
				console.error('加载会话详情失败', e)
			}
		},
		async sendMessage() {
			const text = this.inputText.trim()
			if (!text) return

			this.messages.push({
				role: 'user',
				content: text,
				time: Date.now()
			})
			this.inputText = ''
			this.scrollToBottom()

			const aiMsg = {
				role: 'ai',
				content: '',
				source: '',
				loading: true,
				liked: false,
				disliked: false,
				time: Date.now()
			}
			this.messages.push(aiMsg)
			this.scrollToBottom()

			try {
				const res = await api.sendMessage({ message: text, sessionId: this.sessionId || undefined })
				if (res) {
					this.sessionId = res.sessionId || this.sessionId
					aiMsg.content = res.reply || '抱歉，暂时无法回答您的问题。'
				} else {
					aiMsg.content = '抱歉，服务暂时不可用，请稍后再试。'
				}
			} catch (e) {
				console.error('发送消息失败', e)
				aiMsg.content = '网络异常，请检查网络后重试。'
			}
			aiMsg.loading = false
			this.showTransfer = true
			this.scrollToBottom()
		},
		async likeMsg(msg) {
			msg.liked = !msg.liked
			if (msg.liked) {
				msg.disliked = false
				try {
					const msgIndex = this.messages.indexOf(msg)
					await api.submitFeedback({ sessionId: this.sessionId, messageIndex: msgIndex, type: 'like' })
				} catch (e) {}
			}
		},
		dislikeMsg(msg) {
			msg.disliked = !msg.disliked
			if (msg.disliked) {
				msg.liked = false
				this.currentFeedbackMsg = msg
				this.showFeedback = true
			}
		},
		async submitFeedback() {
			if (!this.feedbackContent.trim()) {
				uni.showToast({ title: '请输入反馈内容', icon: 'none' })
				return
			}
			try {
				await api.submitFeedback({ sessionId: this.sessionId, messageIndex: this.messages.indexOf(this.currentFeedbackMsg), type: 'dislike' })
			} catch (e) {}
			uni.showToast({ title: '反馈已提交', icon: 'success' })
			this.showFeedback = false
			this.feedbackContent = ''
		},
		startVoice() {
			this.isRecording = true
			// 语音录制逻辑
		},
		stopVoice() {
			this.isRecording = false
			// 停止录制并转文字
			uni.showToast({ title: '语音识别中...', icon: 'loading' })
		},
		transferToHuman() {
			uni.showModal({
				title: '转人工服务',
				content: '确认将当前对话转为人工服务？辅导员会尽快为您处理。',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '已提交工单', icon: 'success' })
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

.chat-header {
	background: linear-gradient(180deg, #E8F4FD, #F0F8FF);
	flex-shrink: 0;
}

.header-status {
	background: #E8F4FD;
}

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
}

.header-back {
	width: 60rpx;
	height: 100%;
	display: flex;
	align-items: center;
}

.back-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #5B9BD5;
	border-bottom: 3rpx solid #5B9BD5;
	transform: rotate(45deg);
}

.header-title {
	font-size: 34rpx;
	color: #5B9BD5;
	font-weight: 500;
}

.header-right {
	width: 60rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.history-icon {
	font-size: 36rpx;
}

.chat-list {
	flex: 1;
	height: 0;
	padding: 20rpx;
}

.chat-messages {
	display: flex;
	flex-direction: column;
}

.message-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
	&.message-self {
		justify-content: flex-end;
	}
}

.message-avatar {
	flex-shrink: 0;
	margin-right: 12rpx;
	.message-self & {
		margin-right: 0;
		margin-left: 12rpx;
	}
}

.avatar-ai {
	display: flex;
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: #4A90D9;
	color: #5B9BD5;
	font-size: 22rpx;
	align-items: center;
	justify-content: center;
	font-weight: 600;
}

.avatar-user {
	display: flex;
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: #4CD964;
	color: #5B9BD5;
	font-size: 22rpx;
	align-items: center;
	justify-content: center;
}

.message-bubble {
	max-width: 70%;
	background: #FFFFFF;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	&.bubble-self {
		background: #4A90D9;
		.message-text { color: #5B9BD5; }
	}
}

.message-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	word-break: break-all;
}

.message-source {
	margin-top: 12rpx;
	padding-top: 12rpx;
	border-top: 1rpx solid #F0F0F0;
	font-size: 22rpx;
	color: #999;
}

.message-actions {
	display: flex;
	margin-top: 12rpx;
	padding-top: 12rpx;
	border-top: 1rpx solid #F0F0F0;
	gap: 20rpx;
}

.action-btn {
	font-size: 28rpx;
	.liked { color: #4A90D9; }
	.disliked { color: #DD524D; }
}

.typing-indicator {
	display: flex;
	gap: 8rpx;
	padding: 8rpx 0;
}

.dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #CCC;
	animation: dotBlink 1.4s infinite;
}

@keyframes dotBlink {
	0%, 80%, 100% { opacity: 0.3; }
	40% { opacity: 1; }
}

.transfer-human {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx;
	gap: 16rpx;
}

.transfer-text {
	font-size: 24rpx;
	color: #999;
}

.transfer-btn {
	padding: 12rpx 28rpx;
	background: #F0AD4E;
	border-radius: 28rpx;
	font-size: 24rpx;
	color: #5B9BD5;
}

.input-bar {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	padding: 16rpx 20rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	background: #FFF;
	border-top: 1rpx solid #EEE;
}

.input-wrap {
	flex: 1;
}

.chat-input {
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 36rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.voice-btn {
	width: 80rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 12rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	font-size: 22rpx;
	color: #666;
	.recording { color: #DD524D; }
}

.send-btn {
	width: 100rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 12rpx;
	background: #CCC;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #5B9BD5;
	&.active { background: #4A90D9; }
}

.recording-overlay {
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

.recording-popup {
	background: rgba(0, 0, 0, 0.75);
	border-radius: 20rpx;
	padding: 60rpx 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.recording-wave {
	display: flex;
	gap: 8rpx;
	margin-bottom: 20rpx;
}

.wave-bar {
	width: 6rpx;
	height: 40rpx;
	background: #FFF;
	border-radius: 3rpx;
	animation: wave 0.8s infinite ease-in-out;
}

@keyframes wave {
	0%, 100% { transform: scaleY(0.6); }
	50% { transform: scaleY(1.2); }
}

.recording-text {
	color: #5B9BD5;
	font-size: 26rpx;
}

.feedback-mask {
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

.feedback-popup {
	width: 600rpx;
	background: #FFF;
	border-radius: 20rpx;
	padding: 40rpx;
}

.feedback-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
	display: block;
}

.feedback-input {
	width: 100%;
	height: 200rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	margin-bottom: 24rpx;
	box-sizing: border-box;
}

.feedback-btns {
	display: flex;
	gap: 20rpx;
}

.feedback-cancel, .feedback-submit {
	flex: 1;
	height: 76rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 28rpx;
}

.feedback-cancel {
	background: #F5F6FA;
	color: #666;
}

.feedback-submit {
	background: #4A90D9;
	color: #5B9BD5;
}
</style>
