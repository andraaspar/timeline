import { get } from 'illa/FunctionUtil'
import { TSet, withInterface } from 'illa/Type'
import { Settings } from 'luxon'
import React, { ChangeEvent, Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { makeActionRequestEventInsert } from './ActionRequestEventInsert'
import { buttonCss } from './buttonCss'
import { eventInputFromString } from './EventInput_Methods'
import { EventListItemComp } from './EventListItemComp'
import { ICalendar } from './ICalendar'
import { IEvent, makeIEventFromEventInput } from './IEvent'
import { inputCss } from './inputCss'
import { RowComp } from './RowComp'
import { State } from './State'
import { StateLoad } from './StateLoad'
import { LOAD_STATE_INSERT_EVENT } from './statics'
import { TAction } from './TAction'

export interface CompEventInsertPropsFromStore {
	readonly loadState: StateLoad
	readonly calendarsById: Readonly<TSet<ICalendar>>
	readonly locale: string
	readonly now: number
}
export interface CompEventInsertPropsDispatch {
	readonly insertEvent: (calendarId: string, e: gapi.client.calendar.EventInput) => void
}
export interface CompEventInsertPropsOwn { }
export interface CompEventInsertProps extends CompEventInsertPropsOwn, CompEventInsertPropsFromStore, CompEventInsertPropsDispatch { }
export interface CompEventInsertState {
	readonly value: string
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
			value: '',
			eventInput: null,
			event: null,
			calendarId: 'primary',
			isSaving: false,
		}
	}
	// componentWillMount() {}
	static getDerivedStateFromProps(nextProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertState | null {
		const isSaving = nextProps.loadState.isLoading
		const success = prevState.isSaving && !isSaving && !nextProps.loadState.hasError
		return {
			...prevState,
			calendarId: Object.keys(nextProps.calendarsById).find(id => !!get(() => nextProps.calendarsById[id].primary)) || 'primary',
			isSaving,
			value: success ? '' : prevState.value,
			event: success ? null : prevState.event,
			eventInput: success ? null : prevState.eventInput,
		}
	}
	// shouldComponentUpdate(nextProps: CompEventInsertProps, nextState: CompEventInsertState): boolean {}
	render() {
		return (
			<RowComp distance={5} isVertical>
				<input
					className={inputCss}
					type='text'
					value={this.state.value}
					onChange={this.onValueChanged}
					disabled={this.state.isSaving}
					placeholder={`Create an event: [from][to] event name...`}
				/>
				{this.state.event &&
					<EventListItemComp
						calendar={this.props.calendarsById[this.state.calendarId]}
						event={this.state.event}
						nextEvent={null}
						now={this.props.now}
					/>
				}
				{this.state.eventInput &&
					<button
						className={buttonCss}
						type='button'
						onClick={this.onSaveEventClicked}
						disabled={this.state.isSaving}
					>
						{`Save event`}
					</button>
				}
			</RowComp>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState): CompEventInsertSnap {}
	// componentDidUpdate(prevProps: CompEventInsertProps, prevState: CompEventInsertState, snapshot: CompEventInsertSnap) {}
	// componentWillUnmount() {}

	onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value
		const eventInput = get<gapi.client.calendar.EventInput | null>(() => eventInputFromString(Settings.defaultZoneName, value), null) as gapi.client.calendar.EventInput | null
		const event = eventInput ? makeIEventFromEventInput({ calendarId: this.state.calendarId, locale: this.props.locale }, eventInput) : null
		this.setState({
			...this.state,
			value,
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
