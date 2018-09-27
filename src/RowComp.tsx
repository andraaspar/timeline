import * as CSS from 'csstype';
import { css, cx } from 'emotion';
import React, { Children, Component, ReactElement } from 'react';
import { TTopRightBottomLeft, TXY } from './TTopRightBottomLeft';
import { normalizeXY, topRightBottomLeftToCssValue } from './TTopRightBottomLeft_Methods';

export interface RowCompProps {
	inset?: TTopRightBottomLeft
	distance?: TXY
	isVertical?: boolean
	outerTextAlign?: CSS.TextAlignProperty
	itemTextAlign?: CSS.TextAlignProperty
	outerClass?: string
	itemClass?: string
}
export interface RowCompState { }
export interface RowCompSnap { }

export class RowComp extends Component<RowCompProps, RowCompState/* , RowCompSnap */> {
	static displayName = `RowComp`

	// constructor(props: RowCompProps) {
	// 	super(props)
	// 	// this.state = {}
	// }
	// getDerivedStateFromProps(nextProps: RowCompProps, prevState: RowCompState): RowCompState | null {}
	// componentWillMount() {}
	// shouldComponentUpdate(nextProps: RowCompProps, nextState: RowCompState): boolean {}
	render() {
		const distance = normalizeXY(this.props.distance)
		
		const outerClass = cx(
			this.props.outerClass,
			css({
				label: RowComp.displayName,
				overflow: 'hidden',
				padding: topRightBottomLeftToCssValue(this.props.inset),
				textAlign: this.props.outerTextAlign,
			}),
		)
		const innerClass = css({
			label: `${RowComp.displayName}-inner`,
			margin: `-${distance.y} 0 0 -${distance.x}`,
		})
		const itemClass = cx(
			this.props.itemClass,
			css({
				label: `${RowComp.displayName}-item`,
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
						<div
							key={child ? (child as ReactElement<any>).key : undefined}
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
	// getSnapshotBeforeUpdate(prevProps: RowCompProps, prevState: RowCompState): RowCompSnap {}
	// componentDidUpdate(prevProps: RowCompProps, prevState: RowCompState, snapshot: RowCompSnap) {}
	// componentWillUnmount() {}
}
