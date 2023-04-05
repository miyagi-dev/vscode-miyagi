import semver from 'semver'
import vscode from 'vscode'

import { generateMocks, generateMocksCompatibility } from './commands/generate-mocks'
import { lint, lintCompatibility } from './commands/lint'
import { newComponent, newComponentCompatibility } from './commands/new-component'
import { MIYAGI_CONFIG_GLOB, SCHEMA_GLOB } from './constants'
import { completionTemplate } from './lib/completion-template'
import { ContextKey } from './lib/context-key'
import { documentLinksMocks } from './lib/document-links-mocks'
import { documentLinksSchema } from './lib/document-links-schema'
import { documentLinksTemplate } from './lib/document-links-template'
import { getProjectList, reloadSchemas } from './lib/projects'
import { setupStorage } from './lib/storage'
import { createFileSystemWatcher } from './utils/create-file-system-watcher'

const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
const contextCanLint = new ContextKey('miyagi.canLint')
const contextCanNewComponent = new ContextKey('miyagi.canNewComponent')
const contextCanGenerateMocks = new ContextKey('miyagi.canGenerateMocks')

async function reload () {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)

	const canLint = projectList.every(project => semver.gte(project.version, lintCompatibility))
	contextCanLint.set(canLint)

	const canNewComponent = projectList.every(project => semver.gte(project.version, newComponentCompatibility))
	contextCanNewComponent.set(canNewComponent)

	const canGenerateMocks = projectList.every(project => semver.gte(project.version, generateMocksCompatibility))
	contextCanGenerateMocks.set(canGenerateMocks)
}

export async function activate (context: vscode.ExtensionContext) {
	// Initialization
	setupStorage(context)
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
	const commandGenerateMocks = vscode.commands.registerCommand('miyagi.generateMocks', generateMocks)
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
		commandGenerateMocks,
		commandReload,
		providerDocumentLinksMocks,
		providerDocumentLinksSchema,
		providerDocumentLinksTemplate,
		providerCompletionTemplate,
	)
}
