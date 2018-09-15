import { withInterface } from 'illa/Type';
import 'normalize.css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ActionInitGapi } from './ActionInitGapi';
import { ActionType } from './ActionType';
import { AppComp } from './AppComp';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';

; (window as any).handleClientLoad = () => {
	store.dispatch(withInterface<ActionInitGapi>({
		type: ActionType.InitGapi,
	}))
}

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root')
)
registerServiceWorker()
