import { TSet } from 'illa/Type';
import zipObject from 'lodash/zipObject';
import { ActionType } from './ActionType';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { TAction } from './TAction';

export interface State {
	readonly eventsLoaded: boolean
	readonly eventsById: Readonly<TSet<IEvent>>
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly now: number
	readonly futureWeeks: number
	readonly pastWeeks: number
}

function makeState(): State {
	return {
		eventsLoaded: false,
		eventsById: {},
		calendarsById: {},
		gapiReady: false,
		isSignedIn: false,
		now: Date.now(),
		futureWeeks: 2,
		pastWeeks: 1,
	}
}

export function reducerState(state = makeState(), action: TAction): State {
	switch (action.type) {
		case ActionType.LoadEventsFromAllCalendars:
			return {
				...state,
				eventsLoaded: false,
			}
		case ActionType.SetEvents:
			return {
				...state,
				eventsById: zipObject(action.events.map(_ => _.id), action.events),
				eventsLoaded: true,
			}
		case ActionType.SetGapiReady:
			return {
				...state,
				gapiReady: action.flag,
			}
		case ActionType.SetSignedIn:
			return {
				...state,
				isSignedIn: action.flag,
			}
		case ActionType.SetCalendars:
			return {
				...state,
				calendarsById: zipObject(action.calendars.map(_ => _.id), action.calendars),
			}
		case ActionType.SetNow:
			return {
				...state,
				now: action.now,
			}
		case ActionType.SetInterval:
			if (action.isFuture) {
				return {
					...state,
					futureWeeks: action.weeks,
				}
			} else {
				return {
					...state,
					pastWeeks: action.weeks,
				}
			}
	}
	return state
}