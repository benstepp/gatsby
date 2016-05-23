import 'colors'
import { start } from './worker-timer'
import workerWebpack from './worker-webpack'

start()
const directory = process.argv[2]
const stage = process.argv[3]
const program = { directory }

const pidMessage = `started in PID ${process.pid}`.grey
console.log(`[${stage}] ${pidMessage}`)

workerWebpack(program, stage, null, error => {
  if (error) {
    process.exit(1)
  } else {
    process.exit(0)
  }
})
