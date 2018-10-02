import { Settings } from 'luxon';
import 'normalize.css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'window-onerror-handler';
import { AppComp } from './AppComp';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';
import { Timer } from './Timer';
import { Visibility } from './Visibility';

Settings.throwOnInvalid = true
ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root')
)
registerServiceWorker()
Visibility.listen()
Timer.listen()
Timer.start()
