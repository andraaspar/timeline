import { Component } from 'react'
import {connect} from 'react-redux'
import * as React from 'react';

export interface AppCompProps {
	gapiReady: boolean
}
export interface AppCompState { }
export interface AppCompSnapshot { }

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
			<div>
				{`GAPI: ${this.props.gapiReady}`}
			</div>
		)
	}

	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: AppCompProps, prevState: AppCompState): AppCompSnapshot {}
	// componentDidUpdate(prevProps: AppCompProps, prevState: AppCompState, snapshot: AppCompSnapshot) {}
	// componentWillUnmount() {}
}

export const AppComp = connect(state => {}, dispatch => {})(AppCompPure)
