import 'colors'
import './worker-timer'
import workerWebpack from './worker-webpack'

const directory = process.argv[2]
const stage = process.argv[3]
const program = { directory }

const pidMessage = `started in PID ${process.pid}`.grey
console.log(`[${stage}] ${pidMessage}`)

workerWebpack(program, stage)
