import { createSelector } from 'reselect';
import { State } from './State_';

export const eventsByIdSelector = (state: State) => state.eventsById

export const eventsOrderedSelector = createSelector(
	eventsByIdSelector,
	(eventsById) => {
		return Object.keys(eventsById).map(id => eventsById[id]).sort((a, b) => a.startTimestamp - b.startTimestamp)
	},
)