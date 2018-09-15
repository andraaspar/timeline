import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionSetEvents {
	readonly type: ActionType.SetEvents
	readonly events: ReadonlyArray<Readonly<gapi.client.calendar.Event>>
}

export function makeActionSetEvents(o: TOmit<ActionSetEvents, 'type'>): ActionSetEvents {
	return {
		...o,
		type: ActionType.SetEvents,
	}
}