<template>
	<view class="page">
		<view class="home-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<text class="header-title">AI辅导员</text>
				<view class="header-actions" :style="{ paddingRight: actionsRight + 'px' }">
					<view class="header-btn" @click="goServices">
						<text class="btn-icon"><text class="iconfont icon-fuwu"></text></text>
						<text class="btn-text">服务</text>
					</view>
					<view class="header-btn" @click="goNotices">
						<text class="btn-icon"><text class="iconfont icon-tongzhi"></text></text>
						<text class="btn-text">通知</text>
					</view>
					<view class="header-btn" @click="goProfile">
						<text class="btn-icon"><text class="iconfont icon-wode"></text></text>
						<text class="btn-text">我的</text>
					</view>
				</view>
			</view>
		</view>

		<view class="dh-container">
			<video
				id="dhVideo"
				src="https://xhztest.xyz/live/stream1.m3u8"
				autoplay
				muted
				:controls="false"
				object-fit="cover"
				class="dh-player"
			/>
		</view>

		<scroll-view scroll-y class="chat-area" :scroll-into-view="scrollIntoView" scroll-with-animation @scroll="onChatScroll">
			<view class="welcome-card" v-if="messages.length === 0">
				<text class="welcome-title">你好，我是AI辅导员</text>
				<text class="welcome-desc">有什么问题可以问我</text>
			</view>

			<view class="chat-spacer" v-if="messages.length > 0"></view>

			<view class="chat-messages">
				<view
					class="message-item"
					v-for="(msg, i) in lastMessages"
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
						<view class="leave-buttons" v-if="msg.extra && msg.extra.buttons && !msg.answered">
							<view class="leave-btn" v-for="(btn, bi) in msg.extra.buttons" :key="bi" @click="onExtraBtn(msg, btn)">
								<text>{{ btn.label }}</text>
							</view>
						</view>
						<view class="leave-date-picker" v-if="msg.extra && msg.extra.isDatePicker && !msg.answered">
							<picker mode="multiSelector" :range="msg.extra.pickerColumns" :value="msg.extra.pickerValue" @columnchange="onDateColumnChange($event, msg)" @change="onDateConfirm($event, msg)">
								<view class="leave-btn">
									<text>{{ msg.extra.dateLabel || '选择日期时间' }}</text>
								</view>
							</picker>
						</view>
						<view class="message-actions" v-if="msg.role === 'ai' && !msg.loading && !msg.extra">
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

			<view class="transfer-human" v-if="showTransfer">
				<text class="transfer-text">没有找到答案？</text>
				<view class="transfer-btn" @click="transferToHuman">
					<text>转人工服务</text>
				</view>
			</view>
			<view id="msg-bottom"></view>
		</scroll-view>

		<view class="scroll-bottom-btn" v-if="showScrollBtn" @click="scrollToBottom">
			<view class="scroll-bottom-arrow"></view>
		</view>

		<view class="footer-fixed">
			<view class="quick-tags-bar">
				<scroll-view scroll-x class="quick-tags-scroll" :show-scrollbar="false">
					<view class="quick-tags">
						<view class="quick-tag" v-for="(tag, i) in quickTags" :key="i" @click="sendQuick(tag)">
							<text>{{ tag }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="input-bar">
				<view class="voice-btn" @click="toggleVoiceMode">
					<image class="voice-icon" :src="voiceMode ? '/static/jianpan.svg' : '/static/saying.svg'" mode="aspectFit" />
				</view>
				<view class="input-box" v-if="!voiceMode">
					<input
						class="chat-input"
						v-model="inputText"
						:placeholder="leavePlaceholder"
						confirm-type="send"
						@confirm="sendMessage"
					/>
				</view>
				<view class="voice-box" v-else @touchstart="startVoice" @touchmove="moveVoice" @touchend="stopVoice">
					<text class="voice-hold-text" :class="{ recording: isRecording, cancel: willCancel }">{{ isRecording ? (willCancel ? '松开取消' : '松开发送') : '按住说话' }}</text>
				</view>
				<view class="send-btn" v-if="!voiceMode" @click="sendMessage" :class="{ active: inputText.trim() }">
					<text class="send-icon">✓</text>
				</view>
			</view>
		</view>

		<view class="recording-overlay" v-if="isRecording">
			<view class="recording-popup">
				<view class="recording-wave">
					<view class="wave-bar" v-for="n in 5" :key="n"></view>
				</view>
				<text class="recording-text">{{ willCancel ? '松开取消' : '正在识别...' }}</text>
				<text class="recording-result" v-if="recognizedText">{{ recognizedText }}</text>
			</view>
			<view class="cancel-zone" :class="{ 'cancel-active': willCancel }">
				<text class="cancel-zone-text">{{ willCancel ? '松开取消发送' : '上滑取消发送' }}</text>
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
			actionsRight: 20,
			scrollIntoView: "",
			showScrollBtn: false,
			inputText: "",
			messages: [],
			isRecording: false,
			voiceMode: false,
			activeTag: "",
			willCancel: false,
			voiceStartY: 0,
			recognizedText: "",
			showTransfer: false,
			recorderManager: null,
			voicePath: "",
			leaveState: "idle",
			leaveForm: { type: "", reason: "", startTime: "", endTime: "" },
			sessionId: null,
			quickTags: ["新生报到", "宿舍后勤", "奖助", "请假", "军训"],
			announcements: []
		}
	},
	computed: {
		unreadCount() {
			return this.announcements.filter(a => !a.read).length
		},
		lastMessages() {
			const msgs = this.messages
			if (msgs.length === 0) return []
			const last = msgs[msgs.length - 1]
			if (last.role === 'user' || msgs.length === 1) return [last]
			const prev = msgs[msgs.length - 2]
			if (prev && prev.role === 'user') return [prev, last]
			return [last]
		},
		leavePlaceholder() {
			if (this.leaveState === 'askReason') return '请输入请假原因...'
			return '请输入您的问题...'
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		try {
			const menuRect = uni.getMenuButtonBoundingClientRect()
			if (menuRect && menuRect.width) {
				const windowWidth = windowInfo.windowWidth || 375
				this.actionsRight = windowWidth - menuRect.left + 12
			}
		} catch(e) {}
		try {
			const recorderManager = uni.getRecorderManager && uni.getRecorderManager()
			if (recorderManager) {
				this.recorderManager = recorderManager
				this.recorderManager.onStop((res) => {
					if (!this.willCancel && res.tempFilePath) {
						this.voicePath = res.tempFilePath
						this.recognizeSpeech(res.tempFilePath)
					}
				})
				this.recorderManager.onError((err) => {
					console.error('录音失败', err)
					uni.showToast({ title: '录音失败，请重试', icon: 'none' })
				})
			}
		} catch(e) {}
	},
	onShow() {
		setTimeout(() => { this.loadData() }, 100)
	},
	onLoad(options) {
		if (options.sessionId) {
			this.sessionId = options.sessionId
			this.loadSessionDetail(options.sessionId)
		}
	},
	beforeDestroy() {
		this.destroyDigitalHuman()
	},
	methods: {
		scrollToBottom() {
			this.scrollIntoView = ''
			this.$nextTick(() => {
				this.scrollIntoView = 'msg-bottom'
			})
		},
		onChatScroll(e) {
			const { scrollTop, scrollHeight } = e.detail
			const query = uni.createSelectorQuery().in(this)
			query.select('.chat-area').boundingClientRect(rect => {
				if (rect) {
					this.showScrollBtn = scrollHeight - scrollTop - rect.height > 200
				}
			}).exec()
		},
		sendQuick(tag) {
			if (tag === '请假') {
				this.startLeaveFlow(tag)
				return
			}
			this.activeTag = tag
			this.inputText = tag
			this.sendMessage()
			this.activeTag = ''
		},
		async sendMessage() {
			const text = this.inputText.trim()
			if (!text) return
			if (/请假|休假|请个假/.test(text) && this.leaveState === 'idle') {
				this.startLeaveFlow(text)
				this.inputText = ''
				return
			}
			if (this.leaveState === 'askType') {
				this.onLeaveType(text)
				return
			}
			if (this.leaveState === 'askReason') {
				this.onLeaveReason(text)
				return
			}
			if (this.leaveState !== 'idle') return
			this.messages.push({
				role: 'user',
				content: text,
				time: Date.now()
			})
			this.inputText = ''
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
			try {
				const res = await api.sendMessage({ message: text, sessionId: this.sessionId })
				if (res) {
					this.sessionId = res.sessionId || this.sessionId
					aiMsg.content = res.reply || '抱歉，暂时无法回答您的问题。'
					this.dhSpeak(aiMsg.content)
				} else {
					aiMsg.content = '抱歉，服务暂时不可用，请稍后再试。'
				}
			} catch (e) {
				console.error('发送消息失败', e)
				aiMsg.content = '网络异常，请检查网络后重试。'
			}
			aiMsg.loading = false
			this.showTransfer = true
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
		async dislikeMsg(msg) {
			msg.disliked = !msg.disliked
			if (msg.disliked) {
				msg.liked = false
				try {
					const msgIndex = this.messages.indexOf(msg)
					await api.submitFeedback({ sessionId: this.sessionId, messageIndex: msgIndex, type: 'dislike' })
				} catch (e) {}
			}
		},
		toggleVoiceMode() {
			if (!this.voiceMode) {
				uni.authorize({
					scope: 'scope.record',
					success: () => {
						this.voiceMode = true
					},
					fail: () => {
						uni.showToast({ title: '请允许麦克风权限', icon: 'none' })
					}
				})
			} else {
				this.voiceMode = false
			}
		},
		startVoice(e) {
			if (this.isRecording) return
			this.willCancel = false
			this.voiceStartY = e.touches[0].clientY
			this.recognizedText = ''
			this.voicePath = ''
			this.isRecording = true
			try {
				const manager = uni.getRecorderManager()
				if (manager) {
					manager.start({
						duration: 60000,
						sampleRate: 16000,
						numberOfChannels: 1,
						encodeBitRate: 48000,
						format: 'mp3'
					})
				} else {
					this.isRecording = false
					uni.showToast({ title: '当前环境不支持语音', icon: 'none' })
				}
			} catch(err) {
				this.isRecording = false
				uni.showToast({ title: '当前环境不支持语音', icon: 'none' })
			}
		},
		stopVoice() {
			if (!this.isRecording) return
			const cancelled = this.willCancel
			this.isRecording = false
			this.willCancel = false
			try {
				const manager = uni.getRecorderManager()
				if (manager) {
					manager.stop()
					if (cancelled) {
						uni.showToast({ title: '已取消', icon: 'none' })
					}
				}
			} catch(e) {}
		},
		moveVoice(e) {
			if (!this.isRecording) return
			const moveY = e.touches[0].clientY
			if (this.voiceStartY - moveY > 60) {
				this.willCancel = true
			} else {
				this.willCancel = false
			}
		},
		recognizeSpeech(tempFilePath) {
			this.inputText = ''
			this.recognizedText = '正在识别...'
			// 读取音频文件转base64，用微信同声传译插件识别
			uni.getFileSystemManager().readFile({
				filePath: tempFilePath,
				encoding: 'base64',
				success: (res) => {
					try {
						const plugin = requirePlugin('WechatSI')
						if (plugin && plugin.translate) {
							plugin.translate({
								from: 'zh_CN',
								to: 'zh_CN',
								audio: { data: res.data, sampleRate: 16000 },
								success: (r) => {
									if (r.result) {
										this.recognizedText = r.result
										this.inputText = r.result
									}
								},
								fail: (err) => {
									console.error('微信语音识别失败', err)
									this.fallbackSpeechToText(tempFilePath)
								}
							})
							return
						}
					} catch (e) {
						console.log('WechatSI插件不可用，使用后端识别')
					}
					this.fallbackSpeechToText(tempFilePath)
				},
				fail: () => {
					this.fallbackSpeechToText(tempFilePath)
				}
			})
		},
		async fallbackSpeechToText(tempFilePath) {
			try {
				const res = await api.speechToText(tempFilePath)
				if (res && res.text) {
					this.recognizedText = res.text
					this.inputText = res.text
				} else {
					this.recognizedText = ''
					uni.showToast({ title: '识别失败，请手动输入', icon: 'none' })
				}
			} catch (e) {
				this.recognizedText = ''
				uni.showToast({ title: '识别失败，请手动输入', icon: 'none' })
			}
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
		},
		goNotices() {
			uni.navigateTo({ url: '/subpackages/student/pages/services/notices/index' })
		},
		goServices() {
			uni.navigateTo({ url: '/subpackages/student/pages/services/index' })
		},
		goProfile() {
			uni.navigateTo({ url: '/subpackages/profile/pages/student/index' })
		},
		startLeaveFlow(text) {
			this.leaveState = 'askType'
			this.leaveForm = { type: '', reason: '', startTime: '', endTime: '' }
			this.messages.push({ role: 'user', content: text || '请假', time: Date.now() })
			this.messages.push({
				role: 'ai',
				content: '请问您要请什么类型的假？',
				loading: false,
				liked: false,
				disliked: false,
				time: Date.now(),
				extra: {
					buttons: [
						{ label: '事假', value: '事假' },
						{ label: '病假', value: '病假' }
					]
				}
			})
		},
		onExtraBtn(msg, btn) {
			if (this.leaveState === 'askType') {
				this.onLeaveType(btn.value)
			} else if (this.leaveState === 'confirm') {
				if (btn.value === 'confirm') {
					this.onLeaveConfirm()
				} else {
					this.onLeaveCancel()
				}
			}
		},
		onLeaveType(type) {
			this.leaveForm.type = type
			this.leaveState = 'askReason'
			this.messages.forEach(m => {
				if (m.extra && m.extra.buttons && !m.answered) m.answered = true
			})
			this.messages.push({ role: 'user', content: type, time: Date.now() })
			this.messages.push({
				role: 'ai',
				content: '请说明请假原因：',
				loading: false,
				liked: false,
				disliked: false,
				time: Date.now()
			})
			this.inputText = ''
		},
		onLeaveReason(reason) {
			this.leaveForm.reason = reason
			this.leaveState = 'askTime'
			this.pendingDateField = 'startTime'
			this.messages.push({ role: 'user', content: reason, time: Date.now() })
			this.messages.push({
				role: 'ai',
				content: '请选择请假开始日期：',
				loading: false,
				liked: false,
				disliked: false,
				time: Date.now(),
				extra: {
					isDatePicker: true,
					dateField: 'startTime',
					dateLabel: '开始日期'
				}
			})
			this.inputText = ''
		},
		onLeaveDate(e, field) {
			const date = e.detail.value
			this.leaveForm[field] = date
			this.messages.forEach(m => {
				if (m.extra && m.extra.isDatePicker && m.extra.dateField === field && !m.answered) m.answered = true
			})
			this.messages.push({ role: 'user', content: date, time: Date.now() })
			if (field === 'startTime') {
				this.pendingDateField = 'endTime'
				this.messages.push({
					role: 'ai',
					content: '请选择请假结束日期：',
					loading: false,
					liked: false,
					disliked: false,
					time: Date.now(),
					extra: {
						isDatePicker: true,
						dateField: 'endTime',
						dateLabel: '结束日期'
					}
				})
			} else {
				this.leaveState = 'confirm'
				this.messages.push({
					role: 'ai',
					content: '请假信息确认：\n类型：' + this.leaveForm.type + '\n原因：' + this.leaveForm.reason + '\n时间：' + this.leaveForm.startTime + ' 至 ' + this.leaveForm.endTime,
					loading: false,
					liked: false,
					disliked: false,
					time: Date.now(),
					extra: {
						buttons: [
							{ label: '确认提交', value: 'confirm' },
							{ label: '取消', value: 'cancel' }
						]
					}
				})
			}
		},
		onDateColumnChange(e, msg) {
			// 多列选择器列变化时触发
		},
		onDateConfirm(e, msg) {
			if (msg.extra && msg.extra.dateField) {
				this.onLeaveDate(e, msg.extra.dateField)
			}
		},
		async onLeaveConfirm() {
			this.messages.forEach(m => {
				if (m.extra && m.extra.buttons && !m.answered) m.answered = true
			})
			this.messages.push({ role: 'user', content: '确认提交', time: Date.now() })
			try {
				const res = await api.submitLeave({
					leaveType: this.leaveForm.type,
					reason: this.leaveForm.reason,
					startTime: this.leaveForm.startTime,
					endTime: this.leaveForm.endTime
				})
				if (res) {
					this.messages.push({
						role: 'ai',
						content: '请假申请已提交，请等待辅导员审批。',
						loading: false,
						liked: false,
						disliked: false,
						time: Date.now()
					})
				} else {
					this.messages.push({
						role: 'ai',
						content: '请假申请提交失败：' + (res.msg || '未知错误'),
						loading: false,
						liked: false,
						disliked: false,
						time: Date.now()
					})
				}
			} catch (e) {
				console.error('提交请假失败', e)
				this.messages.push({
					role: 'ai',
					content: '网络异常，请假申请提交失败，请重试。',
					loading: false,
					liked: false,
					disliked: false,
					time: Date.now()
				})
			}
			this.leaveState = 'idle'
			this.showTransfer = true
		},
		onLeaveCancel() {
			this.messages.forEach(m => {
				if (m.extra && m.extra.buttons && !m.answered) m.answered = true
			})
			this.messages.push({ role: 'user', content: '取消', time: Date.now() })
			this.messages.push({
				role: 'ai',
				content: '已取消请假申请，有其他问题可以继续问我。',
				loading: false,
				liked: false,
				disliked: false,
				time: Date.now()
			})
			this.leaveState = 'idle'
		},
		formatDateDisplay(d) {
			if (!d) return ''
			return d.replace(/\//g, '-')
		},
		initDigitalHuman() {},
		destroyDigitalHuman() {},
		async dhSpeak(text) {
			if (!text) return
			try {
				await api.digitalHumanSpeak({ sessionId: '0', text, interrupt: true })
			} catch (e) {
				console.error("数字人播报失败", e)
			}
		},
		async dhInterrupt() {
			try {
				await api.digitalHumanInterrupt({ sessionId: '0' })
			} catch (e) {}
		},
		async loadData() {
			try {
				const res = await api.getStudentHome()
				if (res) {
					if (res.quickTags && res.quickTags.length > 0) {
						this.quickTags = res.quickTags
					}
					if (res.recentSessionId) {
						this.sessionId = res.recentSessionId
					}
				}
			} catch (e) {
				console.error('加载首页数据失败', e)
			}
			try {
				const res = await api.getNotices({ page: 1, pageSize: 20 })
				if (res) {
					this.announcements = (res.notices || res.list || []).map(item => ({
						id: item.id,
						title: item.title,
						time: item.createTime ? item.createTime.substring(5, 10) : '',
						read: item.read
					}))
				}
			} catch (e) {
				console.error('加载通知失败', e)
			}
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
				}
			} catch (e) {
				console.error('加载会话详情失败', e)
			}
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

.dh-container {
	flex: 1;
	background: #000;
	position: relative;
	overflow: hidden;
}

.dh-player {
	width: 100%;
	height: 100%;
}

.home-header {
	background: linear-gradient(180deg, rgba(232, 244, 253, 0.95), rgba(240, 248, 255, 0.9));
	flex-shrink: 0;
	position: relative;
	z-index: 10;
}

.header-status {
	background: rgba(232, 244, 253, 0.95);
}

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
}

.header-title {
	font-size: 38rpx;
	color: #5B9BD5;
	font-weight: 600;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.header-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	padding: 8rpx 20rpx;
	border-radius: 12rpx;
	transition: all 0.2s ease;
	&:active {
		transform: scale(0.93);
	}
}

.btn-icon {
	font-size: 26rpx;
}

.btn-text {
	font-size: 24rpx;
	color: #5B9BD5;
	font-weight: 500;
}

.footer-fixed {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	background: transparent;
}

.chat-area {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 5;
	padding: 20rpx;
	padding-bottom: 300rpx;
}

.welcome-card {
	background: transparent;
	border-radius: 0;
	padding: 40rpx 32rpx;
	margin-bottom: 20rpx;
}

.welcome-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #FFF;
	display: block;
	margin-bottom: 12rpx;
}

.welcome-desc {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	display: block;
	margin-bottom: 24rpx;
}

.quick-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.quick-tag {
	padding: 12rpx 28rpx;
	background: #EEF4FB;
	border-radius: 28rpx;
	font-size: 26rpx;
	color: #5B9BD5;
	transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
	&:active {
		transform: scale(0.95);
		background: #D6E8F7;
	}
	&.active {
		background: #4A90D9;
		color: #FFF;
		transform: scale(0.95);
		box-shadow: 0 4rpx 16rpx rgba(74, 144, 217, 0.4);
	}
}

.quick-tags-bar {
	padding: 8rpx 24rpx;
	background: transparent;
	border-bottom: none;
}

	.quick-tags-scroll {
		white-space: nowrap;
	}

	.quick-tags-scroll .quick-tags {
		display: inline-flex;
		flex-wrap: nowrap;
	}

.chat-spacer {
	height: 55vh;
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
		animation-name: msgSlideInRight;
	}
}

.message-avatar {
	flex-shrink: 0;
	margin-right: 12rpx;
}

.message-self .message-avatar {
	margin-right: 0;
	margin-left: 12rpx;
}

.avatar-ai {
	display: flex;
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: #4A90D9;
	color: #FFF;
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
	color: #FFF;
	font-size: 22rpx;
	align-items: center;
	justify-content: center;
}

.message-bubble {
	max-width: 70%;
	background: #FFF;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	&.bubble-self {
		background: #4A90D9;
		.message-text {
			color: #FFF;
		}
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

.leave-buttons {
	display: flex;
	gap: 16rpx;
	margin-top: 16rpx;
}

.leave-btn {
	padding: 12rpx 32rpx;
	background: #4A90D9;
	color: #FFF;
	border-radius: 12rpx;
	font-size: 26rpx;
	transition: transform 0.2s ease, opacity 0.2s ease;
	&:active {
		transform: scale(0.93);
		opacity: 0.85;
	}
}

.leave-date-picker {
	margin-top: 16rpx;
}

.date-pick-btn {
	padding: 12rpx 32rpx;
	background: #4A90D9;
	color: #FFF;
	border-radius: 12rpx;
	font-size: 26rpx;
	text-align: center;
	transition: transform 0.2s ease;
	&:active {
		transform: scale(0.93);
	}
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
	.liked {
		color: #5B9BD5;
	}
	.disliked {
		color: #DD524D;
	}
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

@keyframes cancelShake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-6rpx); }
	75% { transform: translateX(6rpx); }
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
	color: #FFF;
	transition: transform 0.2s ease;
	&:active {
		transform: scale(0.93);
	}
}

.scroll-bottom-btn {
	position: absolute;
	bottom: 200rpx;
	right: 32rpx;
	width: 72rpx;
	height: 72rpx;
	background: transparent;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
	z-index: 10;
	transition: transform 0.2s ease;
	&:active {
		transform: scale(0.9);
	}
}

.scroll-bottom-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #4A90D9;
	border-bottom: 3rpx solid #4A90D9;
	transform: rotate(-45deg);
	margin-top: -6rpx;
}

.input-bar {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	background: transparent;
	box-shadow: 0 -4rpx 20rpx rgba(91, 155, 213, 0.08);
	gap: 16rpx;
}

.voice-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #E8F4FD, #F0F8FF);
	border-radius: 50%;
	border: 2rpx solid rgba(91, 155, 213, 0.2);
	flex-shrink: 0;
	transition: all 0.2s ease;
	&:active {
		transform: scale(0.9);
		background: #D6E8F7;
	}
}

.voice-icon {
	width: 44rpx;
	height: 44rpx;
}

.input-box {
	flex: 1;
	display: flex;
	align-items: center;
	height: 80rpx;
	background: linear-gradient(135deg, #F0F8FF, #F5F9FE);
	border-radius: 40rpx;
	padding: 0 28rpx;
	border: 2rpx solid rgba(91, 155, 213, 0.15);
	transition: border-color 0.3s ease;
}

.voice-box {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80rpx;
	background: linear-gradient(135deg, #F0F8FF, #F5F9FE);
	border-radius: 40rpx;
	border: 2rpx solid rgba(91, 155, 213, 0.15);
	transition: all 0.2s ease;
	&:active {
		background: linear-gradient(135deg, #D6E8F7, #E8F4FD);
		border-color: rgba(91, 155, 213, 0.4);
	}
}

.voice-hold-text {
	font-size: 28rpx;
	color: #5B9BD5;
	&.recording {
		color: #DD524D;
		animation: recordPulse 0.6s ease infinite;
	}
	&.cancel {
		color: #FF3B30;
		animation: cancelShake 0.3s ease infinite;
	}
}

@keyframes recordPulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.chat-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #333;
}

.send-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #D0E3F0, #E0ECF5);
	border-radius: 50%;
	flex-shrink: 0;
	transition: all 0.3s ease;
	&.active {
		background: linear-gradient(135deg, #5B9BD5, #7BB8E8);
		box-shadow: 0 4rpx 16rpx rgba(91, 155, 213, 0.35);
	}
	&:active {
		transform: scale(0.88);
	}
}

.send-icon {
	font-size: 36rpx;
	color: #FFF;
	font-weight: 700;
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
	.wave-bar {
		width: 5rpx;
		background: transparent;
		border-radius: 10rpx;
		animation: wave 0.6s ease-in-out infinite;
	}
}

@keyframes wave {
	0%, 100% { transform: scaleY(0.6); }
	50% { transform: scaleY(1.2); }
}

.recording-text {
	color: #FFF;
	font-size: 26rpx;
}

.recording-result {
	color: rgba(255, 255, 255, 0.85);
	font-size: 24rpx;
	margin-top: 16rpx;
	max-width: 400rpx;
	text-align: center;
	word-break: break-all;
	line-height: 1.5;
}

.cancel-zone {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 160rpx;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s ease;
	&.cancel-active {
		background: rgba(255, 59, 48, 0.6);
		.cancel-zone-text {
			color: #FFF;
			font-weight: 600;
		}
	}
}

.cancel-zone-text {
	color: rgba(255, 255, 255, 0.7);
	font-size: 28rpx;
	transition: all 0.2s ease;
}

@keyframes msgSlideIn {
	from { opacity: 0; transform: translateX(-30rpx); }
	to { opacity: 1; transform: translateX(0); }
}

@keyframes msgSlideInRight {
	from { opacity: 0; transform: translateX(30rpx); }
	to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeSlideUp {
	from { opacity: 0; transform: translateY(30rpx); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeSlideDown {
	from { opacity: 0; transform: translateY(-20rpx); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
	from { opacity: 0; transform: translateY(100%); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
</style>
