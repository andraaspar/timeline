import { DateTime } from 'luxon';
import { DATE_OPTIONS } from './statics';

export interface IEvent extends Readonly<gapi.client.calendar.Event> {
	readonly calendarId: string
	readonly startTimestamp: number
	readonly endTimestamp: number
	readonly startString: string
	readonly endString: string
}

export interface IEventContext {
	calendarId: string
	locale: string
}

export function makeIEventFromCalendarEvent(o: IEventContext, event: gapi.client.calendar.Event): IEvent {
	const start = DateTime.fromISO(event.start.dateTime || event.start.date, { zone: event.start.timeZone, locale: o.locale })
	const end = DateTime.fromISO(event.end.dateTime || event.end.date, { zone: event.end.timeZone, locale: o.locale })
	return {
		...event,
		calendarId: o.calendarId,
		startTimestamp: start.toMillis(),
		endTimestamp: end.toMillis(),
		startString: start.toLocaleString(DATE_OPTIONS),
		endString: end.toLocaleString(DATE_OPTIONS),
	}
}