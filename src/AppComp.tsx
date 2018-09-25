import { TSet, withInterface } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionInitGapi } from './ActionInitGapi';
import { makeActionLoadCalendars } from './ActionLoadCalendars';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { EventListComp } from './EventListComp';
import { ICalendar } from './ICalendar';
import { IEvent } from './IEvent';
import { eventsOrderedSelector } from './selectors';
import { State } from './State';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly events: ReadonlyArray<IEvent>
	readonly calendarsById: Readonly<TSet<ICalendar>>
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
	loadCalendars: () => void
	initGapi: () => void
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
						<button
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
						{this.props.isSignedIn &&
							<EventListComp
								calendarsById={this.props.calendarsById}
								events={this.props.events}
								loadCalendars={this.props.loadCalendars}
							/>
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
}

export const AppComp = connect(
	(state: State, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		events: eventsOrderedSelector(state),
		calendarsById: state.calendarsById,
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
		loadCalendars: () => dispatch(makeActionLoadCalendars({})),
		initGapi: () => dispatch(makeActionInitGapi({})),
	}),
)(AppCompPure)
