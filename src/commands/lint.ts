import path from 'node:path'

import semver from 'semver'
import { type Uri, window } from 'vscode'

import { outputChannel } from '../lib/output-channel.ts'
import { getProject } from '../lib/projects.ts'
import { runMiyagi } from '../lib/run.ts'
import { selectProject } from '../lib/select-project.ts'

function lintComponent(uri: Uri) {
	const project = getProject(uri)

	if (!project) return

	const cwd = project.uri.path
	const componentsFolder = project.config.components.folder
	const componentPath = semver.gte(project.version, '4.0.0-rc')
		? path.relative(cwd, uri.path)
		: path.relative(path.join(cwd, componentsFolder), uri.path)

	if (!uri.path.includes(componentsFolder)) {
		window.showWarningMessage(`miyagi: Select a component in "${componentsFolder}"`)
		return
	}

	return runMiyagi({
		args: ['lint', componentPath],
		cwd,
	})
}

async function lintProject() {
	const project = await selectProject()

	if (!project) return

	const cwd = project.uri.path

	return runMiyagi({
		args: ['lint'],
		cwd,
	})
}

export async function lint(uri?: Uri) {
	let result

	if (uri) {
		result = lintComponent(uri)
	} else {
		result = await lintProject()
	}

	if (!result) return

	if (result.status === 0) {
		window.showInformationMessage('miyagi: Valid schemas and mock data')
	} else {
		window.showErrorMessage('miyagi: Invalid schemas or mock data')
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
