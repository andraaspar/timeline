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

export const eventsOrderedFutureSelector = createSelector(
	eventsOrderedSelector,
	nowSelector,
	(eventsOrdered, now) => {
		return eventsOrdered.slice(eventsOrdered.findIndex(event => event.startTimestamp >= now))
	},
)

export const eventsOrderedPastSelector = createSelector(
	eventsOrderedSelector,
	nowSelector,
	(eventsOrdered, now) => {
		return eventsOrdered.slice(0, eventsOrdered.findIndex(event => event.startTimestamp >= now)).reverse()
	},
)