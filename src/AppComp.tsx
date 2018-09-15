import { withInterface } from 'illa/Type';
import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { makeActionSignIn } from './ActionSignIn';
import { makeActionSignOut } from './ActionSignOut';
import { State } from './State';
import { TAction } from './TAction';

export interface AppCompPropsFromStore {
	gapiReady: boolean
	isSignedIn: boolean
}
export interface AppCompPropsDispatch {
	signIn: () => void
	signOut: () => void
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
			<Fragment>
				<div>
					{`GAPI: ${this.props.gapiReady}`}
				</div>
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
			</Fragment>
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
	}),
	(dispatch: Dispatch<TAction>, ownProps: AppCompPropsOwn) => withInterface<AppCompPropsDispatch>({
		signIn: () => dispatch(makeActionSignIn({})),
		signOut: () => dispatch(makeActionSignOut({})),
	}),
)(AppCompPure)
