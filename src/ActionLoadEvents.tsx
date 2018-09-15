import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionLoadEvents {
	readonly type: ActionType.LoadEvents
}

export function makeActionLoadEvents(o: TOmit<ActionLoadEvents, 'type'>): ActionLoadEvents {
	return {
		...o,
		type: ActionType.LoadEvents,
	}
}