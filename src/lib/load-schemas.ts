import { SCHEMA_GLOB, EXCLUDE_GLOB } from '../constants'
import path from 'node:path'
import vscode from 'vscode'
import YAML from 'yaml'

interface JSONSchema {
	$schema: string
	$id?: string
}

export interface Schema {
	uri: vscode.Uri
	id: string
	content: JSONSchema
}

async function convertSchema (uri: vscode.Uri): Promise<Schema> {
	const extension = path.extname(uri.path).slice(1)
	const file = await vscode.workspace.fs.readFile(uri)
	let content: JSONSchema

	if (extension === 'yaml') {
		content = YAML.parse(file.toString())
	} else {
		content = JSON.parse(file.toString())
	}

	const id = content.$id ?? uri.path

	return { id, uri, content }
}

export async function loadSchemas (projectURI: vscode.Uri): Promise<Schema[]> {
	const projectSchemaGlob = new vscode.RelativePattern(projectURI, SCHEMA_GLOB)
	const files = await vscode.workspace.findFiles(projectSchemaGlob, EXCLUDE_GLOB)
	return Promise.all(files.map(convertSchema))
}
