import gql from 'graphql-tag'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
} from './typeDefs'

export const SPECS_DELTA = gql`
  subscription delta {
    delta {
      operation
      parentId
      payload {
        __typename
        ... on Spec {
          ...SpecFragment
        }
      }
    }
  }
  ${SPEC_FRAGMENT}
`

export const SPEC_DELTA = gql`
  subscription SpecDelta ($specId: ID!) {
    specDelta (specId: $specId) {
      operation
      parentId
      payload {
        __typename
        ... on Product {
          ...ProductFragment
        }
        ... on Invoice {
          ...InvoiceFragment
          products {
            ...ProductFragment
          }
        }
        ... on Spec {
          ...SpecFragment
          invoices {
            ...InvoiceFragment
            products {
              ...ProductFragment
            }
          }
        }
      }
    }
  }
  ${SPEC_FRAGMENT}
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`
