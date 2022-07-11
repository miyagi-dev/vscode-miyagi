import { getNewComponentPath } from '../lib/get-new-component-path'
import { runMiyagi } from '../lib/run'
import { storage } from '../lib/storage'
import * as vscode from 'vscode'

interface QuickPickItem extends vscode.QuickPickItem {
	value: any
}

const STORAGE_KEY_ONLY_FILES = 'miyagi.new-component-only-files'

const FILE_OPTIONS: QuickPickItem[] = [
	{
		label: 'Template',
		value: 'tpl',
		picked: true
	},
	{
		label: 'CSS',
		value: 'css',
		picked: true
	},
	{
		label: 'JavaScript',
		value: 'js',
		picked: true
	},
	{
		label: 'Mocks',
		value: 'mocks',
		picked: true
	},
	{
		label: 'Schema',
		value: 'schema',
		picked: true
	},
	{
		label: 'Info',
		value: 'info',
		picked: false
	},
	{
		label: 'Documentation',
		value: 'docs',
		picked: false
	}
]

export async function newComponent (uri?: vscode.Uri) {
	const componentPath = await getNewComponentPath(uri)

	if (!componentPath) {
		return
	}

	const storedOnlyFiles: string[] | undefined = await storage.get(STORAGE_KEY_ONLY_FILES)

	if (storedOnlyFiles) {
		FILE_OPTIONS.forEach(option => {
			option.picked = storedOnlyFiles.includes(option.value)
		})
	}

	const selectedFiles = await vscode.window.showQuickPick(FILE_OPTIONS, {
		title: 'miyagi: Select files to create',
		canPickMany: true
	})

	if (!selectedFiles?.length) {
		return
	}

	const onlyFiles = selectedFiles.map(file => file.value)
	await storage.update(STORAGE_KEY_ONLY_FILES, onlyFiles)

	runMiyagi({
		args: ['new', componentPath.path, '--only', ...onlyFiles],
		cwd: componentPath.cwd
	})
}
