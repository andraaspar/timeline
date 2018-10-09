import { push } from 'connected-react-router'
import { css } from 'emotion'
import { TSet, withInterface } from 'illa/Type'
import React, { Component } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { makeActionLoadEventsFromAllCalendars } from './ActionLoadEventsFromAllCalendars'
import { buttonCss } from './buttonCss'
import { EventListComp } from './EventListComp'
import { ICalendar } from './ICalendar'
import { IEvent } from './IEvent'
import { makeRouteHome } from './route'
import { RowComp } from './RowComp'
import { eventsOrderedFutureSelector, eventsOrderedPastSelector, gotEventsSelector, routeParamsEndWeeksSelector, routeParamsStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS } from './statics'

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
			<>
				{this.props.calendarsLoadState === StateLoad.Loading &&
					<div>
						{`Loading calendars...`}
					</div>
				}
				{this.props.calendarsLoadState === StateLoad.Error &&
					<div>
						{`Error loading calendars.`}
					</div>
				}
				{this.props.calendarsLoadState === StateLoad.Loaded &&
					<div className={eventsCss}>
						<div className={eventsPanelCss}>
							<RowComp distance={5} isVertical>
								<EventListComp
									calendarsById={this.props.calendarsById}
									orderedEvents={this.props.orderedFutureEvents}
									eventsLoadState={this.props.eventsLoadState}
									now={this.props.now}
									locale={this.props.locale}
								/>
								<button
									className={buttonCss}
									type='button'
									onClick={this.onLaterClicked}
								>
									{`Later`}
								</button>
							</RowComp>
						</div>
						<div className={eventsPanelCss}>
							<RowComp distance={5} isVertical>
								<EventListComp
									calendarsById={this.props.calendarsById}
									orderedEvents={this.props.orderedPastEvents}
									eventsLoadState={this.props.eventsLoadState}
									now={this.props.now}
									locale={this.props.locale}
								/>
								<button
									className={buttonCss}
									type='button'
									onClick={this.onEarlierClicked}
								>
									{`Earlier`}
								</button>
							</RowComp>
						</div>
					</div>
				}
			</>
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
		this.props.dispatch(push(makeRouteHome(this.props.startWeeks - diff, this.props.endWeeks - diff)))
	}

	onLaterClicked = () => {
		const diff = this.props.endWeeks - this.props.startWeeks
		this.props.dispatch(push(makeRouteHome(this.props.startWeeks + diff, this.props.endWeeks + diff)))
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
		endWeeks: routeParamsEndWeeksSelector(state),
		startWeeks: routeParamsStartWeeksSelector(state),
	}),
)(CompTimelinePure)

const eventsCss = css({
	label: `${displayName}-events`,
	display: 'flex',
})

const eventsPanelCss = css({
	label: `${displayName}-eventsPanel`,
	flexBasis: '100%',
	'& + &': {
		marginLeft: 5,
	},
})
