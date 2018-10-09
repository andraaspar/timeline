import { css } from 'emotion'

export const cssButton = css({
	label: `buttonCss`,
	display: 'block',
	border: `1px solid rgba(0, 0, 0, .2)`,
	borderRadius: 3,
	background: 'white',
	padding: 5,
	cursor: 'pointer',
	fontWeight: 'bolder',
	color: 'teal',
	width: `100%`,
	
	':hover': {
		background: '#eee',
	},
	
	':active': {
		background: '#ddd',
	},
	
	':focus': {
		borderColor: 'teal',
		outline: 'none',
	},
})
