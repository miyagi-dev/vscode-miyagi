import type { Project } from '../types.d.ts'

type ResolveNamespaceOptions = {
	project: Project
	id: string
}

export function getComponentPath({ project, id }: ResolveNamespaceOptions): string | undefined {
	const namespaces = project.config.namespaces

	if (!namespaces) {
		return id
	}

	// Adjust references to match normalized miyagi config namespaces.
	const normalizedId = `${id.startsWith('@') ? '' : '@'}${id.replace(/^\//, '')}`

	for (const [namespaceName, namespacePath] of Object.entries(namespaces)) {
		if (!namespacePath) continue
		if (!normalizedId.startsWith(namespaceName)) continue

		const normalizedNamespacePath = namespacePath
			.replace(project.config.components.folder, '')
			.replace(/^\//, '')

		return normalizedId.replace(namespaceName, normalizedNamespacePath)
	}

	return undefined
}
