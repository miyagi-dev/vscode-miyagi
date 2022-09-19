import vscode from 'vscode'

import { SCHEMA_GLOB } from '../constants'
import { getProject } from './projects'

interface DocumentLink extends vscode.DocumentLink {
	document: vscode.TextDocument
	id: string
}

const LINK_PATTERN = {
	yaml: /\$ref: (?<reference>.+)/g,
	json: /"\$ref": ?"(?<reference>.+?)"/g
} as const

const selector: vscode.DocumentSelector = { pattern: SCHEMA_GLOB }

type ProvideDocumentLinks = vscode.DocumentLinkProvider['provideDocumentLinks']
const provideDocumentLinks: ProvideDocumentLinks = function (document, token) {
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
	const links: DocumentLink[] = []

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

		links.push({ range, document, id })
	}

	return links
}

type ResolveDocumentLink = vscode.DocumentLinkProvider['resolveDocumentLink']
const resolveDocumentLink: ResolveDocumentLink = async function (link: DocumentLink) {
	const project = getProject(link.document.uri)
	const id = link.id

	if (project) {
		link.target = project.schemas.find(schema => schema.id === id)?.uri
	}

	return link
}

const provider: vscode.DocumentLinkProvider = {
	provideDocumentLinks,
	resolveDocumentLink
}

export function documentLinksSchema () {
	return vscode.languages.registerDocumentLinkProvider(selector, provider)
}
