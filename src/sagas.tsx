import { takeEvery, takeLatest } from 'redux-saga/effects';
import { makeActionLoadCalendars } from './ActionLoadCalendars';
import { makeActionSetCalendars } from './ActionSetCalendars';
import { makeActionSetEvents } from './ActionSetEvents';
import { makeActionSetGapiReady } from './ActionSetGapiReady';
import { makeActionSetSignedIn } from './ActionSetSignedIn';
import { ActionType } from './ActionType';
import { ICalendar } from './ICalendar';
import { IEvent, makeIEventFromCalendarEvent } from './IEvent';
import { WEEK } from './statics';
import { store } from './store';

export function* rootSaga() {
	yield takeLatest(ActionType.InitGapi, initGapi)
	yield takeLatest(ActionType.SignIn, signIn)
	yield takeLatest(ActionType.SignOut, signOut)
	yield takeEvery(ActionType.LoadEvents, () => store.dispatch(makeActionLoadCalendars({})))
	yield takeEvery(ActionType.SetCalendars, () => loadEventsFromAllCalendars())
	yield takeEvery(ActionType.LoadCalendars, () => loadCalendars())
}

export function initGapi() {
	gapi.load('client:auth2', () => {
		gapi.client.init({
			apiKey: 'AIzaSyDgRx5gSwle0rziKByBbwzWo3xlntL95BQ',
			clientId: '70722773944-snk5oonsveejagkeuf1v6p92c05f1e01.apps.googleusercontent.com',
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
		}).then(() => {
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus)
			updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
			store.dispatch(makeActionSetGapiReady({
				flag: true,
			}))
		})
	})
}

function updateSignInStatus(isSignedIn: boolean) {
	store.dispatch(makeActionSetSignedIn({
		flag: isSignedIn,
	}))
}

function signIn() {
	gapi.auth2.getAuthInstance().signIn()
}

function signOut() {
	gapi.auth2.getAuthInstance().signOut()
}

function loadCalendars(calendars: ReadonlyArray<ICalendar> = [], pageToken?: string): Promise<void> {
	return gapi.client.calendar.calendarList.list({
		pageToken,
	})
		.then(response => {
			const newCalendars = [...calendars, ...response.result.items]
			if (response.result.nextPageToken) {
				loadCalendars(newCalendars, response.result.nextPageToken)
			} else {
				store.dispatch(makeActionSetCalendars({
					calendars: newCalendars,
				}))
			}
		})
}

function loadEventsFromCalendar(calendarId: string, events: ReadonlyArray<IEvent> = [], pageToken?: string) {
	return new Promise<gapi.client.HttpRequestFulfilled<gapi.client.calendar.Events>>((resolve, reject) => {
		gapi.client.calendar.events.list({
			calendarId,
			timeMin: (new Date(Date.now() - 4 * WEEK)).toISOString(),
			timeMax: (new Date(Date.now() + 16 * WEEK)).toISOString(),
			showDeleted: false,
			singleEvents: true,
			orderBy: 'startTime',
			pageToken,
		})
			.then(response => {
				const newEvents = [...events, ...response.result.items.map(makeIEventFromCalendarEvent)]
				if (response.result.nextPageToken) {
					resolve(loadEventsFromCalendar(calendarId, newEvents, response.result.nextPageToken))
				} else {
					resolve(response)
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}

function loadEventsFromAllCalendars() {
	return Promise.all(
		Object.keys(store.getState().calendarsById).map(calendarId => loadEventsFromCalendar(calendarId))
	)
		.then(responses => {
			const events = ([] as IEvent[]).concat(...responses.map(_ => _.result.items.map(makeIEventFromCalendarEvent)))
			store.dispatch(makeActionSetEvents({
				events,
			}))
		})
}