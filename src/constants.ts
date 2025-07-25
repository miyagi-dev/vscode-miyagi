import type { MiyagiConfigNormalized } from './types.ts'

export const MIYAGI_CONFIG_GLOB = '**/.miyagi.{js,json}'
export const SCHEMA_GLOB = '**/schema.{json,yaml}'
export const MOCKS_GLOB = '**/mocks.{json,yaml}'
export const TWIG_GLOB = '**/*.twig'
export const EXCLUDE_GLOB = '**/node_modules/**'

export const DEFAULT_MIYAGI_CONFIG: MiyagiConfigNormalized = {
	components: {
		folder: 'src',
	},
	files: {
		schema: {
			name: 'schema',
			extension: 'json',
		},
		mocks: {
			name: 'mocks',
			extension: 'json',
		},
		templates: {
			name: 'index',
		},
	},
}
