import { get } from 'illa/FunctionUtil'
import { DateTime, DateTimeOptions, Duration } from 'luxon'

interface IOptions {
	now?: DateTime
}

export function eventInputFromString(timeZone: string, s: string, o: IOptions = {}): gapi.client.calendar.EventInput {
	const tokens = tokenizeString(timeZone, s, o)
	return {
		summary: tokens.summary,
		start: dateTimeToGapiDateTime(tokens.start),
		end: dateTimeToGapiDateTime(tokens.end || tokens.start, { isEnd: true }),
	}
}

const tokensRe = /^\[(.*?)(?:\]\[(.*?))?\] (.*)$/i

function tokenizeString(timeZone: string, s: string, o: IOptions) {
	const r = tokensRe.exec(s)
	if (!r) throw new Error(`[pg2ow9] Invalid string.`)
	const start = parseDate(timeZone, r[1], o.now)
	const end = get<DateTime | null>(() => parseDate(timeZone, r[2], start), null)
	return {
		start,
		end,
		summary: r[3],
	}
}

const dateRe = /^(.*?)(?:([-+])p(.*))?$/i
const dateNoYearRe = /^[0-9]{2}-[0-9]{2}/i
const dateNoYearNoMonthRe = /^[0-9]{2}(?![-0-9:]{2})/i
const timeNoDateRe = /^[0-9]{2}:[0-9]{2}/i
function parseDate(timeZone: string, s: string, fallbackDt = DateTime.local()) {
	const r = dateRe.exec(s)
	if (!r) throw new Error(`[pg2oys] Invalid date.`)
	let date = r[1]
	const addOrSubtract = r[2]
	const range = r[3]
	const options: DateTimeOptions | undefined = timeZone ? { zone: timeZone } : undefined
	if (date) {
		if (dateNoYearRe.test(date)) {
			let newDate = `${fallbackDt.toFormat('yyyy')}-${date}`
			if (DateTime.fromSQL(newDate, options) < fallbackDt) {
				newDate = `${fallbackDt.plus({ years: 1 }).toFormat('yyyy')}-${date}`
			}
			date = newDate
		} else if (dateNoYearNoMonthRe.test(date)) {
			let newDate = `${fallbackDt.toFormat('yyyy')}-${fallbackDt.toFormat('MM')}-${date}`
			if (DateTime.fromSQL(newDate, options) < fallbackDt) {
				newDate = `${fallbackDt.plus({ months: 1 }).toFormat('yyyy')}-${fallbackDt.plus({ months: 1 }).toFormat('MM')}-${date}`
			}
			date = newDate
		} else if (timeNoDateRe.test(date)) {
			let newDate = `${fallbackDt.toISODate()} ${date}`
			if (DateTime.fromSQL(newDate, options) < fallbackDt) {
				newDate = `${fallbackDt.plus({ days: 1 }).toISODate()} ${date}`
			}
			date = newDate
		}
	}
	const dt = date ? DateTime.fromSQL(date, options) : fallbackDt
	if (addOrSubtract === '+') {
		return dt.plus(Duration.fromISO('P' + range.toUpperCase()))
	} else if (addOrSubtract === '-') {
		return dt.minus(Duration.fromISO('P' + range.toUpperCase()))
	} else {
		return dt
	}
}

function isDate(dt: DateTime) {
	return dt.equals(dt.startOf('day'))
}

function dateTimeToGapiDateTime(dt: DateTime, o: { isEnd?: boolean } = {}): gapi.client.calendar.EventInput['start'] {
	if (isDate(dt)) {
		return {
			date: o.isEnd ? dt.plus({ days: 1 }).toISODate() : dt.toISODate(),
		}
	} else {
		return {
			dateTime: dt.toISO(),
			timeZone: dt.zoneName,
		}
	}
}
