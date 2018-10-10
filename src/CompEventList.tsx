import { TSet } from 'illa/Type'
import React, { Component } from 'react'
import { CompEventListItem } from './CompEventListItem'
import { CompRow } from './CompRow'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { StateLoad } from './StateLoad'

export interface CompEventListProps {
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly orderedEvents: ReadonlyArray<IEvent>
	readonly eventsLoadState: StateLoad
	readonly now: number
	readonly locale: string
	readonly isPast?: boolean
}
export interface CompEventListState { }
export interface CompEventListSnapshot { }

const displayName = `CompEventList`

export class CompEventList extends Component<CompEventListProps, CompEventListState> {
	static displayName = displayName

	// constructor(props: CompEventListProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// componentWillMount() {}
	// getDerivedStateFromProps(nextProps: CompEventListProps, prevState: CompEventListState): CompEventListState | null {}
	// shouldComponentUpdate(nextProps: CompEventListProps, nextState: CompEventListState): boolean {}
	render() {
		return (
			this.props.orderedEvents.length ?
				<CompRow distance={5} isVertical>
					{this.props.orderedEvents.map((event, index, events) =>
						<CompEventListItem
							key={event.id}
							event={event}
							calendar={this.props.calendarsById[event.calendarId]}
							now={this.props.now}
							nextEvent={event.isDate ? null : events.slice(index + 1).find(e => e.isDate == event.isDate) || null}
							locale={this.props.locale}
							isPast={this.props.isPast}
						/>
					)}
				</CompRow>
				:
				<div>
					<em>{`No events.`}</em>
				</div>
		)
	}

	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompEventListProps, prevState: CompEventListState): CompEventListSnapshot {}
	// componentDidUpdate(prevProps: CompEventListProps, prevState: CompEventListState, snapshot: CompEventListSnapshot) {}
	// componentWillUnmount() {}
}
