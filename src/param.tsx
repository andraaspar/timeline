
export function numberFromParam(param: string | undefined, defaultValue: number): number {
	if (!param) return defaultValue
	const parsedParam = parseFloat(param)
	return isNaN(parsedParam) || !isFinite(parsedParam) ? defaultValue : parsedParam
}
