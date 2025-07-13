import path from 'node:path'

import { JSONSchema7 } from 'json-schema'
import { RelativePattern, Uri, workspace } from 'vscode'
import YAML from 'yaml'

import { EXCLUDE_GLOB, SCHEMA_GLOB } from '../constants.ts'
import type { Schema } from '../types.ts'

async function convertSchema(uri: Uri): Promise<Schema> {
	const extension = path.extname(uri.path).slice(1) as 'json' | 'yaml'
	const file = await workspace.fs.readFile(uri)
	let content: JSONSchema7

	try {
		if (extension === 'json') {
			content = JSON.parse(file.toString())
		}

		if (extension === 'yaml') {
			content = YAML.parse(file.toString())
		}
	} catch {
		content = {}
	}

	// Fallback object if schema is empty.
	content ??= {}

	const componentURI = Uri.joinPath(uri, '..')
	const id = content.$id ?? componentURI.path

	return { id, uri, componentURI, content }
}

export async function loadSchemas(projectURI: Uri): Promise<Schema[]> {
	const glob = new RelativePattern(projectURI, SCHEMA_GLOB)
	const files = await workspace.findFiles(glob, EXCLUDE_GLOB)
	return Promise.all(files.map(convertSchema))
}
