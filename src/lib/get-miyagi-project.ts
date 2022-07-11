import * as path from 'node:path'
import * as vscode from 'vscode'

interface MiyagiConfig {
	components: {
		folder: string
	}
}

export async function getMiyagiProject () {
	const configs = await vscode.workspace.findFiles('**/.miyagi.{js,json}')

	if (!configs.length) {
		return undefined
	}

	const cwd = path.dirname(configs[0].path)
	const config: MiyagiConfig = require(configs[0].path)

	return { cwd, config }
}
