import gql from 'graphql-tag'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  CLIENT_FRAGMENT,
  CLIENT_TEMPLATE_FRAGMENT,
  SUPPLIER_FRAGMENT,
  SUPPLIER_TEMPLATE_FRAGMENT,
  SUPPLIER_SHOP_FRAGMENT,
  SUPPLIER_SHOP_TEMPLATE_FRAGMENT,
} from './typeDefs'

export const GET_ORGS = gql`
  query GetOrgs {
    getOrgs {
      id
      owner {
        id
        email
        givenName
        familyName
        picture
      }
      role
    }
  }
`

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
  query GetSpec($id: ID!) {
    getSpec(id: $id) {
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

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    getClient(id: $id) {
      ...ClientFragment
      template {
        ...ClientTemplateFragment
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const LIST_CLIENTS = gql`
  query ListClients($specId: ID!) {
    listClients(specId: $specId) {
      items {
        ...ClientFragment
        template {
          ...ClientTemplateFragment
        }
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const LIST_CLIENT_TEMPLATES = gql`
  query ListClientTemplates($specId: ID!) {
    listClientTemplates(specId: $specId) {
      items {
        ...ClientTemplateFragment
      }
    }
  }
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const SEARCH_CLIENTS = gql`
  query SearchClients($specId: ID!, $search: String) {
    listClients(specId: $specId, search: $search) {
      items {
        ...ClientFragment
        template {
          ...ClientTemplateFragment
        }
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const GET_SUPPLIER = gql`
  query GetSupplier($id: ID!) {
    getSupplier(id: $id) {
      ...SupplierFragment
      template {
        ...SupplierTemplateFragment
      }
      shops {
        ...SupplierShopFragment
        template {
          ...SupplierShopTemplateFragment
        }
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_TEMPLATE_FRAGMENT}
  ${SUPPLIER_SHOP_FRAGMENT}
  ${SUPPLIER_SHOP_TEMPLATE_FRAGMENT}
`

export const LIST_SUPPLIERS = gql`
  query ListSuppliers($specId: ID!) {
    listSuppliers(specId: $specId) {
      items {
        ...SupplierFragment
        template {
          ...SupplierTemplateFragment
        }
        shops {
          ...SupplierShopFragment
          template {
            ...SupplierShopTemplateFragment
          }
        }
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_TEMPLATE_FRAGMENT}
  ${SUPPLIER_SHOP_FRAGMENT}
  ${SUPPLIER_SHOP_TEMPLATE_FRAGMENT}
`

export const LIST_SUPPLIER_TEMPLATES = gql`
  query ListSupplierTemplates($specId: ID!) {
    listSupplierTemplates(specId: $specId) {
      items {
        ...SupplierTemplateFragment
      }
    }
  }
  ${SUPPLIER_TEMPLATE_FRAGMENT}
`

export const SEARCH_SUPPLIERS = gql`
  query SearchSuppliers($specId: ID!) {
    searchSuppliers(specId: $specId) {
      items {
        ...SupplierFragment
        template {
          ...SupplierTemplateFragment
        }
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_TEMPLATE_FRAGMENT}
`
