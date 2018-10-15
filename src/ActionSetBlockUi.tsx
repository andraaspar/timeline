import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSetBlockUi {
	readonly type: ActionType.SetBlockUi
	readonly id: string
	readonly block: boolean
}

export function makeActionSetBlockUi(o: TOmit<ActionSetBlockUi, 'type'>): ActionSetBlockUi {
	return {
		...o,
		type: ActionType.SetBlockUi,
	}
}
