import React, { Component, ReactNode } from 'react'
import { StateLoad } from './StateLoad'

export interface CompLoadGuardProps {
	readonly loadState: StateLoad
	readonly what: string
	readonly render: () => ReactNode
}
export interface CompLoadGuardState { }
export interface CompLoadGuardSnap { }

const displayName = 'CompLoadGuard'

export class CompLoadGuard extends Component<CompLoadGuardProps, CompLoadGuardState/* , CompLoadGuardSnap */> {
	static displayName = displayName
	
	// constructor(props: CompLoadGuardProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// static getDerivedStateFromProps(nextProps: CompLoadGuardProps, prevState: CompLoadGuardState): CompLoadGuardState | null {}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: CompLoadGuardProps, nextState: CompLoadGuardState): boolean {}
	render() {
		return (
			<>
				{this.props.loadState === StateLoad.Loading &&
					<div>
						{`Loading ${this.props.what}...`}
					</div>
				}
				{this.props.loadState === StateLoad.Error &&
					<div>
						{`Error loading ${this.props.what}.`}
					</div>
				}
				{this.props.loadState === StateLoad.Loaded &&
					this.props.render()
				}
			</>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompLoadGuardProps, prevState: CompLoadGuardState): CompLoadGuardSnap {}
	// componentDidUpdate(prevProps: CompLoadGuardProps, prevState: CompLoadGuardState, snapshot: CompLoadGuardSnap) {}
	// componentWillUnmount() {}
}
