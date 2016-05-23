import 'colors'
import './worker-timer'
import workerWebpack from './worker-webpack'

const directory = process.argv[2]
const stage = `build-html-${process.argv[3]}`
const program = { directory }

const pidMessage = `started in PID ${process.pid}`.grey
console.log(`[${stage}] ${pidMessage}`)

function compileHTML (routes) {
  const renderMessage = `will render ${routes.length} pages`.grey
  console.log(`[${stage}] ${renderMessage}`)

  workerWebpack(program, stage, routes)
}

process.on('message', (message) => {
  switch (message.type) {
    case 'ROUTES':
      return compileHTML(message.payload)
    default:
      return null
  }
})
