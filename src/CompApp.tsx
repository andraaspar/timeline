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
import { CompEventInsert } from './CompEventInsert'
import { CompLoadGuard } from './CompLoadGuard'
import { CompOnMount } from './CompOnMount'
import { CompRow } from './CompRow'
import { CompTimeline } from './CompTimeline'
import { cssButton } from './cssButton'
import { cssInput } from './cssInput'
import { cssInputLabelInline } from './cssInputLabelInline'
import { Path } from './Path'
import { makeRouteCreate } from './RouteCreate'
import { makeRouteHome } from './RouteHome'
import { gotEventsSelector, isUiBlockedSelector, routeQueryEndWeeksSelector, routeQueryStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { StateLoadId } from './StateLoadId'
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS } from './statics'

export interface CompAppPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly calendarsLoadState: StateLoad
	readonly locale: string
	readonly errors: ReadonlyArray<string>
	readonly gotEvents: boolean
	readonly startWeeks: number
	readonly endWeeks: number
	readonly location: HistoryLocation
	readonly isUiBlocked: boolean
}
export interface CompAppPropsOwn { }
export interface CompAppProps extends CompAppPropsOwn, CompAppPropsFromStore, DispatchProp { }
export interface CompAppState {
	readonly startWeeks: number
	readonly endWeeks: number
	readonly startWeeksStringValue: string
	readonly endWeeksStringValue: string
	readonly localeLastSeen: string
	readonly localeValue: string
}

const displayName = `CompApp`

class CompAppPure extends Component<CompAppProps, CompAppState> {
	static displayName = displayName

	constructor(props: CompAppProps) {
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
	static getDerivedStateFromProps(nextProps: CompAppProps, prevState: CompAppState): CompAppState | null {
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
	// shouldComponentUpdate(nextProps: CompAppProps, nextState: CompAppState): boolean {}
	render() {
		// console.log(`--- CompApp redraw ---`)
		return (
			<CompRow inset={5} distance={5} isVertical>
				{this.props.errors.length > 0 &&
					<div className={cssErrors}>
						<div className={cssErrorsInner}>
							<CompRow distance={5} isVertical>
								{this.props.errors.map((e, index) =>
									<div key={index} className={cssError}>
										{e}
									</div>
								)}
							</CompRow>
						</div>
					</div>
				}
				{this.props.isUiBlocked ?
					<div>
						<em>{`Working...`}</em>
					</div>
					:
					<>
						{this.props.errors.length > 0 &&
							<button
								className={cssButton}
								type='button'
								onClick={this.onClearErrorsClicked}
							>
								{`Clear errors`}
							</button>
						}
						{this.props.gapiReady ?
							<CompRow distance={5} isVertical>
								<CompRow distance={5}>
									<div className={cssInputLabelInline}>
										{process.env.REACT_APP_VERSION}
									</div>
									<button
										className={cssButton}
										type='button'
										onClick={this.onSignInClicked}
									>
										{this.props.isSignedIn ? 'Sign out' : 'Sign in'}
									</button>
									{this.props.isSignedIn &&
										<button
											className={cssButton}
											type='button'
											title={`Reload events`}
											onClick={this.onReloadEventsClicked}
										>
											{`⟳ 📅`}
										</button>
									}
									<Route path={Path.Home} render={() => this.props.isSignedIn &&
										<CompRow distance={5}>
											<CompRow distance={5}>
												<div
													className={cssInputLabelInline}
													title={`Start weeks`}
												>
													{`S:`}
												</div>
												<input
													className={cssInput}
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
											</CompRow>
											<CompRow distance={5}>
												<div
													className={cssInputLabelInline}
													title={`End weeks`}
												>
													{`E:`}
												</div>
												<input
													className={cssInput}
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
											</CompRow>
										</CompRow>
									}
									/>
									{this.props.isSignedIn &&
										<button
											className={cssButton}
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
												className={cssInput}
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
											className={cssButton}
											type='button'
											title={`Create`}
											onClick={this.onCreateClicked}
										>
											{`+`}
										</button>
									}
								</CompRow>
								{this.props.isSignedIn &&
									<CompOnMount onMount={this.onEventListsMounted}>
										<CompLoadGuard
											what={`calendars`}
											loadState={this.props.calendarsLoadState}
											render={this.renderRoutes}
										/>

									</CompOnMount>
								}
							</CompRow>
							:
							<div>{`Loading Google API...`}</div>
						}
					</>
				}
			</CompRow>
		)
	}

	componentDidMount() {
		this.props.dispatch(makeActionInitGapi())
	}
	// getSnapshotBeforeUpdate(prevProps: CompAppProps, prevState: CompAppState): CompAppSnapshot {}
	// componentDidUpdate(prevProps: CompAppProps, prevState: CompAppState, snapshot: CompAppSnapshot) {}
	// componentWillUnmount() {}

	onEventListsMounted = () => {
		this.props.dispatch(makeActionLoadCalendars({
			restoreOldOnFailure: this.props.gotEvents,
		}))
	}

	renderRoutes = () => {
		return (
			<Switch>
				<Route
					exact
					path={`/`}
					render={history =>
						<Redirect
							to={makeRouteHome({
								startWeeks: INITIAL_START_WEEKS,
								endWeeks: INITIAL_END_WEEKS,
							})}
						/>
					}
				/>
				<Route
					path={Path.Home}
					component={CompTimeline}
				/>
				<Route
					path={Path.Create}
					component={CompEventInsert}
				/>
			</Switch>
		)
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
			this.props.dispatch(push(makeRouteHome({
				startWeeks: this.state.startWeeks,
				endWeeks: value,
			})))
		}
	}

	onStartWeeksChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			...this.state,
			startWeeksStringValue: e.currentTarget.value,
		})
		const value = parseFloat(e.currentTarget.value)
		if (!isNaN(value)) {
			this.props.dispatch(push(makeRouteHome({
				startWeeks: value,
				endWeeks: this.state.endWeeks,
			})))
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
			// console.error(e)
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
		this.props.dispatch(push(makeRouteHome({
			startWeeks: INITIAL_START_WEEKS,
			endWeeks: INITIAL_END_WEEKS,
		})))
	}

	onClearErrorsClicked = () => {
		this.props.dispatch(makeActionClearErrors())
	}

	onCreateClicked = () => {
		this.props.dispatch(push(makeRouteCreate({
			startWeeks: this.props.startWeeks,
			endWeeks: this.props.endWeeks,
		})))
	}
}

export const CompApp = connect(
	(state: State/* , ownProps: CompAppPropsOwn */) => withInterface<CompAppPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		calendarsLoadState: state.loadStatesById[StateLoadId.Calendars],
		locale: state.locale,
		errors: state.errors,
		gotEvents: gotEventsSelector(state),
		endWeeks: routeQueryEndWeeksSelector(state),
		startWeeks: routeQueryStartWeeksSelector(state),
		location: state.router.location,
		isUiBlocked: isUiBlockedSelector(state),
	}),
)(CompAppPure)

const cssErrors = css({
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

const cssErrorsInner = css({
	label: `${displayName}-errorsInner`,
	overflow: 'auto',
	maxHeight: 200,
	padding: 5,
})

const cssError = css({
	label: `${displayName}-error`,
	border: `1px solid red`,
	color: `red`,
	background: `white`,
	padding: 5,
	borderRadius: 3,
	whiteSpace: 'pre-wrap',
})
