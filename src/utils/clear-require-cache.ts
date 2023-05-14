export function clearRequireCache(id: string) {
	require.cache[id]?.children.forEach((child) => clearRequireCache(child.id))
	delete require.cache[id]
}
