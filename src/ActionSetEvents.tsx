import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';
import { IEvent } from './IEvent';

export interface ActionSetEvents {
	readonly type: ActionType.SetEvents
	readonly events: ReadonlyArray<IEvent>
}

export function makeActionSetEvents(o: TOmit<ActionSetEvents, 'type'>): ActionSetEvents {
	return {
		...o,
		type: ActionType.SetEvents,
	}
}