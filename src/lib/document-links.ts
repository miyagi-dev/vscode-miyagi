import { findMetaLinks } from './find-meta-links'
import { findTwigLinks } from './find-twig-links'
import { getProject, Project } from './project'
import path from 'node:path'
import vscode from 'vscode'

type EXTENSIONS = 'yaml' | 'json' | 'twig'

export type FindLinksOptions = {
	content: string
	document: vscode.TextDocument
	project: Project
	token: vscode.CancellationToken
}

const FIND_LINKS_MAP = {
	yaml: findMetaLinks,
	json: findMetaLinks,
	twig: findTwigLinks
} as const

function provideDocumentLinks (document: vscode.TextDocument, token: vscode.CancellationToken) {
	const project = getProject(document.uri)
	const content = document.getText()

	if (!project) {
		return
	}

	if (!content.trim()) {
		return
	}

	// The extensions are guaranteed by the DocumentSelector.
	const extension = path.extname(document.uri.path).slice(1) as EXTENSIONS

	return FIND_LINKS_MAP[extension]({ content, document, project, token })
}

export const documentLinks: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}
