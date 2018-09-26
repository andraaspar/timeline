import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionLoadEventsFromAllCalendars {
	readonly type: ActionType.LoadEventsFromAllCalendars
}

export function makeActionLoadEventsFromAllCalendars(o: TOmit<ActionLoadEventsFromAllCalendars, 'type'>): ActionLoadEventsFromAllCalendars {
	return {
		...o,
		type: ActionType.LoadEventsFromAllCalendars,
	}
}