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
	}
	engine?: {
		name?: string
		options?: {
			namespaces?: {
				[key: string]: string | undefined
			}
		}
	}
}

export interface Project {
  uri: vscode.Uri
  config: MiyagiConfig
}

export interface Schema {
	id: string
	uri: vscode.Uri
	component: vscode.Uri
	content: JSONSchema7
}
