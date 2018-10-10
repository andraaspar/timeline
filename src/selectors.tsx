import { withInterface } from 'illa/Type'
import * as qs from 'qs'
import { createSelector } from 'reselect'
import { numberFromParam } from './param'
import { Path } from './Path'
import { State } from './State'
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS } from './statics'
import { TRoute } from './TRoute'

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

export const routePathStringSelector = (state: State) => state.router.location.pathname
export const routeQueryStringSelector = (state: State) => state.router.location.search

export const routeQuerySelector = createSelector(
	routePathStringSelector,
	routeQueryStringSelector,
	(path, query) => {
		return withInterface<TRoute>({
			...qs.parse(query ? query.slice(1) : ''),
			path,
		})
	}
)

export const routeQueryStartWeeksSelector = createSelector(
	routeQuerySelector,
	query => {
		switch (query.path) {
			case Path.Home:
			case Path.Create:
				return numberFromParam(query.startWeeks, INITIAL_START_WEEKS)
			default:
				return INITIAL_START_WEEKS
		}
	},
)

export const routeQueryEndWeeksSelector = createSelector(
	routeQuerySelector,
	query => {
		switch (query.path) {
			case Path.Home:
			case Path.Create:
				return numberFromParam(query.endWeeks, INITIAL_END_WEEKS)
			default:
				return INITIAL_END_WEEKS
		}
	},
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
