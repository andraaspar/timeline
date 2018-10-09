import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionClearErrors {
	readonly type: ActionType.ClearErrors
}

export function makeActionClearErrors(o?: TOmit<ActionClearErrors, 'type'>): ActionClearErrors {
	return {
		...o,
		type: ActionType.ClearErrors,
	}
}
