import { css } from 'emotion';
import { TSet, withInterface } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionClearErrors } from './ActionClearErrors';
import { makeActionInitGapi } from './ActionInitGapi';
import { makeActionLoadCalendars } from './ActionLoadCalendars';
import { makeActionSetInterval } from './ActionSetInterval';
import { makeActionSetLocale } from './ActionSetLocale';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { buttonCss } from './buttonCss';
import { CompEventInsert } from './CompEventInsert';
import { EventListComp } from './EventListComp';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { inputCss } from './inputCss';
import { OnMountComp } from './OnMountComp';
import { RowComp } from './RowComp';
import { eventsOrderedFutureSelector, eventsOrderedPastSelector, gotEventsSelector } from './selectors';
import { State } from './State';
import { StateLoad } from './StateLoad';
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS, LOAD_STATE_CALENDARS, LOAD_STATE_EVENTS } from './statics';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly orderedPastEvents: ReadonlyArray<IEvent>
	readonly orderedFutureEvents: ReadonlyArray<IEvent>
	readonly calendarsLoadState: StateLoad
	readonly eventsLoadState: StateLoad
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly endWeeks: number
	readonly startWeeks: number
	readonly locale: string
	readonly now: number
	readonly errors: ReadonlyArray<string>
	readonly gotEvents: boolean
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
	loadCalendars: (restoreOldOnFailure: boolean) => void
	initGapi: () => void
	setEndWeeks: (v: number) => void
	setStartWeeks: (v: number) => void
	setLocale: (v: string) => void
	clearErrors: () => void
}
export interface AppCompPropsOwn { }
export interface AppCompProps extends AppCompPropsOwn, AppCompPropsFromStore, AppCompPropsDispatch { }
export interface AppCompState {
	startWeeksLastValue: number
	endWeeksLastValue: number
	startWeeksStringValue: string
	endWeeksStringValue: string
}

const displayName = `AppComp`

class AppCompPure extends Component<AppCompProps, AppCompState> {
	static displayName = displayName

	constructor(props: AppCompProps) {
		super(props)
		this.state = {
			startWeeksLastValue: NaN,
			endWeeksLastValue: NaN,
			startWeeksStringValue: '',
			endWeeksStringValue: '',
		}
	}
	// componentWillMount() {}
	static getDerivedStateFromProps(nextProps: AppCompProps, prevState: AppCompState): AppCompState | null {
		return {
			...prevState,
			startWeeksLastValue: nextProps.startWeeks,
			endWeeksLastValue: nextProps.endWeeks,
			startWeeksStringValue: nextProps.startWeeks !== prevState.startWeeksLastValue ? nextProps.startWeeks + '' : prevState.startWeeksStringValue,
			endWeeksStringValue: nextProps.endWeeks !== prevState.endWeeksLastValue ? nextProps.endWeeks + '' : prevState.endWeeksStringValue,
		}
	}
	// shouldComponentUpdate(nextProps: AppCompProps, nextState: AppCompState): boolean {}
	render() {
		// console.log(`--- AppComp redraw ---`)
		return (
			<RowComp inset={5} distance={5} isVertical>
				{this.props.errors.length > 0 &&
					<div className={errorsCss}>
						<div className={errorsInnerCss}>
							<RowComp distance={5} isVertical>
								{this.props.errors.map((e, index) =>
									<div key={index} className={errorCss}>
										{e}
									</div>
								)}
							</RowComp>
						</div>
					</div>
				}
				{this.props.errors.length > 0 &&
					<button
						className={buttonCss}
						type='button'
						onClick={this.onClearErrorsClicked}
					>
						{`Clear errors`}
					</button>
				}
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
											value={this.state.startWeeksStringValue}
											onChange={this.onStartWeeksChanged}
											onBlur={this.onStarWeeksBlurred}
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
											value={this.state.endWeeksStringValue}
											onChange={this.onEndWeeksChanged}
											onBlur={this.onEndWeeksBlurred}
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
							<OnMountComp onMount={this.onEventListsMounted}>
								{this.props.calendarsLoadState.isLoading ?
									<div>
										{`Loading calendars...`}
									</div>
									:
									(this.props.calendarsLoadState.hasError ?
										<div>
											{`Error loading calendars.`}
										</div>
										:
										<RowComp distance={5} isVertical>
											<CompEventInsert />
											<div className={eventsCss}>
												<div className={eventsPanelCss}>
													<RowComp distance={5} isVertical>
														<EventListComp
															calendarsById={this.props.calendarsById}
															orderedEvents={this.props.orderedFutureEvents}
															eventsLoadState={this.props.eventsLoadState}
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
															eventsLoadState={this.props.eventsLoadState}
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
										</RowComp>
									)
								}
							</OnMountComp>
						}
					</RowComp>
					:
					<div>{`Loading Google API...`}</div>
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

	onEventListsMounted = () => {
		this.props.loadCalendars(this.props.gotEvents)
	}

	onSignInClicked = () => {
		if (this.props.isSignedIn) {
			this.props.signOut()
		} else {
			this.props.signIn()
		}
	}

	onEndWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			endWeeksStringValue: e.currentTarget.value,
		})
		const value = parseFloat(e.currentTarget.value)
		if (!isNaN(value)) {
			this.props.setEndWeeks(value)
		}
	}

	onStartWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			startWeeksStringValue: e.currentTarget.value,
		})
		const value = parseFloat(e.currentTarget.value)
		if (!isNaN(value)) {
			this.props.setStartWeeks(value)
		}
	}

	onStarWeeksBlurred = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			startWeeksStringValue: this.props.startWeeks + '',
		})
	}

	onEndWeeksBlurred = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			endWeeksStringValue: this.props.endWeeks + '',
		})
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
		this.props.loadCalendars(this.props.gotEvents)
	}

	onHomeClicked = () => {
		this.props.setStartWeeks(INITIAL_START_WEEKS)
		this.props.setEndWeeks(INITIAL_END_WEEKS)
	}

	onClearErrorsClicked = () => {
		this.props.clearErrors()
	}
}

export const AppComp = connect(
	(state: State, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		orderedFutureEvents: eventsOrderedFutureSelector(state),
		orderedPastEvents: eventsOrderedPastSelector(state),
		eventsLoadState: state.loadStatesById[LOAD_STATE_EVENTS],
		calendarsLoadState: state.loadStatesById[LOAD_STATE_CALENDARS],
		calendarsById: state.calendarsById,
		endWeeks: state.endWeeks,
		startWeeks: state.startWeeks,
		locale: state.locale,
		now: state.now,
		errors: state.errors,
		gotEvents: gotEventsSelector(state),
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
		loadCalendars: restoreOldOnFailure => dispatch(makeActionLoadCalendars({
			restoreOldOnFailure,
		})),
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
		clearErrors: () => dispatch(makeActionClearErrors({})),
	}),
)(AppCompPure)

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

const inputLabelCss = css({
	label: `${displayName}-inputLabel`,
	whiteSpace: 'nowrap',
	fontSize: `12px`,
	fontWeight: 'bold',
	color: 'gray',
	borderTop: `1px solid transparent`,
	borderBottom: `1px solid transparent`,
	paddingTop: 5,
	paddingBottom: 5,
})

const errorsCss = css({
	label: `${displayName}-errors`,
	background: `#eee`,
	position: 'relative',
	'&::after': {
		content: '""',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		pointerEvents: 'none',
		boxShadow: `inset 0 0 3px 1px rgba(0, 0, 0, .2)`,
	},
})

const errorsInnerCss = css({
	label: `${displayName}-errorsInner`,
	overflow: 'auto',
	maxHeight: 200,
	padding: 5,
})

const errorCss = css({
	label: `${displayName}-error`,
	border: `1px solid red`,
	color: `red`,
	background: `white`,
	padding: 5,
	borderRadius: 3,
	whiteSpace: 'pre-wrap',
})