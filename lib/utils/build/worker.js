const startTime = process.hrtime()

import 'colors'
import webpack from 'webpack'
import webpackConfig from '../webpack.config'

const directory = process.argv[2]
const stage = process.argv[3]
const program = { directory }

const pidMessage = `started in PID ${process.pid}`.grey
console.log(`[${stage}] ${pidMessage}`)

const compilerConfig = webpackConfig(program, directory, stage)

let endTime
function getEndTime () {
  if (typeof endTime === 'undefined') {
    const time = process.hrtime(startTime)
    endTime = (time[0] * 1000) + (time[1] / 1000000)
  }
  return endTime
}

function timingMessage (error = false) {
  const message = error ? 'with errors' : 'successfully'
  const color = error ? 'red' : 'green'
  const seconds = Math.round(getEndTime() / 1000)
  console.log(`[${stage}] completed ${message} in ${seconds}s (${getEndTime()}ms)`[color])
}

webpack(compilerConfig.resolve()).run((error, stats) => {
  if (error) {
    console.error(`[${stage}] ${error}`)
    timingMessage(true)
    process.exit(1)
  }

  if (stats.hasErrors()) {
    const errors = stats.toJson().errors
    console.log(`[${stage}] ${'Webpack Compilation Failed with Errors'.red}\n`)
    console.log(errors.toString().red)
    timingMessage(true)
    process.exit(1)
  }

  timingMessage()
  process.exit(0)
})
