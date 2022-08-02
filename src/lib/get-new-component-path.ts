import { getProject, selectProject } from './project'
import path from 'node:path'
import vscode from 'vscode'

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
		vscode.window.showErrorMessage('miyagi: Error getting active project')
		return
	}

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder

	if (!activePath.path.includes(componentsFolder)) {
		vscode.window.showWarningMessage(`miyagi: Select a location in "${componentsFolder}"`)
		return
	}

	let parentFolder: string | undefined

	if (!activePath.path.endsWith(componentsFolder)) {
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
