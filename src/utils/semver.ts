import { SemanticVersion } from '../types'

const FALLBACK = '0.0.0'
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

export class SemVer {
	version: SemanticVersion

	constructor (version: string = FALLBACK) {
		this.version = parse(version)
	}

	gte (version: string = FALLBACK) {
		const a = this.version
		const b = parse(version)

		if (a.major > b.major) {
			return true
		}

		if (a.major === b.major && a.minor > b.minor) {
			return true
		}

		if (a.major === b.major && a.minor === b.minor && a.patch >= b.patch) {
			return true
		}

		return false
	}
}
