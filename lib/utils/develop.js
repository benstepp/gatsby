require('node-cjsx').transform()
import opn from 'opn'

import globPages from './glob-pages'
import devServer from './dev-server'

module.exports = (program) => {
  const directory = program.directory

  // Load pages for the site.
  return globPages(directory, (error, pages) => {
    if (error) {
      console.log(error)
      process.exit()
    }

    devServer(program, pages, (server) => {
      if (program.open) {
        opn(server.info.uri)
      }
      return console.log('Listening at:', server.info.uri)
    })
  })
}
