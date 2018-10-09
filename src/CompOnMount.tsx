import { Component } from 'react'

export interface CompOnMountProps {
	readonly onMount: () => void
}
export interface CompOnMountState { }
export interface CompOnMountSnap { }

const displayName = `CompOnMount`

export class CompOnMount extends Component<CompOnMountProps, CompOnMountState/* , CompOnMountSnap */> {
	static displayName = displayName
	
	// constructor(props: CompOnMountProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// static getDerivedStateFromProps(nextProps: CompOnMountProps, prevState: CompOnMountState): CompOnMountState | null {}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: CompOnMountProps, nextState: CompOnMountState): boolean {}
	render() {
		return (
			this.props.children
		)
	}
	componentDidMount() {
		if (this.props.onMount) this.props.onMount()
	}
	// getSnapshotBeforeUpdate(prevProps: CompOnMountProps, prevState: CompOnMountState): CompOnMountSnap {}
	// componentDidUpdate(prevProps: CompOnMountProps, prevState: CompOnMountState, snapshot: CompOnMountSnap) {}
	// componentWillUnmount() {}
}
