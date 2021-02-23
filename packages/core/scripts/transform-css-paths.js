const path = require('path')
const fs = require('fs-extra')

const dirname = 'lib'

async function* getFiles (dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else if (/components\/.+\.js$/.test(res) && !/index.js$/.test(res)) {
      yield res
    }
  }
}

async function getFile (filepath) {
  const parse = path.parse(filepath)
  const dir = path.relative(parse.dir, parse.dir.replace(dirname, 'src'))

  const file = await fs.readFile(filepath, 'utf8')
  const m = file.match(/import ('\.\/\w+\.css');\n/)
  if (m && m.length === 2) {
    const modified = file.replace(m[1], `'${path.join(dir, `${parse.name}.css`)}'`)
    await fs.outputFile(filepath, modified)
  }
}

;(async () => {
  for await (const filepath of getFiles(dirname)) {
    await getFile(filepath)
  }
})()
