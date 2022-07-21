export function isDefined <T> (input: T | undefined | null): input is T {
	return input !== undefined && input !== null
}

export function includes <U, T extends U> (collection: readonly T[], element: U): element is T {
	return collection.includes(element as T)
}
