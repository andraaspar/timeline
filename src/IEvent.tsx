import { DateTime } from 'luxon'

export interface IEvent extends Readonly<Partial<gapi.client.calendar.Event>> {
	readonly calendarId: string
	readonly startTimestamp: number
	readonly endTimestamp: number
	readonly isDate: boolean
}

export interface IEventContext {
	calendarId: string
	locale: string
}

export function makeIEventFromCalendarEvent(o: IEventContext, event: gapi.client.calendar.Event): IEvent {
	const isDate = !!event.start.date
	const start = DateTime.fromISO(event.start.dateTime || event.start.date!, { zone: event.start.timeZone, locale: o.locale })
	const end = DateTime.fromISO(event.end.dateTime || event.end.date!, { zone: event.end.timeZone, locale: o.locale })
	return {
		...event,
		calendarId: o.calendarId,
		isDate,
		startTimestamp: start.toMillis(),
		endTimestamp: end.toMillis(),
	}
}

export function makeIEventFromEventInput(o: IEventContext, event: gapi.client.calendar.EventInput): IEvent {
	const isDate = !!event.start.date
	const start = DateTime.fromISO(event.start.dateTime || event.start.date!, { zone: event.start.timeZone, locale: o.locale })
	const end = DateTime.fromISO(event.end.dateTime || event.end.date!, { zone: event.end.timeZone, locale: o.locale })
	return {
		calendarId: o.calendarId,
		summary: event.summary,
		isDate,
		startTimestamp: start.toMillis(),
		endTimestamp: end.toMillis(),
	}
}
