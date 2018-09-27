import { isArray } from 'illa/Type';

const LOCALE_KEY = 'locale'

export function getLocale() {
	let result: string
	try {
		result = localStorage.getItem(LOCALE_KEY)
	} catch (e) {}
	if (!result && isArray(navigator.languages)) {
		result = navigator.languages[0]
	}
	if (!result) {
		result = navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage
	}
	if (!result) {
		result = 'en-US'
	}
	return result
}

export function saveLocale(locale: string) {
	try {
		localStorage.setItem(LOCALE_KEY, locale)
	} catch (e) {}
}