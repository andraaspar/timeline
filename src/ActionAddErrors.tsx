import { TOmit } from 'illa/Type';
import { ActionType } from './ActionType';

export interface ActionAddErrors {
	readonly type: ActionType.AddErrors
	readonly errors: ReadonlyArray<string>
}

export function makeActionAddErrors(o: TOmit<ActionAddErrors, 'type'>): ActionAddErrors {
	return {
		...o,
		type: ActionType.AddErrors,
	}
}