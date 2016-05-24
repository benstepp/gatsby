require('node-cjsx').transform()
import 'colors'
import { start } from './worker-timer'
import workerWebpack from './worker-webpack'
import globPages from '../glob-pages'

export default function buildHTML (program) {
  const { directory } = program

  return new Promise((resolve, reject) => {
    globPages(directory, (error, pages) => {
      if (error) reject(error)
      const routes = pages.filter((page) => page.path).map((page) => page.path)
      start()
      const pidMessage = 'started in master'.grey
      console.log(`[build-html] ${pidMessage}`)

      workerWebpack(program, 'build-html', routes, (htmlError) => {
        if (htmlError) reject(error)
        resolve()
      })
    })
  })
}
