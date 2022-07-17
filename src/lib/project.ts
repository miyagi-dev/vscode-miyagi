import { isDefined } from '../utils/types'
import { MIYAGI_CONFIG_GLOB } from '../constants'
import * as vscode from 'vscode'

interface MiyagiConfig {
	components: {
		folder: string
	}
}

interface Project {
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
		const config: MiyagiConfig = require(projectURI.path)
		return { uri, config }
	} catch {
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
