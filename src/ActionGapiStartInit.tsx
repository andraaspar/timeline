import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionGapiStartInit {
	readonly type: ActionType.GapiStartInit
}

export function makeActionGapiStartInit(o: TOmit<ActionGapiStartInit, 'type'>): ActionGapiStartInit {
	return {
		...o,
		type: ActionType.GapiStartInit,
	}
}