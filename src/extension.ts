import { ContextKey } from './lib/context-key'
import { createFileSystemWatcher } from './utils/create-file-system-watcher'
import { documentLinks, documentLinkFiles } from './lib/document-links'
import { getProjectList } from './lib/project'
import { lint } from './commands/lint'
import { MIYAGI_CONFIG_GLOB, SCHEMA_GLOB } from './constants'
import { newComponent } from './commands/new-component'
import { setupStorage } from './lib/storage'
import vscode from 'vscode'

async function queryProjects (contextHasMiyagi: ContextKey) {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)
}

export async function activate (context: vscode.ExtensionContext) {
	setupStorage(context)

	const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
	const reload = () => queryProjects(contextHasMiyagi)
	await queryProjects(contextHasMiyagi)

	// Events
	const eventWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(reload)

	// Watchers
	const watcherMiyagiConfig = createFileSystemWatcher(MIYAGI_CONFIG_GLOB, reload)
	const watcherSchema = createFileSystemWatcher(SCHEMA_GLOB, reload)

	// Commands
	const commandNewComponent = vscode.commands.registerCommand('miyagi.newComponent', newComponent)
	const commandLintComponent = vscode.commands.registerCommand('miyagi.lintComponent', lint)
	const commandLintAllComponents = vscode.commands.registerCommand('miyagi.lintAllComponents', lint)
	const commandReload = vscode.commands.registerCommand('miyagi.reload', reload)

	// Providers
	const providerDocumentLinks = vscode.languages.registerDocumentLinkProvider(documentLinkFiles, documentLinks)

	context.subscriptions.push(
		eventWorkspaceFolders,
		watcherMiyagiConfig,
		watcherSchema,
		commandNewComponent,
		commandLintComponent,
		commandLintAllComponents,
		commandReload,
		providerDocumentLinks
	)
}

export function deactivate () {}
