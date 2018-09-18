import { DateTime } from 'luxon';

export interface IEvent extends Readonly<gapi.client.calendar.Event> {
	readonly startTimestamp: number
	readonly endTimestamp: number
}

export function makeIEventFromCalendarEvent(o: gapi.client.calendar.Event): IEvent {
	return {
		...o,
		startTimestamp: DateTime.fromISO(o.start.dateTime || o.start.date, { zone: o.start.timeZone }).toMillis(),
		endTimestamp: DateTime.fromISO(o.end.dateTime || o.end.date, { zone: o.end.timeZone }).toMillis(),
	}
}