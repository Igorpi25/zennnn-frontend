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

export type EmptyString = string | null | undefined

export type EmptyNumber = number | null | undefined

export enum CustomsTerms {
  EXW = 'EXW',
  FCA = 'FCA',
  CPT = 'CPT',
  CIP = 'CIP',
  DAT = 'DAT',
  DAP = 'DAP',
  DDP = 'DDP',
}

export enum CustomsTermsMore {
  FAS = 'FAS',
  FOB = 'FOB',
  CFR = 'CFR',
  CIF = 'CIF',
}

export const Typename = {
  SPEC: 'Spec',
  INVOICE: 'Invoice',
  PRODUCT: 'Product',
  PAPER_SPEC: 'PaperSpec',
  PAPER_INVOICE: 'PaperInvoice',
  PAPER_PRODUCT: 'PaperProduct',
  CLIENT: 'Client',
  SUPPLIER: 'Supplier',
  REQUISITE: 'Requisite',
  REQUISITE_ITEMS: 'RequisiteItems',
}

export const WordStatus = {
  DRAFT: 'DRAFT',
  DUPLICATE: 'DUPLICATE',
  APPROVED: 'APPROVED',
}
