import { css } from 'emotion';
import { TSet, withInterface } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionInitGapi } from './ActionInitGapi';
import { makeActionLoadCalendars } from './ActionLoadCalendars';
import { makeActionSetInterval } from './ActionSetInterval';
import { makeActionSetLocale } from './ActionSetLocale';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { buttonCss } from './buttonCss';
import { EventListComp } from './EventListComp';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { inputCss } from './inputCss';
import { OnMountComp } from './OnMountComp';
import { RowComp } from './RowComp';
import { eventsOrderedFutureSelector, eventsOrderedPastSelector } from './selectors';
import { State } from './State';
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS } from './statics';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly orderedPastEvents: ReadonlyArray<IEvent>
	readonly orderedFutureEvents: ReadonlyArray<IEvent>
	readonly eventsLoaded: boolean
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly endWeeks: number
	readonly startWeeks: number
	readonly locale: string
	readonly now: number
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
	loadCalendars: () => void
	initGapi: () => void
	setEndWeeks: (v: number) => void
	setStartWeeks: (v: number) => void
	setLocale: (v: string) => void
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
			<RowComp inset={5} distance={5} isVertical>
				{this.props.gapiReady ?
					<RowComp distance={5} isVertical>
						<RowComp distance={5}>
							<button
								className={buttonCss}
								type='button'
								onClick={this.onSignInClicked}
							>
								{this.props.isSignedIn ? 'Sign out' : 'Sign in'}
							</button>
							{this.props.isSignedIn &&
								<button
									className={buttonCss}
									type='button'
									title={`Reload events`}
									onClick={this.onReloadEventsClicked}
								>
									{`⟳ 📅`}
								</button>
							}
							{this.props.isSignedIn &&
								<RowComp distance={5}>
									<RowComp distance={5}>
										<div
											className={inputLabelCss}
											title={`Start weeks`}
										>
											{`S:`}
										</div>
										<input
											className={inputCss}
											type='number'
											max={this.props.endWeeks}
											step={`any`}
											value={this.props.startWeeks}
											onChange={this.onStartWeeksChanged}
											style={{
												width: 50,
											}}
										/>
									</RowComp>
									<RowComp distance={5}>
										<div
											className={inputLabelCss}
											title={`End weeks`}
										>
											{`E:`}
										</div>
										<input
											className={inputCss}
											type='number'
											min={this.props.startWeeks}
											step={`any`}
											value={this.props.endWeeks}
											onChange={this.onEndWeeksChanged}
											style={{
												width: 50,
											}}
										/>
									</RowComp>
								</RowComp>
							}
							{this.props.isSignedIn &&
								<button
									className={buttonCss}
									type='button'
									title={`Home`}
									onClick={this.onHomeClicked}
								>
									{`🏠`}
								</button>
							}
							{this.props.isSignedIn &&
								<>
									<input
										className={inputCss}
										type='text'
										value={this.props.locale}
										onChange={this.onLocaleChanged}
										list='locales'
										style={{
											width: 70,
										}}
									/>
									<datalist id='locales'>
										<option value='de-DE' />
										<option value='en-US' />
										<option value='fr-FR' />
										<option value='hu-HU' />
										<option value='zh-CN' />
									</datalist>
								</>
							}
						</RowComp>
						{this.props.isSignedIn &&
							<OnMountComp onMount={this.props.loadCalendars}>
								<div className={eventsCss}>
									<div className={eventsPanelCss}>
										<RowComp distance={5} isVertical>
											<EventListComp
												calendarsById={this.props.calendarsById}
												orderedEvents={this.props.orderedFutureEvents}
												eventsLoaded={this.props.eventsLoaded}
												now={this.props.now}
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
												eventsLoaded={this.props.eventsLoaded}
												now={this.props.now}
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
							</OnMountComp>
						}
					</RowComp>
					:
					<div>{`Loading...`}</div>
				}
			</RowComp>
		)
	}

	componentDidMount() {
		this.props.initGapi()
	}
	// getSnapshotBeforeUpdate(prevProps: AppCompProps, prevState: AppCompState): AppCompSnapshot {}
	// componentDidUpdate(prevProps: AppCompProps, prevState: AppCompState, snapshot: AppCompSnapshot) {}
	// componentWillUnmount() {}

	onSignInClicked = () => {
		if (this.props.isSignedIn) {
			this.props.signOut()
		} else {
			this.props.signIn()
		}
	}

	onEndWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setEndWeeks(parseFloat(e.currentTarget.value))
	}

	onStartWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setStartWeeks(parseFloat(e.currentTarget.value))
	}

	onLocaleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setLocale(e.currentTarget.value)
	}

	onEarlierClicked = () => {
		const diff = this.props.endWeeks - this.props.startWeeks
		this.props.setStartWeeks(this.props.startWeeks - diff)
		this.props.setEndWeeks(this.props.endWeeks - diff)
	}

	onLaterClicked = () => {
		const diff = this.props.endWeeks - this.props.startWeeks
		this.props.setStartWeeks(this.props.startWeeks + diff)
		this.props.setEndWeeks(this.props.endWeeks + diff)
	}

	onReloadEventsClicked = () => {
		this.props.loadCalendars()
	}

	onHomeClicked = () => {
		this.props.setStartWeeks(INITIAL_START_WEEKS)
		this.props.setEndWeeks(INITIAL_END_WEEKS)
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
		endWeeks: state.endWeeks,
		startWeeks: state.startWeeks,
		locale: state.locale,
		now: state.now,
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
		loadCalendars: () => dispatch(makeActionLoadCalendars({})),
		initGapi: () => dispatch(makeActionInitGapi({})),
		setEndWeeks: weeks => dispatch(makeActionSetInterval({
			isFuture: true,
			weeks,
		})),
		setStartWeeks: weeks => dispatch(makeActionSetInterval({
			isFuture: false,
			weeks,
		})),
		setLocale: locale => dispatch(makeActionSetLocale({
			locale,
		})),
	}),
)(AppCompPure)

const eventsCss = css({
	label: `AppComp-events`,
	display: 'flex',
})

const eventsPanelCss = css({
	label: `AppComp-eventsPanel`,
	flexBasis: '100%',
	'& + &': {
		marginLeft: 5,
	},
})

const inputLabelCss = css({
	label: `AppComp-inputLabel`,
	whiteSpace: 'nowrap',
	fontSize: `12px`,
	fontWeight: 'bold',
	color: 'gray',
	borderTop: `1px solid transparent`,
	borderBottom: `1px solid transparent`,
	paddingTop: 5,
	paddingBottom: 5,
})
