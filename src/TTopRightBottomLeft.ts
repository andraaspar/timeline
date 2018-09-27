export type TTopRightBottomLeft<T = number> = T | IXY<T> | ITopXBottom<T> | IYRightLeft<T> | ITopRightBottomLeft<T>

export type TXY<T = number> = T | IXY<T>

export interface IXY<T = number> {
	x: T
	y: T
}

export interface ITopXBottom<T = number> {
	t: T
	x: T
	b: T
}

export interface IYRightLeft<T = number> {
	y: T
	r: T
	l: T
}

export interface ITopRightBottomLeft<T = number> {
	t: T
	r: T
	b: T
	l: T
}
