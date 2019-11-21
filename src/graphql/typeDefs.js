import gql from 'graphql-tag'

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    productStatus
    name
    article
    qty
    cost {
      clientPrice
      customClientPrice
      clientAmount
      sellingPrice
      customSellingPrice
      sellingAmount
    }
    store {
      net
      gross
      width
      height
      length
      volume
      weight
      atWhouse
      pkgQty
      pkgNo
    }
    info {
      images
      description
    }
    link {
      url
    }
    createdAt
    updatedAt
  }
`

export const INVOICE_FRAGMENT = gql`
  fragment InvoiceFragment on Invoice {
    id
    invoiceStatus
    invoiceNo
    purchaseDate
    shippingDate
    profitType
    profitPercent
    profitForAll
    discount
    prepayment
    prepaymentDate
    obtainCost
    obtainCostDate
    clientDebt
    clientDebtDate
    totalClientAmount
    totalSellingAmount
    totalNet
    totalGross
    totalVolume
    totalWeight
    totalPkgQty
    createdAt
    updatedAt
  }
`

export const INVOICE_PRODUCTS_FRAGMENT = gql`
  fragment InvoiceProductsFragment on Invoice {
    id
    products {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const SPEC_FRAGMENT = gql`
  fragment SpecFragment on Spec {
    id
    specStatus
    specNo
    estimateShippingDate
    shipped
    totalVolume
    totalWeight
    qtyOfPackages
    finalCost
    finalObtainCost
    profit
    totalPrepay
    totalClientDebt
    currency
    currencyRate
    customCurrencyRate
    createdAt
    updatedAt
  }
`

export const SPEC_INVOICES_FRAGMENT = gql`
  fragment SpecInvoicesFragment on Spec {
    id
    invoices {
      ...InvoiceFragment
      products {
        ...ProductFragment
      }
    }
  }
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean
  }
`

export default typeDefs
