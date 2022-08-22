import { getProject } from './project'
import { SCHEMA_GLOB } from '../constants'
import vscode from 'vscode'

const LINK_PATTERN = {
	yaml: /\$ref: (?<reference>.+)/g,
	json: /"\$ref": ?"(?<reference>.+?)"/g
} as const

const selector: vscode.DocumentSelector = { pattern: SCHEMA_GLOB }

type ProvideDocumentLinksType = vscode.DocumentLinkProvider['provideDocumentLinks']
const provideDocumentLinks: ProvideDocumentLinksType = function (document, token) {
	const project = getProject(document.uri)
	const content = document.getText()

	if (!project) {
		return
	}

	if (!content.trim()) {
		return
	}

	const extension = project.config.files.schema.extension
	const matches = content.matchAll(LINK_PATTERN[extension])
	const links: vscode.DocumentLink[] = []

	for (const match of matches) {
		if (token.isCancellationRequested) {
			break
		}

		const reference = match.groups?.reference
		const start = match.index

		if (!reference || start === undefined) {
			continue
		}

		const contentStart = start + match[0].indexOf(reference)
		const contentEnd = contentStart + reference.length
		const [id] = reference.split('#')

		const range = new vscode.Range(
			document.positionAt(contentStart),
			document.positionAt(contentEnd)
		)

		const target = project.schemas.find(schema => schema.id === id)?.uri

		links.push({ range, target })
	}

	return links
}

const provider: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}

export function documentLinksSchema () {
	return vscode.languages.registerDocumentLinkProvider(selector, provider)
}
