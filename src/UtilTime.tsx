import { DAY, HOUR, MINUTE, SECOND, WEEK } from './statics'

export function getTimeDifference(min: number, max: number): string {
	const originalDiff = max - min
	let diff = Math.abs(originalDiff)
	const weeks = Math.floor(diff / WEEK)
	diff %= WEEK
	const days = Math.floor(diff / DAY)
	diff %= DAY
	const hours = Math.floor(diff / HOUR)
	diff %= HOUR
	const mins = Math.floor(diff / MINUTE)
	diff %= MINUTE
	const secs = Math.round(diff / SECOND)
	return [
		originalDiff < 0 ? `-` : `+`,
		weeks && `${weeks}w`,
		days && `${days}d`,
		`${hours}h`,
		`${('0' + mins).slice(-2)}m`,
		!weeks && !days && `${('0' + secs).slice(-2)}s`,
	].filter(Boolean).join(' ')
}

export function getDuration(start: number, end: number): string {
	const originalDiff = end - start
	let diff = Math.abs(originalDiff)
	const weeks = Math.floor(diff / WEEK)
	diff %= WEEK
	const days = Math.floor(diff / DAY)
	diff %= DAY
	const hours = Math.floor(diff / HOUR)
	diff %= HOUR
	const mins = Math.floor(diff / MINUTE)
	diff %= MINUTE
	const secs = Math.round(diff / SECOND)
	return [
		originalDiff < 0 ? `-` : `+`,
		weeks && `${weeks}w`,
		days && `${days}d`,
		hours && `${hours}h`,
		mins && `${mins}m`,
		secs && `${secs}s`,
		!weeks && !days && !hours && !mins && !secs && '0',
	].filter(Boolean).join(' ')
}
