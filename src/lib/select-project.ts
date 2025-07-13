import { type QuickPickItem, window } from 'vscode'

import type { Project } from '../types.ts'
import { getProjectList } from './projects.ts'

interface ProjectOption extends QuickPickItem {
	value: Project
}

export async function selectProject() {
	const projectList = await getProjectList()

	if (projectList.length === 1) {
		return projectList[0]
	}

	const projectOptions: ProjectOption[] = projectList.map((project) => ({
		label: project.uri.path,
		value: project,
	}))

	const projectOption = await window.showQuickPick(projectOptions, {
		title: 'miyagi: Select project',
	})

	if (!projectOption) {
		return
	}

	return projectOption.value
}
