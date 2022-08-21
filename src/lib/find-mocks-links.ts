import { FindLinksOptions } from './document-links'
import vscode from 'vscode'

const LINK_PATTERN = {
	yaml: /\$(?:ref|tpl): (?<reference>.+)/g,
	json: /"\$(?:ref|tpl)": ?"(?<reference>.+?)"/g
} as const

export function findMocksLinks ({ content, document, project, token }: FindLinksOptions) {
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
