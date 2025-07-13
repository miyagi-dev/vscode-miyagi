import { type ExtensionContext, type Memento } from 'vscode'

export let storage: Memento

export function setupStorage(context: ExtensionContext) {
	storage = context.workspaceState
}
