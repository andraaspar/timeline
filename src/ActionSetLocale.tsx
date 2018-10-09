import { TOmit } from 'illa/Type'
import { ActionType } from './ActionType'

export interface ActionSetLocale {
	readonly type: ActionType.SetLocale
	readonly locale: string
}

export function makeActionSetLocale(o: TOmit<ActionSetLocale, 'type'>): ActionSetLocale {
	return {
		...o,
		type: ActionType.SetLocale,
	}
}
