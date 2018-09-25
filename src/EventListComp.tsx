import { css } from 'emotion';
import { get } from 'illa/FunctionUtil';
import { TSet } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { DAY, HOUR, MINUTE, SECOND, WEEK } from './statics';

export interface EventListCompProps {
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly orderedEvents: ReadonlyArray<IEvent>
	readonly eventsLoaded: boolean
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
		return (this.props.eventsLoaded ?
			(this.props.orderedEvents.length ?
				<div className={itemsCss}>
					{this.props.orderedEvents.map((event, index, events) =>
						<div key={event.id} className={itemCss}>
							<div
								className={colorCss}
								style={{
									backgroundColor: this.props.calendarsById[event.calendarId].backgroundColor,
									color: this.props.calendarsById[event.calendarId].foregroundColor,
								}}
							>
								{`@`}
							</div>
							<div className={titleCss}>
								{event.summary}
							</div>
							<div className={metaCss}>
								<div className={metaNameCss}>
									{`S`}
								</div>
								<div className={metaValueCss}>
									<div className={startCss}>
										{this.getTimeDifference(now, event.startTimestamp)}
									</div>
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
								</div>
								<div className={metaNameCss}>
									{`D`}
								</div>
								<div className={metaValueCss}>
									{this.getDuration(event.startTimestamp, event.endTimestamp)}
								</div>
								<div className={metaNameCss}>
									{`E`}
								</div>
								<div className={metaValueCss}>
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
								</div>
								<div className={metaNameCss}>
									{`N`}
								</div>
								<div className={metaValueCss}>
									{get(() => this.getDuration(event.endTimestamp, events[index + 1].startTimestamp))}
								</div>
							</div>
						</div>
					)}
				</div>
				:
				<div>
					<em>{`No events.`}</em>
				</div>
			)
			:
			<div>
				{`Loading...`}
			</div>
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

const itemsCss = css({
	label: `EventListComp-items`,
	marginTop: -5,
})

const itemCss = css({
	label: `EventListComp-item`,
	marginTop: 5,
	// borderWidth: 1,
	// borderStyle: 'solid',
	// borderColor: 'rgba(0, 0, 0, .2)',
	boxShadow: `0 1px 3px 1px rgba(0, 0, 0, .2)`,
	borderRadius: `4px 0 4px 0`,
	display: 'grid',
	gridTemplateRows: `min-content [header] auto [rest]`,
	gridTemplateColumns: `min-content [color] auto [rest]`,
	gridTemplateAreas: [
		`color title`,
		`. meta`,
	].map(_ => `"${_}"`).join(' '),
	gridGap: 5,
	paddingBottom: 10,
})

const colorCss = css({
	label: `EventListComp-color`,
	gridArea: 'color',
	alignSelf: 'baseline',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: 'rgba(0, 0, 0, .2)',
	borderRadius: `3px 0 3px 0`,
	padding: 3,
})

const dateCss = css({
	label: `EventListComp-date`,
	fontSize: 10,
	lineHeight: `14px`,
	color: 'gray',
})

const titleCss = css({
	label: `EventListComp-title`,
	gridArea: 'title',
	fontWeight: 'bold',
	alignSelf: 'baseline',
})

const metaCss = css({
	label: `EventListComp-meta`,
	gridArea: 'meta',
	display: 'grid',
	gridTemplateColumns: `min-content [name] auto [value]`,
	gridRowGap: 1,
	gridColumnGap: 5,
})

const metaNameCss = css({
	label: `EventListComp-metaName`,
	gridColumn: 'name-start name-end',
	justifySelf: 'end',
	alignSelf: 'baseline',
	fontSize: 10,
	fontWeight: 'bold',
	lineHeight: `14px`,
	color: 'gray',
})

const metaValueCss = css({
	label: `EventListComp-metaValue`,
	gridColumn: 'value-start value-end',
	alignSelf: 'baseline',
})

const startCss = css({
	label: `EventListComp-start`,
	fontWeight: 'bold',
})