import { withInterface } from 'illa/Type'
import { Path } from './Path'
import { makeRouteString } from './route'

export interface RouteCreateSchema {
	readonly startWeeks: number
	readonly endWeeks: number
}

export interface RouteCreate {
	readonly path: Path.Create
	readonly startWeeks: string
	readonly endWeeks: string
}

export function makeRouteCreate(o: RouteCreateSchema) {
	return makeRouteString(withInterface<RouteCreate>({
		path: Path.Create,
		endWeeks: o.endWeeks + '',
		startWeeks: o.startWeeks + '',
	}))
}
