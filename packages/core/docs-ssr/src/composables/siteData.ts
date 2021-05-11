import serialized from '@siteData'
import { Ref, ref, readonly } from 'vue'

interface SiteData<ThemeConfig = any> {
  base: string
  lang: string
  title: string
  description: string
  head: any[]
  themeConfig: ThemeConfig
  locales: Record<string, any>
  customData: any
}

export type SiteDataRef<T = any> = Ref<SiteData<T>>

export const siteDataRef: Ref<SiteData> = ref(parse(serialized))

export function useSiteData<T = any>() {
  return siteDataRef as Ref<SiteData<T>>
}

function parse(data: string): SiteData {
  return readonly(JSON.parse(data)) as SiteData
}

// hmr
if (import.meta.hot) {
  import.meta.hot!.accept('/@siteData', (m) => {
    siteDataRef.value = parse(m.default)
  })
}
