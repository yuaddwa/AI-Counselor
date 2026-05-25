<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">成绩查询</text>
				<view class="header-placeholder"></view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<!-- 学期选择 -->
			<view class="semester-bar">
				<picker :range="semesters" @change="onSemesterChange">
					<view class="semester-picker">
						<text>{{ currentSemester || '选择学期' }}</text>
						<text class="picker-arrow"></text>
					</view>
				</picker>
			</view>

			<!-- 统计概览 -->
			<view class="stats-card" v-if="stats">
				<view class="stat-item">
					<text class="stat-num">{{ stats.avgGPA || '--' }}</text>
					<text class="stat-label">平均绩点</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">{{ stats.totalCredits || '--' }}</text>
					<text class="stat-label">总学分</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">{{ stats.passRate || '--' }}</text>
					<text class="stat-label">通过率</text>
				</view>
			</view>

			<!-- 成绩列表 -->
			<view class="grade-list">
				<view class="grade-item" v-for="(item, i) in grades" :key="i">
					<view class="grade-header">
						<text class="grade-name">{{ item.courseName }}</text>
						<text class="grade-score" :class="getScoreClass(item.score)">{{ item.score }}</text>
					</view>
					<view class="grade-meta">
						<text class="grade-credit">{{ item.credits }}学分</text>
						<text class="grade-type">{{ item.courseType }}</text>
						<text class="grade-gpa" v-if="item.gpa">绩点 {{ item.gpa }}</text>
					</view>
					<view class="grade-bar">
						<view class="grade-bar-fill" :style="{ width: item.score + '%', background: getScoreColor(item.score) }"></view>
					</view>
				</view>
			</view>

			<view class="empty-hint" v-if="grades.length === 0 && !loading">
				<text>暂无成绩数据</text>
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
			semesters: [],
			currentSemester: '',
			stats: null,
			grades: []
		}
	},
	created() {
		const windowInfo = uni.getWindowInfo()
		this.statusBarHeight = windowInfo.statusBarHeight || 0
		this.loadData()
	},
	methods: {
		goBack() { uni.navigateBack() },
		async loadData(semester) {
			this.loading = true
			try {
				const params = semester ? { semester } : {}
				const res = await api.getGrades(params)
				if (res) {
					this.semesters = res.semesters || []
					this.currentSemester = res.currentSemester || (this.semesters.length > 0 ? this.semesters[0] : '')
					this.stats = res.stats || null
					this.grades = (res.grades || res.list || []).map(item => ({
						courseName: item.courseName || item.name,
						score: item.score,
						credits: item.credits || item.credit,
						courseType: item.courseType || item.type || '',
						gpa: item.gpa || ''
					}))
				}
			} catch (e) {
				console.error('加载成绩失败', e)
			}
			this.loading = false
		},
		onSemesterChange(e) {
			const idx = e.detail.value
			this.currentSemester = this.semesters[idx]
			this.loadData(this.currentSemester)
		},
		getScoreClass(score) {
			if (score >= 90) return 'excellent'
			if (score >= 80) return 'good'
			if (score >= 60) return 'pass'
			return 'fail'
		},
		getScoreColor(score) {
			if (score >= 90) return '#4CD964'
			if (score >= 80) return '#4A90D9'
			if (score >= 60) return '#F0AD4E'
			return '#DD524D'
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
	background: linear-gradient(135deg, #F3E8FD 0%, #F8F0FF 50%, #F3E8FD 100%);
	flex-shrink: 0;
}

.header-status { background: #F3E8FD; }

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
	border-left: 3rpx solid #9B59B6;
	border-bottom: 3rpx solid #9B59B6;
	transform: rotate(45deg);
}

.header-title {
	font-size: 38rpx;
	color: #9B59B6;
	font-weight: 600;
}

.header-placeholder { width: 60rpx; }

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 40rpx;
}

.semester-bar {
	margin: 24rpx 24rpx 0;
}

.semester-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFF;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	font-size: 28rpx;
	color: #333;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.picker-arrow {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #999;
	border-bottom: 2rpx solid #999;
	transform: rotate(45deg);
}

.stats-card {
	display: flex;
	margin: 24rpx;
	background: linear-gradient(135deg, #9B59B6, #B07CC6);
	border-radius: 16rpx;
	padding: 28rpx 0;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	&:not(:last-child) {
		border-right: 1rpx solid rgba(255, 255, 255, 0.2);
	}
}

.stat-num {
	font-size: 40rpx;
	color: #FFF;
	font-weight: 700;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.grade-list {
	margin: 0 24rpx;
}

.grade-item {
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.grade-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.grade-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	flex: 1;
}

.grade-score {
	font-size: 36rpx;
	font-weight: 700;
	&.excellent { color: #4CD964; }
	&.good { color: #4A90D9; }
	&.pass { color: #F0AD4E; }
	&.fail { color: #DD524D; }
}

.grade-meta {
	display: flex;
	gap: 16rpx;
	margin-bottom: 12rpx;
}

.grade-credit, .grade-type, .grade-gpa {
	font-size: 22rpx;
	color: #999;
	background: #F5F6FA;
	padding: 2rpx 12rpx;
	border-radius: 6rpx;
}

.grade-bar {
	height: 6rpx;
	background: #F0F0F0;
	border-radius: 3rpx;
	overflow: hidden;
}

.grade-bar-fill {
	height: 100%;
	border-radius: 3rpx;
	transition: width 0.6s ease;
}

.empty-hint {
	text-align: center;
	padding: 80rpx 0;
	text { font-size: 26rpx; color: #CCC; }
}

.bottom-space { height: 40rpx; }
</style>
