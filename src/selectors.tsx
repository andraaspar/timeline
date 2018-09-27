import { createSelector } from 'reselect';
import { State } from './State';

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
			return (a.summary || '').localeCompare(b.summary)
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
			return eventsOrdered
		}
		return eventsOrdered.slice(0, firstFutureEventIndex).reverse()
	},
)