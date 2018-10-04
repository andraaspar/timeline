import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSetNow {
	readonly type: ActionType.SetNow
	readonly now: number
}

export function makeActionSetNow(o: TOmit<ActionSetNow, 'type'>): ActionSetNow {
	return {
		...o,
		type: ActionType.SetNow,
	}
}
