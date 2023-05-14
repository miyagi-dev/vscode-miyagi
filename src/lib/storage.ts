import vscode from 'vscode'

export let storage: vscode.Memento

export function setupStorage(context: vscode.ExtensionContext) {
	storage = context.workspaceState
}
