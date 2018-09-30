import { ActionAddErrors } from './ActionAddErrors';
import { ActionClearErrors } from './ActionClearErrors';
import { ActionInitGapi } from './ActionInitGapi';
import { ActionLoadCalendars } from './ActionLoadCalendars';
import { ActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars';
import { ActionSetCalendars } from './ActionSetCalendars';
import { ActionSetEvents } from './ActionSetEvents';
import { ActionSetGapiReady } from './ActionSetGapiReady';
import { ActionSetInterval } from './ActionSetInterval';
import { ActionSetLocale } from './ActionSetLocale';
import { ActionSetNow } from './ActionSetNow';
import { ActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSignIn } from './ActionSignIn';
import { ActionSignOut } from './ActionSignOut';
import { ActionUpdateStateLoad } from './ActionUpdateStateLoad';

export type TAction =
	| ActionSetEvents
	| ActionInitGapi
	| ActionLoadEventsFromAllCalendars
	| ActionSetSignedIn
	| ActionSignIn
	| ActionSignOut
	| ActionSetGapiReady
	| ActionSetCalendars
	| ActionLoadCalendars
	| ActionSetNow
	| ActionSetInterval
	| ActionSetLocale
	| ActionAddErrors
	| ActionClearErrors
	| ActionUpdateStateLoad