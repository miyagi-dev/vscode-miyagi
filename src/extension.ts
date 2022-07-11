import { ContextKey } from './lib/context-key'
import { getMiyagiProject } from './lib/get-miyagi-project'
import { lint } from './commands/lint'
import { newComponent } from './commands/new-component'
import { setupStorage } from './lib/storage'
import * as vscode from 'vscode'

async function setContext (contextHasMiyagi: ContextKey) {
	const miyagiProject = await getMiyagiProject()
	contextHasMiyagi.set(!!miyagiProject)
}

export async function activate (context: vscode.ExtensionContext) {
	setupStorage(context)

	const commandNewComponent = vscode.commands.registerCommand('miyagi.newComponent', newComponent)
	const commandLint = vscode.commands.registerCommand('miyagi.lint', lint)

	const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
	await setContext(contextHasMiyagi)

	const onChangeWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		setContext(contextHasMiyagi)
	})

	context.subscriptions.push(commandNewComponent, commandLint, onChangeWorkspaceFolders)
}

export function deactivate () {}
