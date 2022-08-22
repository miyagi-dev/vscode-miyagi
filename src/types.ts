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

export interface JSONSchema {
	$schema: string
	$id?: string
}

export interface Schema {
	uri: vscode.Uri
	id: string
	content: JSONSchema
}

export interface Project {
  uri: vscode.Uri
  config: MiyagiConfig
	schemas: Schema[]
}
