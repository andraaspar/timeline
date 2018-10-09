import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionInitGapi {
	readonly type: ActionType.InitGapi
}

export function makeActionInitGapi(o?: TOmit<ActionInitGapi, 'type'>): ActionInitGapi {
	return {
		...o,
		type: ActionType.InitGapi,
	}
}
