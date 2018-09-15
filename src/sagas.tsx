import { call, takeLatest } from 'redux-saga/effects';
import { makeActionSetSignedIn } from './ActionSetSignedIn';
import { ActionType } from './ActionType';
import { store } from './store';
import { TAction } from './TAction';

export function* rootSaga() {
	yield takeLatest(ActionType.GapiReady, initGapi)
	yield takeLatest(ActionType.SignIn, signIn)
	yield takeLatest(ActionType.SignOut, signOut)
}

export function* initGapi(action: TAction) {
	yield call(gapi.load, 'client:auth2', () => {
		gapi.client.init({
			apiKey: 'AIzaSyDgRx5gSwle0rziKByBbwzWo3xlntL95BQ',
			clientId: '70722773944-snk5oonsveejagkeuf1v6p92c05f1e01.apps.googleusercontent.com',
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
		}).then(() => {
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus)
			updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
		})
	})
}

function updateSignInStatus(isSignedIn: boolean) {
	console.log('updateSignInStatus')
	store.dispatch(makeActionSetSignedIn({
		flag: isSignedIn,
	}))
}

function* signIn() {
	console.log('signIn')
	yield call(gapi.auth2.getAuthInstance().signIn)
}

function* signOut() {
	console.log('signOut')
	yield call(gapi.auth2.getAuthInstance().signOut)
}