
export interface IEvent extends gapi.client.calendar.Event {
	readonly startTimestamp: number
	readonly endTimestamp: number
}

export function makeIEventFromCalendarEvent(o: gapi.client.calendar.Event): IEvent {
	return {
		...o,
		startTimestamp: (o.start.dateTime ? new Date(o.start.dateTime) : new (Date as any)(...(o.start.date as string).split('-').map((_, i) => parseInt(_, 10) - (i === 1 ? 1 : 0)))).getTime(),
		endTimestamp: (o.end.dateTime ? new Date(o.end.dateTime) : new (Date as any)(...(o.end.date as string).split('-').map((_, i) => parseInt(_, 10) - (i === 1 ? 1 : 0)))).getTime(),
	}
}