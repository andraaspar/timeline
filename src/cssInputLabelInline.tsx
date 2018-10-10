import { css, cx } from 'emotion'
import { cssInputLabel } from './cssInputLabel'
import { BUTTON_PADDING_BOTTOM, BUTTON_PADDING_TOP } from './StyleConstants'

export const cssInputLabelInline = cx(
	cssInputLabel,
	css({
		label: `inputLabelInline`,
		whiteSpace: 'nowrap',
		borderTop: `1px solid transparent`,
		borderBottom: `1px solid transparent`,
		paddingTop: BUTTON_PADDING_TOP,
		paddingBottom: BUTTON_PADDING_BOTTOM,
	}),
)
