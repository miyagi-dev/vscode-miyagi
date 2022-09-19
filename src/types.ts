import { JSONSchema7 } from 'json-schema'
import vscode from 'vscode'

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
	uri: vscode.Uri
	componentURI: vscode.Uri
	content: JSONSchema7
}

export interface Project {
	uri: vscode.Uri
	config: MiyagiConfig
	schemas: Schema[]
}
