import path from 'path'
import { fork } from 'child_process'
import Promise from 'bluebird'
import workerGlobSharing from './worker-glob-sharing'

export default function createHTMLWorker (program, index, routes) {
  return new Promise((resolve, reject) => {
    const { directory } = program
    const stage = `build-html-${index}`
    const worker = path.resolve(__dirname, 'html-worker')
    const child = fork(worker, [directory, index])

    workerGlobSharing(program, stage, child)

    child.on('error', error => {
      console.error(error)
    })

    child.on('exit', (code) => {
      const result = { code, stage }
      if (code === 0) { resolve(result) }
      reject(result)
    })

    child.send({
      type: 'ROUTES',
      payload: routes,
    })
  })
}
