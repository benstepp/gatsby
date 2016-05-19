import webpack from 'webpack'
import { registerAssets } from './assets-manager'
import webpackConfig from './webpack.config'

module.exports = (program, callback) => {
  const { directory } = program

  const compilerConfig = webpackConfig(program, directory, 'build-javascript')

  return webpack(compilerConfig.resolve()).run((err, stats) => {
    registerAssets(stats)

    return callback(err, stats)
  })
}
