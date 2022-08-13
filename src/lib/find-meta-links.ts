import { FindLinksOptions } from './document-links'
import path from 'node:path'
import vscode from 'vscode'

type EXTENSIONS = 'yaml' | 'json'
type TYPES = 'mocks' | 'schema'

const LINK_PATTERN = {
	yaml: /\$(?:ref|tpl): (?<reference>.+)/g,
	json: /"\$(?:ref|tpl)": ?"(?<reference>.+)"/g
} as const

export function findMetaLinks ({ content, document, project, token }: FindLinksOptions) {
	// The extensions and types are guaranteed by the DocumentSelector.
	const extension = path.extname(document.uri.path).slice(1) as EXTENSIONS
	const type = path.basename(document.uri.path, `.${extension}`) as TYPES

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
		const [filename] = reference.split('#')

		const range = new vscode.Range(
			document.positionAt(contentStart),
			document.positionAt(contentEnd)
		)

		const target = vscode.Uri.joinPath(
			project.uri,
			project.config.components.folder,
			filename,
			`${type}.${extension}`
		)

		links.push({ range, target })
	}

	return links
}
