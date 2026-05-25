<template>
	<view class="page">
		<view class="page-header">
			<view class="header-status" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-bar">
				<view class="header-back" @click="goBack">
					<view class="back-arrow"></view>
				</view>
				<text class="header-title">失物招领</text>
				<view class="header-publish" @click="showPublish = true">
					<text>发布</text>
				</view>
			</view>
			<!-- 分类Tab -->
			<view class="header-tabs">
				<view
					class="header-tab"
					v-for="(tab, i) in tabs"
					:key="i"
					:class="{ active: activeTab === i }"
					@click="switchTab(i)"
				>
					<text>{{ tab.label }}</text>
					<view class="tab-indicator" v-if="activeTab === i"></view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
			<view class="item-list">
				<view class="lost-card" v-for="(item, i) in items" :key="i" @click="goDetail(item)">
					<view class="lost-type-tag" :style="{ background: item.typeColor }">
						<text>{{ item.typeLabel }}</text>
					</view>
					<view class="lost-body">
						<text class="lost-title">{{ item.title }}</text>
						<text class="lost-desc">{{ item.description }}</text>
						<view class="lost-meta">
							<text class="meta-item">
								<text class="iconfont icon-ditu meta-icon"></text>
								{{ item.location }}
							</text>
							<text class="meta-item">
								<text class="iconfont icon-xiaoli meta-icon"></text>
								{{ item.time }}
							</text>
						</view>
					</view>
					<view class="lost-image" v-if="item.image">
						<image :src="item.image" mode="aspectFill" />
					</view>
				</view>
			</view>

			<view class="empty-hint" v-if="items.length === 0 && !loading">
				<text>暂无{{ tabs[activeTab].label }}信息</text>
			</view>
			<view class="loading-more" v-if="loading">
				<text>加载中...</text>
			</view>
			<view class="bottom-space"></view>
		</scroll-view>

		<!-- 发布弹窗 -->
		<view class="modal-mask" v-if="showPublish" @click="showPublish = false">
			<view class="modal-wrap" @click.stop>
				<text class="modal-title">发布失物招领</text>

				<view class="form-group">
					<text class="form-label">类型</text>
					<view class="form-radio-group">
						<view
							class="form-radio"
							v-for="t in typeOptions"
							:key="t.value"
							:class="{ active: publishForm.type === t.value }"
							@click="publishForm.type = t.value"
						>
							<text>{{ t.label }}</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<text class="form-label">物品名称</text>
					<input class="form-input" v-model="publishForm.title" placeholder="请输入物品名称" />
				</view>

				<view class="form-group">
					<text class="form-label">详细描述</text>
					<textarea class="form-textarea" v-model="publishForm.description" placeholder="请描述物品特征、颜色、品牌等" />
				</view>

				<view class="form-group">
					<text class="form-label">丢失/拾获地点</text>
					<input class="form-input" v-model="publishForm.location" placeholder="请输入地点" />
				</view>

				<view class="form-group">
					<text class="form-label">联系方式</text>
					<input class="form-input" v-model="publishForm.contact" placeholder="请输入手机号或微信号" />
				</view>

				<view class="form-group">
					<text class="form-label">上传图片（可选）</text>
					<view class="upload-area" @click="chooseImage">
						<image v-if="publishForm.image" :src="publishForm.image" mode="aspectFill" class="upload-preview" />
						<text v-else class="upload-plus">+</text>
					</view>
				</view>

				<view class="modal-actions">
					<view class="modal-btn cancel" @click="showPublish = false">
						<text>取消</text>
					</view>
					<view class="modal-btn submit" @click="submitPublish">
						<text>发布</text>
					</view>
				</view>
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
			loading: false,
			activeTab: 0,
			tabs: [
				{ label: '全部', value: 'all' },
				{ label: '寻物', value: 'lost' },
				{ label: '招领', value: 'found' }
			],
			typeOptions: [
				{ label: '寻物启事', value: 'lost' },
				{ label: '拾物招领', value: 'found' }
			],
			items: [],
			page: 1,
			hasMore: true,
			showPublish: false,
			publishForm: {
				type: 'lost',
				title: '',
				description: '',
				location: '',
				contact: '',
				image: ''
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
			this.page = 1
			try {
				const type = this.tabs[this.activeTab].value
				const params = { page: 1, pageSize: 20 }
				if (type !== 'all') params.type = type
				const res = await api.getLostFound(params)
				if (res) {
					this.items = this.formatItems(res.list || res.items || [])
					this.hasMore = (res.list || res.items || []).length >= 20
				}
			} catch (e) {
				console.error('加载失物招领失败', e)
			}
			this.loading = false
		},
		async loadMore() {
			if (this.loading || !this.hasMore) return
			this.page++
			this.loading = true
			try {
				const type = this.tabs[this.activeTab].value
				const params = { page: this.page, pageSize: 20 }
				if (type !== 'all') params.type = type
				const res = await api.getLostFound(params)
				if (res) {
					const newItems = this.formatItems(res.list || res.items || [])
					this.items = [...this.items, ...newItems]
					this.hasMore = newItems.length >= 20
				}
			} catch (e) {}
			this.loading = false
		},
		formatItems(list) {
			return list.map(item => ({
				id: item.id,
				title: item.title || item.name,
				description: item.description || item.desc || '',
				location: item.location || '',
				time: item.time || item.createTime || '',
				type: item.type,
				typeLabel: item.type === 'found' ? '招领' : '寻物',
				typeColor: item.type === 'found' ? '#E8F8E8' : '#FFE8E8',
				image: item.image || item.imageUrl || ''
			}))
		},
		switchTab(i) {
			if (this.activeTab === i) return
			this.activeTab = i
			this.loadData()
		},
		goDetail(item) {
			// 可以跳转到详情页，暂用toast展示联系信息
			uni.showToast({ title: item.title, icon: 'none' })
		},
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					const tempPath = res.tempFilePaths[0]
					try {
						const uploadRes = await api.uploadImage(tempPath)
						if (uploadRes && uploadRes.url) {
							this.publishForm.image = uploadRes.url
						} else {
							this.publishForm.image = tempPath
						}
					} catch (e) {
						this.publishForm.image = tempPath
					}
				}
			})
		},
		async submitPublish() {
			if (!this.publishForm.title.trim()) {
				uni.showToast({ title: '请输入物品名称', icon: 'none' })
				return
			}
			if (!this.publishForm.description.trim()) {
				uni.showToast({ title: '请输入描述', icon: 'none' })
				return
			}
			try {
				await api.publishLostFound({
					type: this.publishForm.type,
					title: this.publishForm.title,
					description: this.publishForm.description,
					location: this.publishForm.location,
					contact: this.publishForm.contact,
					image: this.publishForm.image
				})
				uni.showToast({ title: '发布成功', icon: 'success' })
				this.showPublish = false
				this.publishForm = { type: 'lost', title: '', description: '', location: '', contact: '', image: '' }
				this.loadData()
			} catch (e) {
				uni.showToast({ title: e.msg || '发布失败', icon: 'none' })
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

.page-header {
	background: linear-gradient(135deg, #E8FFF3 0%, #F0FFF8 50%, #E8FFF3 100%);
	flex-shrink: 0;
	position: relative;
}

.header-status { background: #E8FFF3; }

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
	border-left: 3rpx solid #1ABC9C;
	border-bottom: 3rpx solid #1ABC9C;
	transform: rotate(45deg);
}

.header-title {
	font-size: 38rpx;
	color: #1ABC9C;
	font-weight: 600;
}

.header-publish {
	padding: 10rpx 28rpx;
	background: #1ABC9C;
	border-radius: 28rpx;
	transition: transform 0.2s ease;
	&:active { transform: scale(0.93); }
	text { font-size: 26rpx; color: #FFF; font-weight: 500; }
}

.header-tabs {
	display: flex;
	padding: 0 24rpx;
}

.header-tab {
	flex: 1;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	color: rgba(26, 188, 156, 0.6);
	position: relative;
	&.active {
		color: #1ABC9C;
		font-weight: 500;
	}
}

.tab-indicator {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 4rpx;
	background: #1ABC9C;
	border-radius: 2rpx;
}

.scroll-content {
	flex: 1;
	height: 0;
	padding-bottom: 40rpx;
}

.item-list {
	padding: 24rpx;
}

.lost-card {
	display: flex;
	background: #FFF;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	position: relative;
	transition: transform 0.15s ease;
	&:active { transform: scale(0.98); }
}

.lost-type-tag {
	position: absolute;
	top: 0;
	right: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 0 0 8rpx 8rpx;
	text { font-size: 22rpx; color: #1ABC9C; font-weight: 500; }
}

.lost-body {
	flex: 1;
	margin-right: 20rpx;
}

.lost-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.lost-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 12rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.lost-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 22rpx;
	color: #999;
}

.meta-icon {
	font-size: 22rpx;
	color: #CCC;
}

.lost-image {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	overflow: hidden;
	flex-shrink: 0;
	image { width: 100%; height: 100%; }
}

.empty-hint {
	text-align: center;
	padding: 80rpx 0;
	text { font-size: 26rpx; color: #CCC; }
}

.loading-more {
	text-align: center;
	padding: 24rpx;
	text { font-size: 24rpx; color: #999; }
}

.bottom-space { height: 40rpx; }

/* 发布弹窗 */
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
	max-height: 85vh;
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
	gap: 16rpx;
}

.form-radio {
	padding: 12rpx 32rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #666;
	transition: all 0.2s ease;
	&.active {
		background: #E8FFF3;
		color: #1ABC9C;
		border: 2rpx solid #1ABC9C;
	}
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

.upload-area {
	width: 160rpx;
	height: 160rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx dashed #DDD;
}

.upload-preview {
	width: 100%;
	height: 100%;
	border-radius: 12rpx;
}

.upload-plus {
	font-size: 60rpx;
	color: #CCC;
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
		background: #1ABC9C;
		color: #FFF;
	}
}
</style>
