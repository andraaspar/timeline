import * as CSS from 'csstype'
import { css, cx } from 'emotion'
import React, { Children, Component, ReactElement } from 'react'
import { TTopRightBottomLeft, TXY } from './TTopRightBottomLeft'
import { normalizeXY, topRightBottomLeftToCssValue } from './TTopRightBottomLeft_Methods'

export interface CompRowProps {
	inset?: TTopRightBottomLeft
	distance?: TXY
	isVertical?: boolean
	outerTextAlign?: CSS.TextAlignProperty
	itemTextAlign?: CSS.TextAlignProperty
	outerClass?: string
	itemClass?: string
}
export interface CompRowState { }
export interface CompRowSnap { }

const displayName = `CompRow`

export class CompRow extends Component<CompRowProps, CompRowState/* , CompRowSnap */> {
	static displayName = displayName

	// constructor(props: CompRowProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// getDerivedStateFromProps(nextProps: CompRowProps, prevState: CompRowState): CompRowState | null {}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: CompRowProps, nextState: CompRowState): boolean {}
	render() {
		const distance = normalizeXY(this.props.distance)
		
		const outerClass = cx(
			this.props.outerClass,
			css({
				label: displayName,
				overflow: 'hidden',
				padding: topRightBottomLeftToCssValue(this.props.inset),
				textAlign: this.props.outerTextAlign,
			}),
		)
		const innerClass = css({
			label: `${displayName}-inner`,
			margin: `-${distance.y} 0 0 -${distance.x}`,
		})
		const itemClass = cx(
			this.props.itemClass,
			css({
				label: `${displayName}-item`,
				display: this.props.isVertical ? 'block' : 'inline-block',
				verticalAlign: 'top',
				textAlign: this.props.itemTextAlign,
				margin: `${distance.y} 0 0 ${distance.x}`,
			}),
		)
		return (
			<div className={outerClass}>
				<div className={innerClass}>
					{Children.map(this.props.children, child =>
						child &&
						<div
							key={(child as ReactElement<any>).key || undefined}
							className={itemClass}
						>
							{child}
						</div>
					)}
				</div>
			</div>
		)
	}
	// componentDidMount() {}
	// getSnapshotBeforeUpdate(prevProps: CompRowProps, prevState: CompRowState): CompRowSnap {}
	// componentDidUpdate(prevProps: CompRowProps, prevState: CompRowState, snapshot: CompRowSnap) {}
	// componentWillUnmount() {}
}
