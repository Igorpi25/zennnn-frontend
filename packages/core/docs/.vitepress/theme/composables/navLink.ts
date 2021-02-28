import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { isExternal as isExternalCheck } from '../utils'
import { useUrl } from './url'

export function useNavLink (item: any) {
  const route = useRoute()
  const { withBase } = useUrl()

  const isExternal = isExternalCheck(item.link)

  const isActive = computed(() => {
    const routePath = normalizePath(route.path)

    if (item.activeMatch) {
      return new RegExp(item.activeMatch).test(routePath)
    } else {
      const itemPath = normalizePath(withBase(item.link))
      return itemPath === '/'
        ? itemPath === routePath
        : routePath.startsWith(itemPath)
    }
  })

  const props = computed(() => {
    return {
      href: isExternal ? item.link : withBase(item.link),
      target: item.target || isExternal ? `_blank` : null,
      rel: item.rel || isExternal ? `noopener noreferrer` : null,
      'aria-label': item.ariaLabel
    }
  })

  return {
    props,
    isActive,
    isExternal
  }
}

function normalizePath (path: string): string {
  return path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
}
