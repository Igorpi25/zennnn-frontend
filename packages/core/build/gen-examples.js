const path = require('path')
const fs = require('fs').promises

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
  const md = `\`\`\`vue\n${file}\n\`\`\`\n`
  const parse = path.parse(filepath)
  const filename = `${parse.name}Code.md`
  await fs.writeFile(path.join(parse.dir, filename), md)
}

;(async () => {
  for await (const filepath of getFiles(dirname)) {
    console.log('filepath', filepath)
    await getFile(filepath)
  }
})()
