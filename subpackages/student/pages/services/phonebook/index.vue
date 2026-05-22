<template>
	<view class="page">
		<view class="search-bar">
			<input class="search-input" v-model="keyword" placeholder="搜索联系人或部门..." />
		</view>
		<scroll-view scroll-y class="phone-list">
			<view
				class="phone-group"
				v-for="(group, gi) in filteredGroups"
				:key="gi"
			>
				<view class="group-header">
					<text>{{ group.category }}</text>
				</view>
				<view
					class="phone-item"
					v-for="(item, i) in group.items"
					:key="i"
					@click="callPhone(item.phone)"
				>
					<view class="phone-info">
						<text class="phone-name">{{ item.name }}</text>
						<text class="phone-num">{{ item.phone }}</text>
					</view>
					<view class="phone-call">
						<text> </text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			groups: [
				{
					category: '职能部门',
					items: [
						{ name: '教务处', phone: '010-88880001' },
						{ name: '学生处', phone: '010-88880002' },
						{ name: '财务处', phone: '010-88880003' },
						{ name: '后勤管理处', phone: '010-88880004' },
						{ name: '图书馆', phone: '010-88880005' }
					]
				},
				{
					category: '辅导员',
					items: [
						{ name: '张老师（计算机系）', phone: '010-88881001' },
						{ name: '李老师（经管系）', phone: '010-88881002' },
						{ name: '王老师（外语系）', phone: '010-88881003' }
					]
				},
				{
					category: '宿管',
					items: [
						{ name: '1号楼值班室', phone: '010-88882001' },
						{ name: '2号楼值班室', phone: '010-88882002' },
						{ name: '3号楼值班室', phone: '010-88882003' }
					]
				}
			]
		}
	},
	computed: {
		filteredGroups() {
			if (!this.keyword) return this.groups
			const kw = this.keyword
			return this.groups.map(g => ({
				...g,
				items: g.items.filter(item => item.name.includes(kw) || item.phone.includes(kw))
			})).filter(g => g.items.length > 0)
		}
	},
	methods: {
		callPhone(phone) {
			uni.makePhoneCall({ phoneNumber: phone })
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	background: #F5F6FA;
}

.search-bar {
	padding: 20rpx 24rpx;
	background: #FFF;
}

.search-input {
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 36rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.phone-list {
	height: calc(100vh - 112rpx);
	padding: 0 24rpx;
}

.group-header {
	padding: 20rpx 0 12rpx;
	font-size: 26rpx;
	color: #4A90D9;
	font-weight: 500;
}

.phone-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 8rpx;
}

.phone-info {
	flex: 1;
}

.phone-name {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 6rpx;
}

.phone-num {
	font-size: 24rpx;
	color: #999;
}

.phone-call {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
}
</style>
