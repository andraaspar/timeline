import { url } from './UtilURL'
export const ROUTE_HOME = '/home'
export const ROUTE_CREATE = '/create'

export type TRoute =
	| RouteHome
	| RouteCreate

export interface RouteHome {
	readonly startWeeks: string
	readonly endWeeks: string
}

export interface RouteCreate {
	readonly startWeeks: string
	readonly endWeeks: string
}

export function makeRouteHome(startWeeks: number, endWeeks: number) {
	return url`/home?startWeeks=${startWeeks + ''}&endWeeks=${endWeeks + ''}`
}

export function makeRouteCreate(startWeeks: number, endWeeks: number) {
	return url`/create?startWeeks=${startWeeks + ''}&endWeeks=${endWeeks + ''}`
}
