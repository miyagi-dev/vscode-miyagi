import vscode from 'vscode'

import { generateMock, generateMockCompatibility } from './commands/generate-mock'
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
import { SemVer } from './utils/semver'

const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
const contextCanLint = new ContextKey('miyagi.canLint')
const contextCanNewComponent = new ContextKey('miyagi.canNewComponent')
const contextCanGenerateMock = new ContextKey('miyagi.canGenerateMock')

async function reload () {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)

	const canLint = projectList.every(project => new SemVer(project.version).gte(lintCompatibility))
	contextCanLint.set(canLint)

	const canNewComponent = projectList.every(project => new SemVer(project.version).gte(newComponentCompatibility))
	contextCanNewComponent.set(canNewComponent)

	const canGenerateMock = projectList.every(project => new SemVer(project.version).gte(generateMockCompatibility))
	contextCanGenerateMock.set(canGenerateMock)
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
	const commandGenerateMock = vscode.commands.registerCommand('miyagi.generateMock', generateMock)
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
		commandGenerateMock,
		commandReload,
		providerDocumentLinksMocks,
		providerDocumentLinksSchema,
		providerDocumentLinksTemplate,
		providerCompletionTemplate
	)
}

export function deactivate () {}
