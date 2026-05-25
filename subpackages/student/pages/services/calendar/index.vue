<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">校历</text>
				<view class="header-placeholder"></view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 学期信息 -->
			<view class="semester-card" v-if="semesterName">
				<text class="semester-name">{{ semesterName }}</text>
				<text class="semester-date">{{ semesterDateRange }}</text>
			</view>

			<!-- 月历视图 -->
			<view class="calendar-card">
				<view class="calendar-nav">
					<view class="nav-btn" @click="prevMonth">
						<text class="nav-arrow left"></text>
					</view>
					<text class="calendar-month">{{ currentYear }}年{{ currentMonth }}月</text>
					<view class="nav-btn" @click="nextMonth">
						<text class="nav-arrow right"></text>
					</view>
				</view>
				<view class="calendar-weekdays">
					<text class="weekday" v-for="d in weekdays" :key="d">{{ d }}</text>
				</view>
				<view class="calendar-days">
					<view
						class="calendar-day"
						v-for="(day, i) in calendarDays"
						:key="i"
						:class="{
							'other-month': !day.current,
							'today': day.isToday,
							'has-event': day.event,
							'holiday': day.type === 'holiday',
							'exam': day.type === 'exam'
						}"
						@click="onDayClick(day)"
					>
						<text class="day-num">{{ day.day }}</text>
						<view class="day-dot" v-if="day.event"></view>
					</view>
				</view>
			</view>

			<!-- 今日事件 -->
			<view class="section" v-if="todayEvents.length > 0">
				<text class="section-title">今日事项</text>
				<view class="event-card" v-for="(evt, i) in todayEvents" :key="i">
					<view class="event-tag" :style="{ background: evt.tagBg, color: evt.tagColor }">
						<text>{{ evt.tag }}</text>
					</view>
					<text class="event-text">{{ evt.title }}</text>
				</view>
			</view>

			<!-- 日程列表 -->
			<view class="section">
				<text class="section-title">{{ currentMonth }}月日程</text>
				<view class="timeline">
					<view class="timeline-item" v-for="(evt, i) in monthEvents" :key="i">
						<view class="timeline-dot" :style="{ background: evt.dotColor }"></view>
						<view class="timeline-line" v-if="i < monthEvents.length - 1"></view>
						<view class="timeline-content">
							<text class="timeline-date">{{ evt.dateLabel }}</text>
							<view class="timeline-card">
								<view class="event-tag small" :style="{ background: evt.tagBg, color: evt.tagColor }">
									<text>{{ evt.tag }}</text>
								</view>
								<text class="timeline-title">{{ evt.title }}</text>
								<text class="timeline-desc" v-if="evt.desc">{{ evt.desc }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="empty-hint" v-if="monthEvents.length === 0 && !loading">
					<text>本月暂无日程安排</text>
				</view>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			statusBarHeight: 0,
			loading: false,
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth() + 1,
			weekdays: ['日', '一', '二', '三', '四', '五', '六'],
			semesterName: '',
			semesterDateRange: '',
			events: []
		}
	},
	computed: {
		calendarDays() {
			const year = this.currentYear
			const month = this.currentMonth - 1
			const firstDay = new Date(year, month, 1).getDay()
			const daysInMonth = new Date(year, month + 1, 0).getDate()
			const daysInPrevMonth = new Date(year, month, 0).getDate()
			const today = new Date()
			const days = []
			for (let i = firstDay - 1; i >= 0; i--) {
				days.push({ day: daysInPrevMonth - i, current: false, isToday: false })
			}
			for (let i = 1; i <= daysInMonth; i++) {
				const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
				const evt = this.events.find(e => e.date === dateStr)
				const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
				days.push({
					day: i,
					current: true,
					isToday,
					date: dateStr,
					event: evt ? evt.title : null,
					type: evt ? evt.type : null
				})
			}
			const remaining = 42 - days.length
			for (let i = 1; i <= remaining; i++) {
				days.push({ day: i, current: false, isToday: false })
			}
			return days
		},
		todayEvents() {
			const today = new Date()
			const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
			return this.events.filter(e => e.date === dateStr).map(e => this.formatEvent(e))
		},
		monthEvents() {
			const prefix = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}`
			return this.events
				.filter(e => e.date && e.date.startsWith(prefix))
				.map(e => {
					const formatted = this.formatEvent(e)
					const day = parseInt(e.date.split('-')[2])
					return { ...formatted, dateLabel: `${this.currentMonth}月${day}日` }
				})
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
				const res = await api.getCalendar()
				if (res) {
					this.semesterName = res.semesterName || res.semester || ''
					this.semesterDateRange = res.dateRange || ''
					this.events = (res.events || res.items || []).map(item => ({
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
		formatEvent(evt) {
			const typeMap = {
				holiday: { tag: '假期', tagBg: '#E8F8E8', tagColor: '#4CD964', dotColor: '#4CD964' },
				exam: { tag: '考试', tagBg: '#FFE8E8', tagColor: '#DD524D', dotColor: '#DD524D' },
				event: { tag: '活动', tagBg: '#E8F4FD', tagColor: '#4A90D9', dotColor: '#4A90D9' },
				register: { tag: '注册', tagBg: '#FFF3E0', tagColor: '#F0AD4E', dotColor: '#F0AD4E' },
				default: { tag: '日程', tagBg: '#F3E8FD', tagColor: '#9B59B6', dotColor: '#9B59B6' }
			}
			const info = typeMap[evt.type] || typeMap.default
			return { ...evt, ...info }
		},
		prevMonth() {
			if (this.currentMonth === 1) {
				this.currentMonth = 12
				this.currentYear--
			} else {
				this.currentMonth--
			}
		},
		nextMonth() {
			if (this.currentMonth === 12) {
				this.currentMonth = 1
				this.currentYear++
			} else {
				this.currentMonth++
			}
		},
		onDayClick(day) {
			if (!day.current || !day.event) return
			uni.showToast({ title: day.event, icon: 'none' })
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
	font-size: 38rpx;
	color: #4CD964;
	font-weight: 600;
}

.header-placeholder { width: 60rpx; }

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

.calendar-card {
	margin: 24rpx;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.calendar-nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.nav-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background 0.2s ease;
	&:active { background: #F0F0F0; }
}

.nav-arrow {
	width: 14rpx;
	height: 14rpx;
	border-left: 3rpx solid #666;
	border-bottom: 3rpx solid #666;
	&.left { transform: rotate(45deg); }
	&.right { transform: rotate(-135deg); }
}

.calendar-month {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}

.calendar-weekdays {
	display: flex;
	margin-bottom: 16rpx;
}

.weekday {
	flex: 1;
	text-align: center;
	font-size: 24rpx;
	color: #999;
}

.calendar-days {
	display: flex;
	flex-wrap: wrap;
}

.calendar-day {
	width: calc(100% / 7);
	height: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	transition: background 0.2s ease;
	position: relative;
	&.other-month { opacity: 0.3; }
	&.today {
		background: #E8F8E8;
		.day-num { color: #4CD964; font-weight: 700; }
	}
	&.has-event:active { background: #F0F0F0; }
	&.holiday .day-num { color: #4CD964; }
	&.exam .day-num { color: #DD524D; }
}

.day-num {
	font-size: 26rpx;
	color: #333;
}

.day-dot {
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background: #4A90D9;
	position: absolute;
	bottom: 8rpx;
}

.section {
	margin: 24rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
	display: block;
	margin-bottom: 16rpx;
}

.event-card {
	display: flex;
	align-items: center;
	background: #FFF;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	margin-bottom: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.event-tag {
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
	text { font-size: 22rpx; font-weight: 500; }
	&.small { padding: 2rpx 12rpx; text { font-size: 20rpx; } }
}

.event-text {
	font-size: 28rpx;
	color: #333;
}

.timeline {
	position: relative;
	padding-left: 32rpx;
}

.timeline-item {
	display: flex;
	position: relative;
	margin-bottom: 24rpx;
}

.timeline-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	flex-shrink: 0;
	margin-top: 8rpx;
	margin-right: 20rpx;
}

.timeline-line {
	position: absolute;
	left: 7rpx;
	top: 24rpx;
	bottom: -16rpx;
	width: 2rpx;
	background: #E8E8E8;
}

.timeline-content { flex: 1; }

.timeline-date {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 8rpx;
}

.timeline-card {
	background: #FFF;
	border-radius: 12rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.timeline-title {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-top: 8rpx;
}

.timeline-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 8rpx;
}

.empty-hint {
	text-align: center;
	padding: 60rpx 0;
	text { font-size: 26rpx; color: #CCC; }
}

.bottom-space { height: 40rpx; }
</style>
