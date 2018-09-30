import { delay } from 'redux-saga';
import { fork, put, take, takeLatest } from 'redux-saga/effects';
import { makeActionAddErrors } from './ActionAddErrors';
import { makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars';
import { makeActionSetCalendars } from './ActionSetCalendars';
import { makeActionSetEvents } from './ActionSetEvents';
import { makeActionSetGapiReady } from './ActionSetGapiReady';
import { ActionSetLocale } from './ActionSetLocale';
import { makeActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSetVisibility } from './ActionSetVisibility';
import { ActionType } from './ActionType';
import { makeActionUpdateStateLoad } from './ActionUpdateStateLoad';
import { GAPI } from './GAPI';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { saveLocale } from './LocaleUtil';
import { LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS, MINUTE, SECOND } from './statics';

export function* rootSaga() {
	yield fork(gapiSaga)
}

function* tryUntilSuccess(fun: () => Promise<any>, ms: number = 5 * SECOND) {
	while (true) {
		try {
			return yield fun()
		} catch (e) {
			yield* showError(e)
			yield delay(ms)
		}
	}
}

function* gapiSaga() {
	yield take(ActionType.InitGapi)
	try {
		yield* tryUntilSuccess(GAPI.loadAuth2)
		yield* tryUntilSuccess(GAPI.initClient)
		yield GAPI.listenToAuth2SignIn()
		yield put(makeActionSetSignedIn({
			flag: GAPI.isSignedIn(),
		}))
		yield takeLatest(ActionType.SignIn, signIn)
		yield takeLatest(ActionType.SignOut, signOut)
		yield takeLatest(ActionType.LoadEventsFromAllCalendars, loadEventsFromAllCalendars)
		yield takeLatest(ActionType.LoadCalendars, loadCalendars)
		yield takeLatest(ActionType.SetInterval, setInterval_)
		yield takeLatest(ActionType.SetLocale, setLocale)
		yield takeLatest(ActionType.SetVisibility, setVisibility)
		yield put(makeActionSetGapiReady({
			flag: true,
		}))
	} catch (e) {
		yield* showError(e)
	}
}

function* signIn() {
	yield GAPI.signIn()
}

function* signOut() {
	yield GAPI.signOut()
}

function* loadEventsFromAllCalendars() {
	try {
		yield* loadStart(LOAD_STATE_EVENTS)
		const events: IEvent[] = yield GAPI.loadEventsFromAllCalendars()
		yield put(makeActionSetEvents({
			events,
		}))
		yield* loadSuccess(LOAD_STATE_EVENTS)
	} catch (e) {
		yield* showError(e)
		yield* loadError(LOAD_STATE_EVENTS)
	}
}

function* loadCalendars() {
	try {
		yield* loadStart(LOAD_STATE_CALENDARS)
		const calendars: ICalendar[] = yield GAPI.loadCalendars()
		yield put(makeActionSetCalendars({
			calendars,
		}))
		yield* loadSuccess(LOAD_STATE_CALENDARS)
		yield put(makeActionLoadEventsFromAllCalendars({}))
	} catch (e) {
		yield* showError(e)
		yield* loadError(LOAD_STATE_CALENDARS)
	}
}

function* setInterval_() {
	yield delay(600)
	yield put(makeActionLoadEventsFromAllCalendars({}))
}

function* setLocale(action: ActionSetLocale) {
	yield delay(3000)
	yield saveLocale(action.locale)
	yield put(makeActionLoadEventsFromAllCalendars({}))
}

function* setVisibility(action: ActionSetVisibility) {
	if (action.visible && action.hideTime && action.showTime - action.hideTime > 5 * MINUTE) {
		yield put(makeActionLoadEventsFromAllCalendars({}))
	}
}

function* showError(e: any) {
	console.error(e)
	yield put(makeActionAddErrors({
		errors: [e + ''],
	}))
}

function* loadStart(id: string) {
	yield put(makeActionUpdateStateLoad({
		id,
		state: {
			hasError: false,
			isLoading: true,
		},
	}))
}

function* loadSuccess(id: string) {
	yield put(makeActionUpdateStateLoad({
		id,
		state: {
			hasError: false,
			isLoading: false,
			lastLoaded: Date.now(),
		},
	}))
}

function* loadError(id: string) {
	yield put(makeActionUpdateStateLoad({
		id: id,
		state: {
			hasError: true,
			isLoading: false,
			lastLoaded: Date.now(),
		},
	}))
}
