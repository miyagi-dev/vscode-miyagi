import deepmerge from 'deepmerge'
import vscode from 'vscode'

import { DEFAULT_MIYAGI_CONFIG, EXCLUDE_GLOB, MIYAGI_CONFIG_GLOB } from '../constants'
import { Project } from '../types'
import { clearRequireCache } from '../utils/clear-require-cache'
import { isPathIgnored } from '../utils/is-path-ignored'
import { getMiyagiVersion } from './get-miyagi-version'
import { loadSchemas } from './load-schemas'
import { outputChannel } from './output-channel'

type GetProjectListOptions = {
	refresh?: boolean
}

let projects: Project[]

async function getProjectInfo (configURI: vscode.Uri): Promise<Project | undefined> {
	try {
		clearRequireCache(configURI.path)

		const uri = vscode.Uri.joinPath(configURI, '..')
		const version = getMiyagiVersion(uri) ?? '0.0.0'
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const config = deepmerge(DEFAULT_MIYAGI_CONFIG, require(configURI.path))
		const schemas = await loadSchemas(uri)

		return { uri, version, config, schemas }
	} catch (error) {
		outputChannel.appendLine(String(error))

		// eslint-disable-next-line promise/catch-or-return
		vscode.window
			.showErrorMessage('miyagi: Error loading configuration', 'Show Details')
			.then(action => action === 'Show Details' && outputChannel.show())

		return undefined
	}
}

export async function getProjectList ({ refresh }: GetProjectListOptions = {}) {
	if (projects && !refresh) {
		return projects
	}

	const configURIs = await vscode.workspace.findFiles(MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB)
	projects = []

	for (const configURI of configURIs) {
		const isIgnored = isPathIgnored(configURI)

		if (isIgnored) {
			continue
		}

		const projectInfo = await getProjectInfo(configURI)

		if (!projectInfo) {
			continue
		}

		projects.push(projectInfo)
	}

	return projects
}

export function getProject (uri: vscode.Uri) {
	return projects.find(project => uri.path.startsWith(project.uri.path))
}

export async function reloadSchemas () {
	for (const project of projects) {
		project.schemas = await loadSchemas(project.uri)
	}
}
