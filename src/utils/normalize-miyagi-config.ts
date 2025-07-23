import deepmerge from 'deepmerge'

import { DEFAULT_MIYAGI_CONFIG } from '../constants.ts'
import type { MiyagiConfig3, MiyagiConfig4, MiyagiConfigNormalized } from '../types.d.ts'

type NormalizeMiyagiConfigOptions = {
	config: MiyagiConfig3 | MiyagiConfig4
	cwd: string
}

export function normalizeMiyagiConfig({
	config,
	cwd,
}: NormalizeMiyagiConfigOptions): MiyagiConfigNormalized {
	const normalizedConfig: MiyagiConfigNormalized = deepmerge(DEFAULT_MIYAGI_CONFIG, {
		files: structuredClone(config.files),
		components: structuredClone(config.components),
	})

	// miyagi v3

	if ('engine' in config && config.engine?.options?.namespaces) {
		normalizedConfig.namespaces = {}

		for (const [namespaceName, namespacePath] of Object.entries(config.engine.options.namespaces)) {
			if (!namespacePath) continue

			normalizedConfig.namespaces[`@${namespaceName}`] = namespacePath.replace(/^\//, '')
		}
	}

	// miyagi v4

	if ('namespaces' in config && config.namespaces) {
		normalizedConfig.namespaces = {}

		for (const [namespaceName, namespacePath] of Object.entries(config.namespaces)) {
			if (!namespacePath) continue

			normalizedConfig.namespaces[namespaceName] = namespacePath.replace(cwd, '').replace(/^\//, '')
		}
	}

	return normalizedConfig
}
