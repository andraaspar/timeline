import { css } from 'emotion'
import { BORDER, BUTTON_PADDING, RADIUS, TEAL_4 } from './StyleConstants'
import { topRightBottomLeftToCssValue } from './TTopRightBottomLeft_Methods'

export const cssInput = css({
	label: `cssInput`,
	display: 'block',
	width: `100%`,
	border: BORDER,
	borderRadius: RADIUS,
	padding: topRightBottomLeftToCssValue(BUTTON_PADDING),
	':focus': {
		borderColor: TEAL_4,
	},
})
