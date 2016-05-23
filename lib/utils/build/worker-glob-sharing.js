import 'colors'
import globPages from '../glob-pages'

function sendGlob (program, stage, child) {
  const { directory } = program

  globPages(directory, (error, pages) => {
    const globMessage = `sending cached glob to ${stage}`.grey
    console.log(`[master] ${globMessage}`)

    child.send({
      type: 'GLOB_RESPONSE',
      payload: pages,
    })
  })
}

export default function workerGlobSharing (program, stage, child) {
  child.on('message', message => {
    if (message.type === 'GLOB_REQUEST') {
      sendGlob(program, stage, child)
    }
  })
}
