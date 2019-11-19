import gql from 'graphql-tag'

export const SPEC_FRAGMENT = gql`
  fragment SpecFragment on Spec {
    id
    name
    totalPrice
    estimateShippingDate
  }
`

export const INVOICE_FRAGMENT = gql`
  fragment InvoiceFragment on Invoice {
    id
    name
    totalPrice
    purchaseDate
  }
`

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    count
    price
    amount
    net
    gross
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

export const INVOICE_PRODUCTS_FRAGMENT = gql`
  fragment InvoiceProductsFragment on Invoice {
    id
    products {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

const typeDefs = gql`
  input ProductInput {
    name: String,
    count: Int,
    price: Float
  }
  input InvoiceInput {
    name: String
  }
  input SpecInput {
    name: String
  }
  extend type Query {
    isLoggedIn: Boolean
  }
`

export default typeDefs
