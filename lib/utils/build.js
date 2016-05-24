import _ from 'lodash'
import Promise from 'bluebird'

import createWorker from './build/create-asset-worker'
import buildHTML from './build/build-html'
import loadConfig from './load-config'
import postBuild from './post-build'
import globPages from './glob-pages'

function customPost (program, callback) {
  const directory = program.directory
  let customPostBuild
  try {
    const gatsbyNodeConfig = require(`${directory}/gatsby-node`)
    customPostBuild = gatsbyNodeConfig.postBuild
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND' && !_.includes(e.Error, 'gatsby-node')) {
      console.log('Failed to load gatsby-node.js, skipping custom post build script', e)
    }
  }

  if (customPostBuild) {
    console.log('Performing custom post-build steps')

    return globPages(directory, (globError, pages) => (
      customPostBuild(pages, (error) => {
        if (error) {
          console.log('customPostBuild function failed')
          callback(error)
        }
        return callback()
      })
    ))
  }

  return callback()
}

function post (program, callback) {
  console.log('Copying assets')

  postBuild(program, (error) => {
    if (error) {
      console.log('failed to copy assets')
      return callback(error)
    }

    return customPost(program, callback)
  })
}

function build (program, callback) {
  const config = loadConfig(program)

  const assetStages = [createWorker(program, 'build-css')]
  if (!config.noProductionJavascript) {
    assetStages.push(createWorker(program, 'build-javascript'))
  }

  return Promise.all(assetStages)
    .then(() => buildHTML(program))
    .then(() => post(program, callback))
    .catch(() => {})
}

module.exports = build
