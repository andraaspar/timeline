import * as qs from 'qs'
import { createSelector } from 'reselect'
import { numberFromParam } from './param'
import { TRoute } from './route'
import { State } from './State'
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS } from './statics'

export const nowSelector = (state: State) => state.now
export const eventsByIdSelector = (state: State) => state.eventsById

export const eventsOrderedSelector = createSelector(
	eventsByIdSelector,
	(eventsById) => {
		return Object.keys(eventsById).map(id => eventsById[id]).sort((a, b) => {
			const startDiff = a.startTimestamp - b.startTimestamp
			if (startDiff) {
				return startDiff
			}
			const endDiff = a.endTimestamp - b.endTimestamp
			if (endDiff) {
				return endDiff
			}
			return (a.summary || '').localeCompare(b.summary || '')
		})
	},
)

export const firstFutureEventIndexSelector = createSelector(
	eventsOrderedSelector,
	nowSelector,
	(eventsOrdered, now) => {
		return eventsOrdered.findIndex(event => event.startTimestamp >= now)
	},
)

export const eventsOrderedFutureSelector = createSelector(
	eventsOrderedSelector,
	firstFutureEventIndexSelector,
	(eventsOrdered, firstFutureEventIndex) => {
		if (firstFutureEventIndex == -1) {
			return []
		}
		return eventsOrdered.slice(firstFutureEventIndex)
	},
)

export const eventsOrderedPastSelector = createSelector(
	eventsOrderedSelector,
	firstFutureEventIndexSelector,
	(eventsOrdered, firstFutureEventIndex) => {
		if (firstFutureEventIndex == -1) {
			return eventsOrdered.slice().reverse()
		}
		return eventsOrdered.slice(0, firstFutureEventIndex).reverse()
	},
)

export const gotEventsSelector = createSelector(
	eventsByIdSelector,
	eventsById => Object.keys(eventsById).length > 0,
)

export const routerLocationSearchSelector = (state: State) => state.router.location.search

export const routeParamsSelector = createSelector(
	routerLocationSearchSelector,
	query => qs.parse(query ? query.slice(1) : '') as TRoute
)

export const routeParamsStartWeeksSelector = createSelector(
	routeParamsSelector,
	params => numberFromParam(params.startWeeks, INITIAL_START_WEEKS),
)

export const routeParamsEndWeeksSelector = createSelector(
	routeParamsSelector,
	params => numberFromParam(params.endWeeks, INITIAL_END_WEEKS),
)

export const localeSelector = (state: State) => state.locale

export const calendarsByIdSelector = (state: State) => state.calendarsById

export const selectedCalendarIdsSelector = createSelector(
	calendarsByIdSelector,
	calendarsById => Object.keys(calendarsById).filter(id => {
		const calendar = calendarsById[id]
		return calendar.selected
	}),
)
