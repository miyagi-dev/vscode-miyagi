import { Worker } from 'node:worker_threads'

const js = String.raw

type GetModuleOptions = {
	modulePath: string
	cwd: string
}

export async function getModule({ modulePath, cwd }: GetModuleOptions): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const workerCode = js`
			import process from 'node:process'
			import { parentPort, workerData } from 'node:worker_threads'

			// Rewrite cwd to match project
			process.cwd = () => process.env.CWD

			const module = await import(workerData)
			parentPort?.postMessage(JSON.stringify(module))
		`

		const worker = new Worker(workerCode, {
			workerData: modulePath,
			eval: true,
			env: {
				CWD: cwd,
				NODE_ENV: 'development',
			},
		})

		worker.on('message', (value) => resolve(JSON.parse(value)))
		worker.on('error', reject)

		worker.on('exit', (code) => {
			if (code === 0) return
			reject(new Error(`get-module worker exit code: ${code}`))
		})
	})
}
