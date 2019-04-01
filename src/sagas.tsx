import { push } from 'connected-react-router'
import { delay, fork, put, select, take, takeLatest } from 'redux-saga/effects'
import { makeActionAddErrors } from './ActionAddErrors'
import { ActionLoadCalendars } from './ActionLoadCalendars'
import { ActionLoadEventsFromAllCalendars, makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars'
import { ActionRequestEventDelete } from './ActionRequestEventDelete'
import { ActionRequestEventInsert } from './ActionRequestEventInsert'
import { makeActionSetBlockUi } from './ActionSetBlockUi'
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
import { StateLoadId } from './StateLoadId'
import { StateUiBlockId } from './StateUiBlockId'
import { MINUTE, SECOND } from './statics'
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
		yield takeLatest(ActionType.RequestEventDelete, requestEventDelete)
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
		yield* loadStart(StateLoadId.Events)
		const events: IEvent[] = yield GAPI.loadEventsFromAllCalendars()
		yield put(makeActionSetEvents({
			events,
		}))
		yield* loadSuccess(StateLoadId.Events)
	} catch (e) {
		yield* showError(e)
		if (action.restoreOldOnFailure) {
			yield* loadSuccess(StateLoadId.Events)
		} else {
			yield* loadError(StateLoadId.Events)
		}
	}
}

function* loadCalendars(action: ActionLoadCalendars) {
	try {
		yield* loadStart(StateLoadId.Calendars)
		const calendars: ICalendar[] = yield GAPI.loadCalendars()
		yield put(makeActionSetCalendars({
			calendars,
		}))
		yield* loadSuccess(StateLoadId.Calendars)
		yield put(makeActionLoadEventsFromAllCalendars({
			restoreOldOnFailure: false,
		}))
	} catch (e) {
		yield* showError(e)
		if (action.restoreOldOnFailure) {
			yield* loadSuccess(StateLoadId.Calendars)
		} else {
			yield* loadError(StateLoadId.Calendars)
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
	yield* blockUi(StateUiBlockId.InsertEvent, true)
	try {
		yield GAPI.insertEvent(action.calendarId, action.event)
		yield* blockUi(StateUiBlockId.InsertEvent, false)
		const startWeeks: number = yield select(routeQueryStartWeeksSelector)
		const endWeeks: number = yield select(routeQueryEndWeeksSelector)
		yield put(push(makeRouteHome({
			endWeeks,
			startWeeks,
		})))
	} catch (e) {
		yield* showError(e)
		yield* blockUi(StateUiBlockId.InsertEvent, false)
	}
}

function* setLocale(action: ActionSetLocale) {
	yield saveLocale(action.locale)
}

function* requestEventDelete(action: ActionRequestEventDelete) {
	yield* blockUi(StateUiBlockId.DeleteEvent, true)
	try {
		yield GAPI.deleteEvent(action.calendarId, action.eventId)
		yield* blockUi(StateUiBlockId.DeleteEvent, false)
	} catch (e) {
		yield* showError(e)
		yield* blockUi(StateUiBlockId.DeleteEvent, false)
	}
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
		id,
		state: StateLoad.Error,
	}))
}

function* blockUi(id: string, block: boolean) {
	yield put(makeActionSetBlockUi({
		id,
		block,
	}))
}
