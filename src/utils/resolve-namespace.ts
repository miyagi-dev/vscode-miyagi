import { Project } from '../types'

type ResolveNamespaceOptions = {
	project: Project
	id: string
}

export function resolveNamespace ({ project, id }: ResolveNamespaceOptions): string {
	const namespaces = project.config.engine?.options?.namespaces

	if (!namespaces) {
		return id
	}

	for (const [name, path] of Object.entries(namespaces)) {
		if (!path) {
			continue
		}

		const namespaceReference = `@${name}`
		const namespacePath = path.replace(project.config.components.folder, '')

		if (id.startsWith(namespaceReference)) {
			return id.replace(namespaceReference, namespacePath)
		}
	}

	return id
}
