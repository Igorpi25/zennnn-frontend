const path = require('path')
const fs = require('fs-extra')

const dirname = 'src/examples'

async function* getFiles (dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else if (res.match(/\w+\.vue$/)) {
      yield res
    }
  }
}

async function getFile (filepath) {
  const file = await fs.readFile(filepath, 'utf8')
  const md = `\`\`\`vue\n${file}\`\`\``
  const parse = path.parse(filepath)
  const dirname = parse.dir.replace('/examples/', '/examples_code/')
  const filename = `${parse.name}.md`
  await fs.outputFile(`${dirname}/${filename}`, md)
}

;(async () => {
  for await (const filepath of getFiles(dirname)) {
    await getFile(filepath)
  }
})()
