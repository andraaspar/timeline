import { applyMiddleware, createStore, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { ActionType } from './ActionType'
import { rootSaga } from './sagas'
import { reducerState } from './State'
import { TAction } from './TAction'

const sagaMiddleware = createSagaMiddleware()
const middleware = [
	sagaMiddleware,
	process.env.NODE_ENV !== 'production' && createLogger({
		collapsed: true,
		timestamp: false,
		predicate: (getState, action: TAction) => action.type !== ActionType.SetNow,
	}),
].filter(Boolean) as Middleware[]

export const store = createStore(
	reducerState,
	applyMiddleware(...middleware),
)

sagaMiddleware.run(rootSaga)
