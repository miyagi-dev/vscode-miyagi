import * as vscode from 'vscode'

export async function getWorkspaceFolder () {
	const workspaceFolders = vscode.workspace.workspaceFolders
	let workspaceFolder: vscode.WorkspaceFolder | undefined

	if (workspaceFolders?.length === 1) {
		workspaceFolder = workspaceFolders[0]
	} else {
		workspaceFolder = await vscode.window.showWorkspaceFolderPick()
	}

	return workspaceFolder
}
