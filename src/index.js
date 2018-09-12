import React from 'react'
import ReactDOM from 'react-dom'
import '../node_modules/normalize.css/normalize.css'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

/* global gapi */

const CLIENT_ID = '70722773944-snk5oonsveejagkeuf1v6p92c05f1e01.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDgRx5gSwle0rziKByBbwzWo3xlntL95BQ'

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

const authorizeButton = document.getElementById('authorize_button')
const signoutButton = document.getElementById('signout_button')


window.handleClientLoad = () => {
  gapi.load('client:auth2', initClient)
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    authorizeButton.onclick = handleAuthClick
    signoutButton.onclick = handleSignoutClick
  })
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'block'
    listUpcomingEvents()
  } else {
    authorizeButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn()
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut()
}

function appendPre(message) {
  var pre = document.getElementById('content')
  var textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items
    appendPre('Upcoming events:')

    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        var event = events[i]
        var when = event.start.dateTime
        if (!when) {
          when = event.start.date
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.')
    }
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
