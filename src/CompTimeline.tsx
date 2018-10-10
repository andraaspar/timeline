import { push } from 'connected-react-router'
import { css } from 'emotion'
import { TSet, withInterface } from 'illa/Type'
import React, { Component } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars'
import { CompEventList } from './CompEventList'
import { CompLoadGuard } from './CompLoadGuard'
import { CompRow } from './CompRow'
import { cssButton } from './cssButton'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { makeRouteHome } from './RouteHome'
import { eventsOrderedFutureSelector, eventsOrderedPastSelector, gotEventsSelector, routeQueryEndWeeksSelector, routeQueryStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS } from './statics'
import { BLACK_4, BOLD, FONT_SIZE_TINY, LINE_HEIGHT_TINY } from './StyleConstants'
import { getDuration } from './UtilTime'

export interface CompTimelinePropsFromStore {
	readonly isSignedIn: boolean
	readonly calendarsLoadState: StateLoad
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly orderedPastEvents: ReadonlyArray<IEvent>
	readonly orderedFutureEvents: ReadonlyArray<IEvent>
	readonly eventsLoadState: StateLoad
	readonly now: number
	readonly locale: string
	readonly gotEvents: boolean
	readonly startWeeks: number
	readonly endWeeks: number
}
export interface CompTimelinePropsOwn { }
export interface CompTimelineProps extends CompTimelinePropsOwn, CompTimelinePropsFromStore, DispatchProp { }
export interface CompTimelineState { }
export interface CompTimelineSnap { }

const displayName = 'CompTimeline'

class CompTimelinePure extends Component<CompTimelineProps, CompTimelineState/* , CompTimelineSnap */> {
	static displayName = displayName

	// constructor(props: CompTimelineProps) {}
	// componentWillMount() {}
	// static getDerivedStateFromProps(nextProps: CompTimelineProps, prevState: CompTimelineState): CompTimelineState | null {}
	// shouldComponentUpdate(nextProps: CompTimelineProps, nextState: CompTimelineState): boolean {}
	render() {
		return (
			<CompLoadGuard
				what={`events`}
				loadState={this.props.eventsLoadState}
				render={this.renderEvents}
			/>
		)
	}
	renderEvents = () => {
		return (
			<CompRow distance={5} isVertical={true}>
				{this.props.orderedPastEvents.length > 0 && this.props.orderedFutureEvents.length > 0 &&
					<div className={cssDiff}>
						{getDuration(this.props.orderedPastEvents[0].endTimestamp, this.props.orderedFutureEvents[0].startTimestamp, { negativePrefix: `Overlap:`, positivePrefix: `` })}
					</div>
				}
				<div className={cssEvents}>
					<div className={cssEventsPanel}>
						<CompRow distance={5} isVertical>
							<CompEventList
								calendarsById={this.props.calendarsById}
								orderedEvents={this.props.orderedPastEvents}
								eventsLoadState={this.props.eventsLoadState}
								now={this.props.now}
								locale={this.props.locale}
								isPast={true}
							/>
							<button
								className={cssButton}
								type='button'
								onClick={this.onEarlierClicked}
							>
								{`Earlier`}
							</button>
						</CompRow>
					</div>
					<div className={cssEventsPanel}>
						<CompRow distance={5} isVertical>
							<CompEventList
								calendarsById={this.props.calendarsById}
								orderedEvents={this.props.orderedFutureEvents}
								eventsLoadState={this.props.eventsLoadState}
								now={this.props.now}
								locale={this.props.locale}
							/>
							<button
								className={cssButton}
								type='button'
								onClick={this.onLaterClicked}
							>
								{`Later`}
							</button>
						</CompRow>
					</div>
				</div>
			</CompRow>
		)
	}
	componentDidMount() {
		this.props.dispatch(makeActionLoadEventsFromAllCalendars({
			restoreOldOnFailure: false,
		}))
	}
	// getSnapshotBeforeUpdate(prevProps: CompTimelineProps, prevState: CompTimelineState): CompTimelineSnap {}
	componentDidUpdate(prevProps: CompTimelineProps, prevState: CompTimelineState, snapshot: CompTimelineSnap) {
		if (prevProps.endWeeks !== this.props.endWeeks || prevProps.startWeeks !== this.props.startWeeks) {
			this.props.dispatch(makeActionLoadEventsFromAllCalendars({
				restoreOldOnFailure: false,
			}))
		}
	}
	// componentWillUnmount() {}

	onEarlierClicked = () => {
		const diff = this.props.endWeeks - this.props.startWeeks
		this.props.dispatch(push(makeRouteHome({
			startWeeks: this.props.startWeeks - diff,
			endWeeks: this.props.endWeeks - diff,
		})))
	}

	onLaterClicked = () => {
		const diff = this.props.endWeeks - this.props.startWeeks
		this.props.dispatch(push(makeRouteHome({
			startWeeks: this.props.startWeeks + diff,
			endWeeks: this.props.endWeeks + diff,
		})))
	}
}

export const CompTimeline = connect(
	(state: State/* , ownProps: CompTimelinePropsOwn */) => withInterface<CompTimelinePropsFromStore>({
		calendarsLoadState: state.loadStatesById[LOAD_STATE_CALENDARS],
		isSignedIn: state.isSignedIn,
		calendarsById: state.calendarsById,
		orderedFutureEvents: eventsOrderedFutureSelector(state),
		orderedPastEvents: eventsOrderedPastSelector(state),
		eventsLoadState: state.loadStatesById[LOAD_STATE_EVENTS],
		now: state.now,
		locale: state.locale,
		gotEvents: gotEventsSelector(state),
		endWeeks: routeQueryEndWeeksSelector(state),
		startWeeks: routeQueryStartWeeksSelector(state),
	}),
)(CompTimelinePure)

const cssEvents = css({
	label: `${displayName}-events`,
	display: 'flex',
})

const cssEventsPanel = css({
	label: `${displayName}-eventsPanel`,
	flexBasis: '100%',
	'& + &': {
		marginLeft: 5,
	},
})

const cssDiff = css({
	label: `${displayName}-diff`,
	fontSize: FONT_SIZE_TINY,
	lineHeight: LINE_HEIGHT_TINY,
	fontWeight: BOLD,
	color: BLACK_4,
	textAlign: 'center',
})
