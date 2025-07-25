import {
	type DocumentLink,
	type DocumentLinkProvider,
	type DocumentSelector,
	languages,
	Range,
	type TextDocument,
} from 'vscode'

import { SCHEMA_GLOB } from '../constants.ts'
import { getProject } from './projects.ts'

interface DocumentLinkWithDocument extends DocumentLink {
	document: TextDocument
	id: string
}

const LINK_PATTERN = {
	yaml: /\$ref: ("|')?(?<reference>.+)\1/g,
	json: /"\$ref": ?"(?<reference>.+?)"/g,
} as const

const selector: DocumentSelector = { pattern: SCHEMA_GLOB }

type ProvideDocumentLinks = DocumentLinkProvider['provideDocumentLinks']
const provideDocumentLinks: ProvideDocumentLinks = function (document, token) {
	const project = getProject(document.uri)
	const content = document.getText()

	if (!project) return
	if (!content.trim()) return

	const extension = project.config.files.schema.extension
	const matches = content.matchAll(LINK_PATTERN[extension])
	const links: DocumentLinkWithDocument[] = []

	for (const match of matches) {
		if (token.isCancellationRequested) break

		const reference = match.groups?.reference
		const start = match.index

		if (!reference || start === undefined) continue

		const contentStart = start + match[0].indexOf(reference)
		const contentEnd = contentStart + reference.length

		const [id] = reference.split('#')
		const range = new Range(document.positionAt(contentStart), document.positionAt(contentEnd))

		links.push({ range, document, id })
	}

	return links
}

type ResolveDocumentLink = DocumentLinkProvider['resolveDocumentLink']
const resolveDocumentLink: ResolveDocumentLink = async function (link: DocumentLinkWithDocument) {
	const project = getProject(link.document.uri)
	const id = link.id

	if (project) {
		link.target = project.schemas.find((schema) => schema.id === id)?.uri
	}

	return link
}

const provider: DocumentLinkProvider = {
	provideDocumentLinks,
	resolveDocumentLink,
}

export function documentLinksSchema() {
	return languages.registerDocumentLinkProvider(selector, provider)
}
