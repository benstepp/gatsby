import each from 'lodash/each'
import map from 'lodash/map'
import includes from 'lodash/includes'
import fromPairs from 'lodash/fromPairs'

const assets = {}

const EXCLUDED_FILES = ['bundle-for-css.js', 'render-page.js']
function filterFiles (file) {
  return !includes(EXCLUDED_FILES, file) && !file.match(/\.map$/)
}

function parseStats (webpackStats) {
  const stats = webpackStats.toJson({
    children: false,
    chunks: false,
    errorDetails: false,
    hash: false,
    modules: false,
    publicPath: false,
    source: false,
    timings: false,
    version: false,
  }).assetsByChunkName

  return fromPairs(map(stats, (files, chunkName) =>
    [chunkName, files.filter(filterFiles)]
  ))
}

function assetsForChunk (chunkName) {
  if (!assets.hasOwnProperty(chunkName)) {
    assets[chunkName] = []
  }
  return assets[chunkName]
}

function mergeAssets (files, chunkName) {
  const currentAssets = assetsForChunk(chunkName)
  files.forEach(file => {
    if (!includes(currentAssets, file)) {
      currentAssets.push(file)
    }
  })
}

export function registerAssets (webpackStats) {
  const stats = parseStats(webpackStats)
  each(stats, mergeAssets)
  console.log(assets)
}

export default assets
