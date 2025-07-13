import { spawnSync } from 'node:child_process'
import path from 'node:path'

import { type Uri, workspace } from 'vscode'

type SearchIgnoreOptions = {
	filePath: string
	cwd: string
	root: string
}

function searchIgnore({ filePath, cwd, root }: SearchIgnoreOptions): boolean {
	const result = spawnSync('git', ['check-ignore', filePath], { cwd })

	if (result.status === 0) {
		return true
	}

	if (result.status === 128) {
		return false
	}

	if (cwd === root) {
		return false
	}

	return searchIgnore({ filePath, cwd: path.dirname(cwd), root })
}

export function isPathIgnored(uri: Uri) {
	const folder = workspace.getWorkspaceFolder(uri)

	if (!folder) {
		return false
	}

	const filePath = uri.path
	const root = folder.uri.path
	const cwd = path.dirname(uri.path)

	return searchIgnore({ filePath, cwd, root })
}
