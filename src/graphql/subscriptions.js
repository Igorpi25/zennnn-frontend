import gql from 'graphql-tag'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
  CLIENT_FRAGMENT,
  ORG_REQUISITE_FRAGMENT,
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
        ... on PayloadFields {
          id
          fields
        }
        ... on RequisiteItems {
          items {
            ...OrgRequisiteFragment
          }
        }
        ... on Client {
          ...ClientFragment
        }
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
  ${CLIENT_FRAGMENT}
  ${ORG_REQUISITE_FRAGMENT}
`

export const PAPER_SPEC_DELTA = gql`
  subscription PaperSpecDelta ($specId: ID!) {
    paperSpecDelta (specId: $specId) {
      operation
      parentId
      payload {
        __typename
        ... on PayloadFields {
          id
          fields
        }
        ... on PaperProduct {
          ...PaperProductFragment
        }
        ... on PaperInvoice {
          ...PaperInvoiceFragment
          products {
            ...PaperProductFragment
          }
        }
        ... on PaperSpec {
          ...PaperSpecFragment
          invoices {
            ...PaperInvoiceFragment
            products {
              ...PaperProductFragment
            }
          }
        }
      }
    }
  }
  ${PAPER_SPEC_FRAGMENT}
  ${PAPER_INVOICE_FRAGMENT}
  ${PAPER_PRODUCT_FRAGMENT}
`
