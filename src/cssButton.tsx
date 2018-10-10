import { css } from 'emotion'
import { BLACK_2, BLACK_3, BLACK_4, BORDER, BUTTON_PADDING, RADIUS, SEMIBOLD, TEAL_4, TRANSPARENT } from './StyleConstants'
import { topRightBottomLeftToCssValue } from './TTopRightBottomLeft_Methods'

export const cssButton = css({
	label: `cssButton`,
	display: 'block',
	border: BORDER,
	borderRadius: RADIUS,
	background: TRANSPARENT,
	padding: topRightBottomLeftToCssValue(BUTTON_PADDING),
	cursor: 'pointer',
	fontWeight: SEMIBOLD,
	color: TEAL_4,
	width: `100%`,
	
	':hover': {
		background: BLACK_2,
	},
	
	':active': {
		background: BLACK_3,
	},
	
	':focus': {
		borderColor: TEAL_4,
		outline: 'none',
	},
	
	':disabled': {
		color: BLACK_4,
		background: TRANSPARENT,
		cursor: 'default',
	},
})
