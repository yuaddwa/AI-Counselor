																							<script>
export default {
	onLaunch: function() {
		console.log('AI Counselor App Launch')
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style>
	@import '/static/font_5182314_hyy73kszqgm/iconfont.css';

	page {
		background-color: #F5F6FA;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 28rpx;
		color: #333333;
	}

	view, text, input, textarea, scroll-view {
		box-sizing: border-box;
	}

	/* 全局弹窗遮罩 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
</style>
