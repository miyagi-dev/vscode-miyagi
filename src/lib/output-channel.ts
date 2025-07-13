import { window } from 'vscode'

export const outputChannel = window.createOutputChannel('miyagi', {
	log: true,
})
