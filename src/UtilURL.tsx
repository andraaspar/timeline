
export function url(s: TemplateStringsArray, ...rest: string[]) {
	let result = ''
	let sLength = s.length
	let restLength = rest.length
	for (let i = 0; i < sLength; i++) {
		result += s[i]
		if (i < restLength) result += encodeURIComponent(rest[i])
	}
	return result
}
