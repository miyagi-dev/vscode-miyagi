import path from 'node:path'

import vscode from 'vscode'

import { outputChannel } from '../lib/output-channel'
import { getProject } from '../lib/projects'
import { runMiyagi } from '../lib/run'

export function generateMocks (uri?: vscode.Uri) {
	if (!uri) {
		return
	}

	const project = getProject(uri)

	if (!project) {
		return
	}

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder
	const componentPath = path.relative(cwd, uri.path)

	if (!uri.path.includes(componentsFolder)) {
		vscode.window.showWarningMessage(`miyagi: Select a component in "${componentsFolder}"`)
		return
	}

	const result = runMiyagi({
		args: ['mocks', componentPath],
		cwd,
	})

	if (result.status !== 0) {
		vscode.window.showErrorMessage('miyagi: Error generating mock')
	}

	const stderr = result?.stderr.toString()

	if (stderr) {
		outputChannel.appendLine(stderr)
		outputChannel.show()
	}
}

export const generateMocksCompatibility = '3.3.2'
