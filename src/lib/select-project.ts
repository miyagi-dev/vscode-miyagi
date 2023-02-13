import vscode from 'vscode'

import { Project } from '../types'
import { getProjectList } from './projects'

interface ProjectOption extends vscode.QuickPickItem {
	value: Project
}

export async function selectProject () {
	const projectList = await getProjectList()

	if (projectList.length === 1) {
		return projectList[0]
	}

	const projectOptions: ProjectOption[] = projectList.map(project => ({
		label: project.uri.path,
		value: project,
	}))

	const projectOption = await vscode.window.showQuickPick(projectOptions, {
		title: 'miyagi: Select project',
	})

	if (!projectOption) {
		return
	}

	return projectOption.value
}
