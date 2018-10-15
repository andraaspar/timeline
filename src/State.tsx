import { RouterState } from 'connected-react-router'
import { enumValues } from 'illa/EnumUtil'
import { TSet } from 'illa/Type'
import { omit } from 'lodash'
import zipObject from 'lodash/zipObject'
import { ActionType } from './ActionType'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { StateLoad } from './StateLoad'
import { StateLoadId } from './StateLoadId'
import { TAction } from './TAction'
import { getLocale } from './UtilLocale'

export interface State {
	readonly uiBlockers: Readonly<TSet<number>>
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
	const allLoadStates = enumValues(StateLoadId)
	return {
		uiBlockers: {},
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
		case ActionType.SetBlockUi: {
			const current = state.uiBlockers[action.id]
			const next = Math.max(0, action.block ? (current + 1 || 1) : (current - 1) || 0)
			if (next) {
				return {
					...state,
					uiBlockers: {
						...state.uiBlockers,
						[action.id]: next,
					},
				}
			} else {
				return {
					...state,
					uiBlockers: omit(state.uiBlockers, action.id),
				}
			}
		}
	}
	return state
}
