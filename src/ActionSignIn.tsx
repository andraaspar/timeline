import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSignIn {
	readonly type: ActionType.SignIn
}

export function makeActionSignIn(o?: TOmit<ActionSignIn, 'type'>): ActionSignIn {
	return {
		...o,
		type: ActionType.SignIn,
	}
}
