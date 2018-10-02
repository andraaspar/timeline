export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7

export const DATE_OPTIONS = {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	hour: 'numeric',
	minute: '2-digit',
	// second: '2-digit',
}

export const INITIAL_START_WEEKS = -1
export const INITIAL_END_WEEKS = 2

export const LOAD_STATE_CALENDARS = 'LOAD_STATE_CALENDARS'
export const LOAD_STATE_EVENTS = 'LOAD_STATE_EVENTS'
export const LOAD_STATE_INSERT_EVENT = 'LOAD_STATE_INSERT_EVENT'