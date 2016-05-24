import fs from 'fs'
import toml from 'toml'
import objectAssign from 'object-assign'

const DEFAULT_CONFIG = {
  noProductionJavascript: false,
}

let config
function readConfig (directory) {
  try {
    const userConfig = toml.parse(fs.readFileSync(`${directory}/config.toml`))
    config = objectAssign({}, DEFAULT_CONFIG, userConfig)
  } catch (error) {
    console.log("Couldn't load your site config")
    config = objectAssign({}, DEFAULT_CONFIG)
  }
}

export default function loadConfig ({ directory }) {
  if (typeof config === 'undefined') {
    readConfig(directory)
  }

  return config
}
