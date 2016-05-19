import webpack from 'webpack'
import webpackConfig from './webpack.config'
import { registerAssets } from './assets-manager'
import fs from 'fs'

module.exports = (program, callback) => {
  const { directory } = program

  const compilerConfig = webpackConfig(program, directory, 'build-css')

  return webpack(compilerConfig.resolve()).run((err, stats) => {
    // We don't want any javascript produced by this step in the process.
    fs.unlinkSync(`${directory}/public/bundle-for-css.js`)
    registerAssets(stats)

    return callback(err, stats)
  })
}
