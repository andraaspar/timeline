import { css } from 'emotion'

export const inputCss = css({
	label: `inputCss`,
	display: 'block',
	width: `100%`,
	border: `1px solid rgba(0, 0, 0, .2)`,
	borderRadius: 3,
	padding: 5,
	':focus': {
		borderColor: 'teal',
	},
})
