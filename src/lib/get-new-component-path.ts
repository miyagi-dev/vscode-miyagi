import { getMiyagiProject } from './get-miyagi-project'
import { getWorkspaceFolder } from './get-workspace-folder'
import * as path from 'node:path'
import * as vscode from 'vscode'

export async function getNewComponentPath (uri?: vscode.Uri) {
	let activePath: vscode.Uri | undefined

	if (uri) {
		activePath = uri
	} else if (vscode.window.activeTextEditor) {
		activePath = vscode.window.activeTextEditor.document.uri
	} else {
		const workspaceFolder = await getWorkspaceFolder()
		activePath = workspaceFolder?.uri
	}

	if (!activePath) {
		return
	}

	const workspaceFolder = vscode.workspace.getWorkspaceFolder(activePath)

	if (!workspaceFolder) {
		return
	}

	const miyagiProject = await getMiyagiProject()

	if (!miyagiProject) {
		return
	}

	const parentPlaceholder = '<componentFolder>'
	const componentPlaceholder = '<componentName>'
	const cwd = miyagiProject.cwd
	const componentsFolder = miyagiProject.config.components.folder
	const parentFolder = uri
		? path.relative(path.join(cwd, componentsFolder), uri.path)
		: ''

	const componentPath = await vscode.window.showInputBox({
		title: 'miyagi: Component path and name',
		value: uri ? path.join(parentFolder, componentPlaceholder) : undefined,
		valueSelection: [parentFolder.length + 1, -1],
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
