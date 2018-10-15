import { get } from 'illa/FunctionUtil'
import { TSet, withInterface } from 'illa/Type'
import { Settings } from 'luxon'
import React, { ChangeEvent, Component } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { isUndefined } from 'util'
import { makeActionRequestEventInsert } from './ActionRequestEventInsert'
import { CompEventListItem } from './CompEventListItem'
import { CompRow } from './CompRow'
import { cssButton } from './cssButton'
import { cssInput } from './cssInput'
import { cssInputLabel } from './cssInputLabel'
import { eventInputFromString } from './EventInput_Methods'
import { ICalendar } from './ICalendar'
import { IEvent, makeIEventFromEventInput } from './IEvent'
import { editableCalendarsOrderedSelector, routeQueryEndWeeksSelector, routeQueryStartWeeksSelector } from './selectors'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_INSERT_EVENT } from './statics'

export interface CompEventInsertPropsFromStore {
	readonly loadState: StateLoad
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly calendarsOrdered: ReadonlyArray<ICalendar>
	readonly locale: string
	readonly now: number
	readonly startWeeks: number
	readonly endWeeks: number
}
export interface CompEventInsertPropsOwn { }
export interface CompEventInsertProps extends CompEventInsertPropsOwn, CompEventInsertPropsFromStore, DispatchProp { }
export interface CompEventInsertState {
	readonly start: string
	readonly end: string
	readonly summary: string
	readonly eventInput: gapi.client.calendar.EventInput | null
	readonly event: IEvent | null
	readonly calendarId: string
	readonly isSaving: boolean
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
		}
	}
	// componentWillMount() {}
	static getDerivedStateFromProps(nextProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertState | null {
		const isSaving = nextProps.loadState === StateLoad.Loading
		return {
			...prevState,
			isSaving,
		}
	}
	// shouldComponentUpdate(nextProps: CompEventInsertProps, nextState: CompEventInsertState): boolean {}
	render() {
		const disabled = this.props.loadState === StateLoad.Loading
		return (
			<CompRow distance={5} isVertical>
				<div className={cssInputLabel}>
					{`Summary:`}
				</div>
				<div>
					<input
						className={cssInput}
						type='text'
						value={this.state.summary}
						onChange={this.onSummaryValueChanged}
						disabled={disabled}
						placeholder={`What’s happening`}
					/>
				</div>
				<div className={cssInputLabel}>
					{`Start:`}
				</div>
				<div>
					<input
						className={cssInput}
						type='text'
						value={this.state.start}
						onChange={this.onStartValueChanged}
						disabled={disabled}
						placeholder={`16:45 or 08-23 or +pt2h`}
					/>
				</div>
				<div className={cssInputLabel}>
					{`End:`}
				</div>
				<div>
					<input
						className={cssInput}
						type='text'
						value={this.state.end}
						onChange={this.onEndValueChanged}
						disabled={disabled}
						placeholder={`+p15m or 17:00 or 08-23`}
					/>
				</div>
				<div className={cssInputLabel}>
					{`Calendar:`}
				</div>
				<div>
					{this.props.calendarsOrdered.map(calendar =>
						<label key={calendar.id}>
							<input
								type='radio'
								name='calendar'
								value={calendar.id}
								defaultChecked={calendar.primary || this.state.calendarId === calendar.id}
								onChange={this.onCalendarIdChanged}
								disabled={disabled}
							/>
							{` `}
							{calendar.summary}
							{` `}
						</label>
					)}
				</div>
				<div className={cssInputLabel}>
					{`Event:`}
				</div>
				{this.state.event &&
					<CompEventListItem
						calendar={this.getCalendarById(this.state.calendarId)}
						event={this.state.event}
						nextEvent={null}
						now={this.props.now}
						alwaysExpanded={true}
						locale={this.props.locale}
					/>
				}
				{this.state.eventInput &&
					<button
						className={cssButton}
						type='button'
						onClick={this.onSaveEventClicked}
						disabled={disabled || !this.state.eventInput.summary}
					>
						{`Save event`}
					</button>
				}
			</CompRow>
		)
	}
	componentDidMount() {
		this.setEventProperties({}) // Create event
	}
	// getSnapshotBeforeUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertSnap {}
	// componentDidUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState, snapshot: CompEventInsertSnap) {}
	// componentWillUnmount() {}

	onStartValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		this.setEventProperties({ start: e.currentTarget.value })
	}

	onEndValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		this.setEventProperties({ end: e.currentTarget.value })
	}

	onSummaryValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		this.setEventProperties({ summary: e.currentTarget.value })
	}

	setEventProperties(o: { start?: string, end?: string, summary?: string, calendarId?: string }) {
		const start = !isUndefined(o.start) ? o.start : this.state.start
		const end = !isUndefined(o.end) ? o.end : this.state.end
		const summary = !isUndefined(o.summary) ? o.summary : this.state.summary
		const calendarId = !isUndefined(o.calendarId) ? o.calendarId : this.state.calendarId
		const eventInput = get<gapi.client.calendar.EventInput | null>(() => eventInputFromString(Settings.defaultZoneName, start, end, summary), null) as gapi.client.calendar.EventInput | null
		const event = eventInput ? makeIEventFromEventInput({ calendarId, locale: this.props.locale }, eventInput) : null
		this.setState({
			...this.state,
			...o,
			eventInput,
			event,
		})
	}

	onCalendarIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
		this.setEventProperties({ calendarId: e.currentTarget.value })
	}

	onSaveEventClicked = () => {
		if (this.state.eventInput) {
			this.props.dispatch(makeActionRequestEventInsert({
				calendarId: this.state.calendarId,
				event: this.state.eventInput,
			}))
		}
	}

	getCalendarById(id: string): ICalendar {
		if (id === 'primary') {
			return this.props.calendarsOrdered.find(calendar => !!calendar.primary)!
		}
		return this.props.calendarsById[this.state.calendarId]
	}
}

export const CompEventInsert = connect(
	(state: State/* , ownProps: CompEventInsertPropsOwn */) => withInterface<CompEventInsertPropsFromStore>({
		calendarsById: state.calendarsById,
		calendarsOrdered: editableCalendarsOrderedSelector(state),
		locale: state.locale,
		now: state.now,
		loadState: state.loadStatesById[LOAD_STATE_INSERT_EVENT],
		endWeeks: routeQueryEndWeeksSelector(state),
		startWeeks: routeQueryStartWeeksSelector(state),
	}),
)(CompEventInsertPure)
