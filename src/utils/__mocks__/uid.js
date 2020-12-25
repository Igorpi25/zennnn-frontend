// eslint-disable-next-line no-undef
beforeEach(() => {
  uidCounter = {}
})

let uidCounter = {}

const uid = (prefix = '$default') => {
  if (!uidCounter[prefix]) {
    uidCounter[prefix] = 0
  }

  const id = ++uidCounter[prefix]
  if (prefix === '$default') {
    return `${id}`
  }

  return `${prefix}${id}`
}

export default uid
