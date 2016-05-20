import React from 'react'

let assets

function extractAssetsFromEnv () {
  if (process.env.GATSBY_ASSETS) {
    assets = process.env.GATSBY_ASSETS
  } else {
    assets = { gatsby: ['bundle.js'] }
  }
  return assets
}

/**
 * Get all assets from the `build-css` and `build-javascript` stages of
 * the Gatsby build process.
*/
export function getAssets () {
  return assets || extractAssetsFromEnv()
}

/**
 * Return a specific chunk name of assets from the `build-css` and
 * `build-javascript` stages of the Gatsby build process.
*/
export function getAssetsByChunk (chunk) {
  return getAssets()[chunk] || []
}

function getCSSByChunk (chunk) {
  return getAssetsByChunk(chunk).filter(a => a.match(/\.css$/))
}

function getJSByChunk (chunk) {
  return getAssetsByChunk(chunk).filter(a => a.match(/\.js$/))
}

function inlineCSS (chunk) {
  return getCSSByChunk(chunk).map(file => (
    <style dangerouslySetInnerHTML={{ __html: require(`!raw!public/${file}`) }} />
  ))
}

function linkCSS (chunk) {
  return getCSSByChunk(chunk).map(file => (
    <link rel="stylesheet" href={`/${file}`} />
  ))
}

function scriptJS (chunk) {
  return getJSByChunk(chunk).map(file => (
    <script src={`/${file}`} />
  ))
}

/**
 * Returns css for a given chunk. By default it returns inline css for
 * the 'gatsby' chunk. Allowed options:
 *
 * @param {boolean} [options.inline=true] - Whether or not the css should
 * be returned inlined (<style> element). This defaults to true.
 *
 * @param {string} [options.chunk=gatsby] - The named entry chunk to return
 * css assets for. Defaults to 'gatsby'
 *
*/
export function css (opts = {}) {
  const options = Object.assign({}, { chunk: 'gatsby', inline: true }, opts)
  return (options.inline) ? inlineCSS(options.chunk) : linkCSS(options.chunk)
}

/**
 * Returns a script tag for the a given chunk name. This defaults to
 * the 'gatsby' chunk.
*/
export function js (opts = {}) {
  const options = Object.assign({}, { chunk: 'gatsby' }, opts)
  return scriptJS(options.chunk)
}
