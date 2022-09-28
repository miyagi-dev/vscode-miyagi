import path from 'node:path'

import vscode from 'vscode'

import { outputChannel } from '../lib/output-channel'
import { getProject } from '../lib/projects'
import { runMiyagi } from '../lib/run'
import { selectProject } from '../lib/select-project'

function lintComponent (uri: vscode.Uri) {
	const project = getProject(uri)

	if (!project) {
		return
	}

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder
	const componentPath = path.relative(path.join(cwd, componentsFolder), uri.path)

	if (!uri.path.includes(componentsFolder)) {
		vscode.window.showWarningMessage(`miyagi: Select a component in "${componentsFolder}"`)
		return
	}

	return runMiyagi({
		args: ['lint', componentPath],
		cwd
	})
}

async function lintProject () {
	const project = await selectProject()

	if (!project) {
		return
	}

	const cwd = project.uri.path

	return runMiyagi({
		args: ['lint'],
		cwd
	})
}

export async function lint (uri?: vscode.Uri) {
	let result

	if (uri) {
		result = lintComponent(uri)
	} else {
		result = await lintProject()
	}

	if (!result) {
		return
	}

	if (result.status === 0) {
		vscode.window.showInformationMessage('miyagi: Valid schemas and mock data')
	} else {
		vscode.window.showErrorMessage('miyagi: Invalid schemas or mock data')
	}

	const stdout = result?.stdout.toString()
	const stderr = result?.stderr.toString()

	if (stdout) {
		outputChannel.appendLine(stdout)
	}

	if (stderr) {
		outputChannel.appendLine(stderr)
		outputChannel.show()
	}
}

export const lintCompatibility = '3.3.2'
