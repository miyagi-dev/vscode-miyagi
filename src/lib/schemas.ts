import { JSONSchema7 } from 'json-schema'
import { Schema } from '../types'
import { SCHEMA_GLOB, EXCLUDE_GLOB } from '../constants'
import path from 'node:path'
import vscode from 'vscode'
import YAML from 'yaml'

let schemas: Schema[]

async function convertSchema (uri: vscode.Uri): Promise<Schema> {
	const extension = path.extname(uri.path).slice(1)
	const file = await vscode.workspace.fs.readFile(uri)
	let content: JSONSchema7

	if (extension === 'yaml') {
		content = YAML.parse(file.toString())
	} else {
		content = JSON.parse(file.toString())
	}

	const component = vscode.Uri.joinPath(uri, '..')
	const id = content.$id ?? component.path

	return { id, uri, component, content }
}

type GetSchemaListOptions = {
	refresh?: boolean
}

export async function getSchemaList ({ refresh }: GetSchemaListOptions = {}): Promise<Schema[]> {
	if (schemas && !refresh) {
		return schemas
	}

	schemas = []

	const files = await vscode.workspace.findFiles(SCHEMA_GLOB, EXCLUDE_GLOB)

	for (const file of files) {
		const schema = await convertSchema(file)
		schemas.push(schema)
	}

	return schemas
}

export function getSchema (uri: vscode.Uri): Schema | undefined {
	const componentPath = uri.path.endsWith('.twig') ? path.dirname(uri.path) : uri.path
	return schemas.find(schema => schema.component.path === componentPath)
}
