import semver from 'semver'
import { commands, ExtensionContext, workspace } from 'vscode'

import { generateMocks } from './commands/generate-mocks.ts'
import { lint } from './commands/lint.ts'
import { newComponent } from './commands/new-component.ts'
import { MIYAGI_CONFIG_GLOB, SCHEMA_GLOB } from './constants.ts'
import { completionTemplate } from './lib/completion-template.ts'
import { ContextKey } from './lib/context-key.ts'
import { documentLinksMocks } from './lib/document-links-mocks.ts'
import { documentLinksSchema } from './lib/document-links-schema.ts'
import { documentLinksTemplate } from './lib/document-links-template.ts'
import { getProjectList, reloadSchemas } from './lib/projects.ts'
import { setupStorage } from './lib/storage.ts'
import { createFileSystemWatcher } from './utils/create-file-system-watcher.ts'

const contextHasMiyagi = new ContextKey('miyagi.hasMiyagi')
const contextCanLint = new ContextKey('miyagi.canLint')
const contextCanNewComponent = new ContextKey('miyagi.canNewComponent')
const contextCanGenerateMocks = new ContextKey('miyagi.canGenerateMocks')

async function reload() {
	const projectList = await getProjectList({ refresh: true })
	contextHasMiyagi.set(projectList.length > 0)

	const canLint = projectList.every((project) => semver.gte(project.version, '3.3.2'))
	contextCanLint.set(canLint)

	const canNewComponent = projectList.every((project) => semver.gte(project.version, '3.3.2'))
	contextCanNewComponent.set(canNewComponent)

	const canGenerateMocks = projectList.every((project) => semver.gte(project.version, '3.3.2'))
	contextCanGenerateMocks.set(canGenerateMocks)
}

export async function activate(context: ExtensionContext) {
	// Initialization
	setupStorage(context)
	await reload()

	// Events
	const eventWorkspaceFolders = workspace.onDidChangeWorkspaceFolders(reload)

	// Watchers
	const watcherMiyagiConfig = createFileSystemWatcher(MIYAGI_CONFIG_GLOB, reload)
	const watcherSchema = createFileSystemWatcher(SCHEMA_GLOB, reloadSchemas)

	// Commands
	const commandNewComponent = commands.registerCommand('miyagi.newComponent', newComponent)
	const commandLintComponent = commands.registerCommand('miyagi.lintComponent', lint)
	const commandLintAllComponents = commands.registerCommand('miyagi.lintAllComponents', lint)
	const commandGenerateMocks = commands.registerCommand('miyagi.generateMocks', generateMocks)
	const commandReload = commands.registerCommand('miyagi.reload', reload)

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
