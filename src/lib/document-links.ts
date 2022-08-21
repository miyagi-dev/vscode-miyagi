import { findMocksLinks } from './find-mocks-links'
import { findSchemaLinks } from './find-schema-links'
import { findTwigLinks } from './find-twig-links'
import { getProject, Project } from './project'
import { SCHEMA_GLOB, MOCKS_GLOB, TWIG_GLOB } from '../constants'
import path from 'node:path'
import vscode from 'vscode'

export type FindLinksOptions = {
	content: string
	document: vscode.TextDocument
	project: Project
	token: vscode.CancellationToken
}

type ProvideDocumentLinksType = vscode.DocumentLinkProvider['provideDocumentLinks']
const provideDocumentLinks: ProvideDocumentLinksType = function (document, token) {
	const project = getProject(document.uri)
	const content = document.getText()

	if (!project) {
		return
	}

	if (!content.trim()) {
		return
	}

	const filename = path.basename(document.uri.path)
	const extension = path.extname(document.uri.path).slice(1)

	if (filename === `${project.config.files.schema.name}.${project.config.files.schema.extension}`) {
		return findSchemaLinks({ content, document, project, token })
	}

	if (filename === `${project.config.files.mocks.name}.${project.config.files.mocks.extension}`) {
		return findMocksLinks({ content, document, project, token })
	}

	if (extension === 'twig') {
		return findTwigLinks({ content, document, project, token })
	}

	return undefined
}

export const documentLinks: vscode.DocumentLinkProvider = {
	provideDocumentLinks
}

export const documentLinkFiles: vscode.DocumentSelector = [
	{ pattern: SCHEMA_GLOB },
	{ pattern: MOCKS_GLOB },
	{ pattern: TWIG_GLOB }
] as const
