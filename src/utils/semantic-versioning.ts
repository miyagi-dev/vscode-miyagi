import { SemanticVersion } from '../types'

const PATTERN = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/

function parse (version: string): SemanticVersion {
	const match = version.match(PATTERN)

	const major = match?.groups?.major ?? '0'
	const minor = match?.groups?.minor ?? '0'
	const patch = match?.groups?.patch ?? '0'

	const result = {
		major: parseInt(major),
		minor: parseInt(minor),
		patch: parseInt(patch)
	}

	return result
}

function greaterThanOrEqual (a: SemanticVersion, b: SemanticVersion): boolean {
	const valuesA = Object.values(a)
	const valuesB = Object.values(b)

	return valuesA.every((value, index) => value >= valuesB[index])
}

export function compareSemanticVersion (a: string = '0.0.0', comparison: '>=', b: string = '0.0.0'): boolean {
	if (comparison === '>=') {
		return greaterThanOrEqual(parse(a), parse(b))
	}

	return false
}
