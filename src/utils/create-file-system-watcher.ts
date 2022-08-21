import * as vscode from 'vscode'

export function createFileSystemWatcher (glob: vscode.GlobPattern, callback: ((event: vscode.Uri) => any)) {
	const watcher = vscode.workspace.createFileSystemWatcher(glob)

	watcher.onDidCreate(callback)
	watcher.onDidChange(callback)
	watcher.onDidDelete(callback)

	return watcher
}
