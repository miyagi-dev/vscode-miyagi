import { getMiyagiProject } from '../lib/get-miyagi-project'
import { getWorkspaceFolder } from '../lib/get-workspace-folder'
import { miyagiOutputChannel } from '../lib/output-channel'
import { runMiyagi } from '../lib/run'
import * as path from 'node:path'
import * as vscode from 'vscode'

async function lintComponent (uri: vscode.Uri) {
	const miyagiProject = await getMiyagiProject()

	if (!miyagiProject) {
		return
	}

	const cwd = miyagiProject.cwd
	const componentsFolder = miyagiProject.config.components.folder
	const componentPath = path.relative(path.join(cwd, componentsFolder), uri.path)

	return runMiyagi({
		args: ['lint', componentPath],
		cwd
	})
}

async function lintWorkspace () {
	const workspaceFolder = await getWorkspaceFolder()

	if (!workspaceFolder) {
		return
	}

	const miyagiProject = await getMiyagiProject()

	if (!miyagiProject) {
		return
	}

	const cwd = miyagiProject.cwd

	return runMiyagi({
		args: ['lint'],
		cwd
	})
}

export async function lint (uri?: vscode.Uri) {
	let result

	if (uri) {
		result = await lintComponent(uri)
	} else {
		result = await lintWorkspace()
	}

	if (result?.status === 0) {
		vscode.window.showInformationMessage('miyagi: Valid schemas and mock data')
	} else {
		vscode.window.showErrorMessage('miyagi: Invalid schemas or mock data')
	}

	const stdout = result?.stdout.toString()
	const stderr = result?.stderr.toString()

	if (stdout) {
		miyagiOutputChannel.appendLine(stdout)
	}

	if (stderr) {
		miyagiOutputChannel.appendLine(stderr)
		miyagiOutputChannel.show()
	}
}
