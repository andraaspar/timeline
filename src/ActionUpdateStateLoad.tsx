import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'
import { StateLoad } from './StateLoad'

export interface ActionUpdateStateLoad {
	readonly type: ActionType.UpdateStateLoad
	readonly id: string
	readonly state: Partial<StateLoad>
}

export function makeActionUpdateStateLoad(o: TOmit<ActionUpdateStateLoad, 'type'>): ActionUpdateStateLoad {
	return {
		...o,
		type: ActionType.UpdateStateLoad,
	}
}
