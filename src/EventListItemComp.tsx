import { css, cx } from 'emotion'
import { get } from 'illa/FunctionUtil'
import { DateTime } from 'luxon'
import React, { Component } from 'react'
import { buttonCss } from './buttonCss'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { DATE_OPTIONS, DAY, HOUR, MINUTE, SECOND, WEEK } from './statics'

export interface EventListItemCompProps {
	readonly calendar: ICalendar
	readonly event: IEvent
	readonly nextEvent: IEvent | null
	readonly now: number
	readonly alwaysExpanded?: boolean
	readonly locale: string
}
export interface EventListItemCompState {
	readonly expanded: boolean
	readonly alwaysExpanded: boolean
}
export interface EventListItemCompSnap { }

const displayName = 'EventListItemComp'

export class EventListItemComp extends Component<EventListItemCompProps, EventListItemCompState/* , EventListItemCompSnap */> {
	static displayName = displayName

	constructor(props: EventListItemCompProps) {
		super(props)
		this.state = {
			expanded: false,
			alwaysExpanded: false,
		}
	}
	static getDerivedStateFromProps(nextProps: EventListItemCompProps, prevState: EventListItemCompState): EventListItemCompState | null {
		const { event } = nextProps
		const isInProgress = event.startTimestamp <= nextProps.now && event.endTimestamp > nextProps.now
		const alwaysExpanded = nextProps.alwaysExpanded || isInProgress
		return {
			...prevState,
			alwaysExpanded,
			...alwaysExpanded && { expanded: true },
		}
	}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: EventListItemCompProps, nextState: EventListItemCompState): boolean {}
	render() {
		return (
			<div className={this.props.event.isDate ? itemIsDateCss : itemCss}>
				<div
					className={colorCss}
					style={{
						backgroundColor: this.props.calendar.backgroundColor,
						color: this.props.calendar.foregroundColor,
					}}
				>
					{this.props.event.startTimestamp <= this.props.now ?
						(this.props.event.endTimestamp > this.props.now ?
							`►`
							:
							`-`
						)
						:
						`+`
					}
				</div>
				<div className={titleCss}>
					{this.props.event.summary}
				</div>
				<div className={metaCss}>
					<div className={metaNameCss}>
						{`S`}
					</div>
					<div className={metaValueCss}>
						<div className={startEndCss}>
							{this.getTimeDifference(this.props.now, this.props.event.startTimestamp)}
						</div>
						<div className={dateCss}>
							{DateTime.fromMillis(this.props.event.startTimestamp, { locale: this.props.locale }).toLocaleString(DATE_OPTIONS)}
						</div>
					</div>
					{this.state.expanded &&
						<>
							<div className={metaNameCss}>
								{`D`}
							</div>
							<div className={metaValueCss}>
								{this.getDuration(this.props.event.startTimestamp, this.props.event.endTimestamp)}
							</div>
							<div className={metaNameCss}>
								{`E`}
							</div>
							<div className={metaValueCss}>
								<div className={startEndCss}>
									{this.getTimeDifference(this.props.now, this.props.event.endTimestamp)}
								</div>
								<div className={dateCss}>
									{DateTime.fromMillis(this.props.event.endTimestamp, { locale: this.props.locale }).minus({ milliseconds: this.props.event.isDate ? 1 : 0 }).toLocaleString(DATE_OPTIONS)}
								</div>
							</div>
							{this.props.nextEvent &&
								<>
									<div className={metaNameCss}>
										{`N`}
									</div>
									<div className={metaValueCss}>
										{get(() => this.getDuration(this.props.event.endTimestamp, this.props.nextEvent!.startTimestamp))}
									</div>
								</>
							}
						</>
					}
					{!this.state.alwaysExpanded &&
						<div className={metaButtonCss}>
							<button
								className={detailsButtonCss}
								type='button'
								title={this.state.expanded ? `Hide details` : `Show details`}
								onClick={this.onShowDetailsClicked}
							>
								{this.state.expanded ? `▲` : `▼`}
							</button>
						</div>
					}
				</div>
			</div>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: EventListItemCompProps, prevState: EventListItemCompState): EventListItemCompSnap {}
	// componentDidUpdate(prevProps: EventListItemCompProps, prevState: EventListItemCompState, snapshot: EventListItemCompSnap) {}
	// componentWillUnmount() {}

	onShowDetailsClicked = () => {
		this.setState({
			...this.state,
			expanded: !this.state.expanded,
		})
	}

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
			`${('0' + mins).slice(-2)}m`,
			!weeks && !days && `${('0' + secs).slice(-2)}s`,
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

const itemCss = css({
	label: `${displayName}-item`,
	background: 'white',
	marginTop: 5,
	borderRadius: `3px 0 3px 0`,
	overflow: 'hidden',
	display: 'grid',
	gridTemplateRows: `min-content [header] auto [rest]`,
	gridTemplateColumns: `min-content [color] auto [rest]`,
	gridTemplateAreas: [
		`color title`,
		`. meta`,
	].map(_ => `"${_}"`).join(' '),
	gridGap: 5,
	position: 'relative',
	zIndex: 0,
	'&::after': {
		content: '""',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		boxShadow: `inset 0 0 0 1px rgba(0,0,0,.2)`,
		borderRadius: `inherit`,
		pointerEvents: 'none',
	},
})

const itemIsDateCss = cx(
	itemCss,
	css({
		label: `${displayName}-itemIsDate`,
		'&::after': {
			boxShadow: `inset 0 0 0 3px rgba(0,0,0,.2)`,
		},
	}),
)

const colorCss = css({
	label: `${displayName}-color`,
	gridArea: 'color',
	alignSelf: 'baseline',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: 'rgba(0, 0, 0, .2)',
	borderRadius: `3px 0 3px 0`,
	padding: 3,
	minWidth: 24,
	textAlign: 'center',
})

const titleCss = css({
	label: `${displayName}-title`,
	gridArea: 'title',
	fontWeight: 'bold',
	alignSelf: 'baseline',
})

const metaCss = css({
	label: `${displayName}-meta`,
	gridArea: 'meta',
	display: 'grid',
	gridTemplateColumns: `min-content auto`,
})

const metaCellCss = css({
	// alignSelf: 'baseline',
	borderTop: `1px solid rgba(0, 0, 0, .2)`,
	padding: `1px 0`,
})

const metaNameCss = cx(
	metaCellCss,
	css({
		label: `${displayName}-metaName`,
		gridColumn: '1 / 2',
		justifySelf: 'end',
		fontSize: 10,
		fontWeight: 'bold',
		// lineHeight: `14px`,
		color: 'gray',
		paddingRight: 10,
	}),
)

const metaValueCss = cx(
	metaCellCss,
	css({
		label: `${displayName}-metaValue`,
		gridColumn: '2 / 3',
	}),
)

const metaButtonCss = cx(
	metaCellCss,
	css({
		label: `${displayName}-metaButton`,
		gridColumn: '1 / 3',
		padding: 0,
	}),
)

const startEndCss = css({
	label: `${displayName}-startEnd`,
	fontWeight: 'bold',
})

const detailsButtonCss = cx(
	buttonCss,
	css({
		label: `${displayName}-button`,
		borderColor: `transparent`,
		borderRadius: 0,
		padding: 0,
		fontSize: 12,
		lineHeight: `14px`,
	})
)

const dateCss = css({
	label: `${displayName}-date`,
	fontSize: 10,
	lineHeight: `12px`,
	color: 'gray',
})
