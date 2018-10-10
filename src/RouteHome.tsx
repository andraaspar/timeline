import { withInterface } from 'illa/Type'
import { Path } from './Path'
import { makeRouteString } from './route'

export interface RouteHomeSchema {
	readonly startWeeks: number
	readonly endWeeks: number
}

export interface RouteHome {
	readonly path: Path.Home
	readonly startWeeks: string
	readonly endWeeks: string
}

export function makeRouteHome(o: RouteHomeSchema) {
	return makeRouteString(withInterface<RouteHome>({
		path: Path.Home,
		startWeeks: o.startWeeks + '',
		endWeeks: o.endWeeks + '',
	}))
}
