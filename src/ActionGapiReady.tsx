import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionGapiReady {
	readonly type: ActionType.GapiReady
}

export function makeActionGapiReady(o: TOmit<ActionGapiReady, 'type'>): ActionGapiReady {
	return {
		...o,
		type: ActionType.GapiReady,
	}
}