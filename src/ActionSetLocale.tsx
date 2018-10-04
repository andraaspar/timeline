import { ActionType } from './ActionType'

export interface ActionSetLocaleSchema {
	readonly locale: string
}

export interface ActionSetLocale extends ActionSetLocaleSchema {
	readonly type: ActionType.SetLocale
}

export function makeActionSetLocale(o: ActionSetLocaleSchema): ActionSetLocale {
	return {
		type: ActionType.SetLocale as ActionType.SetLocale,
		...o,
	}
}
