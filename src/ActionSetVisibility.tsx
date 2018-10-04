import { ActionType } from './ActionType'

export interface ActionSetVisibilitySchema {
	readonly visible: boolean
	readonly showTime: number
	readonly hideTime: number
}

export interface ActionSetVisibility extends ActionSetVisibilitySchema {
	readonly type: ActionType.SetVisibility
}

export function makeActionSetVisibility(o: ActionSetVisibilitySchema): ActionSetVisibility {
	return {
		type: ActionType.SetVisibility as ActionType.SetVisibility,
		...o,
	}
}
