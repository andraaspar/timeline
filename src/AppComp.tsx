import { withInterface } from 'illa/Type';
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionLoadEvents } from './ActionLoadEvents';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { EventListComp } from './EventListComp';
import { IEvent } from './IEvent';
import { eventsOrderedSelector } from './selectors';
import { State } from './State_';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	readonly gapiReady: boolean
	readonly isSignedIn: boolean
	readonly events: ReadonlyArray<IEvent>
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
	loadEvents: () => void
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
								events={this.props.events}
								loadEvents={this.props.loadEvents}
							/>
						}
					</>
					:
					<div>{`Loading...`}</div>
				}
			</>
		)
	}

	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: AppCompProps, prevState: AppCompState): AppCompSnapshot {}
	// componentDidUpdate(prevProps: AppCompProps, prevState: AppCompState, snapshot: AppCompSnapshot) {}
	// componentWillUnmount() {}
}

export const AppComp = connect(
	(state: State, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsFromStore>({
		gapiReady: state.gapiReady,
		isSignedIn: state.isSignedIn,
		events: eventsOrderedSelector(state),
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
		loadEvents: () => dispatch(makeActionLoadEvents({})),
	}),
)(AppCompPure)
