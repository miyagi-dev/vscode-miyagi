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
	const componentsFolder = project.config.components.folder

	let parentFolder

	if (activePath.path.includes(componentsFolder) && !activePath.path.endsWith(componentsFolder)) {
		parentFolder = path.relative(path.join(cwd, componentsFolder), activePath.path) + '/'
	}

	const componentPath = await vscode.window.showInputBox({
		title: 'miyagi: Component path and name',
		value: parentFolder,
		valueSelection: [-1, -1],
		placeHolder: '<componentFolder>/<componentName>'
	})

	if (!componentPath) {
		return
	}

	return {
		cwd,
		path: path.join(componentsFolder, componentPath)
	}
}
