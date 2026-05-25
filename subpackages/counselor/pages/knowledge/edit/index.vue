<template>
	<view class="page">
		<scroll-view scroll-y class="edit-scroll">
			<view class="form-group">
				<text class="form-label">所属分类</text>
				<picker :range="categoryNames" @change="onCategoryChange">
					<view class="picker-wrap">
						<text>{{ form.categoryName || '请选择分类' }}</text>
						<view class="picker-arrow-right"></view>
					</view>
				</picker>
			</view>

			<view class="form-group">
				<text class="form-label">标题</text>
				<input class="form-input" v-model="form.title" placeholder="请输入标题" />
			</view>

			<view class="form-group">
				<text class="form-label">内容</text>
				<textarea
					class="form-textarea"
					v-model="form.content"
					placeholder="请输入知识库内容，支持富文本排版..."
					maxlength="-1"
				/>
			</view>

			<view class="form-actions">
				<view class="btn-cancel" @click="handleCancel">
					<text>取消</text>
				</view>
				<view class="btn-save" @click="handleSave">
					<text>保存</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			form: {
				id: '',
				title: '',
				content: '',
				categoryId: '',
				categoryName: ''
			},
			categories: []
		}
	},
	computed: {
		categoryNames() {
			return this.categories.map(c => c.name)
		}
	},
	onLoad(options) {
		this.loadCategories()
		if (options.id) {
			this.form.id = options.id
			this.loadDetail(options.id)
			uni.setNavigationBarTitle({ title: '编辑知识库' })
		} else {
			uni.setNavigationBarTitle({ title: '新建知识库' })
		}
	},
	methods: {
		async loadCategories() {
			try {
				const res = await api.getKnowledgeCategories()
				const list = res.list || res || []
				if (list.length) {
					this.categories = list
				}
			} catch (e) {}
		},
		async loadDetail(id) {
			try {
				uni.showLoading({ title: '加载中...' })
				const res = await api.getKnowledgeList({ id })
				const list = res
				const item = Array.isArray(list) ? list.find(k => k.id == id) : list
				if (item) {
					this.form.title = item.title || ''
					this.form.content = item.content || ''
					this.form.categoryId = item.categoryId || item.category || ''
					const cat = this.categories.find(c => c.id == this.form.categoryId)
					if (cat) {
						this.form.categoryName = cat.name
					}
				}
			} catch (e) {
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		},
		onCategoryChange(e) {
			const index = e.detail.value
			this.form.categoryId = this.categories[index].id
			this.form.categoryName = this.categories[index].name
		},
		handleSave() {
			if (!this.form.title.trim()) {
				uni.showToast({ title: '请输入标题', icon: 'none' })
				return
			}
			if (!this.form.categoryId) {
				uni.showToast({ title: '请选择分类', icon: 'none' })
				return
			}
			this.doSave()
		},
		async doSave() {
			uni.showLoading({ title: '保存中...' })
			try {
				await api.saveKnowledge({
					title: this.form.title,
					content: this.form.content,
					category: this.form.categoryId
				})
				uni.hideLoading()
				uni.showToast({ title: '保存成功', icon: 'success' })
				setTimeout(() => uni.navigateBack(), 1500)
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: e.msg || '保存失败', icon: 'none' })
			}
		},
		handleCancel() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	background: #F5F6FA;
}

.edit-scroll {
	height: 100%;
	padding: 24rpx;
}

.form-group {
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 16rpx;
}

.form-input {
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.form-textarea {
	width: 100%;
	min-height: 400rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
	line-height: 1.6;
	box-sizing: border-box;
}

.picker-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333;
}

.picker-arrow-right {
	width: 14rpx;
	height: 14rpx;
	border-right: 2rpx solid #CCC;
	border-bottom: 2rpx solid #CCC;
	transform: rotate(-45deg);
}

.form-actions {
	display: flex;
	gap: 20rpx;
	margin-top: 32rpx;
	padding-bottom: 40rpx;
}

.btn-cancel, .btn-save {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 30rpx;
}

.btn-cancel {
	background: #F5F6FA;
	color: #666;
}

.btn-save {
	background: #4A90D9;
	color: #FFF;
}
</style>
