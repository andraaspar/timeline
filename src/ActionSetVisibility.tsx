import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSetVisibility {
	readonly type: ActionType.SetVisibility
	readonly visible: boolean
	readonly showTime: number
	readonly hideTime: number
}

export function makeActionSetVisibility(o: TOmit<ActionSetVisibility, 'type'>): ActionSetVisibility {
	return {
		...o,
		type: ActionType.SetVisibility,
	}
}
