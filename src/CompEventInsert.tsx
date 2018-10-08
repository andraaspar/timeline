import { get } from 'illa/FunctionUtil'
import { TSet, withInterface } from 'illa/Type'
import { Settings } from 'luxon'
import React, { ChangeEvent, Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Dispatch } from 'redux'
import { makeActionRequestEventInsert } from './ActionRequestEventInsert'
import { buttonCss } from './buttonCss'
import { eventInputFromString } from './EventInput_Methods'
import { EventListItemComp } from './EventListItemComp'
import { ICalendar } from './ICalendar'
import { IEvent, makeIEventFromEventInput } from './IEvent'
import { inputCss } from './inputCss'
import { inputLabelCss } from './inputLabelCss'
import { makeRouteHome } from './route'
import { RowComp } from './RowComp'
import { routeParamsEndWeeksSelector, routeParamsStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { INITIAL_END_WEEKS, INITIAL_START_WEEKS, LOAD_STATE_INSERT_EVENT } from './statics'
import { TAction } from './TAction'

export interface CompEventInsertPropsFromStore {
	readonly loadState: StateLoad
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly locale: string
	readonly now: number
	readonly startWeeks: number
	readonly endWeeks: number
}
export interface CompEventInsertPropsDispatch {
	readonly insertEvent: (calendarId: string, e: gapi.client.calendar.EventInput) => void
}
export interface CompEventInsertPropsOwn extends RouteComponentProps { }
export interface CompEventInsertProps extends CompEventInsertPropsOwn, CompEventInsertPropsFromStore, CompEventInsertPropsDispatch { }
export interface CompEventInsertState {
	readonly start: string
	readonly end: string
	readonly summary: string
	readonly eventInput: gapi.client.calendar.EventInput | null
	readonly event: IEvent | null
	readonly calendarId: string
	readonly isSaving: boolean
	readonly justSaved: boolean
}
export interface CompEventInsertSnap { }

const displayName = 'CompEventInsert'

class CompEventInsertPure extends Component<CompEventInsertProps, CompEventInsertState/* , CompEventInsertSnap */> {
	static displayName = displayName

	constructor(props: CompEventInsertProps) {
		super(props)
		this.state = {
			start: '',
			end: '',
			summary: '',
			eventInput: null,
			event: null,
			calendarId: 'primary',
			isSaving: false,
			justSaved: false,
		}
	}
	// componentWillMount() {}
	static getDerivedStateFromProps(nextProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertState | null {
		const isSaving = nextProps.loadState === StateLoad.Loading
		const justSaved = prevState.isSaving && nextProps.loadState === StateLoad.Loaded
		return {
			...prevState,
			calendarId: Object.keys(nextProps.calendarsById).find(id => !!get(() => nextProps.calendarsById[id].primary)) || 'primary',
			isSaving,
			justSaved,
			start: justSaved ? '' : prevState.start,
			end: justSaved ? '' : prevState.end,
			summary: justSaved ? '' : prevState.summary,
			event: justSaved ? null : prevState.event,
			eventInput: justSaved ? null : prevState.eventInput,
		}
	}
	// shouldComponentUpdate(nextProps: CompEventInsertProps, nextState: CompEventInsertState): boolean {}
	render() {
		const disabled = this.props.loadState === StateLoad.Loading || this.state.justSaved
		return (
			<RowComp distance={5} isVertical>
				<div className={inputLabelCss}>
					{`Summary:`}
				</div>
				<div>
					<input
						className={inputCss}
						type='text'
						value={this.state.summary}
						onChange={this.onSummaryValueChanged}
						disabled={disabled}
						placeholder={`What’s happening`}
					/>
				</div>
				<div className={inputLabelCss}>
					{`Start:`}
				</div>
				<div>
					<input
						className={inputCss}
						type='text'
						value={this.state.start}
						onChange={this.onStartValueChanged}
						disabled={disabled}
						placeholder={`16:45 or 08-23 or 2018-08-23 16:45+p1wt2h`}
					/>
				</div>
				<div className={inputLabelCss}>
					{`End:`}
				</div>
				<div>
					<input
						className={inputCss}
						type='text'
						value={this.state.end}
						onChange={this.onEndValueChanged}
						disabled={disabled}
						placeholder={`+p15m or 17:00 or 08-23 or 2018-08-24 11:33+p1wt2h`}
					/>
				</div>
				{this.state.event &&
					<EventListItemComp
						calendar={this.props.calendarsById[this.state.calendarId]}
						event={this.state.event}
						nextEvent={null}
						now={this.props.now}
						alwaysExpanded={true}
						locale={this.props.locale}
					/>
				}
				{this.state.eventInput &&
					<button
						className={buttonCss}
						type='button'
						onClick={this.onSaveEventClicked}
						disabled={disabled}
					>
						{`Save event`}
					</button>
				}
			</RowComp>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertSnap {}
	componentDidUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState, snapshot: CompEventInsertSnap) {
		if (this.state.justSaved) {
			this.props.history.push(makeRouteHome(INITIAL_START_WEEKS, INITIAL_END_WEEKS))
		}
	}
	// componentWillUnmount() {}

	onStartValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		const start = e.currentTarget.value
		const { end, summary } = this.state
		this.setStartEndSummary(start, end, summary)
	}

	onEndValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		const end = e.currentTarget.value
		const { start, summary } = this.state
		this.setStartEndSummary(start, end, summary)
	}

	onSummaryValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		const summary = e.currentTarget.value
		const { start, end } = this.state
		this.setStartEndSummary(start, end, summary)
	}

	setStartEndSummary(start: string, end: string, summary: string) {
		const eventInput = get<gapi.client.calendar.EventInput | null>(() => eventInputFromString(Settings.defaultZoneName, start, end, summary), null) as gapi.client.calendar.EventInput | null
		const event = eventInput ? makeIEventFromEventInput({ calendarId: this.state.calendarId, locale: this.props.locale }, eventInput) : null
		this.setState({
			...this.state,
			start,
			end,
			summary,
			eventInput,
			event,
		})
	}

	onSaveEventClicked = () => {
		if (this.state.eventInput) {
			this.props.insertEvent(this.state.calendarId, this.state.eventInput)
		}
	}
}

export const CompEventInsert = connect(
	(state: State, ownProps: CompEventInsertPropsOwn) => withInterface<CompEventInsertPropsFromStore>({
		calendarsById: state.calendarsById,
		locale: state.locale,
		now: state.now,
		loadState: state.loadStatesById[LOAD_STATE_INSERT_EVENT],
		endWeeks: routeParamsEndWeeksSelector(state),
		startWeeks: routeParamsStartWeeksSelector(state),
	}),
	(dispatch: Dispatch<TAction>, ownProps: CompEventInsertPropsOwn) => withInterface<CompEventInsertPropsDispatch>({
		insertEvent: (calendarId, event) => {
			dispatch(makeActionRequestEventInsert({
				calendarId,
				event,
			}))
		},
	}),
)(CompEventInsertPure)
