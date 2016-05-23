import 'colors'
import webpack from 'webpack'
import timingMessage from './worker-timer'
import webpackConfig from '../webpack.config'

export default function workerWebpack (program, labeledStage, routes) {
  const stage = labeledStage.replace(/-\d$/, '')
  const { directory } = program
  const compilerConfig = webpackConfig(program, directory, stage, null, routes)

  webpack(compilerConfig.resolve()).run((error, stats) => {
    if (error) {
      console.log(`[${labeledStage}] ${error}`.red)
      timingMessage(labeledStage, true)
      process.exit(1)
    }

    if (stats.hasErrors()) {
      const errors = stats.toJson().errors
      console.log(`[${labeledStage}] ${'Webpack Compilation Failed with Errors'.red}\n`)
      console.log(errors.toString().red)
      timingMessage(labeledStage, true)
      process.exit(1)
    }

    timingMessage(labeledStage)
    process.exit(0)
  })
}
