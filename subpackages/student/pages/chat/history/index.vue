<template>
	<view class="page">
		<view class="history-header">
			<view class="header-actions">
				<text class="clear-btn" @click="clearAll">清空全部</text>
			</view>
		</view>

		<scroll-view scroll-y class="history-list">
			<view
				class="history-item"
				v-for="(item, i) in sessions"
				:key="i"
				@click="openSession(item)"
			>
				<view class="history-main">
					<text class="history-title">{{ item.lastMessage }}</text>
					<text class="history-time">{{ item.time }}</text>
				</view>
				<view class="history-delete" @click.stop="deleteSession(item, i)">
					<text class="delete-icon">×</text>
				</view>
			</view>

			<empty-state v-if="sessions.length === 0" text="暂无历史对话" />
		</scroll-view>
	</view>
</template>

<script>
import EmptyState from '@/common/components/empty-state.vue'
import { api } from '@/common/utils/request.js'

export default {
	components: { EmptyState },
	data() {
		return {
			sessions: [],
			page: 1,
			pageSize: 20,
			hasMore: true
		}
	},
	created() {
		this.loadHistory()
	},
	methods: {
		async loadHistory() {
			try {
				const res = await api.getChatHistory({ page: this.page, pageSize: this.pageSize })
				if (res) {
					this.sessions = (res.list || []).map(item => ({
						id: item.sessionId,
						lastMessage: item.title || item.lastMessage || '',
						time: item.updateTime ? item.updateTime.substring(5, 16).replace('T', ' ') : '',
						msgCount: 0
					}))
					this.hasMore = this.sessions.length >= this.pageSize
				}
			} catch (e) {
				console.error('加载聊天历史失败', e)
			}
		},
		openSession(item) {
			uni.navigateTo({ url: `/subpackages/student/pages/home/index?sessionId=${item.id}` })
		},
		deleteSession(item, index) {
			uni.showModal({
				title: '确认删除',
				content: '删除后不可恢复，确认删除该对话？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await api.deleteChatSession(item.id)
							this.sessions.splice(index, 1)
							uni.showToast({ title: '已删除', icon: 'success' })
						} catch (e) {
							uni.showToast({ title: '删除失败', icon: 'none' })
						}
					}
				}
			})
		},
		clearAll() {
			if (this.sessions.length === 0) return
			uni.showModal({
				title: '确认清空',
				content: '将清空所有历史对话，确认继续？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await api.clearAllChat()
							this.sessions = []
							uni.showToast({ title: '已清空', icon: 'success' })
						} catch (e) {
							uni.showToast({ title: '清空失败', icon: 'none' })
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
	background: #F5F6FA;
}

.history-header {
	padding: 16rpx 24rpx;
	display: flex;
	justify-content: flex-end;
}

.clear-btn {
	font-size: 26rpx;
	color: #DD524D;
}

.history-list {
	height: calc(100vh - 80rpx);
	padding: 0 24rpx;
}

.history-item {
	display: flex;
	align-items: center;
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
}

.history-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.history-title {
	font-size: 28rpx;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-bottom: 8rpx;
}

.history-time {
	font-size: 22rpx;
	color: #999;
}

.history-delete {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-icon {
	font-size: 40rpx;
	color: #CCC;
}
</style>
