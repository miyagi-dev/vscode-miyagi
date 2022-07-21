import { ContextKey } from './lib/context-key'
import { documentLinks } from './lib/document-links'
import { getProjectList } from './lib/project'
import { lint } from './commands/lint'
import { MIYAGI_CONFIG_GLOB } from './constants'
import { newComponent } from './commands/new-component'
import { setupStorage } from './lib/storage'
import * as vscode from 'vscode'

async function setContext (contextHasMiyagi: ContextKey) {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)
}

export async function activate (context: vscode.ExtensionContext) {
	setupStorage(context)

	const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
	await setContext(contextHasMiyagi)

	const eventWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(() => setContext(contextHasMiyagi))

	const watcherMiyagiConfig = vscode.workspace.createFileSystemWatcher(MIYAGI_CONFIG_GLOB)
	watcherMiyagiConfig.onDidCreate(() => setContext(contextHasMiyagi))
	watcherMiyagiConfig.onDidChange(() => setContext(contextHasMiyagi))
	watcherMiyagiConfig.onDidDelete(() => setContext(contextHasMiyagi))

	const commandNewComponent = vscode.commands.registerCommand('miyagi.newComponent', newComponent)
	const commandLintComponent = vscode.commands.registerCommand('miyagi.lintComponent', lint)
	const commandLintAllComponents = vscode.commands.registerCommand('miyagi.lintAllComponents', lint)

	const providerYAMLLinks = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'yaml' }, documentLinks)
	const providerJSONLinks = vscode.languages.registerDocumentLinkProvider({ scheme: 'file', language: 'json' }, documentLinks)

	context.subscriptions.push(
		eventWorkspaceFolders,
		watcherMiyagiConfig,
		commandNewComponent,
		commandLintComponent,
		commandLintAllComponents,
		providerYAMLLinks,
		providerJSONLinks
	)
}

export function deactivate () {}
