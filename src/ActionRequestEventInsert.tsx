import { ActionType } from './ActionType'

export interface ActionRequestEventInsertSchema {
	readonly calendarId: string
	readonly event: gapi.client.calendar.EventInput
}

export interface ActionRequestEventInsert extends ActionRequestEventInsertSchema {
	readonly type: ActionType.RequestEventInsert
}

export function makeActionRequestEventInsert(o: ActionRequestEventInsertSchema): ActionRequestEventInsert {
	return {
		type: ActionType.RequestEventInsert as ActionType.RequestEventInsert,
		...o,
	}
}
