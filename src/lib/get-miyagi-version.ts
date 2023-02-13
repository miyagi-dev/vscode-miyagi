import vscode from 'vscode'

import { SemanticVersionString } from '../types'
import { runMiyagi } from './run'

export function getMiyagiVersion (projectURI: vscode.Uri): SemanticVersionString | undefined {
	const result = runMiyagi({
		args: ['--version'],
		cwd: projectURI.path,
	})

	if (result.status !== 0) {
		return undefined
	}

	return result.stdout.toString() as SemanticVersionString | undefined
}
