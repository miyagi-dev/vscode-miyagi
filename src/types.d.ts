import { JSONSchema7 } from 'json-schema'
import { Uri } from 'vscode'

// General-purpose types

export interface SemanticVersionObject {
	major: number
	minor: number
	patch: number
}

// miyagi-specific types

export interface MiyagiConfig {
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
	engine?: {
		name?: 'twig' | string
		options?: {
			namespaces?: {
				[key: string]: string | undefined
			}
		}
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
	config: MiyagiConfig
	schemas: Schema[]
}
