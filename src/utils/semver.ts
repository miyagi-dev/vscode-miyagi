import { SemanticVersion } from '../types'

const PATTERN = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/

export class SemVer {
	version: SemanticVersion

	constructor (version: string = '0.0.0') {
		this.version = SemVer.parse(version)
	}

	gte (b: string) {
		const valuesA = Object.values(this.version)
		const valuesB = Object.values(SemVer.parse(b))

		return valuesA.every((value, index) => value >= valuesB[index])
	}

	static parse (version: string): SemanticVersion {
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
}
