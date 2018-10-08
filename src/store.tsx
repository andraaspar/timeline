import { connectRouter, routerMiddleware } from 'connected-react-router'
import createHashHistory from 'history/createHashHistory'
import { applyMiddleware, createStore, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { ActionType } from './ActionType'
import { rootSaga } from './sagas'
import { reducerState } from './State'
import { TAction } from './TAction'

export const history = createHashHistory()

const sagaMiddleware = createSagaMiddleware()
const middleware = [
	routerMiddleware(history),
	sagaMiddleware,
	process.env.NODE_ENV !== 'production' && createLogger({
		collapsed: true,
		timestamp: false,
		predicate: (getState, action: TAction) => action.type !== ActionType.SetNow,
	}),
].filter(Boolean) as Middleware[]

export const store = createStore(
	connectRouter(history)(reducerState),
	applyMiddleware(...middleware),
)

sagaMiddleware.run(rootSaga)
