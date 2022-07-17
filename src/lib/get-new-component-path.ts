import { getProject, selectProject } from './project'
import * as path from 'node:path'
import * as vscode from 'vscode'

export async function getNewComponentPath (uri?: vscode.Uri) {
	let activePath: vscode.Uri | undefined

	if (uri) {
		activePath = uri
	} else if (vscode.window.activeTextEditor) {
		activePath = vscode.Uri.joinPath(vscode.window.activeTextEditor.document.uri, '..')
	} else {
		activePath = (await selectProject())?.uri
	}

	if (!activePath) {
		return
	}

	const project = getProject(activePath)

	if (!project) {
		return
	}

	const cwd = project.uri.path
	const parentPlaceholder = '<componentFolder>'
	const componentPlaceholder = '<componentName>'
	const componentsFolder = project.config.components.folder
	const activePathInComponentsFolder = activePath.path.includes(componentsFolder) &&
		!activePath.path.endsWith(componentsFolder)
	const parentFolder = activePathInComponentsFolder
		? path.relative(path.join(cwd, componentsFolder), activePath.path)
		: ''

	const componentPath = await vscode.window.showInputBox({
		title: 'miyagi: Component path and name',
		value: activePathInComponentsFolder
			? path.join(parentFolder, componentPlaceholder)
			: undefined,
		valueSelection: activePathInComponentsFolder
			? [parentFolder.length + 1, -1]
			: [0, 0],
		placeHolder: `${parentPlaceholder}/${componentPlaceholder}`
	})

	if (!componentPath) {
		return
	}

	return {
		cwd,
		path: path.join(componentsFolder, componentPath)
	}
}
