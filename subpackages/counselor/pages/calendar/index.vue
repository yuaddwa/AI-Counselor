<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">校历管理</text>
				<view class="header-add" @click="showAddEvent = true">
					<text>+ 添加</text>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 学期信息 -->
			<view class="semester-card" v-if="semesterName">
				<text class="semester-name">{{ semesterName }}</text>
				<text class="semester-date">{{ semesterDateRange }}</text>
			</view>

			<!-- 事件列表 -->
			<view class="section">
				<view class="section-title-wrap">
					<view class="title-bar"></view>
					<text class="section-title">日程事件</text>
					<text class="section-count">共{{ events.length }}条</text>
				</view>

				<view class="event-item" v-for="(evt, i) in events" :key="i">
					<view class="event-left">
						<view class="event-dot" :style="{ background: getTypeColor(evt.type) }"></view>
						<view class="event-info">
							<text class="event-date">{{ evt.date }}</text>
							<text class="event-title">{{ evt.title }}</text>
							<text class="event-desc" v-if="evt.desc">{{ evt.desc }}</text>
						</view>
					</view>
					<view class="event-right">
						<view class="event-type-tag" :style="{ background: getTypeBg(evt.type), color: getTypeColor(evt.type) }">
							<text>{{ getTypeLabel(evt.type) }}</text>
						</view>
						<view class="event-delete" @click="deleteEvent(evt, i)">
							<text>删除</text>
						</view>
					</view>
				</view>

				<empty-state v-if="events.length === 0 && !loading" text="暂无日程事件" />
			</view>

			<view class="bottom-space"></view>
		</scroll-view>

		<!-- 添加事件弹窗 -->
		<view class="modal-mask" v-if="showAddEvent" @click="showAddEvent = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">添加日程事件</text>

				<view class="form-group">
					<text class="form-label">事件类型</text>
					<view class="form-radio-group">
						<view
							class="form-radio"
							v-for="t in typeOptions"
							:key="t.value"
							:class="{ active: eventForm.type === t.value }"
							@click="eventForm.type = t.value"
						>
							<text>{{ t.label }}</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<text class="form-label">日期</text>
					<picker mode="date" @change="onDateChange">
						<view class="form-picker">
							<text>{{ eventForm.date || '选择日期' }}</text>
							<text class="picker-arrow"></text>
						</view>
					</picker>
				</view>

				<view class="form-group">
					<text class="form-label">事件标题</text>
					<input class="form-input" v-model="eventForm.title" placeholder="请输入事件标题" />
				</view>

				<view class="form-group">
					<text class="form-label">描述（可选）</text>
					<textarea class="form-textarea" v-model="eventForm.desc" placeholder="请输入描述" />
				</view>

				<view class="modal-actions">
					<view class="modal-btn cancel" @click="showAddEvent = false">
						<text>取消</text>
					</view>
					<view class="modal-btn submit" @click="submitEvent">
						<text>添加</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

const TYPE_CONFIG = {
	holiday: { label: '假期', color: '#4CD964', bg: '#E8F8E8' },
	exam: { label: '考试', color: '#DD524D', bg: '#FFE8E8' },
	event: { label: '活动', color: '#4A90D9', bg: '#E8F4FD' },
	register: { label: '注册', color: '#F0AD4E', bg: '#FFF3E0' },
	default: { label: '日程', color: '#9B59B6', bg: '#F3E8FD' }
}

export default {
	components: { EmptyState },
	data() {
		return {
			statusBarHeight: 0,
			loading: false,
			semesterName: '',
			semesterDateRange: '',
			events: [],
			showAddEvent: false,
			typeOptions: [
				{ label: '假期', value: 'holiday' },
				{ label: '考试', value: 'exam' },
				{ label: '活动', value: 'event' },
				{ label: '注册', value: 'register' },
				{ label: '其他', value: 'default' }
			],
			eventForm: {
				type: 'event',
				date: '',
				title: '',
				desc: ''
			}
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.loadData()
	},
	methods: {
		goBack() { uni.navigateBack() },
		async loadData() {
			this.loading = true
			try {
				const res = await api.getCounselorCalendar()
				if (res) {
					this.semesterName = res.semesterName || res.semester || ''
					this.semesterDateRange = res.dateRange || ''
					this.events = (res.events || res.items || []).map(item => ({
						id: item.id,
						date: item.date,
						title: item.title,
						type: item.type || 'default',
						desc: item.description || item.desc || ''
					}))
				}
			} catch (e) {
				console.error('加载校历失败', e)
			}
			this.loading = false
		},
		getTypeLabel(type) {
			return (TYPE_CONFIG[type] || TYPE_CONFIG.default).label
		},
		getTypeColor(type) {
			return (TYPE_CONFIG[type] || TYPE_CONFIG.default).color
		},
		getTypeBg(type) {
			return (TYPE_CONFIG[type] || TYPE_CONFIG.default).bg
		},
		onDateChange(e) {
			this.eventForm.date = e.detail.value
		},
		async submitEvent() {
			if (!this.eventForm.date) {
				uni.showToast({ title: '请选择日期', icon: 'none' })
				return
			}
			if (!this.eventForm.title.trim()) {
				uni.showToast({ title: '请输入标题', icon: 'none' })
				return
			}
			try {
				await api.addCalendarEvent({
					type: this.eventForm.type,
					date: this.eventForm.date,
					title: this.eventForm.title,
					description: this.eventForm.desc
				})
				uni.showToast({ title: '添加成功', icon: 'success' })
				this.showAddEvent = false
				this.eventForm = { type: 'event', date: '', title: '', desc: '' }
				this.loadData()
			} catch (e) {
				uni.showToast({ title: e.msg || '添加失败', icon: 'none' })
			}
		},
		deleteEvent(evt, index) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除"${evt.title}"？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await api.deleteCalendarEvent(evt.id)
							this.events.splice(index, 1)
							uni.showToast({ title: '已删除', icon: 'success' })
						} catch (e) {
							uni.showToast({ title: '删除失败', icon: 'none' })
						}
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

.page-header {
	background: linear-gradient(135deg, #E8F8E8 0%, #F0FFF0 50%, #E8F8E8 100%);
	flex-shrink: 0;
}

.header-status { background: #E8F8E8; }

.header-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
}

.header-back {
	width: 60rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	transition: transform 0.2s ease;
	&:active { transform: translateX(-6rpx) scale(1.1); }
}

.back-arrow {
	width: 20rpx;
	height: 20rpx;
	border-left: 3rpx solid #4CD964;
	border-bottom: 3rpx solid #4CD964;
	transform: rotate(45deg);
}

.header-title {
	font-size: 36rpx;
	color: #4CD964;
	font-weight: 600;
}

.header-add {
	padding: 10rpx 24rpx;
	background: #4CD964;
	border-radius: 24rpx;
	transition: transform 0.2s ease;
	&:active { transform: scale(0.93); }
	text { font-size: 26rpx; color: #FFF; font-weight: 500; }
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 40rpx;
}

.semester-card {
	margin: 24rpx 24rpx 0;
	background: linear-gradient(135deg, #4CD964, #7BE088);
	border-radius: 16rpx;
	padding: 28rpx 32rpx;
}

.semester-name {
	font-size: 32rpx;
	color: #FFF;
	font-weight: 600;
	display: block;
	margin-bottom: 8rpx;
}

.semester-date {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.section {
	margin: 24rpx;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.section-title-wrap {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.title-bar {
	width: 6rpx;
	height: 28rpx;
	background: linear-gradient(180deg, #4CD964, #7BE088);
	border-radius: 3rpx;
	margin-right: 12rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.section-count {
	font-size: 24rpx;
	color: #999;
	margin-left: auto;
}

.event-item {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	&:last-child { border-bottom: none; }
}

.event-left {
	flex: 1;
	display: flex;
	align-items: flex-start;
	margin-right: 16rpx;
}

.event-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	margin-right: 16rpx;
	margin-top: 10rpx;
	flex-shrink: 0;
}

.event-info { flex: 1; }

.event-date {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-bottom: 4rpx;
}

.event-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 4rpx;
}

.event-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.event-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
	flex-shrink: 0;
}

.event-type-tag {
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	text { font-size: 20rpx; font-weight: 500; }
}

.event-delete {
	padding: 6rpx 16rpx;
	background: #FDECEA;
	border-radius: 8rpx;
	text { font-size: 20rpx; color: #DD524D; }
	transition: transform 0.15s ease;
	&:active { transform: scale(0.93); }
}

.bottom-space { height: 40rpx; }

/* 弹窗 */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: flex-end;
	z-index: 1000;
}

.modal-wrap {
	width: 100%;
	max-height: 80vh;
	background: #FFF;
	border-radius: 32rpx 32rpx 0 0;
	padding: 40rpx;
	overflow-y: auto;
	animation: slideUp 0.3s ease;
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 32rpx;
	text-align: center;
}

.form-group {
	margin-bottom: 24rpx;
}

.form-label {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 12rpx;
}

.form-radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.form-radio {
	padding: 10rpx 24rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: #666;
	transition: all 0.2s ease;
	&.active {
		background: #E8F8E8;
		color: #4CD964;
		border: 2rpx solid #4CD964;
	}
}

.form-picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 76rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
	color: #333;
}

.picker-arrow {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #999;
	border-bottom: 2rpx solid #999;
	transform: rotate(45deg);
}

.form-input {
	height: 76rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 26rpx;
}

.form-textarea {
	width: 100%;
	height: 160rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	box-sizing: border-box;
}

.modal-actions {
	display: flex;
	gap: 16rpx;
	margin-top: 32rpx;
}

.modal-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 500;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.97); }
	&.cancel {
		background: #F5F6FA;
		color: #666;
	}
	&.submit {
		background: #4CD964;
		color: #FFF;
	}
}
</style>
