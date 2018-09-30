import { TSet, withInterface } from 'illa/Type';
import zipObject from 'lodash/zipObject';
import { ActionType } from './ActionType';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { getLocale } from './LocaleUtil';
import { StateLoad } from './StateLoad';
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS, LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS } from './statics';
import { TAction } from './TAction';

export interface State {
	readonly loadStatesById: Readonly<TSet<StateLoad>>
	readonly eventsById: Readonly<TSet<IEvent>>
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly now: number
	readonly startWeeks: number
	readonly endWeeks: number
	readonly locale: string
	readonly errors: ReadonlyArray<string>
}

function makeState(): State {
	const allLoadStates = [
		LOAD_STATE_CALENDARS,
		LOAD_STATE_EVENTS,
	]
	return {
		loadStatesById: {
			...zipObject(allLoadStates, allLoadStates.map(() => withInterface<StateLoad>({
				hasError: false,
				isLoading: false,
				lastLoaded: -Infinity,
			}))),
		},
		calendarsById: {},
		eventsById: {},
		gapiReady: false,
		isSignedIn: false,
		now: Date.now(),
		startWeeks: INITIAL_START_WEEKS,
		endWeeks: INITIAL_END_WEEKS,
		locale: getLocale(),
		errors: [],
	}
}

export function reducerState(state = makeState(), action: TAction): State {
	switch (action.type) {
		case ActionType.LoadCalendars:
			return {
				...state,
				calendarsById: {},
			}
		case ActionType.SetCalendars:
			return {
				...state,
				calendarsById: zipObject(action.calendars.map(_ => _.id), action.calendars),
			}
		case ActionType.LoadEventsFromAllCalendars:
			return {
				...state,
				eventsById: {},
			}
		case ActionType.SetEvents:
			return {
				...state,
				eventsById: zipObject(action.events.map(_ => _.id), action.events),
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
		case ActionType.SetNow:
			return {
				...state,
				now: action.now,
			}
		case ActionType.SetInterval:
			if (action.isFuture) {
				return {
					...state,
					endWeeks: action.weeks,
				}
			} else {
				return {
					...state,
					startWeeks: action.weeks,
				}
			}
		case ActionType.SetLocale:
			return {
				...state,
				locale: action.locale,
			}
		case ActionType.AddErrors:
			return {
				...state,
				errors: [...state.errors, ...action.errors],
			}
		case ActionType.ClearErrors:
			return {
				...state,
				errors: [],
			}
		case ActionType.UpdateStateLoad:
			return {
				...state,
				loadStatesById: {
					...state.loadStatesById,
					[action.id]: {
						...state.loadStatesById[action.id],
						...action.state,
					},
				},
			}
	}
	return state
}