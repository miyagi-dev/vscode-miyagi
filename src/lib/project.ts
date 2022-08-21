import { clearRequireCache } from '../utils/clear-require-cache'
import { loadSchemas, Schema } from './load-schemas'
import { MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB } from '../constants'
import { outputChannel } from './output-channel'
import deepmerge from 'deepmerge'
import vscode from 'vscode'

interface MiyagiConfig {
	components: {
		folder: string
	}
	files: {
		schema: {
			name: string
			extension: 'json' | 'yaml'
		}
		mocks: {
			name: string
			extension: 'json' | 'yaml'
		}
	}
	engine?: {
		name?: string
		options?: {
			namespaces?: {
				[key: string]: string | undefined
			}
		}
	}
}

export interface Project {
  uri: vscode.Uri
  config: MiyagiConfig
	schemas: Schema[]
}

interface ProjectOption extends vscode.QuickPickItem {
	value: Project
}

type GetProjectListOptions = {
  refresh?: boolean
}

const DEFAULT_CONFIG: MiyagiConfig = {
	components: {
		folder: 'src'
	},
	files: {
		schema: {
			name: 'schema',
			extension: 'json'
		},
		mocks: {
			name: 'mocks',
			extension: 'json'
		}
	}
}

let projects: Project[]

async function getProjectInfo (projectURI: vscode.Uri): Promise<Project | undefined> {
	try {
		clearRequireCache(projectURI.path)

		const uri = vscode.Uri.joinPath(projectURI, '..')
		const config = deepmerge(DEFAULT_CONFIG, require(projectURI.path))
		const schemas = await loadSchemas(uri)

		return { uri, config, schemas }
	} catch (error) {
		outputChannel.appendLine(String(error))

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

	const projectURIs = await vscode.workspace.findFiles(MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB)
	projects = []

	for (const projectURI of projectURIs) {
		const projectInfo = await getProjectInfo(projectURI)

		if (projectInfo) {
			projects.push(projectInfo)
		}
	}

	return projects
}

export function getProject (uri: vscode.Uri) {
	return projects.find(project => uri.path.startsWith(project.uri.path))
}

export async function selectProject () {
	const projectList = await getProjectList()

	if (projectList.length === 1) {
		return projectList[0]
	}

	const projectOptions: ProjectOption[] = projectList.map(project => ({
		label: project.uri.path,
		value: project
	}))

	const projectOption = await vscode.window.showQuickPick(projectOptions, {
		title: 'miyagi: Select project'
	})

	if (!projectOption) {
		return
	}

	return projectOption.value
}
