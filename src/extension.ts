import vscode from 'vscode'

import { lint } from './commands/lint'
import { newComponent } from './commands/new-component'
import { MIYAGI_CONFIG_GLOB, SCHEMA_GLOB } from './constants'
import { completionTemplate } from './lib/completion-template'
import { ContextKey } from './lib/context-key'
import { documentLinksMocks } from './lib/document-links-mocks'
import { documentLinksSchema } from './lib/document-links-schema'
import { documentLinksTemplate } from './lib/document-links-template'
import { getProjectList, reloadSchemas } from './lib/projects'
import { setupStorage } from './lib/storage'
import { createFileSystemWatcher } from './utils/create-file-system-watcher'

async function queryProjects (contextHasMiyagi: ContextKey) {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)
}

export async function activate (context: vscode.ExtensionContext) {
	setupStorage(context)

	const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
	const reload = () => queryProjects(contextHasMiyagi)

	// Initial project loading.
	await reload()

	// Events
	const eventWorkspaceFolders = vscode.workspace.onDidChangeWorkspaceFolders(reload)

	// Watchers
	const watcherMiyagiConfig = createFileSystemWatcher(MIYAGI_CONFIG_GLOB, reload)
	const watcherSchema = createFileSystemWatcher(SCHEMA_GLOB, reloadSchemas)

	// Commands
	const commandNewComponent = vscode.commands.registerCommand('miyagi.newComponent', newComponent)
	const commandLintComponent = vscode.commands.registerCommand('miyagi.lintComponent', lint)
	const commandLintAllComponents = vscode.commands.registerCommand('miyagi.lintAllComponents', lint)
	const commandReload = vscode.commands.registerCommand('miyagi.reload', reload)

	// Providers
	const providerDocumentLinksMocks = documentLinksMocks()
	const providerDocumentLinksSchema = documentLinksSchema()
	const providerDocumentLinksTemplate = documentLinksTemplate()
	const providerCompletionTemplate = completionTemplate()

	context.subscriptions.push(
		eventWorkspaceFolders,
		watcherMiyagiConfig,
		watcherSchema,
		commandNewComponent,
		commandLintComponent,
		commandLintAllComponents,
		commandReload,
		providerDocumentLinksMocks,
		providerDocumentLinksSchema,
		providerDocumentLinksTemplate,
		providerCompletionTemplate
	)
}

export function deactivate () {}
