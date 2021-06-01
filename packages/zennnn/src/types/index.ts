import { RouteLocationRaw } from 'vue-router'

export type NavItem = {
  text: string
  to?: RouteLocationRaw
  href?: string
}
export type NavItems = NavItem[]
