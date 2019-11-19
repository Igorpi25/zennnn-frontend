import gql from 'graphql-tag'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
} from './typeDefs'

export const LOGIN = gql`
  mutation Login {
    login {
      id
      email
      givenName
      familyName
      picture
    }
  }
`

export const CREATE_SPEC = gql`
  mutation CreateSpec {
    createSpec {
      ...SpecFragment
    }
  }
  ${SPEC_FRAGMENT}
`

export const UPDATE_SPEC = gql`
  mutation UpdateSpec($specId: ID!, $specInput: SpecInput!) {
    updateSpec(specId: $specId, specInput: $specInput) {
      ...SpecFragment
    }
  }
  ${SPEC_FRAGMENT}
`

export const DELETE_SPEC = gql`
  mutation DeleteSpec($specId: ID!) {
    deleteSpec(specId: $specId)
  }
`

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($specId: ID!) {
    createInvoice(specId: $specId) {
      ...InvoiceFragment
      products {
        ...ProductFragment
      }
    }
  }
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($invoiceId: ID!, $invoiceInput: InvoiceInput!) {
    updateInvoice(invoiceId: $invoiceId, invoiceInput: $invoiceInput) {
      ...InvoiceFragment
    }
  }
  ${INVOICE_FRAGMENT}
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($invoiceId: ID!) {
    createProduct(invoiceId: $invoiceId) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($productId: ID!, $productInput: ProductInput!) {
    updateProduct(productId: $productId, productInput: $productInput) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`
