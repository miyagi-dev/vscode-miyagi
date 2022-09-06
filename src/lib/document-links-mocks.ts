import path from 'node:path'

import vscode from 'vscode'

import { MOCKS_GLOB } from '../constants'
import { getProject } from './projects'

type TYPES = 'ref' | 'tpl'

const LINK_PATTERN = {
	yaml: /\$(?<type>ref|tpl): (?<reference>.+)/g,
	json: /"\$(?<type>ref|tpl)": ?"(?<reference>.+?)"/g
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

	const filenames = {
		ref: project.config.files.mocks.name,
		tpl: project.config.files.templates.name
	}

	const extensions = {
		ref: project.config.files.mocks.extension,
		tpl: project.config.files.templates.extension
	}

	const matches = content.matchAll(LINK_PATTERN[project.config.files.mocks.extension])
	const links: vscode.DocumentLink[] = []

	for (const match of matches) {
		if (token.isCancellationRequested) {
			break
		}

		const reference = match.groups?.reference
		const type = match.groups?.type as TYPES | undefined
		const start = match.index

		if (!reference || !type || start === undefined) {
			continue
		}

		const contentStart = start + match[0].indexOf(reference)
		const contentEnd = contentStart + reference.length
		const [componentPath] = reference.split('#')

		const range = new vscode.Range(
			document.positionAt(contentStart),
			document.positionAt(contentEnd)
		)

		const filename = filenames[type].replace('<component>', path.basename(componentPath))
		const extension = extensions[type]

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
