import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

export interface PageData {
  relativePath: string
  title: string
  description: string
  headers: Header[]
  frontmatter: Record<string, any>
  lastUpdated: number
}

export interface Header {
  level: number
  title: string
  slug: string
}

export function usePageData(route?: RouteLocationNormalized) {
  const r = route || useRoute()
  return computed(() => (r.meta.pageData || {}) as PageData)
}
