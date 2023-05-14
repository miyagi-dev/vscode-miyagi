import path from 'node:path'

import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import vscode from 'vscode'

import { TWIG_GLOB } from '../constants'
import { getProject } from './projects'

interface CompletionItem extends vscode.CompletionItem {
	definition?: JSONSchema7Definition
}

const OBJECT_PATH_PATTERN = /[\w.]+$/

const selector: vscode.DocumentSelector = [{ pattern: TWIG_GLOB }] as const

type TraverseSchemaOptions = {
	properties: JSONSchema7['properties']
	path: string[]
	token: vscode.CancellationToken
}

function traverseSchema({
	properties,
	path,
	token,
}: TraverseSchemaOptions): JSONSchema7['properties'] {
	if (!properties) {
		return
	}

	if (token.isCancellationRequested) {
		return
	}

	const [childKey, ...childPath] = path
	const childKeyInProperties = childKey in properties

	// If the child key is not in the properties but the child path still goes on,
	// we have to assume a “broken” object path.
	if (!childKeyInProperties && childPath.length) {
		return
	}

	// If there is no child key (“end” of object path) or the child key is not in the properties
	// (not a “direct” match has been entered), we just return the current properties and let
	// VS Code figure out the fuzzy matching.
	if (!childKey || !childKeyInProperties) {
		return properties
	}

	const childDefinition = properties[childKey]

	if (typeof childDefinition === 'boolean') {
		return
	}

	const childProperties = childDefinition.properties

	if (!childProperties) {
		return
	}

	return traverseSchema({ properties: childProperties, path: childPath, token })
}

function getItemType(definition: JSONSchema7Definition): string | undefined {
	if (typeof definition === 'boolean') {
		return
	}

	let type: string | undefined

	if (typeof definition.type === 'string') {
		type = definition.type
	}

	if (Array.isArray(definition.type)) {
		type = definition.type.join(' | ')
	}

	if (!type) {
		return
	}

	return `(property) ${type}`
}

function getItemDescription(definition: JSONSchema7Definition): vscode.MarkdownString | undefined {
	if (typeof definition === 'boolean') {
		return
	}

	const description: string[] = []

	if (definition.description) {
		description.push(definition.description)
	}

	if (definition.format) {
		description.push(`Format: \`${definition.format}\``)
	}

	if (definition.default) {
		description.push(`Default: \`${definition.default}\``)
	}

	if (definition.enum) {
		description.push(`Enum: ${definition.enum.map((item) => `\`${item}\``).join(', ')}`)
	}

	if (!description.length) {
		return
	}

	return new vscode.MarkdownString(description.join('\n\n'))
}

function getItemCommitCharacter(definition: JSONSchema7Definition): string[] | undefined {
	const commitCharacters: string[] = ['|']

	if (typeof definition === 'boolean') {
		return commitCharacters
	}

	if (
		(typeof definition.type === 'string' && ['object', 'array'].includes(definition.type)) ||
		(Array.isArray(definition.type) &&
			(definition.type.includes('object') || definition.type.includes('array')))
	) {
		commitCharacters.push('.')
	}

	return commitCharacters
}

type ProvideCompletionItems = vscode.CompletionItemProvider['provideCompletionItems']
const provideCompletionItems: ProvideCompletionItems = function (document, position, token) {
	const componentPath = path.dirname(document.uri.path)
	const project = getProject(document.uri)
	const schema = project?.schemas.find((schema) => schema.componentURI.path === componentPath)

	if (!schema) {
		return
	}

	let properties = schema.content.properties

	const linePrefix = document.lineAt(position).text.slice(0, position.character)
	const objectPath = linePrefix.match(OBJECT_PATH_PATTERN)?.[0]

	if (objectPath) {
		const normalizedObjectPath = objectPath.endsWith('.') ? objectPath.slice(0, -1) : objectPath
		const path = normalizedObjectPath.split('.')
		properties = traverseSchema({ properties, path, token })
	}

	if (!properties) {
		return
	}

	const completionItems: CompletionItem[] = []

	for (const [key, definition] of Object.entries(properties)) {
		if (token.isCancellationRequested) {
			break
		}

		const item: CompletionItem = new vscode.CompletionItem(key)

		item.kind = vscode.CompletionItemKind.Variable
		item.commitCharacters = getItemCommitCharacter(definition)
		item.definition = definition

		completionItems.push(item)
	}

	return completionItems
}

type ResolveCompletionItem = vscode.CompletionItemProvider['resolveCompletionItem']
const resolveCompletionItem: ResolveCompletionItem = function (item: CompletionItem) {
	if (!item.definition) {
		return
	}

	item.detail = getItemType(item.definition)
	item.documentation = getItemDescription(item.definition)

	return item
}

const provider: vscode.CompletionItemProvider = {
	provideCompletionItems,
	resolveCompletionItem,
}

export function completionTemplate() {
	return vscode.languages.registerCompletionItemProvider(selector, provider, '.')
}
