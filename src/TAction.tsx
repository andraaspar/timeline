import { ActionGapiReady } from './ActionGapiReady';
import { ActionLoadEvents } from './ActionLoadEvents';
import { ActionSetEvents } from './ActionSetEvents';
import { ActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSignIn } from './ActionSignIn';
import { ActionSignOut } from './ActionSignOut';

export type TAction =
	| ActionSetEvents
	| ActionGapiReady
	| ActionLoadEvents
	| ActionSetSignedIn
	| ActionSignIn
	| ActionSignOut