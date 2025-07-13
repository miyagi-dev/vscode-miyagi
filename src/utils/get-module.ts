import { Worker } from 'node:worker_threads'

export async function getModule(modulePath: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const workerCode = /* js */ `
			import { parentPort, workerData } from 'node:worker_threads'

			const module = await import(workerData)
			parentPort?.postMessage(JSON.stringify(module))
		`

		const worker = new Worker(workerCode, { workerData: modulePath, eval: true })

		worker.on('message', (value) => resolve(JSON.parse(value)))
		worker.on('error', reject)

		worker.on('exit', (code) => {
			if (code === 0) return
			reject(new Error(`get-module worker exit code: ${code}`))
		})
	})
}
