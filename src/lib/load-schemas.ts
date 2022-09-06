import path from 'node:path'

import { JSONSchema7 } from 'json-schema'
import vscode from 'vscode'
import YAML from 'yaml'

import { EXCLUDE_GLOB, SCHEMA_GLOB } from '../constants'
import { Schema } from '../types'

async function convertSchema (uri: vscode.Uri): Promise<Schema> {
	const extension = path.extname(uri.path).slice(1)
	const file = await vscode.workspace.fs.readFile(uri)
	let content: JSONSchema7

	try {
		content = extension === 'yaml'
			? YAML.parse(file.toString())
			: JSON.parse(file.toString())
	} catch {
		content = {}
	}

	// Fallback object if schema is empty.
	content ??= {}

	const componentURI = vscode.Uri.joinPath(uri, '..')
	const id = content.$id ?? componentURI.path

	return { id, uri, componentURI, content }
}

export async function loadSchemas (projectURI: vscode.Uri): Promise<Schema[]> {
	const glob = new vscode.RelativePattern(projectURI, SCHEMA_GLOB)
	const files = await vscode.workspace.findFiles(glob, EXCLUDE_GLOB)
	return Promise.all(files.map(convertSchema))
}
