import { Dictionary, zipObject } from 'lodash'
import { TAction } from './TAction'
import { ActionType } from './ActionType'

export interface State {
	readonly eventsById: Readonly<Dictionary<Readonly<gapi.client.calendar.Event>>>
	readonly gapiReady: boolean
}

function makeState(): State {
	return {
		eventsById: {},
		gapiReady: false,
	}
}

export function state(state = makeState(), action: TAction): State {
	switch (action.type) {
		case ActionType.SetEvents:
			return {
				...state,
				eventsById: {
					...zipObject(action.events.map(_ => _.id), action.events),
				},
			}
		case ActionType.GapiReady:
			return {
				...state,
				gapiReady: true,
			}
	}
	return state
}