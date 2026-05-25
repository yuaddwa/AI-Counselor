<template>
	<view class="page">
		<view class="map-container">
			<map
				class="campus-map"
				:latitude="centerLat"
				:longitude="centerLng"
				:scale="16"
				:markers="markers"
				@markertap="onMarkerTap"
			/>
		</view>
		<view class="map-sidebar">
			<view class="search-bar">
				<input class="search-input" v-model="keyword" placeholder="搜索地点..." @input="onSearch" />
			</view>
			<scroll-view scroll-y class="poi-list">
				<view
					class="poi-item"
					v-for="(poi, i) in filteredPois"
					:key="i"
					@click="focusPoi(poi)"
					:class="{ active: activePoi === i }"
				>
					<view class="poi-icon" :style="{ background: poi.color }">
						<text class="iconfont" :class="poi.icon || 'icon-ditu'"></text>
					</view>
					<view class="poi-info">
						<text class="poi-name">{{ poi.name }}</text>
						<text class="poi-category">{{ poi.category }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { api } from '@/common/utils/request.js'

export default {
	data() {
		return {
			centerLat: 0,
			centerLng: 0,
			keyword: '',
			activePoi: -1,
			pois: []
		}
	},
	created() {
		api.getCampusMap().then(res => {
			if (res) {
				const d = res
				if (d.centerLat) this.centerLat = d.centerLat
				if (d.centerLng) this.centerLng = d.centerLng
				if (d.pois && d.pois.length) this.pois = d.pois
			}
		}).catch(() => {})
	},
	computed: {
		markers() {
			return this.pois.map((poi, i) => ({
				id: i,
				latitude: poi.lat,
				longitude: poi.lng,
				title: poi.name,
				width: 30,
				height: 30
			}))
		},
		filteredPois() {
			if (!this.keyword) return this.pois
			return this.pois.filter(p => p.name.includes(this.keyword) || p.category.includes(this.keyword))
		}
	},
	methods: {
		onSearch() {},
		focusPoi(poi) {
			this.centerLat = poi.lat
			this.centerLng = poi.lng
			this.activePoi = this.pois.indexOf(poi)
		},
		onMarkerTap(e) {
			const poi = this.pois[e.detail.markerId]
			if (poi) this.focusPoi(poi)
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.map-container {
	height: 45vh;
}

.campus-map {
	width: 100%;
	height: 100%;
}

.map-sidebar {
	flex: 1;
	background: #FFF;
	border-radius: 24rpx 24rpx 0 0;
	margin-top: -24rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
}

.search-bar {
	padding: 20rpx 24rpx;
}

.search-input {
	height: 72rpx;
	background: #F5F6FA;
	border-radius: 36rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
}

.poi-list {
	flex: 1;
	padding: 0 24rpx;
}

.poi-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	&.active { background: #F5F6FA; border-radius: 12rpx; padding: 20rpx 16rpx; }
}

.poi-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.poi-info {
	flex: 1;
}

.poi-name {
	font-size: 28rpx;
	color: #333;
	display: block;
}

.poi-category {
	font-size: 22rpx;
	color: #999;
}
</style>
