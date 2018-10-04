import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSetSignedIn {
	readonly type: ActionType.SetSignedIn
	readonly flag: boolean
}

export function makeActionSetSignedIn(o: TOmit<ActionSetSignedIn, 'type'>): ActionSetSignedIn {
	return {
		...o,
		type: ActionType.SetSignedIn,
	}
}
