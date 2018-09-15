import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionSetGapiReady {
	readonly type: ActionType.SetGapiReady
	readonly flag: boolean
}

export function makeActionSetGapiReady(o: TOmit<ActionSetGapiReady, 'type'>): ActionSetGapiReady {
	return {
		...o,
		type: ActionType.SetGapiReady,
	}
}