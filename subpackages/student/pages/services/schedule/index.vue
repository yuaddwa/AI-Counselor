<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">我的课表</text>
				<view class="header-placeholder"></view>
			</view>
			<!-- 周次选择 -->
			<view class="week-bar">
				<view class="week-btn" @click="prevWeek">
					<text class="week-arrow left"></text>
				</view>
				<text class="week-label">第{{ currentWeek }}周</text>
				<view class="week-btn" @click="nextWeek">
					<text class="week-arrow right"></text>
				</view>
			</view>
		</view>

		<scroll-view scroll-x class="day-tabs-wrap">
			<view class="day-tabs">
				<view
					class="day-tab"
					v-for="(day, i) in weekDays"
					:key="i"
					:class="{ active: activeDay === i, today: day.isToday }"
					@click="activeDay = i"
				>
					<text class="day-tab-name">{{ day.name }}</text>
					<text class="day-tab-date">{{ day.date }}</text>
					<view class="day-tab-dot" v-if="day.hasClass"></view>
				</view>
			</view>
		</scroll-view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 课程列表 -->
			<view class="course-list">
				<view
					class="course-card"
					v-for="(course, i) in dayCourses"
					:key="i"
					:style="{ borderLeftColor: course.color }"
				>
					<view class="course-time">
						<text class="time-start">{{ course.startTime }}</text>
						<text class="time-sep">-</text>
						<text class="time-end">{{ course.endTime }}</text>
						<text class="time-section">{{ course.section }}</text>
					</view>
					<view class="course-info">
						<text class="course-name">{{ course.name }}</text>
						<view class="course-detail">
							<text class="iconfont icon-ditu course-icon"></text>
							<text>{{ course.location }}</text>
						</view>
						<view class="course-detail">
							<text class="iconfont icon-wode course-icon"></text>
							<text>{{ course.teacher }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="empty-hint" v-if="dayCourses.length === 0 && !loading">
				<text>今天没有课程安排</text>
			</view>
			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

const COLORS = ['#4A90D9', '#4CD964', '#F0AD4E', '#DD524D', '#9B59B6', '#E67E22', '#1ABC9C']
const SECTION_TIMES = [
	{ start: '08:00', end: '08:45', section: '第1节' },
	{ start: '08:55', end: '09:40', section: '第2节' },
	{ start: '10:00', end: '10:45', section: '第3节' },
	{ start: '10:55', end: '11:40', section: '第4节' },
	{ start: '14:00', end: '14:45', section: '第5节' },
	{ start: '14:55', end: '15:40', section: '第6节' },
	{ start: '16:00', end: '16:45', section: '第7节' },
	{ start: '16:55', end: '17:40', section: '第8节' },
	{ start: '19:00', end: '19:45', section: '第9节' },
	{ start: '19:55', end: '20:40', section: '第10节' }
]

export default {
	data() {
		return {
			statusBarHeight: 0,
			loading: false,
			currentWeek: 1,
			activeDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
			scheduleData: [],
			startDate: ''
		}
	},
	computed: {
		weekDays() {
			const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			const today = new Date()
			const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1
			const monday = new Date(today)
			monday.setDate(today.getDate() - todayIdx - (this.currentWeek - 1) * 7 + (today.getDay() === 0 ? -6 : 1 - today.getDay()))
			// Simpler: compute based on current week
			const baseMonday = new Date(today)
			baseMonday.setDate(today.getDate() - todayIdx)
			return dayNames.map((name, i) => {
				const d = new Date(baseMonday)
				d.setDate(baseMonday.getDate() + i + (this.currentWeek - getWeekOfSemester(today, this.startDate)) * 7)
				const hasClass = this.scheduleData.some(c => c.dayOfWeek === i + 1)
				return {
					name,
					date: `${d.getMonth() + 1}/${d.getDate()}`,
					isToday: i === todayIdx && this.currentWeek === getWeekOfSemester(today, this.startDate),
					hasClass
				}
			})
		},
		dayCourses() {
			const day = this.activeDay + 1
			return this.scheduleData
				.filter(c => c.dayOfWeek === day)
				.map((c, idx) => {
					const sectionIdx = (c.startSection || 1) - 1
					const timeInfo = SECTION_TIMES[Math.min(sectionIdx, SECTION_TIMES.length - 1)] || SECTION_TIMES[0]
					return {
						name: c.courseName || c.name,
						location: c.location || c.classroom || '',
						teacher: c.teacher || '',
						startTime: c.startTime || timeInfo.start,
						endTime: c.endTime || timeInfo.end,
						section: c.section || timeInfo.section,
						color: COLORS[idx % COLORS.length]
					}
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
				const res = await api.getSchedule({ week: this.currentWeek })
				if (res) {
					this.scheduleData = res.courses || res.schedule || res.list || []
					this.startDate = res.startDate || ''
					if (res.currentWeek) this.currentWeek = res.currentWeek
				}
			} catch (e) {
				console.error('加载课表失败', e)
			}
			this.loading = false
		},
		prevWeek() {
			if (this.currentWeek > 1) {
				this.currentWeek--
				this.loadData()
			}
		},
		nextWeek() {
			if (this.currentWeek < 25) {
				this.currentWeek++
				this.loadData()
			}
		}
	}
}

function getWeekOfSemester(today, startDate) {
	if (!startDate) return 1
	const start = new Date(startDate)
	const diff = Math.floor((today - start) / (7 * 24 * 60 * 60 * 1000))
	return Math.max(1, Math.min(25, diff + 1))
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
	background: linear-gradient(135deg, #FFE8E8 0%, #FFF0F0 50%, #FFE8E8 100%);
	flex-shrink: 0;
}

.header-status { background: #FFE8E8; }

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
	border-left: 3rpx solid #DD524D;
	border-bottom: 3rpx solid #DD524D;
	transform: rotate(45deg);
}

.header-title {
	font-size: 38rpx;
	color: #DD524D;
	font-weight: 600;
}

.header-placeholder { width: 60rpx; }

.week-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 32rpx 20rpx;
	gap: 32rpx;
}

.week-btn {
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.6);
	transition: background 0.2s ease;
	&:active { background: rgba(255, 255, 255, 0.9); }
}

.week-arrow {
	width: 12rpx;
	height: 12rpx;
	border-left: 3rpx solid #DD524D;
	border-bottom: 3rpx solid #DD524D;
	&.left { transform: rotate(45deg); }
	&.right { transform: rotate(-135deg); }
}

.week-label {
	font-size: 30rpx;
	color: #DD524D;
	font-weight: 600;
}

.day-tabs-wrap {
	background: #FFF;
	flex-shrink: 0;
}

.day-tabs {
	display: flex;
	padding: 16rpx 24rpx;
}

.day-tab {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12rpx 0;
	border-radius: 12rpx;
	position: relative;
	transition: background 0.2s ease;
	&.active {
		background: #FFE8E8;
		.day-tab-name { color: #DD524D; font-weight: 600; }
	}
	&.today {
		.day-tab-name { color: #DD524D; }
		.day-tab-date { color: #DD524D; }
	}
}

.day-tab-name {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 4rpx;
}

.day-tab-date {
	font-size: 22rpx;
	color: #999;
}

.day-tab-dot {
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background: #DD524D;
	margin-top: 6rpx;
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 40rpx;
}

.course-list {
	padding: 24rpx;
}

.course-card {
	display: flex;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border-left: 6rpx solid;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	transition: transform 0.15s ease;
	&:active { transform: scale(0.98); }
}

.course-time {
	width: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.time-start, .time-end {
	font-size: 24rpx;
	color: #333;
	font-weight: 500;
}

.time-sep {
	font-size: 20rpx;
	color: #CCC;
	margin: 4rpx 0;
}

.time-section {
	font-size: 20rpx;
	color: #999;
	margin-top: 8rpx;
}

.course-info { flex: 1; }

.course-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 12rpx;
}

.course-detail {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 6rpx;
	text { font-size: 24rpx; color: #999; }
}

.course-icon {
	font-size: 24rpx;
	color: #CCC;
}

.empty-hint {
	text-align: center;
	padding: 80rpx 0;
	text { font-size: 26rpx; color: #CCC; }
}

.bottom-space { height: 40rpx; }
</style>
