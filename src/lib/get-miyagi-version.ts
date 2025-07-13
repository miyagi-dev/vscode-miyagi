import { type Uri } from 'vscode'

import { runMiyagi } from './run.ts'

export function getMiyagiVersion(projectURI: Uri): string | undefined {
	const result = runMiyagi({
		args: ['--version'],
		cwd: projectURI.path,
	})

	if (result.status !== 0) {
		return undefined
	}

	return result.stdout.toString() as string | undefined
}
