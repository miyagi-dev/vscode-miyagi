import path from 'node:path'

import {
	type DocumentLink,
	type DocumentLinkProvider,
	type DocumentSelector,
	languages,
	Range,
	Uri,
} from 'vscode'

import { TWIG_GLOB } from '../constants.ts'
import { getProject } from './projects.ts'

type EXTENSIONS = 'twig'

const LINK_PATTERN = {
	twig: /("|')(?<namespace>@[a-z0-9-_]+)\/(?<filename>.+?)\1/gi,
} as const

const selector: DocumentSelector = [{ pattern: TWIG_GLOB }]

type ProvideDocumentLinks = DocumentLinkProvider['provideDocumentLinks']
const provideDocumentLinks: ProvideDocumentLinks = function (document, token) {
	const project = getProject(document.uri)
	const content = document.getText()

	if (!project) return
	if (!content.trim()) return

	const namespaces = project.config.namespaces

	if (!namespaces) return

	const extension = path.extname(document.uri.path).slice(1) as EXTENSIONS
	const matches = content.matchAll(LINK_PATTERN[extension])
	const links: DocumentLink[] = []

	for (const match of matches) {
		if (token.isCancellationRequested) break

		const start = match.index
		const namespace = match.groups?.namespace
		const filename = match.groups?.filename

		if (!namespace || !filename || start === undefined) continue

		const namespacePath = namespaces[namespace]

		if (!namespacePath) continue

		const contentStart = start + 1
		const contentEnd = start + match[0].length - 1

		const range = new Range(document.positionAt(contentStart), document.positionAt(contentEnd))
		const target = Uri.joinPath(project.uri, namespacePath, filename)

		links.push({ range, target })
	}

	return links
}

const provider: DocumentLinkProvider = {
	provideDocumentLinks,
}

export function documentLinksTemplate() {
	return languages.registerDocumentLinkProvider(selector, provider)
}
