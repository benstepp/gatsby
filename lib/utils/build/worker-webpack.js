import 'colors'
import { inspect } from 'util'
import webpack from 'webpack'
import * as timer from './worker-timer'
import webpackConfig from '../webpack.config'

export default function workerWebpack (program, stage, routes, callback) {
  const { directory } = program
  const compilerConfig = webpackConfig(program, directory, stage, null, routes)

  webpack(compilerConfig.resolve()).run((error, stats) => {
    if (error) {
      console.log(`[${stage}] ${error}`.red)
      timer.message(stage, true)
      callback(error)
    }

    if (stats.hasErrors()) {
      const errors = stats.toJson().errors
      console.log(`[${stage}] ${'Webpack Compilation Failed with Errors'.red}\n`)
      errors.forEach(err => {
        console.log(`${err.toString().substring(0, 950)}`.red)
        console.log('\n')
      })
      timer.message(stage, true)
      callback(errors)
    }

    timer.message(stage)
    callback(null)
  })
}
