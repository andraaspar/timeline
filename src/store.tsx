import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, createStore, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { ActionType } from './ActionType'
import { rootSaga } from './sagas'
import { reducerState, State } from './State'
import { TAction } from './TAction'

export const history = createHashHistory()

const sagaMiddleware = createSagaMiddleware()
const middleware = [
	routerMiddleware(history),
	sagaMiddleware,
	process.env.NODE_ENV !== 'production' &&
		createLogger({
			collapsed: true,
			timestamp: false,
			predicate: (getState, action: TAction) =>
				action.type !== ActionType.SetNow,
		}),
].filter(Boolean) as Middleware[]

const routerReducer = connectRouter(history)

export const store = createStore((state: State, action: TAction) => {
	state = reducerState(state, action)
	const router = routerReducer(state.router, action as any)
	if (router !== state.router) {
		state = {
			...state,
			router,
		}
	}
	return state
}, applyMiddleware(...middleware))

sagaMiddleware.run(rootSaga)
