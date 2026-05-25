<template>
	<view class="page">
		<scroll-view scroll-y class="create-scroll">
			<view class="form-group">
				<text class="form-label">标题</text>
				<input class="form-input" v-model="form.title" placeholder="请输入通知标题" />
			</view>

			<view class="form-group">
				<text class="form-label">正文</text>
				<textarea
					class="form-textarea"
					v-model="form.content"
					placeholder="请输入通知内容..."
					maxlength="-1"
				/>
			</view>

			<view class="form-group">
				<text class="form-label">接收范围</text>
				<view class="scope-options">
					<view
						class="scope-option"
						v-for="(opt, i) in scopeOptions"
						:key="i"
						:class="{ active: form.scope === opt.value }"
						@click="form.scope = opt.value"
					>
						<text>{{ opt.label }}</text>
					</view>
				</view>
				<!-- 班级多选 -->
				<view class="class-select" v-if="form.scope === 'class'">
					<view
						class="class-option"
						v-for="(cls, i) in classList"
						:key="i"
						:class="{ selected: form.selectedClasses.includes(cls) }"
						@click="toggleClass(cls)"
					>
						<text>{{ cls }}</text>
					</view>
				</view>
			</view>

			<view class="form-actions">
				<view class="btn-draft" @click="saveDraft">
					<text>保存草稿</text>
				</view>
				<view class="btn-publish" @click="publish">
					<text>发布</text>
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
				title: '',
				content: '',
				scope: 'all',
				selectedClasses: []
			},
			scopeOptions: [
				{ label: '全体学生', value: 'all' },
				{ label: '指定班级', value: 'class' }
			],
			classList: []
		}
	},
	created() {
		this.loadClassList()
	},
	methods: {
		async loadClassList() {
			try {
				const res = await api.getClasses()
				const classes = res.classes || []
				if (classes.length) {
					this.classList = classes.map(c => c.className)
				}
			} catch (e) {}
		},
		toggleClass(cls) {
			const idx = this.form.selectedClasses.indexOf(cls)
			if (idx > -1) {
				this.form.selectedClasses.splice(idx, 1)
			} else {
				this.form.selectedClasses.push(cls)
			}
		},
		saveDraft() {
			if (!this.form.title.trim()) {
				uni.showToast({ title: '请输入标题', icon: 'none' })
				return
			}
			uni.showToast({ title: '草稿已保存', icon: 'success' })
		},
		publish() {
			if (!this.form.title.trim() || !this.form.content.trim()) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			if (this.form.scope === 'class' && this.form.selectedClasses.length === 0) {
				uni.showToast({ title: '请选择接收班级', icon: 'none' })
				return
			}
			uni.showModal({
				title: '确认发布',
				content: '确定发布此通知？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '发布中...' })
						const payload = {
							title: this.form.title,
							content: this.form.content,
							type: this.form.scope,
							classes: this.form.scope === 'class' ? this.form.selectedClasses : []
						}
						api.createNotification(payload).then(() => {
							uni.hideLoading()
							uni.showToast({ title: '发布成功', icon: 'success' })
							setTimeout(() => uni.navigateBack(), 1500)
						}).catch((e) => {
							uni.hideLoading()
							console.error('发布通知失败', e)
							uni.showToast({ title: '发布失败', icon: 'none' })
						})
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

.create-scroll {
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

.scope-options {
	display: flex;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.scope-option {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #F5F6FA;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #666;
	&.active {
		background: #4A90D9;
		color: #FFF;
	}
}

.class-select {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.class-option {
	padding: 12rpx 24rpx;
	background: #F5F6FA;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #666;
	&.selected {
		background: #4A90D9;
		color: #FFF;
	}
}

.form-actions {
	display: flex;
	gap: 20rpx;
	padding: 32rpx 0;
}

.btn-draft, .btn-publish {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 30rpx;
}

.btn-draft {
	background: #FFF;
	color: #4A90D9;
	border: 1rpx solid #4A90D9;
}

.btn-publish {
	background: #4A90D9;
	color: #FFF;
}
</style>
