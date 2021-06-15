import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Ref } from 'vue'
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

export type PageDataMap = Record<string, PageData>

export const pageDataMap: Ref<PageDataMap> = ref({})

export function usePageData(route?: RouteLocationNormalized) {
  const r = route || useRoute()
  return computed(() => pageDataMap.value[r.path] || {})
}
