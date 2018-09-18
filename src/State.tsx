import { TSet } from 'illa/Type';
import zipObject from 'lodash/zipObject';
import { ActionType } from './ActionType';
import { IEvent } from './IEvent';
import { TAction } from './TAction';

export interface State {
	readonly eventsById: Readonly<TSet<IEvent>>
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
}

function makeState(): State {
	return {
		eventsById: {},
		gapiReady: false,
		isSignedIn: false,
	}
}

export function reducerState(state = makeState(), action: TAction): State {
	switch (action.type) {
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
	}
	return state
}