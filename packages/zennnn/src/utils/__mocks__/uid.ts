// eslint-disable-next-line no-undef
beforeEach(() => {
  uidCounter = {}
})

let uidCounter: Record<string, number> = {}

const uid = (prefix = '$default'): string => {
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
