import { RouterState } from 'connected-react-router'
import { TSet } from 'illa/Type'
import zipObject from 'lodash/zipObject'
import { ActionType } from './ActionType'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { getLocale } from './LocaleUtil'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS, LOAD_STATE_INSERT_EVENT } from './statics'
import { TAction } from './TAction'

export interface State {
	readonly loadStatesById: Readonly<TSet<StateLoad>>
	readonly eventsById: Readonly<TSet<IEvent>>
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly now: number
	readonly locale: string
	readonly errors: ReadonlyArray<string>
	readonly router: RouterState
}

function makeState(): State {
	const allLoadStates = [
		LOAD_STATE_CALENDARS,
		LOAD_STATE_EVENTS,
		LOAD_STATE_INSERT_EVENT,
	]
	return {
		loadStatesById: {
			...zipObject(allLoadStates, allLoadStates.map(() => StateLoad.Never)),
		},
		calendarsById: {},
		eventsById: {},
		gapiReady: false,
		isSignedIn: false,
		now: Date.now(),
		locale: getLocale(),
		errors: [],
		router: null as any,
	}
}

export function reducerState(state = makeState(), action: TAction): State {
	switch (action.type) {
		case ActionType.LoadCalendars:
			return {
				...state,
				calendarsById: action.restoreOldOnFailure ? state.calendarsById : {},
			}
		case ActionType.SetCalendars:
			return {
				...state,
				calendarsById: zipObject(action.calendars.map(_ => _.id), action.calendars),
			}
		case ActionType.LoadEventsFromAllCalendars:
			return {
				...state,
				eventsById: action.restoreOldOnFailure ? state.eventsById : {},
			}
		case ActionType.SetEvents:
			return {
				...state,
				eventsById: zipObject(action.events.map(_ => _.id + ''), action.events),
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
					[action.id]: action.state,
				},
			}
	}
	return state
}
