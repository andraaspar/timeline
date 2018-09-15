import { ActionSetEvents } from './ActionSetEvents'
import { ActionGapiReady } from './ActionGapiReady'

export type TAction =
	| ActionSetEvents
	| ActionGapiReady