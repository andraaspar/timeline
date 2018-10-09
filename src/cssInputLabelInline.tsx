import { css, cx } from 'emotion'
import { cssInputLabel } from './cssInputLabel'

export const cssInputLabelInline = cx(
	cssInputLabel,
	css({
		label: `inputLabelInline`,
		whiteSpace: 'nowrap',
		borderTop: `1px solid transparent`,
		borderBottom: `1px solid transparent`,
		paddingTop: 5,
		paddingBottom: 5,
	}),
)
