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
  mutation UpdateSpec($id: ID!, $input: SpecInput!) {
    updateSpec(id: $id, input: $input) {
      ...SpecFragment
    }
  }
  ${SPEC_FRAGMENT}
`

export const DELETE_SPEC = gql`
  mutation DeleteSpec($id: ID!) {
    deleteSpec(id: $id)
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
  mutation UpdateInvoice($id: ID!, $input: InvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
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
  mutation updateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`
