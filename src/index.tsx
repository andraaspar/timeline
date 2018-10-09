import { ConnectedRouter } from 'connected-react-router'
import { Settings } from 'luxon'
import 'normalize.css/normalize.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'window-onerror-handler'
import { CompApp } from './CompApp'
import './index.css'
import { unregister } from './registerServiceWorker'
import { history, store } from './store'
import { Timer } from './Timer'
import { Visibility } from './Visibility'

Settings.throwOnInvalid = true
ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<CompApp />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)
unregister()
Visibility.listen()
Timer.listen()
Timer.start()
