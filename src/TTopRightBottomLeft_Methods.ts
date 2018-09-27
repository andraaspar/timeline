import { getIfNot } from 'illa/FunctionUtil'
import { isNumber, isObjectNotNull, isString, withInterface } from 'illa/Type'
import { ITopRightBottomLeft, IXY, TTopRightBottomLeft, TXY } from './TTopRightBottomLeft'

export function normalizeXY(o: TXY<number | string>, unit?: string): IXY<string> {
	if (isObjectNotNull(o)) {
		return withInterface<IXY<string>>({
			x: stringOrNumberToUnit(o.x, unit),
			y: stringOrNumberToUnit(o.y, unit),
		})
	}
	const value = stringOrNumberToUnit(o, unit)
	return withInterface<IXY<string>>({
		x: value,
		y: value,
	})
}

export function topRightBottomLeftToMulti(o: TTopRightBottomLeft<number>, defaultValue = 1): ITopRightBottomLeft<number> {
	if (isObjectNotNull(o)) {
		if ('x' in o) {
			if ('y' in o) {
				return {
					t: getIfNot(isNaN, o.y, defaultValue),
					r: getIfNot(isNaN, o.x, defaultValue),
					b: getIfNot(isNaN, o.y, defaultValue),
					l: getIfNot(isNaN, o.x, defaultValue),
				}
			} else {
				return {
					t: getIfNot(isNaN, o.t, defaultValue),
					r: getIfNot(isNaN, o.x, defaultValue),
					b: getIfNot(isNaN, o.b, defaultValue),
					l: getIfNot(isNaN, o.x, defaultValue),
				}
			}
		} else if ('y' in o) {
			return {
				t: getIfNot(isNaN, o.y, defaultValue),
				r: getIfNot(isNaN, o.r, defaultValue),
				b: getIfNot(isNaN, o.y, defaultValue),
				l: getIfNot(isNaN, o.l, defaultValue),
			}
		} else {
			return {
				t: getIfNot(isNaN, o.t, defaultValue),
				r: getIfNot(isNaN, o.r, defaultValue),
				b: getIfNot(isNaN, o.b, defaultValue),
				l: getIfNot(isNaN, o.l, defaultValue),
			}
		}
	} else if (isNumber(o) && !isNaN(o)) {
		return {
			t: o,
			r: o,
			b: o,
			l: o,
		}
	}
	return {
		t: defaultValue,
		r: defaultValue,
		b: defaultValue,
		l: defaultValue,
	}
}

export function topRightBottomLeftToCssValue(o: TTopRightBottomLeft<number | string>, unit?: string, multi?: TTopRightBottomLeft<number>): string {
	const m = topRightBottomLeftToMulti(multi)
	if (isObjectNotNull(o)) {
		if ('x' in o) {
			if ('y' in o) {
				return `${stringOrNumberToUnit(o.y, unit, m.t)} ${stringOrNumberToUnit(o.x, unit, m.r)} ${stringOrNumberToUnit(o.y, unit, m.b)} ${stringOrNumberToUnit(o.x, unit, m.l)}`
			} else {
				return `${stringOrNumberToUnit(o.t, unit, m.t)} ${stringOrNumberToUnit(o.x, unit, m.r)} ${stringOrNumberToUnit(o.b, unit, m.b)} ${stringOrNumberToUnit(o.x, unit, m.l)}`
			}
		} else if ('y' in o) {
			return `${stringOrNumberToUnit(o.y, unit, m.t)} ${stringOrNumberToUnit(o.r, unit, m.r)} ${stringOrNumberToUnit(o.y, unit, m.b)} ${stringOrNumberToUnit(o.l, unit, m.l)}`
		} else {
			return `${stringOrNumberToUnit(o.t, unit, m.t)} ${stringOrNumberToUnit(o.r, unit, m.r)} ${stringOrNumberToUnit(o.b, unit, m.b)} ${stringOrNumberToUnit(o.l, unit, m.l)}`
		}
	} else if (isString(o) || isNumber(o)) {
		return `${stringOrNumberToUnit(o, unit, m.t)} ${stringOrNumberToUnit(o, unit, m.r)} ${stringOrNumberToUnit(o, unit, m.b)} ${stringOrNumberToUnit(o, unit, m.l)}`
	}
	return undefined
}

export function stringOrNumberToUnit(o: string | number, unit = 'px', multi = 1): string {
	if (multi == 0) {
		return '0'
	} else if (multi == 1) {
		if (isNumber(o)) {
			return `${o}${unit}`
		} else {
			return o || '0'
		}
	} else {
		return `calc(${stringOrNumberToUnit(o, unit)} * ${multi})`
	}
}
