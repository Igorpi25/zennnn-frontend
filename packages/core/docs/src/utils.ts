export const outboundRE = /^[a-z]+:/i

export function isExternal(path: string): boolean {
  return outboundRE.test(path)
}

export const inBrowser = typeof window !== 'undefined'

/**
 * Converts a url path to the corresponding js chunk filename.
 */
export function pathToFile(path: string): string {
  let pagePath = path.slice()
  if (pagePath.endsWith('/')) {
    pagePath += 'index'
  }

  if (import.meta.env.DEV) {
    // always force re-fetch content in dev
    pagePath = `./pages${pagePath}.md?t=${Date.now()}`
  } else {
    if (inBrowser) {
      const base = import.meta.env.BASE_URL
      const assetPath = __PAGE_ASSETS_MAP__[pagePath]
      pagePath = `${base}assets/${assetPath}`
    } else {
      // ssr build uses much simpler name mapping
      pagePath = `./pages${pagePath}.md`
    }
  }

  return pagePath
}
