import 'normalize.css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppComp } from './AppComp';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';
import { Timer } from './Timer';

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root')
)
registerServiceWorker()
Timer.listen()
Timer.start()
