import { makeActionSetVisibility } from './ActionSetVisibility'
import { store } from './store'

export namespace Visibility {

	let isListening: boolean
	let visible: boolean = isVisible()
	let hideTime: number
	let showTime: number

	export function listen() {
		if (isListening) return
		isListening = true
		document.addEventListener('visibilitychange', e => {
			const newVisible = isVisible()
			if (newVisible !== visible) {
				visible = newVisible
				if (visible) {
					showTime = Date.now()
				} else {
					hideTime = Date.now()
				}
				store.dispatch(makeActionSetVisibility({
					visible: isVisible(),
					showTime,
					hideTime,
				}))
			}
		})
	}

	export function isVisible() {
		return !document.hidden
	}
}
