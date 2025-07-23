import { Uri, window, workspace } from 'vscode'

import { EXCLUDE_GLOB, MIYAGI_CONFIG_GLOB } from '../constants.ts'
import type { MiyagiConfig3, MiyagiConfig4, Project } from '../types.ts'
import { getModule } from '../utils/get-module.ts'
import { isPathIgnored } from '../utils/is-path-ignored.ts'
import { normalizeMiyagiConfig } from '../utils/normalize-miyagi-config.ts'
import { getMiyagiVersion } from './get-miyagi-version.ts'
import { loadSchemas } from './load-schemas.ts'
import { outputChannel } from './output-channel.ts'

type GetProjectListOptions = {
	refresh?: boolean
}

let projects: Project[]

async function getProjectInfo(configURI: Uri): Promise<Project | undefined> {
	try {
		const uri = Uri.joinPath(configURI, '..')
		const version = getMiyagiVersion(uri) ?? '0.0.0'

		const projectConfig = (await getModule({ modulePath: configURI.path, cwd: uri.path })) as
			| { default: MiyagiConfig3 }
			| MiyagiConfig4

		const config = normalizeMiyagiConfig({
			config: 'default' in projectConfig ? projectConfig.default : projectConfig,
			cwd: uri.path,
		})

		const schemas = await loadSchemas(uri)

		return { uri, version, config, schemas }
	} catch (error) {
		outputChannel.appendLine(String(error))

		window
			.showErrorMessage('miyagi: Error loading configuration', 'Show Details')
			.then((action) => action === 'Show Details' && outputChannel.show())

		return undefined
	}
}

export async function getProjectList({ refresh }: GetProjectListOptions = {}) {
	if (projects && !refresh) {
		return projects
	}

	const configURIs = await workspace.findFiles(MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB)
	projects = []

	for (const configURI of configURIs) {
		const isIgnored = isPathIgnored(configURI)

		if (isIgnored) continue

		const projectInfo = await getProjectInfo(configURI)

		if (!projectInfo) continue

		projects.push(projectInfo)
	}

	return projects
}

export function getProject(uri: Uri) {
	return projects.find((project) => uri.path.startsWith(project.uri.path))
}

export async function reloadSchemas() {
	for (const project of projects) {
		project.schemas = await loadSchemas(project.uri)
	}
}
