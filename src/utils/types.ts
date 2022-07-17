export function isDefined <T> (input: T | undefined | null): input is T {
	return input !== undefined && input !== null
}
