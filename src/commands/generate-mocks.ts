import path from 'node:path'

import { type Uri, window } from 'vscode'

import { outputChannel } from '../lib/output-channel.ts'
import { getProject } from '../lib/projects.ts'
import { runMiyagi } from '../lib/run.ts'

export function generateMocks(uri?: Uri) {
	if (!uri) return

	const project = getProject(uri)

	if (!project) return

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder
	const componentPath = path.relative(cwd, uri.path)

	if (!uri.path.includes(componentsFolder)) {
		window.showWarningMessage(`miyagi: Select a component in "${componentsFolder}"`)
		return
	}

	const result = runMiyagi({
		args: ['mocks', componentPath],
		cwd,
	})

	if (result.status !== 0) {
		window.showErrorMessage('miyagi: Error generating mock')
	}

	const stderr = result?.stderr.toString()

	if (stderr) {
		outputChannel.appendLine(stderr)
		outputChannel.show()
	}
}
