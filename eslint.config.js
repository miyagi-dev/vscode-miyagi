import eslint from '@eslint/js'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{ ignores: ['out'] },
	{
		plugins: {
			'simple-import-sort': simpleImportSortPlugin,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	eslint.configs.recommended,
	tseslint.configs.strict,
)
