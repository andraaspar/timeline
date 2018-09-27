import { delay } from 'redux-saga';
import { fork, put, take, takeLatest } from 'redux-saga/effects';
import { makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars';
import { makeActionSetCalendars } from './ActionSetCalendars';
import { makeActionSetEvents } from './ActionSetEvents';
import { makeActionSetGapiReady } from './ActionSetGapiReady';
import { ActionSetLocale } from './ActionSetLocale';
import { makeActionSetSignedIn } from './ActionSetSignedIn';
import { ActionSetVisibility } from './ActionSetVisibility';
import { ActionType } from './ActionType';
import { GAPI } from './GAPI';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { saveLocale } from './LocaleUtil';
import { MINUTE, SECOND } from './statics';

export function* rootSaga() {
	yield fork(gapiSaga)
}

function* tryUntilSuccess(fun: () => Promise<any>, ms: number = 5 * SECOND) {
	while (true) {
		try {
			return yield fun()
		} catch (e) {
			console.error(e)
			yield delay(ms)
		}
	}
}

function* gapiSaga() {
	yield take(ActionType.InitGapi)
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
}

function* signIn() {
	yield GAPI.signIn()
}

function* signOut() {
	yield GAPI.signOut()
}

function* loadEventsFromAllCalendars() {
	const events: IEvent[] = yield GAPI.loadEventsFromAllCalendars()
	yield put(makeActionSetEvents({
		events,
	}))
}

function* loadCalendars() {
	const calendars: ICalendar[] = yield GAPI.loadCalendars()
	yield put(makeActionSetCalendars({
		calendars,
	}))
	yield put(makeActionLoadEventsFromAllCalendars({}))
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
