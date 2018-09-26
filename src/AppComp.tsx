import { css } from 'emotion';
import { TSet, withInterface } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionInitGapi } from './ActionInitGapi';
import { makeActionLoadCalendars } from './ActionLoadCalendars';
import { makeActionSetInterval } from './ActionSetInterval';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { buttonCss } from './buttonCss';
import { EventListComp } from './EventListComp';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { inputCss } from './inputCss';
import { OnMountComp } from './OnMountComp';
import { eventsOrderedFutureSelector, eventsOrderedPastSelector } from './selectors';
import { State } from './State';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly orderedPastEvents: ReadonlyArray<IEvent>
	readonly orderedFutureEvents: ReadonlyArray<IEvent>
	readonly eventsLoaded: boolean
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly futureWeeks: number
	readonly pastWeeks: number
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
	loadCalendars: () => void
	initGapi: () => void
	setFutureWeeks: (v: number) => void
	setPastWeeks: (v: number) => void
}
export interface AppCompPropsOwn { }
export interface AppCompProps extends AppCompPropsOwn, AppCompPropsFromStore, AppCompPropsDispatch { }
export interface AppCompState { }

class AppCompPure extends Component<AppCompProps, AppCompState> {
	static displayName = __filename

	// constructor(props: AppCompProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// componentWillMount() {}
	// getDerivedStateFromProps(nextProps: AppCompProps, prevState: AppCompState): AppCompState | null {}
	// shouldComponentUpdate(nextProps: AppCompProps, nextState: AppCompState): boolean {}
	render() {
		return (
			<>
				{this.props.gapiReady ?
					<>
						<div className={buttonBarCss}>
							<button
								className={buttonCss}
								type='button'
								onClick={() => {
									if (this.props.isSignedIn) {
										this.props.signOut()
									} else {
										this.props.signIn()
									}
								}}
							>
								{this.props.isSignedIn ? 'Sign out' : 'Sign in'}
							</button>
							<button
								className={buttonCss}
								type='button'
								onClick={() => {
									this.props.loadCalendars()
								}}
							>
								{`Reload data`}
							</button>
						</div>
						<div className={inputBarCss}>
							<div className={inputLabelCss}>
								{`Future weeks:`}
							</div>
							<input
								className={inputCss}
								type='number'
								min={0}
								step={1}
								value={this.props.futureWeeks}
								onChange={this.onFutureWeeksChange}
							/>
							<div className={inputLabelCss}>
								{`Past weeks:`}
							</div>
							<input
								className={inputCss}
								type='number'
								min={0}
								step={1}
								value={this.props.pastWeeks}
								onChange={this.onPastWeeksChange}
							/>
						</div>
						{this.props.isSignedIn &&
							<OnMountComp onMount={this.props.loadCalendars}>
								<div className={eventsCss}>
									<div className={eventsPanelCss}>
										<EventListComp
											calendarsById={this.props.calendarsById}
											orderedEvents={this.props.orderedFutureEvents}
											eventsLoaded={this.props.eventsLoaded}
										/>
									</div>
									<div className={eventsPanelCss}>
										<EventListComp
											calendarsById={this.props.calendarsById}
											orderedEvents={this.props.orderedPastEvents}
											eventsLoaded={this.props.eventsLoaded}
										/>
									</div>
								</div>
							</OnMountComp>
						}
					</>
					:
					<div>{`Loading...`}</div>
				}
			</>
		)
	}

	componentDidMount() {
		this.props.initGapi()
	}
	// getSnapshotBeforeUpdate(prevProps: AppCompProps, prevState: AppCompState): AppCompSnapshot {}
	// componentDidUpdate(prevProps: AppCompProps, prevState: AppCompState, snapshot: AppCompSnapshot) {}
	// componentWillUnmount() {}
	
	onFutureWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setFutureWeeks(parseInt(e.currentTarget.value, 10))
	}
	
	onPastWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setPastWeeks(parseInt(e.currentTarget.value, 10))
	}
}

export const AppComp = connect(
	(state: State, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		orderedFutureEvents: eventsOrderedFutureSelector(state),
		orderedPastEvents: eventsOrderedPastSelector(state),
		eventsLoaded: state.eventsLoaded,
		calendarsById: state.calendarsById,
		futureWeeks: state.futureWeeks,
		pastWeeks: state.pastWeeks,
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
		loadCalendars: () => dispatch(makeActionLoadCalendars({})),
		initGapi: () => dispatch(makeActionInitGapi({})),
		setFutureWeeks: weeks => dispatch(makeActionSetInterval({
			isFuture: true,
			weeks,
		})),
		setPastWeeks: weeks => dispatch(makeActionSetInterval({
			isFuture: false,
			weeks,
		})),
	}),
)(AppCompPure)

const eventsCss = css({
	label: `AppComp-events`,
	display: 'flex',
})

const eventsPanelCss = css({
	label: `AppComp-eventsPanel`,
	margin: 5,
	flexBasis: '100%',
})

const buttonBarCss = css({
	label: `AppComp-buttonBar`,
	margin: 5,
	display: 'grid',
	gridGap: 5,
	gridAutoFlow: 'column',
})

const inputBarCss = css({
	label: `AppComp-inputBar`,
	margin: 5,
	display: 'grid',
	gridGap: 5,
	gridTemplateColumns: `repeat(2, min-content [label] auto [value])`,
})

const inputLabelCss= css({
	label: `AppComp-inputLabel`,
	whiteSpace: 'nowrap',
	fontSize: `12px`,
	alignSelf: 'center',
})
