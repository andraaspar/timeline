import { push } from 'connected-react-router'
import { delay } from 'redux-saga'
import { fork, put, select, take, takeLatest } from 'redux-saga/effects'
import { makeActionAddErrors } from './ActionAddErrors'
import { ActionLoadCalendars } from './ActionLoadCalendars'
import { ActionLoadEventsFromAllCalendars, makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars'
import { ActionRequestEventInsert } from './ActionRequestEventInsert'
import { makeActionSetCalendars } from './ActionSetCalendars'
import { makeActionSetEvents } from './ActionSetEvents'
import { makeActionSetGapiReady } from './ActionSetGapiReady'
import { ActionSetLocale } from './ActionSetLocale'
import { makeActionSetSignedIn } from './ActionSetSignedIn'
import { ActionSetVisibility } from './ActionSetVisibility'
import { ActionType } from './ActionType'
import { makeActionUpdateStateLoad } from './ActionUpdateStateLoad'
import { GAPI } from './GAPI'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { makeRouteHome } from './RouteHome'
import { gotEventsSelector, routeQueryEndWeeksSelector, routeQueryStartWeeksSelector } from './selectors'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS, LOAD_STATE_INSERT_EVENT, MINUTE, SECOND } from './statics'
import { saveLocale } from './UtilLocale'

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
		yield takeLatest(ActionType.SetVisibility, setVisibility)
		yield takeLatest(ActionType.RequestEventInsert, requestEventInsert)
		yield takeLatest(ActionType.SetLocale, setLocale)
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

function* loadEventsFromAllCalendars(action: ActionLoadEventsFromAllCalendars) {
	try {
		yield* loadStart(LOAD_STATE_EVENTS)
		const events: IEvent[] = yield GAPI.loadEventsFromAllCalendars()
		yield put(makeActionSetEvents({
			events,
		}))
		yield* loadSuccess(LOAD_STATE_EVENTS)
	} catch (e) {
		yield* showError(e)
		if (action.restoreOldOnFailure) {
			yield* loadSuccess(LOAD_STATE_EVENTS)
		} else {
			yield* loadError(LOAD_STATE_EVENTS)
		}
	}
}

function* loadCalendars(action: ActionLoadCalendars) {
	try {
		yield* loadStart(LOAD_STATE_CALENDARS)
		const calendars: ICalendar[] = yield GAPI.loadCalendars()
		yield put(makeActionSetCalendars({
			calendars,
		}))
		yield* loadSuccess(LOAD_STATE_CALENDARS)
		yield put(makeActionLoadEventsFromAllCalendars({
			restoreOldOnFailure: false,
		}))
	} catch (e) {
		yield* showError(e)
		if (action.restoreOldOnFailure) {
			yield* loadSuccess(LOAD_STATE_CALENDARS)
		} else {
			yield* loadError(LOAD_STATE_CALENDARS)
		}
	}
}

function* setVisibility(action: ActionSetVisibility) {
	if (action.visible && action.hideTime && action.showTime - action.hideTime > 5 * MINUTE) {
		const gotEvents: boolean = yield select(gotEventsSelector)
		yield put(makeActionLoadEventsFromAllCalendars({
			restoreOldOnFailure: gotEvents,
		}))
	}
}

function* requestEventInsert(action: ActionRequestEventInsert) {
	yield* loadStart(LOAD_STATE_INSERT_EVENT)
	try {
		yield GAPI.insertEvent(action.calendarId, action.event)
		yield* loadSuccess(LOAD_STATE_INSERT_EVENT)
		const startWeeks: number = yield select(routeQueryStartWeeksSelector)
		const endWeeks: number = yield select(routeQueryEndWeeksSelector)
		yield put(push(makeRouteHome({
			endWeeks,
			startWeeks,
		})))
	} catch (e) {
		yield* showError(e)
		yield* loadError(LOAD_STATE_INSERT_EVENT)
	}
}

function* setLocale(action: ActionSetLocale) {
	yield saveLocale(action.locale)
}

function* showError(e: any) {
	console.error(e)
	let errorAsString = e + ''
	if (errorAsString === {} + '') {
		// errorAsString = get(() => e.result.error.message, () => JSON.stringify(e, undefined, 2))
		errorAsString = JSON.stringify(e, undefined, 2)
	}
	yield put(makeActionAddErrors({
		errors: [errorAsString],
	}))
}

function* loadStart(id: string) {
	yield put(makeActionUpdateStateLoad({
		id,
		state: StateLoad.Loading,
	}))
}

function* loadSuccess(id: string) {
	yield put(makeActionUpdateStateLoad({
		id,
		state: StateLoad.Loaded,
	}))
}

function* loadError(id: string) {
	yield put(makeActionUpdateStateLoad({
		id: id,
		state: StateLoad.Error,
	}))
}
