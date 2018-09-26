import { Component } from 'react';

export interface OnMountCompProps {
	readonly onMount: () => void
}
export interface OnMountCompState { }
export interface OnMountCompSnap { }

export class OnMountComp extends Component<OnMountCompProps, OnMountCompState/* , OnMountCompSnap */> {
	static displayName = __filename
	
	// constructor(props: OnMountCompProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// static getDerivedStateFromProps(nextProps: OnMountCompProps, prevState: OnMountCompState): OnMountCompState | null {}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: OnMountCompProps, nextState: OnMountCompState): boolean {}
	render() {
		return (
			this.props.children
		)
	}
	componentDidMount() {
		if (this.props.onMount) this.props.onMount()
	}
	// getSnapshotBeforeUpdate(prevProps: OnMountCompProps, prevState: OnMountCompState): OnMountCompSnap {}
	// componentDidUpdate(prevProps: OnMountCompProps, prevState: OnMountCompState, snapshot: OnMountCompSnap) {}
	// componentWillUnmount() {}
}