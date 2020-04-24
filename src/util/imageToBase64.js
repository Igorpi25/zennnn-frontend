// not saved to package.json 
const sharp = require('sharp')
const DEFAULT_SIZE = 20

const filenameIndex = process.argv.indexOf('--name')
const filename = filenameIndex === -1 ? '' : process.argv[filenameIndex + 1]
const sizeIndex = process.argv.indexOf('--size')
const size = sizeIndex === -1 ? DEFAULT_SIZE : process.argv[sizeIndex + 1]

if (!filename) {
  process.exit()
}

console.log('Image to process: ', filename)

sharp(filename)
  .resize(size)
  .toBuffer()
  .then(data => {
    console.log(`data:image/png;base64,${data.toString('base64')}`)
  })
  .catch(error => {
    console.warn(error)
  })
