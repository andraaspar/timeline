import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionLoadCalendars {
	readonly type: ActionType.LoadCalendars
}

export function makeActionLoadCalendars(o: TOmit<ActionLoadCalendars, 'type'>): ActionLoadCalendars {
	return {
		...o,
		type: ActionType.LoadCalendars,
	}
}