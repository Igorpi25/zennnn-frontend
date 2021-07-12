import { RouteLocationRaw } from 'vue-router'

export type NavItem = {
  text: string
  to?: RouteLocationRaw
  href?: string
}
export type NavItems = NavItem[]

export enum BillingType {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
}

export enum PaymentMethod {
  DEFAULT = 'DEFAULT',
  NEW = 'NEW',
}

export enum PaymentType {
  PROMO = 'PROMO',
  INVOICE = 'INVOICE',
  CHANGE = 'CHANGE',
  NEW_PAYMENT_METHOD = 'NEW_PAYMENT_METHOD',
}
