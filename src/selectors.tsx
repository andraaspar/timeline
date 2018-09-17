import { createSelector } from 'reselect';
import { State } from './State';

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