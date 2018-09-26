import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionSignOut {
	readonly type: ActionType.SignOut
}

export function makeActionSignOut(o: TOmit<ActionSignOut, 'type'>): ActionSignOut {
	return {
		...o,
		type: ActionType.SignOut,
	}
}