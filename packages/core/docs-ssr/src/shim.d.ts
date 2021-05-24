/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@siteData' {
  const data: string
  export default data
}

declare module '*.json' {
  const value: any
  export default value
}

declare const __VP_HASH_MAP__: Record<string, string>
