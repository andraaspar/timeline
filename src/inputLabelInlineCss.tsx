import { css, cx } from 'emotion'
import { inputLabelCss } from './inputLabelCss'

export const inputLabelInlineCss = cx(
	inputLabelCss,
	css({
		label: `inputLabelInline`,
		whiteSpace: 'nowrap',
		borderTop: `1px solid transparent`,
		borderBottom: `1px solid transparent`,
		paddingTop: 5,
		paddingBottom: 5,
	}),
)
