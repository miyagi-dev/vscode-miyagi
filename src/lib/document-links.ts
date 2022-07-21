import { getProject, Project } from './project'
import { includes } from '../utils/types'
import * as path from 'node:path'
import * as vscode from 'vscode'

const VALID_TYPES = ['mocks', 'schema'] as const
const VALID_EXTENSIONS = ['.yaml', '.json'] as const

const LINK_PATTERN = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'.yaml': /\$(?:ref|tpl): (?<reference>.+)/g,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'.json': /"\$(?:ref|tpl)": ?"(?<reference>.+)"/g
}

interface FindLinksOptions {
	content: string
	document: vscode.TextDocument
	project: Project
	type: (typeof VALID_TYPES)[number]
	extension: (typeof VALID_EXTENSIONS)[number]
	token: vscode.CancellationToken
}

function findLinks ({ content, document, project, type, extension, token }: FindLinksOptions) {
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
			type + extension
		)

		links.push({ range, target })
	}

	return links
}

function provideDocumentLinks (document: vscode.TextDocument, token: vscode.CancellationToken) {
	const project = getProject(document.uri)
	const content = document.getText()
	const extension = path.extname(document.uri.path)
	const type = path.basename(document.uri.path, extension)

	if (!project) {
		return
	}

	if (!content.trim()) {
		return
	}

	if (!includes(VALID_TYPES, type)) {
		return
	}

	if (!includes(VALID_EXTENSIONS, extension)) {
		return
	}

	return findLinks({ content, document, project, type, extension, token })
}

export const documentLinks: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}
