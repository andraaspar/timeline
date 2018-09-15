import { ActionGapiStartInit } from './ActionGapiStartInit';
import { ActionLoadEvents } from './ActionLoadEvents';
import { ActionSetEvents } from './ActionSetEvents';
import { ActionSetGapiReady } from './ActionSetGapiReady';
import { ActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSignIn } from './ActionSignIn';
import { ActionSignOut } from './ActionSignOut';

export type TAction =
	| ActionSetEvents
	| ActionGapiStartInit
	| ActionLoadEvents
	| ActionSetSignedIn
	| ActionSignIn
	| ActionSignOut
	| ActionSetGapiReady