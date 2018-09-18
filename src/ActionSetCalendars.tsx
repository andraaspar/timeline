import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';
import { ICalendar } from './ICalendar';

export interface ActionSetCalendars {
	readonly type: ActionType.SetCalendars
	readonly calendars: ReadonlyArray<ICalendar>
}

export function makeActionSetCalendars(o: TOmit<ActionSetCalendars, 'type'>): ActionSetCalendars {
	return {
		...o,
		type: ActionType.SetCalendars,
	}
}