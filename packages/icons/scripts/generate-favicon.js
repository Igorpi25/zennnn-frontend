const path = require('path')
const fsPromises = require('fs').promises
const sharp = require('sharp')
const toIco = require('to-ico')

async function generateFavicon (sourcePath, destPath) {
  const faviconDimensions = [16, 24, 32, 64]
  const metadata = await sharp(path.join(__dirname, sourcePath)).metadata()

  // Create buffer for each size
  const resizedBuffers = await Promise.all(faviconDimensions.map(dimension =>
    sharp(path.join(__dirname, sourcePath), { density: dimension / Math.max(metadata.width, metadata.height) * metadata.density })
      .toBuffer()
  ))

  return fsPromises.writeFile(path.join(__dirname, destPath), await toIco(resizedBuffers))
}

;(async () => {
  await generateFavicon('../temp/favicon.svg', '../dist/favicon.ico')
})()
