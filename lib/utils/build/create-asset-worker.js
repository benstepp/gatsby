import path from 'path'
import { fork } from 'child_process'
import Promise from 'bluebird'
import workerGlobSharing from './worker-glob-sharing'

export default function createWorker (program, stage) {
  return new Promise((resolve, reject) => {
    const { directory } = program
    const worker = path.resolve(__dirname, 'asset-worker')
    const child = fork(worker, [directory, stage])

    workerGlobSharing(program, stage, child)

    child.on('error', error => {
      console.error(error)
    })

    child.on('exit', (code) => {
      const result = { code, stage }
      if (code === 0) { resolve(result) }
      reject(result)
    })
  })
}
