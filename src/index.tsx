import { withInterface } from 'illa/Type';
import 'normalize.css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ActionGapiReady } from './ActionGapiReady';
import { ActionType } from './ActionType';
import { AppComp } from './AppComp';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

	; (window as any).handleClientLoad = () => {
		store.dispatch(withInterface<ActionGapiReady>({
			type: ActionType.GapiReady,
		}))
	}

// function listUpcomingEvents() {
// 	gapi.client.events.list({
// 		calendarId: 'primary',
// 		timeMin: (new Date(Date.now() - DAY)).toISOString(),
// 		timeMax: (new Date(Date.now() + 4 * WEEK)).toISOString(),
// 		showDeleted: false,
// 		singleEvents: true,
// 		orderBy: 'startTime'
// 	}).then(response => {
// 		var events = response.result.items
// 		appendPre('Upcoming events:')

// 		if (events.length > 0) {
// 			var now = Date.now()
// 			for (let i = 0; i < events.length; i++) {
// 				let event = events[i]
// 				let dateTime = event.start.dateTime ? new Date(event.start.dateTime) : new (Date as any)(...(event.start.date as string).split('-').map((_, i) => parseInt(_, 10) - (i === 1 ? 1 : 0)))
// 				var when = getTimeDifference(dateTime.getTime(), now)
// 				appendPre(event.summary + ' (' + when + ')')
// 			}
// 		} else {
// 			appendPre('No upcoming events found.')
// 		}
// 	})
// }

function getTimeDifference(min: number, max: number): string {
	console.log(min, max)
	const originalDiff = max - min
	let diff = Math.abs(originalDiff)
	const weeks = Math.floor(diff / WEEK)
	diff %= WEEK
	const days = Math.floor(diff / DAY)
	diff %= DAY
	const hours = Math.floor(diff / HOUR)
	diff %= HOUR
	const mins = Math.floor(diff / MINUTE)
	diff %= MINUTE
	const secs = Math.round(diff / SECOND)
	return [
		weeks && `${weeks} weeks`,
		days && `${days} days`,
		`${hours} hours`,
		`${mins} minutes`,
		`${secs} seconds`,
		originalDiff < 0 ? `in the future` : `in the past`,
	].filter(Boolean).join(' ')
}

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root')
)
registerServiceWorker()
