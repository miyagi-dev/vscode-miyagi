import { getProject } from './projects'
import { TWIG_GLOB } from '../constants'
import path from 'node:path'
import vscode from 'vscode'

type EXTENSIONS = 'twig'

const LINK_PATTERN = {
	twig: /("|')@(?<namespace>[a-z0-9-_]+)\/(?<filename>.+?)\1/gi
} as const

const selector: vscode.DocumentSelector = [
	{ pattern: TWIG_GLOB }
]

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

	if (project.config.engine?.name !== 'twig') {
		return
	}

	if (!project.config.engine?.options?.namespaces) {
		return
	}

	const extension = path.extname(document.uri.path).slice(1) as EXTENSIONS
	const matches = content.matchAll(LINK_PATTERN[extension])
	const links: vscode.DocumentLink[] = []

	for (const match of matches) {
		if (token.isCancellationRequested) {
			break
		}

		const start = match.index
		const namespace = match.groups?.namespace
		const filename = match.groups?.filename

		if (!namespace || !filename || start === undefined) {
			continue
		}

		const namespacePath = project.config.engine.options.namespaces[namespace]

		if (!namespacePath) {
			continue
		}

		const contentStart = start + 1
		const contentEnd = start + match[0].length - 1

		const range = new vscode.Range(
			document.positionAt(contentStart),
			document.positionAt(contentEnd)
		)

		const target = vscode.Uri.joinPath(
			project.uri,
			namespacePath,
			filename
		)

		links.push({ range, target })
	}

	return links
}

const provider: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}

export function documentLinksTemplate () {
	return vscode.languages.registerDocumentLinkProvider(selector, provider)
}
