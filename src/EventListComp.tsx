import * as React from 'react';
import { Component } from 'react';
import { IEvent } from './IEvent';
import { DAY, HOUR, MINUTE, SECOND, WEEK } from './statics';

export interface EventListCompProps {
	readonly events: ReadonlyArray<IEvent>
	readonly loadEvents: () => void
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
		const now = Date.now()
		return (
			<table>
				<tbody>
					{this.props.events.length ?
						this.props.events.map(event =>
							<tr key={event.id}>
								<td>{event.summary}</td>
								<td>{this.getTimeDifference(event.startTimestamp, now)}</td>
							</tr>
						)
						:
						<tr>
							<td><em>{`No events.`}</em></td>
						</tr>
					}
				</tbody>
			</table>
		)
	}

	componentDidMount() {
		this.props.loadEvents()
	}
	// getSnapshotBeforeUpdate(prevProps: EventListCompProps, prevState: EventListCompState): EventListCompSnapshot {}
	// componentDidUpdate(prevProps: EventListCompProps, prevState: EventListCompState, snapshot: EventListCompSnapshot) {}
	// componentWillUnmount() {}

	getTimeDifference(min: number, max: number): string {
		const originalDiff = max - min
		let diff = Math.abs(originalDiff)
		const weeks = Math.floor(diff / WEEK)
		diff %= WEEK
		const days = Math.floor(diff / DAY)
		diff %= DAY
		const hours = Math.floor(diff / HOUR)
		diff %= HOUR
		const mins = Math.floor(diff / MINUTE)
		diff %= MINUTE
		const secs = Math.round(diff / SECOND)
		return [
			weeks && `${weeks} weeks`,
			days && `${days} days`,
			`${hours} hours`,
			`${mins} minutes`,
			`${secs} seconds`,
			originalDiff < 0 ? `in the future` : `in the past`,
		].filter(Boolean).join(' ')
	}
}