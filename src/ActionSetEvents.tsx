import { ActionType } from './ActionType'

export interface ActionSetEvents {
	readonly type: ActionType.SetEvents
	readonly events: ReadonlyArray<Readonly<gapi.client.calendar.Event>>
}