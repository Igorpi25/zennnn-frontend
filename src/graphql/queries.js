import gql from 'graphql-tag'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
} from './typeDefs'

export const GET_ROLE_IN_PROJECT = gql`
  query GetRoleInProject($specId: ID!) {
    roleInProject(specId: $specId)
  }
`

export const GET_IS_LOGGED_IN = gql`
  query GetIsLoggedIn {
    isLoggedIn @client
  }
`

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      email
      givenName
      familyName
      picture
    }
  }
`

export const GET_SPECS = gql`
  query GetSpecs {
    getSpecs {
      ...SpecFragment
    }
  }
  ${SPEC_FRAGMENT}
`

export const GET_SPEC = gql`
  query GetSpec ($id: ID!) {
    getSpec (id: $id) {
      ...SpecFragment
      invoices {
        ...InvoiceFragment
        products {
          ...ProductFragment
        }
      }
    }
  }
  ${SPEC_FRAGMENT}
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`
