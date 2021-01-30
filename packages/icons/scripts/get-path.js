const path = require('path')
const fs = require('fs').promises
const { removeSvgAttrs, mergeSvgPaths, getPath: getFilePath } = require('./svgo-process')

const getPath = async (filepath) => {
  if (!filepath) {
    console.log('filepath not setted.')
    return
  }
  const file = await fs.readFile(filepath, 'utf8')
  const clearedResult = await removeSvgAttrs(file)
  const result = await mergeSvgPaths(clearedResult.data)
  console.log('SVGO removeAttrs result')
  console.log(clearedResult)
  console.log('SVGO mergePaths result')
  console.log(result)
  const data = result.data
  console.log('Result')
  console.log(getFilePath(data, filepath))
}

const fileIndex = process.argv.indexOf('--file')
const file = fileIndex === -1 ? undefined : process.argv[fileIndex + 1]

;(async () => {
  const filepath = path.join(__dirname, file)
  await getPath(filepath)
})()
