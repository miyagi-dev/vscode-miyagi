import { isDefined } from '../utils/types'
import { MIYAGI_CONFIG_GLOB } from '../constants'
import { outputChannel } from './output-channel'
import vscode from 'vscode'
import deepmerge from 'deepmerge'

interface MiyagiConfig {
	components: {
		folder: string
	}
}

const DEFAULT_CONFIG: MiyagiConfig = {
	components: {
		folder: 'src'
	}
}

export interface Project {
  uri: vscode.Uri
  config: MiyagiConfig
}

interface GetProjectListOptions {
  refresh?: boolean
}

interface ProjectOption extends vscode.QuickPickItem {
	value: Project
}

let projects: Project[]

function getProjectInfo (projectURI: vscode.Uri): Project | undefined {
	try {
		delete require.cache[projectURI.path]

		const uri = vscode.Uri.joinPath(projectURI, '..')
		const config = deepmerge(DEFAULT_CONFIG, require(projectURI.path))

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

	const projectURIs = await vscode.workspace.findFiles(MIYAGI_CONFIG_GLOB)
	projects = projectURIs.map(getProjectInfo).filter(isDefined)

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
