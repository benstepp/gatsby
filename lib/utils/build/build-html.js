require('node-cjsx').transform()
import 'colors'
import workerWebpack from './worker-webpack'
import globPages from '../glob-pages'

export default function buildHTML (program, callback) {
  const { directory } = program

  globPages(directory, (error, pages) => {
    const routes = pages.filter((page) => page.path).map((page) => page.path)
    workerWebpack(program, 'build-html', routes, (htmlError) => {
      if (htmlError) {
        callback(htmlError)
      } else {
        callback()
      }
    })
  })
}
