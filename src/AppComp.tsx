import { push } from 'connected-react-router'
import { css } from 'emotion'
import { Location as HistoryLocation } from 'history'
import { withInterface } from 'illa/Type'
import { DateTime } from 'luxon'
import React, { Component } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { makeActionClearErrors } from './ActionClearErrors'
import { makeActionInitGapi } from './ActionInitGapi'
import { makeActionLoadCalendars } from './ActionLoadCalendars'
import { makeActionSetLocale } from './ActionSetLocale'
import { makeActionSignIn } from './ActionSignIn'
import { makeActionSignOut } from './ActionSignOut'
import { buttonCss } from './buttonCss'
import { CompEventInsert } from './CompEventInsert'
import { CompTimeline } from './CompTimeline'
import { inputCss } from './inputCss'
import { inputLabelInlineCss } from './inputLabelInlineCss'
import { OnMountComp } from './OnMountComp'
import { makeRouteCreate, makeRouteHome, ROUTE_CREATE, ROUTE_HOME } from './route'
import { RowComp } from './RowComp'
import { gotEventsSelector, routeParamsEndWeeksSelector, routeParamsStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS, LOAD_STATE_CALENDARS } from './statics'

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly calendarsLoadState: StateLoad
	readonly locale: string
	readonly errors: ReadonlyArray<string>
	readonly gotEvents: boolean
	readonly startWeeks: number
	readonly endWeeks: number
	readonly location: HistoryLocation
}
export interface AppCompPropsOwn { }
export interface AppCompProps extends AppCompPropsOwn, AppCompPropsFromStore, DispatchProp { }
export interface AppCompState {
	readonly startWeeks: number
	readonly endWeeks: number
	readonly startWeeksStringValue: string
	readonly endWeeksStringValue: string
	readonly localeLastSeen: string
	readonly localeValue: string
}

const displayName = `AppComp`

class AppCompPure extends Component<AppCompProps, AppCompState> {
	static displayName = displayName

	constructor(props: AppCompProps) {
		super(props)
		this.state = {
			startWeeks: NaN,
			endWeeks: NaN,
			startWeeksStringValue: '',
			endWeeksStringValue: '',
			localeLastSeen: '',
			localeValue: '',
		}
	}
	// componentWillMount() {}
	static getDerivedStateFromProps(nextProps: AppCompProps, prevState: AppCompState): AppCompState | null {
		const { endWeeks, startWeeks, locale } = nextProps
		return {
			...prevState,
			startWeeks,
			endWeeks,
			startWeeksStringValue: startWeeks !== prevState.startWeeks ? startWeeks + '' : prevState.startWeeksStringValue,
			endWeeksStringValue: endWeeks !== prevState.endWeeks ? endWeeks + '' : prevState.endWeeksStringValue,
			localeLastSeen: locale,
			localeValue: prevState.localeLastSeen !== locale ? locale : prevState.localeValue,
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
							<div className={inputLabelInlineCss}>
								{process.env.REACT_APP_VERSION}
							</div>
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
							<Route path={ROUTE_HOME} render={() => this.props.isSignedIn &&
								<RowComp distance={5}>
									<RowComp distance={5}>
										<div
											className={inputLabelInlineCss}
											title={`Start weeks`}
										>
											{`S:`}
										</div>
										<input
											className={inputCss}
											type='number'
											max={this.state.endWeeks}
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
											className={inputLabelInlineCss}
											title={`End weeks`}
										>
											{`E:`}
										</div>
										<input
											className={inputCss}
											type='number'
											min={this.state.startWeeks}
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
							/>
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
										value={this.state.localeValue}
										onChange={this.onLocaleChanged}
										onBlur={this.onLocaleBlurred}
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
							{this.props.isSignedIn && this.props.calendarsLoadState === StateLoad.Loaded &&
								<button
									className={buttonCss}
									type='button'
									title={`Create`}
									onClick={this.onCreateClicked}
								>
									{`+`}
								</button>
							}
						</RowComp>
						{this.props.isSignedIn &&
							<OnMountComp onMount={this.onEventListsMounted}>
								<Switch>
									<Route
										exact
										path={`/`}
										render={history => <Redirect to={makeRouteHome(INITIAL_START_WEEKS, INITIAL_END_WEEKS)} />}
									/>
									<Route
										path={ROUTE_HOME}
										component={CompTimeline}
									/>
									<Route
										path={ROUTE_CREATE}
										component={CompEventInsert}
									/>
								</Switch>
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
		this.props.dispatch(makeActionInitGapi())
	}
	// getSnapshotBeforeUpdate(prevProps: AppCompProps, prevState: AppCompState): AppCompSnapshot {}
	// componentDidUpdate(prevProps: AppCompProps, prevState: AppCompState, snapshot: AppCompSnapshot) {}
	// componentWillUnmount() {}

	onEventListsMounted = () => {
		this.props.dispatch(makeActionLoadCalendars({
			restoreOldOnFailure: this.props.gotEvents,
		}))
	}

	onSignInClicked = () => {
		if (this.props.isSignedIn) {
			this.props.dispatch(makeActionSignOut())
		} else {
			this.props.dispatch(makeActionSignIn())
		}
	}

	onEndWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			endWeeksStringValue: e.currentTarget.value,
		})
		const value = parseFloat(e.currentTarget.value)
		if (!isNaN(value)) {
			this.props.dispatch(push(makeRouteHome(this.state.startWeeks, value)))
		}
	}

	onStartWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			startWeeksStringValue: e.currentTarget.value,
		})
		const value = parseFloat(e.currentTarget.value)
		if (!isNaN(value)) {
			this.props.dispatch(push(makeRouteHome(value, this.state.endWeeks)))
		}
	}

	onStarWeeksBlurred = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			startWeeksStringValue: this.state.startWeeks + '',
		})
	}

	onEndWeeksBlurred = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			endWeeksStringValue: this.state.endWeeks + '',
		})
	}

	onLocaleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		const locale = e.currentTarget.value
		this.setState({
			...this.state,
			localeValue: locale,
		})
		try {
			const dt = DateTime.fromMillis(Date.now(), { locale })
			console.log(dt.toLocaleString())
			this.props.dispatch(makeActionSetLocale({
				locale: dt.locale,
			}))
		} catch (e) {
			console.error(e)
		}
	}

	onLocaleBlurred = (e: React.FocusEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			localeValue: this.props.locale,
		})
	}

	onReloadEventsClicked = () => {
		this.props.dispatch(makeActionLoadCalendars({
			restoreOldOnFailure: this.props.gotEvents,
		}))
	}

	onHomeClicked = () => {
		// this.props.setStartWeeks(INITIAL_START_WEEKS)
		// this.props.setEndWeeks(INITIAL_END_WEEKS)
		this.props.dispatch(push(makeRouteHome(INITIAL_START_WEEKS, INITIAL_END_WEEKS)))
	}

	onClearErrorsClicked = () => {
		this.props.dispatch(makeActionClearErrors())
	}

	onCreateClicked = () => {
		this.props.dispatch(push(makeRouteCreate(this.props.startWeeks, this.props.endWeeks)))
	}
}

export const AppComp = connect(
	(state: State/* , ownProps: AppCompPropsOwn */) => withInterface<AppCompPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		calendarsLoadState: state.loadStatesById[LOAD_STATE_CALENDARS],
		locale: state.locale,
		errors: state.errors,
		gotEvents: gotEventsSelector(state),
		endWeeks: routeParamsEndWeeksSelector(state),
		startWeeks: routeParamsStartWeeksSelector(state),
		location: state.router.location,
	}),
)(AppCompPure)

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
