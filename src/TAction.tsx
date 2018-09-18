import { ActionInitGapi } from './ActionInitGapi';
import { ActionLoadCalendars } from './ActionLoadCalendars';
import { ActionLoadEvents } from './ActionLoadEvents';
import { ActionSetCalendars } from './ActionSetCalendars';
import { ActionSetEvents } from './ActionSetEvents';
import { ActionSetGapiReady } from './ActionSetGapiReady';
import { ActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSignIn } from './ActionSignIn';
import { ActionSignOut } from './ActionSignOut';

export type TAction =
	| ActionSetEvents
	| ActionInitGapi
	| ActionLoadEvents
	| ActionSetSignedIn
	| ActionSignIn
	| ActionSignOut
	| ActionSetGapiReady
	| ActionSetCalendars
	| ActionLoadCalendars