import vscode from 'vscode'

type ContextValue = boolean | string | string[] | RegExp | undefined

export class ContextKey {
	#name: string
	#lastValue: ContextValue | undefined

	constructor(name: string) {
		this.#name = name
	}

	set(value: ContextValue) {
		if (value === this.#lastValue) {
			return
		}

		this.#lastValue = value
		vscode.commands.executeCommand('setContext', this.#name, value)
	}

	get() {
		return this.#lastValue
	}
}
