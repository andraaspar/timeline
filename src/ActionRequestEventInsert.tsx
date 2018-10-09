import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionRequestEventInsert {
	readonly type: ActionType.RequestEventInsert
	readonly calendarId: string
	readonly event: gapi.client.calendar.EventInput
}

export function makeActionRequestEventInsert(o: TOmit<ActionRequestEventInsert, 'type'>): ActionRequestEventInsert {
	return {
		type: ActionType.RequestEventInsert as ActionType.RequestEventInsert,
		...o,
	}
}
