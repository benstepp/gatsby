require('node-cjsx').transform()
import 'colors'
import os from 'os'
import Promise from 'bluebird'
import times from 'lodash/times'
import chunk from 'lodash/chunk'
import createWorker from './create-html-worker'
import globPages from '../glob-pages'

export default function buildHTML (program, callback) {
  const { directory } = program
  const cpus = os.cpus()
  const workerCount = (cpus.length / 2 > 1) ? (cpus.length / 2) : 1

  return new Promise((resolve) => {
    globPages(directory, (err, pages) => {
      const routes = pages.filter((page) => page.path).map((page) => page.path)
      resolve(routes)
    })
  }).then(routes => {
    const chunkSize = Math.floor(routes.length / workerCount) || 1
    const splitRoutes = chunk(routes, chunkSize)

    const workers = []
    const workerMessage = `Creating ${splitRoutes.length} workers to render Static HTML`.grey
    console.log(`[build-html] ${workerMessage}`)

    times(splitRoutes.length, index => {
      workers.push(createWorker(program, index, splitRoutes[index]))
    })

    return Promise.all(workers)
      .then(w => callback(null, w))
  })
}
