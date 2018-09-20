import { css } from 'emotion';
import { get } from 'illa/FunctionUtil';
import * as React from 'react';
import { Component } from 'react';
import { IEvent } from './IEvent';
import { DAY, HOUR, MINUTE, SECOND, WEEK } from './statics';

export interface EventListCompProps {
	readonly events: ReadonlyArray<IEvent>
	readonly loadCalendars: () => void
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
			<table className={tableCss}>
				<thead>
					<tr>
						<th>{`Summary`}</th>
						<th>{`Start`}</th>
						<th>{`Duration`}</th>
						<th>{`End`}</th>
						<th>{`Until next`}</th>
					</tr>
				</thead>
				<tbody>
					{this.props.events.length ?
						this.props.events.map((event, index, events) =>
							<tr key={event.id}>
								<td>{event.summary}</td>
								<td>
									<div>{this.getTimeDifference(now, event.startTimestamp)}</div>
									<div className={dateCss}>
										{new Date(event.startTimestamp).toLocaleString(undefined, {
											weekday: 'short',
											year: 'numeric',
											month: 'short',
											day: '2-digit',
											hour: 'numeric',
											minute: '2-digit',
											second: '2-digit',
										})}
									</div>
								</td>
								<td>{this.getDuration(event.startTimestamp, event.endTimestamp)}</td>
								<td>
									<div>{this.getTimeDifference(now, event.endTimestamp)}</div>
									<div className={dateCss}>
										{new Date(event.endTimestamp).toLocaleString(undefined, {
											weekday: 'short',
											year: 'numeric',
											month: 'short',
											day: '2-digit',
											hour: 'numeric',
											minute: '2-digit',
											second: '2-digit',
										})}
									</div>
								</td>
								<td>{get(() => this.getDuration(event.endTimestamp, events[index + 1].startTimestamp))}</td>
							</tr>
						)
						:
						<tr>
							<td colSpan={5}><em>{`No events.`}</em></td>
						</tr>
					}
				</tbody>
			</table>
		)
	}

	componentDidMount() {
		this.props.loadCalendars()
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
			originalDiff < 0 ? `-` : `+`,
			weeks && `${weeks}w`,
			days && `${days}d`,
			`${hours}h`,
			`${mins}m`,
			`${secs}s`,
		].filter(Boolean).join(' ')
	}

	getDuration(start: number, end: number): string {
		const originalDiff = end - start
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
			originalDiff < 0 ? `-` : `+`,
			weeks && `${weeks}w`,
			days && `${days}d`,
			hours && `${hours}h`,
			mins && `${mins}m`,
			secs && `${secs}s`,
			!weeks && !days && !hours && !mins && !secs && '0',
		].filter(Boolean).join(' ')
	}
}

const tableCss = css({
	label: `EventListComp-table`,
	width: `100%`,
	tableLayout: 'fixed',
	borderCollapse: 'collapse',
	'> * > tr > *': {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: 'gray',
		verticalAlign: 'baseline',
		textAlign: 'left',
	},
	'> tbody > tr:nth-child(odd) > *': {
		backgroundColor: '#eee',
	}
})

const dateCss = css({
	label: `EventListComp-table`,
	fontSize: 10,
	lineHeight: `14px`,
	color: 'gray',
})