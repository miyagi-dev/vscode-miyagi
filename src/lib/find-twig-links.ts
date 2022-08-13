import { FindLinksOptions } from './document-links'
import vscode from 'vscode'

const LINK_PATTERN = /("|')@(?<namespace>[a-z0-9-_]+)\/(?<filename>.+?)("|')/g

export function findTwigLinks ({ content, document, project, token }: FindLinksOptions) {
	if (project.config.engine?.name !== 'twig') {
		return
	}

	if (!project.config.engine?.options?.namespaces) {
		return
	}

	const matches = content.matchAll(LINK_PATTERN)
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
