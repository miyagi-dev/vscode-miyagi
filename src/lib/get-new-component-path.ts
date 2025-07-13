import path from 'node:path'

import { Uri, window } from 'vscode'

import { getProject } from './projects.ts'
import { selectProject } from './select-project.ts'

export async function getNewComponentPath(uri?: Uri) {
	let activePath: Uri | undefined

	if (uri) {
		activePath = uri
	} else if (window.activeTextEditor) {
		activePath = Uri.joinPath(window.activeTextEditor.document.uri, '..')
	} else {
		activePath = (await selectProject())?.uri
	}

	if (!activePath) {
		return
	}

	const project = getProject(activePath)

	if (!project) {
		window.showErrorMessage('miyagi: Error getting active project')
		return
	}

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder

	if (!activePath.path.includes(componentsFolder)) {
		window.showWarningMessage(`miyagi: Select a location in "${componentsFolder}"`)
		return
	}

	let parentFolder: string | undefined

	if (!activePath.path.endsWith(componentsFolder)) {
		parentFolder = path.relative(path.join(cwd, componentsFolder), activePath.path) + '/'
	}

	const componentPath = await window.showInputBox({
		title: 'miyagi: Component path and name',
		value: parentFolder,
		valueSelection: [-1, -1],
		placeHolder: '<componentFolder>/<componentName>',
	})

	if (!componentPath) {
		return
	}

	return {
		cwd,
		path: path.join(componentsFolder, componentPath),
	}
}
