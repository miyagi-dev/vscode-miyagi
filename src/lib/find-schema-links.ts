import { FindLinksOptions } from './document-links'
import vscode from 'vscode'

const LINK_PATTERN = {
	yaml: /\$ref: (?<reference>.+)/g,
	json: /"\$ref": ?"(?<reference>.+?)"/g
} as const

export function findSchemaLinks ({ content, document, project, token }: FindLinksOptions) {
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
