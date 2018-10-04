import { TSet } from 'illa/Type'
import React, { Component } from 'react'
import { EventListItemComp } from './EventListItemComp'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { RowComp } from './RowComp'
import { StateLoad } from './StateLoad'

export interface EventListCompProps {
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly orderedEvents: ReadonlyArray<IEvent>
	readonly eventsLoadState: StateLoad
	readonly now: number
}
export interface EventListCompState { }
export interface EventListCompSnapshot { }

export class EventListComp extends Component<EventListCompProps, EventListCompState> {
	static displayName = __filename

	// constructor(props: EventListCompProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// componentWillMount() {}
	// getDerivedStateFromProps(nextProps: EventListCompProps, prevState: EventListCompState): EventListCompState | null {}
	// shouldComponentUpdate(nextProps: EventListCompProps, nextState: EventListCompState): boolean {}
	render() {
		return (this.props.eventsLoadState.isLoading ?
			<div>
				{`Loading events...`}
			</div>
			:
			(this.props.eventsLoadState.hasError ?
				<div>
					<em>{`Error loading events.`}</em>
				</div>
				:
				(this.props.orderedEvents.length ?
					<RowComp distance={5} isVertical>
						{this.props.orderedEvents.map((event, index, events) =>
							<EventListItemComp
								key={event.id}
								event={event}
								calendar={this.props.calendarsById[event.calendarId]}
								now={this.props.now}
								nextEvent={events[index + 1]}
							/>
						)}
					</RowComp>
					:
					<div>
						<em>{`No events.`}</em>
					</div>
				)
			)
		)
	}

	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: EventListCompProps, prevState: EventListCompState): EventListCompSnapshot {}
	// componentDidUpdate(prevProps: EventListCompProps, prevState: EventListCompState, snapshot: EventListCompSnapshot) {}
	// componentWillUnmount() {}
}
