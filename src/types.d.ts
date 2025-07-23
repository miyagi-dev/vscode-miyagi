import { JSONSchema7 } from 'json-schema'
import { Uri } from 'vscode'

// General-purpose types

export interface SemanticVersionObject {
	major: number
	minor: number
	patch: number
}

// miyagi-specific types

interface MiyagiConfigBase {
	components: {
		folder: string
	}
	files: {
		schema: {
			name: string
			extension: 'json' | 'yaml'
		}
		mocks: {
			name: string
			extension: 'json' | 'yaml'
		}
		templates: {
			name: '<component>' | string
			extension?: 'twig'
		}
	}
}

export interface MiyagiConfig3 extends MiyagiConfigBase {
	engine?: {
		options?: {
			namespaces?: {
				[key: string]: string | undefined
			}
		}
	}
}

export interface MiyagiConfig4 extends MiyagiConfigBase {
	namespaces?: {
		[key: string]: string | undefined
	}
}

export interface MiyagiConfigNormalized extends MiyagiConfigBase {
	namespaces?: {
		[key: string]: string | undefined
	}
}

export interface Schema {
	id: string
	uri: Uri
	componentURI: Uri
	content: JSONSchema7
}

export interface Project {
	uri: Uri
	version: string
	config: MiyagiConfigNormalized
	schemas: Schema[]
}
