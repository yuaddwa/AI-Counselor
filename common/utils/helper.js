export function formatTime(timestamp) {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hour = String(date.getHours()).padStart(2, '0')
	const minute = String(date.getMinutes()).padStart(2, '0')
	return `${year}-${month}-${day} ${hour}:${minute}`
}

export function formatDate(timestamp) {
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export function formatRelativeTime(timestamp) {
	const now = Date.now()
	const diff = now - timestamp
	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour

	if (diff < minute) return '刚刚'
	if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
	if (diff < day) return `${Math.floor(diff / hour)}小时前`
	if (diff < 30 * day) return `${Math.floor(diff / day)}天前`
	return formatDate(timestamp)
}

export function throttle(fn, delay = 300) {
	let timer = null
	return function (...args) {
		if (timer) return
		timer = setTimeout(() => {
			fn.apply(this, args)
			timer = null
		}, delay)
	}
}

export function debounce(fn, delay = 300) {
	let timer = null
	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}

export function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export const ticketStatusMap = {
	pending: { text: '待受理', color: '#F0AD4E' },
	processing: { text: '处理中', color: '#4A90D9' },
	completed: { text: '已完结', color: '#4CD964' }
}
