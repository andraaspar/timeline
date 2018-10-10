import qs from 'qs'
import { TRoute } from './TRoute'

export function makeRouteString(o: TRoute) {
	return `${o.path}?${qs.stringify(o, { strictNullHandling: true, sort: alphabeticalSort, filter })}`
}

function alphabeticalSort(a: string, b: string) {
	return a.localeCompare(b)
}

function filter(name: string, value: string) {
	if (name === 'path') {
		return undefined
	}
	return value
}

export function parseQueryString(query: string) {
	return qs.parse(query ? query.slice(1) : '', { strictNullHandling: true })
}
