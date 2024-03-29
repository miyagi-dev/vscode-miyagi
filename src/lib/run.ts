import { spawnSync } from 'node:child_process'
import path from 'node:path'

type RunMiyagiOptions = {
	args: string[]
	cwd: string
}

const MIYAGI_BIN = 'node_modules/.bin/miyagi'

export function runMiyagi({ args, cwd }: RunMiyagiOptions) {
	const miyagiPath = path.join(cwd, MIYAGI_BIN)
	return spawnSync('node', [miyagiPath, ...args], { cwd })
}
