import { ActionType } from './ActionType'

export interface ActionSetIntervalSchema {
	readonly isFuture: boolean
	readonly weeks: number
}

export interface ActionSetInterval extends ActionSetIntervalSchema {
	readonly type: ActionType.SetInterval
}

export function makeActionSetInterval(o: ActionSetIntervalSchema): ActionSetInterval {
	return {
		type: ActionType.SetInterval as ActionType.SetInterval,
		...o,
	}
}
