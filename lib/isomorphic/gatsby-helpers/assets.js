import React from 'react'

let assets

function extractAssetsFromEnv () {
  assets = JSON.parse(process.env.GATSBY_ASSETS)
  console.log('extract', assets)
  return assets
}

function getAssets () {
  return assets || extractAssetsFromEnv()
}

export function getAssetsByChunk (chunk) {
  return getAssets()[chunk]
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
    <link rel="stylesheet" href={`public/${file}`} />
  ))
}

function scriptJS (chunk) {
  return getJSByChunk(chunk).map(file => (
    <script src={`public/${file}`} />
  ))
}

export function css (chunk = 'gatsby', inline = true) {
  return (inline) ? inlineCSS(chunk) : linkCSS(chunk)
}

export function js (chunk = 'gatsby') {
  return scriptJS(chunk)
}
