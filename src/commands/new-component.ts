import { type QuickPickItem, type Uri, window } from 'vscode'

import { getNewComponentPath } from '../lib/get-new-component-path.ts'
import { outputChannel } from '../lib/output-channel.ts'
import { runMiyagi } from '../lib/run.ts'
import { storage } from '../lib/storage.ts'

interface FileOption extends QuickPickItem {
	value: string
}

const STORAGE_KEY_ONLY_FILES = 'miyagi.new-component-only-files'

const fileOptions: FileOption[] = [
	{
		label: 'Template',
		value: 'tpl',
		picked: true,
	},
	{
		label: 'CSS',
		value: 'css',
		picked: true,
	},
	{
		label: 'JavaScript',
		value: 'js',
		picked: true,
	},
	{
		label: 'Mocks',
		value: 'mocks',
		picked: true,
	},
	{
		label: 'Schema',
		value: 'schema',
		picked: true,
	},
	{
		label: 'Documentation',
		value: 'docs',
		picked: false,
	},
]

export async function newComponent(uri?: Uri) {
	const componentPath = await getNewComponentPath(uri)

	if (!componentPath) return

	const storedOnlyFiles: string[] | undefined = await storage.get(STORAGE_KEY_ONLY_FILES)

	if (storedOnlyFiles) {
		fileOptions.forEach((option) => {
			option.picked = storedOnlyFiles.includes(option.value)
		})
	}

	const selectedFiles = await window.showQuickPick(fileOptions, {
		title: 'miyagi: Select files to create',
		canPickMany: true,
	})

	if (!selectedFiles?.length) return

	const onlyFiles = selectedFiles.map((file) => file.value)
	await storage.update(STORAGE_KEY_ONLY_FILES, onlyFiles)

	const result = runMiyagi({
		args: ['new', componentPath.path, '--only', ...onlyFiles],
		cwd: componentPath.cwd,
	})

	if (result.status !== 0) {
		window.showErrorMessage('miyagi: Error creating component')
	}

	const stderr = result?.stderr.toString()

	if (stderr) {
		outputChannel.appendLine(stderr)
		outputChannel.show()
	}
}
