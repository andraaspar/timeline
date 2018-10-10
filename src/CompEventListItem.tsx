import { css, cx } from 'emotion'
import { DateTime } from 'luxon'
import * as memoizee from 'memoizee'
import React, { Component } from 'react'
import { cssButton } from './cssButton'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { DATE_OPTIONS, DATETIME_OPTIONS } from './statics'
import { BLACK_3, BLACK_4, BOLD, BORDER, BORDER_SHADOW, FONT_SIZE_SMALL, FONT_SIZE_TINY, GRAY_4, LINE_HEIGHT_SMALL, LINE_HEIGHT_TINY, ORANGE_1, RADIUS, WHITE } from './StyleConstants'
import { getDuration, getTimeDifference } from './UtilTime'

export interface CompEventListItemProps {
	readonly calendar: ICalendar
	readonly event: IEvent
	readonly nextEvent: IEvent | null
	readonly now: number
	readonly alwaysExpanded?: boolean
	readonly locale: string
	readonly isPast?: boolean
}
export interface CompEventListItemState {
	readonly expanded: boolean
	readonly alwaysExpanded: boolean
}
export interface CompEventListItemSnap { }

const displayName = `CompEventListItem`

export class CompEventListItem extends Component<CompEventListItemProps, CompEventListItemState/* , CompEventListItemSnap */> {
	static displayName = displayName

	constructor(props: CompEventListItemProps) {
		super(props)
		this.state = {
			expanded: false,
			alwaysExpanded: false,
		}
	}
	static getDerivedStateFromProps(nextProps: CompEventListItemProps, prevState: CompEventListItemState): CompEventListItemState | null {
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
	// shouldComponentUpdate(nextProps: CompEventListItemProps, nextState: CompEventListItemState): boolean {}
	render() {
		return (
			<>
				<div className={this.props.event.isDate ? cssItemIsDate : cssItem}>
					<div
						className={cssColor}
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
					<div className={cssTitle}>
						{this.props.event.summary}
						{` `}
						{this.props.event.startTimestamp !== this.props.event.endTimestamp &&
							<span className={cssDuration}>
								{getDuration(this.props.event.startTimestamp, this.props.event.endTimestamp, { positivePrefix: '', negativePrefix: '' })}
							</span>
						}
					</div>
					<div className={cssMeta}>
						{this.props.isPast ?
							this.renderEnd()
							:
							this.renderStart()
						}
						{this.state.expanded &&
							(this.props.isPast ?
								this.renderStart()
								:
								this.renderEnd()
							)
						}
						{!this.state.alwaysExpanded &&
							<div className={cssMetaButton}>
								<button
									className={cssDetailsButton}
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
				{this.props.nextEvent &&
					<div className={cssTimeBetween}>
						{this.props.isPast ?
							getDuration(this.props.event.startTimestamp, Math.min(this.props.event.endTimestamp, this.props.nextEvent.endTimestamp), { negativePrefix: ``, positivePrefix: `Overlap:` })
							:
							getDuration(this.props.event.endTimestamp, this.props.nextEvent.startTimestamp, { negativePrefix: `Overlap:`, positivePrefix: `` })
						}
					</div>
				}
			</>
		)
	}
	renderStart() {
		return (
			<>
				<div className={cssMetaName}>
					{`S`}
				</div>
				<div className={cssMetaValue}>
					<div className={cssStartEnd}>
						{getTimeDifference(this.props.now, this.props.event.startTimestamp)}
					</div>
					<div className={cssDate}>
						{this.getStartDate(this.props.event.startTimestamp, this.props.locale, this.props.event.isDate)}
					</div>
				</div>
			</>
		)
	}
	renderEnd() {
		return (
			<>
				<div className={cssMetaName}>
					{`E`}
				</div>
				<div className={cssMetaValue}>
					<div className={cssStartEnd}>
						{getTimeDifference(this.props.now, this.props.event.endTimestamp)}
					</div>
					<div className={cssDate}>
						{this.getEndDate(this.props.event.endTimestamp, this.props.locale, this.props.event.isDate)}
					</div>
				</div>
			</>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompEventListItemProps, prevState: CompEventListItemState): CompEventListItemSnap {}
	// componentDidUpdate(prevProps: CompEventListItemProps, prevState: CompEventListItemState, snapshot: CompEventListItemSnap) {}
	// componentWillUnmount() {}

	onShowDetailsClicked = () => {
		this.setState({
			...this.state,
			expanded: !this.state.expanded,
		})
	}

	getStartDate = memoizee((ms: number, locale: string, isDate: boolean) => {
		return DateTime.fromMillis(ms, { locale }).toLocaleString(isDate ? DATE_OPTIONS : DATETIME_OPTIONS)
	}, { max: 1 })

	getEndDate = memoizee((ms: number, locale: string, isDate: boolean) => {
		return DateTime.fromMillis(ms, { locale }).minus({ milliseconds: isDate ? 1 : 0 }).toLocaleString(isDate ? DATE_OPTIONS : DATETIME_OPTIONS)
	}, { max: 1 })
}

const cssItem = css({
	label: `${displayName}-item`,
	background: WHITE,
	marginTop: 5,
	borderRadius: `${RADIUS} 0 ${RADIUS} 0`,
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
		boxShadow: BORDER_SHADOW,
		borderRadius: `inherit`,
		pointerEvents: 'none',
	},
})

const cssItemIsDate = cx(
	cssItem,
	css({
		label: `${displayName}-itemIsDate`,
		background: ORANGE_1,
	}),
)

const cssColor = css({
	label: `${displayName}-color`,
	gridArea: 'color',
	alignSelf: 'baseline',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: BLACK_3,
	borderRadius: `3px 0 3px 0`,
	padding: 3,
	minWidth: 24,
	textAlign: 'center',
})

const cssTitle = css({
	label: `${displayName}-title`,
	gridArea: 'title',
	fontWeight: BOLD,
	alignSelf: 'baseline',
})

const cssMeta = css({
	label: `${displayName}-meta`,
	gridArea: 'meta',
	display: 'grid',
	gridTemplateColumns: `min-content auto`,
})

const cssMetaCell = css({
	// alignSelf: 'baseline',
	borderTop: BORDER,
	padding: `1px 0`,
})

const cssMetaName = cx(
	cssMetaCell,
	css({
		label: `${displayName}-metaName`,
		gridColumn: '1 / 2',
		justifySelf: 'end',
		fontSize: FONT_SIZE_TINY,
		fontWeight: BOLD,
		// lineHeight: `14px`,
		color: BLACK_4,
		paddingRight: 10,
	}),
)

const cssMetaValue = cx(
	cssMetaCell,
	css({
		label: `${displayName}-metaValue`,
		gridColumn: '2 / 3',
	}),
)

const cssMetaButton = cx(
	cssMetaCell,
	css({
		label: `${displayName}-metaButton`,
		gridColumn: '1 / 3',
		padding: 0,
	}),
)

const cssStartEnd = css({
	label: `${displayName}-startEnd`,
	fontWeight: 'bold',
})

const cssDetailsButton = cx(
	cssButton,
	css({
		label: `${displayName}-button`,
		borderColor: `transparent`,
		borderRadius: 0,
		padding: 0,
		fontSize: FONT_SIZE_SMALL,
		lineHeight: LINE_HEIGHT_SMALL,
	})
)

const cssDate = css({
	label: `${displayName}-date`,
	fontSize: FONT_SIZE_TINY,
	lineHeight: LINE_HEIGHT_TINY,
	color: BLACK_4,
})

const cssTimeBetween = css({
	label: `${displayName}-timeBetween`,
	fontSize: FONT_SIZE_TINY,
	lineHeight: LINE_HEIGHT_TINY,
	fontWeight: BOLD,
	color: BLACK_4,
	padding: `2px 0 0`,
})

const cssDuration = css({
	label: `${displayName}-duration`,
	display: 'inline-block',
	fontSize: FONT_SIZE_TINY,
	lineHeight: LINE_HEIGHT_TINY,
	fontWeight: BOLD,
	background: GRAY_4,
	color: WHITE,
	borderRadius: RADIUS,
	padding: `1px 5px`,
})
