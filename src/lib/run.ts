import { spawnSync } from 'node:child_process'
import * as path from 'node:path'

interface RunMiyagiOptions {
  args: string[]
  cwd: string
}

const MIYAGI_BIN = 'node_modules/.bin/miyagi'

export function runMiyagi ({ args, cwd }: RunMiyagiOptions) {
	const miyagiPath = path.join(cwd, MIYAGI_BIN)
	return spawnSync('node', [miyagiPath, ...args], { cwd })
}
