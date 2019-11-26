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
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($specId: ID!, $inpit: CreateClientInput!) {
    createClient(specId: $specId, input: $input) {
      ...ClientFragment
      template {
        ...ClientTemplateFragment
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $inpit: ClientInput!) {
    updateClient(id: $id, input: $input) {
      ...ClientFragment
      template {
        ...ClientTemplateFragment
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

export const CREATE_CLIENT_TEMPLATE = gql`
  mutation CreateClientTemplate($specId: ID!, $inpit: CreateClientTemplateInput!) {
    createClientTemplate(specId: $specId, input: $input) {
      ...ClientTemplateFragment
    }
  }
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const DELETE_CLIENT_TEMPLATE = gql`
  mutation DeleteClientTemplate($id: ID!) {
    deleteClientTemplate(id: $id)
  }
`

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($specId: ID!, $inpit: SupplierInput!) {
    createSupplier(specId: $specId, input: $input) {
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

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($specId: ID!, $inpit: SupplierInput!) {
    updateSupplier(specId: $specId, input: $input) {
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

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id)
  }
`

export const CREATE_SUPPLIER_TEMPLATE = gql`
  mutation CreateSupplierTemplate($specId: ID!, $inpit: CreateSupplierTemplateInput!) {
    createSupplierTemplate(specId: $specId, input: $input) {
      ...SupplierTemplateFragment
    }
  }
  ${SUPPLIER_TEMPLATE_FRAGMENT}
`

export const DELETE_SUPPLIER_TEMPLATE = gql`
  mutation DeleteSupplierTemplate($id: ID!) {
    deleteSupplierTemplate(id: $id)
  }
`
