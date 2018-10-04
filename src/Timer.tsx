import { makeActionSetNow } from './ActionSetNow'
import { store } from './store'

export namespace Timer {

	let isListening: boolean
	let isStarted = false
	let ref: any

	export function start() {
		isStarted = true
		if (shouldTick()) {
			startInternal()
		}
	}

	export function stop() {
		isStarted = false
		stopInternal()
	}
	
	function shouldTick() {
		return document.visibilityState === 'visible'
	}

	function startInternal() {
		stopInternal()
		ref = setInterval(onTick, 1000)
		onTick()
	}

	function stopInternal() {
		clearInterval(ref)
	}

	function onTick() {
		store.dispatch(makeActionSetNow({
			now: Date.now(),
		}))
	}

	export function listen() {
		if (isListening) return
		isListening = true
		document.addEventListener('visibilitychange', e => {
			if (shouldTick()) {
				if (isStarted) startInternal()
			} else {
				stopInternal()
			}
		})
	}
}
