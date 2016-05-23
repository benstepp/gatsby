import 'colors'
import path from 'path'
import { fork } from 'child_process'
import Promise from 'bluebird'
import globPages from '../glob-pages'

function sendGlob (program, stage, child) {
  const { directory } = program

  globPages(directory, (error, pages) => {
    const globMessage = `sending cached glob to ${stage}`.grey
    console.log(`[master] ${globMessage}`)

    child.send({
      type: 'GLOB_RESPONSE',
      payload: pages,
    })
  })
}

export default function createWorker (program, stage) {
  return new Promise((resolve, reject) => {
    const { directory } = program
    const worker = path.resolve(__dirname, 'asset-worker')
    const child = fork(worker, [directory, stage])

    child.on('message', message => {
      if (message.type === 'GLOB_REQUEST') {
        sendGlob(program, stage, child)
      }
    })

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
