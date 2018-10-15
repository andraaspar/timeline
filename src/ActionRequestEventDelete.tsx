import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionRequestEventDelete {
	readonly type: ActionType.RequestEventDelete
	readonly calendarId: string
	readonly eventId: string
}

export function makeActionRequestEventDelete(o: TOmit<ActionRequestEventDelete, 'type'>): ActionRequestEventDelete {
	return {
		...o,
		type: ActionType.RequestEventDelete,
	}
}
