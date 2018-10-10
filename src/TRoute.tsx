import { RouteCreate } from './RouteCreate'
import { RouteHome } from './RouteHome'

export type TRoute = Partial<
	| RouteHome
	| RouteCreate
	>
