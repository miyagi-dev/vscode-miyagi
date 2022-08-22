import { getProject } from './project'
import { MOCKS_GLOB } from '../constants'
import vscode from 'vscode'

const LINK_PATTERN = {
	yaml: /\$(?:ref|tpl): (?<reference>.+)/g,
	json: /"\$(?:ref|tpl)": ?"(?<reference>.+?)"/g
} as const

const selector: vscode.DocumentSelector = { pattern: MOCKS_GLOB }

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

	const filename = project.config.files.mocks.name
	const extension = project.config.files.mocks.extension
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
		const [componentPath] = reference.split('#')

		const range = new vscode.Range(
			document.positionAt(contentStart),
			document.positionAt(contentEnd)
		)

		const target = vscode.Uri.joinPath(
			project.uri,
			project.config.components.folder,
			componentPath,
			`${filename}.${extension}`
		)

		links.push({ range, target })
	}

	return links
}

const provider: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}

export function documentLinksMocks () {
	return vscode.languages.registerDocumentLinkProvider(selector, provider)
}
