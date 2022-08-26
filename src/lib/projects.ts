import { clearRequireCache } from '../utils/clear-require-cache'
import { MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB, DEFAULT_MIYAGI_CONFIG } from '../constants'
import { outputChannel } from './output-channel'
import { Project } from '../types'
import deepmerge from 'deepmerge'
import vscode from 'vscode'

interface ProjectOption extends vscode.QuickPickItem {
	value: Project
}

type GetProjectListOptions = {
  refresh?: boolean
}

let projects: Project[]

async function getProjectInfo (configURI: vscode.Uri): Promise<Project | undefined> {
	try {
		clearRequireCache(configURI.path)

		const uri = vscode.Uri.joinPath(configURI, '..')
		const config = deepmerge(DEFAULT_MIYAGI_CONFIG, require(configURI.path))

		return { uri, config }
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

	const configURIs = await vscode.workspace.findFiles(MIYAGI_CONFIG_GLOB, EXCLUDE_GLOB)
	projects = []

	for (const configURI of configURIs) {
		const projectInfo = await getProjectInfo(configURI)

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
