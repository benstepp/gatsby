import 'colors'

const startTime = process.hrtime()

let endTime
function getEndTime () {
  if (typeof endTime === 'undefined') {
    const time = process.hrtime(startTime)
    endTime = (time[0] * 1000) + (time[1] / 1000000)
  }
  return endTime
}

export default function timingMessage (stage, error = false) {
  const subtext = error ? 'with errors' : 'successfully'
  const color = error ? 'red' : 'green'
  const seconds = Math.round(getEndTime() / 1000)
  const message = `[${stage}] completed ${subtext} in ${seconds}s (${getEndTime()}ms)`
  console.log(message[color])
}
