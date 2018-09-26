import { makeActionSetSignedIn } from './ActionSetSignedIn';
import { ICalendar } from './ICalendar';
import { IEvent, makeIEventFromCalendarEvent } from './IEvent';
import { WEEK } from './statics';
import { store } from './store';

export namespace GAPI {
	export const ERROR_AUTH2 = `[pfnwpe] GAPI auth2 error`
	export const ERROR_TIMEOUT = `[pfnwqa] GAPI auth2 timeout`

	export function loadAuth2() {
		return new Promise<void>((resolve, reject) => {
			gapi.load('client:auth2', {
				callback: () => resolve(),
				onerror: () => reject(ERROR_AUTH2),
				ontimeout: () => reject(ERROR_TIMEOUT),
				timeout: 5000,
			})
		})
	}

	export function initClient() {
		return new Promise<void>((resolve, reject) => {
			gapi.client.init({
				apiKey: 'AIzaSyDgRx5gSwle0rziKByBbwzWo3xlntL95BQ',
				clientId: '70722773944-snk5oonsveejagkeuf1v6p92c05f1e01.apps.googleusercontent.com',
				discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
				scope: 'https://www.googleapis.com/auth/calendar.readonly',
			})
				.then(() => {
					resolve()
				})
				.catch(e => {
					reject(e)
				})
		})
	}

	export function listenToAuth2SignIn() {
		gapi.auth2.getAuthInstance().isSignedIn.listen(flag => {
			store.dispatch(makeActionSetSignedIn({ flag }))
		})
	}

	export function isSignedIn() {
		return gapi.auth2.getAuthInstance().isSignedIn.get()
	}

	export function signIn() {
		gapi.auth2.getAuthInstance().signIn()
	}

	export function signOut() {
		gapi.auth2.getAuthInstance().signOut()
	}

	export function loadCalendars(calendars: ReadonlyArray<ICalendar> = [], pageToken?: string) {
		return new Promise<ICalendar[]>((resolve, reject) => {
			gapi.client.calendar.calendarList.list({
				pageToken,
			})
				.then(response => {
					const newCalendars = [...calendars, ...response.result.items]
					if (response.result.nextPageToken) {
						resolve(loadCalendars(newCalendars, response.result.nextPageToken))
					} else {
						resolve(newCalendars)
					}
				})
				.catch(e => {
					reject(e)
				})
		})
	}

	export function loadEventsFromCalendar(calendarId: string, events: ReadonlyArray<IEvent> = [], pageToken?: string) {
		return new Promise<IEvent[]>((resolve, reject) => {
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
					const newEvents = [...events, ...response.result.items.map(_ => makeIEventFromCalendarEvent(calendarId, _))]
					if (response.result.nextPageToken) {
						resolve(loadEventsFromCalendar(calendarId, newEvents, response.result.nextPageToken))
					} else {
						resolve(newEvents)
					}
				})
				.catch(e => {
					reject(e)
				})
		})
	}

	export function loadEventsFromAllCalendars() {
		return new Promise<IEvent[]>((resolve, reject) => {
			Promise.all(
				Object.keys(store.getState().calendarsById)
					.filter(calendarId => {
						const calendar = store.getState().calendarsById[calendarId]
						return !!calendar.selected
					})
					.map(calendarId => loadEventsFromCalendar(calendarId))
			)
				.then(loadedEvents => {
					const events = ([] as IEvent[]).concat(...loadedEvents)
					resolve(events)
				})
				.catch(e => {
					reject(e)
				})
		})
	}
}
