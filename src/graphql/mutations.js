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
  ORG_REQUISITE_FRAGMENT,
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
  mutation CreateSpec($orgId: ID!) {
    createSpec(orgId: $orgId) {
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
export const UPDATE_PRODUCT_COST = gql`
  mutation UpdateProductCost($id: ID!, $input: ProductCostInput!) {
    updateProductCost(id: $id, input: $input) {
      clientPrice
      customClientPrice
      clientAmount
      purchasePrice
      customPurchasePrice
      purchaseAmount
    }
  }
`
export const UPDATE_PRODUCT_STORE = gql`
  mutation UpdateProductStore($id: ID!, $input: ProductStoreInput!) {
    updateProductStore(id: $id, input: $input) {
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
  }
`
export const UPDATE_PRODUCT_INFO = gql`
  mutation UpdateProductInfo($id: ID!, $input: ProductInfoInput!) {
    updateProductInfo(id: $id, input: $input) {
      images
      description
    }
  }
`
export const UPDATE_PRODUCT_LINK = gql`
  mutation UpdateProductLink($id: ID!, $input: ProductLinkInput!) {
    updateProductLink(id: $id, input: $input) {
      url
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export const SET_SPEC_CLIENT = gql`
  mutation SetSpecClient($specId: ID!, $clientId: ID!) {
    setSpecClient(specId: $specId, clientId: $clientId) {
      ...ClientFragment
    }
  }
  ${CLIENT_FRAGMENT}
`

export const SET_INVOICE_SUPPLIER = gql`
  mutation SetInvoiceSupplier($invoiceId: ID!, $supplierId: ID!) {
    setInvoiceSupplier(invoiceId: $invoiceId, supplierId: $supplierId) {
      ...SupplierFragment
    }
  }
  ${SUPPLIER_FRAGMENT}
`

export const CREATE_CLIENT = gql`
  mutation CreateClient($orgId: ID!, $input: CreateClientInput!) {
    createClient(orgId: $orgId, input: $input) {
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
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
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
  mutation CreateClientTemplate($orgId: ID!, $fromClient: ID, $input: CreateClientTemplateInput!) {
    createClientTemplate(orgId: $orgId, fromClient: $fromClient, input: $input) {
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
  mutation CreateSupplier($orgId: ID!, $input: CreateSupplierInput!) {
    createSupplier(orgId: $orgId, input: $input) {
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
  mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
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

export const CREATE_SUPPLIER_SHOP = gql`
  mutation CreateSupplierShop($supplierId: ID!, $input: SupplierShopInput!) {
    createSupplierShop(supplierId: $supplierId, input: $input) {
      ...SupplierShopFragment
      template {
        ...SupplierShopTemplateFragment
      }
    }
  }
  ${SUPPLIER_SHOP_FRAGMENT}
  ${SUPPLIER_SHOP_TEMPLATE_FRAGMENT}
`

export const UPDATE_SUPPLIER_SHOP = gql`
  mutation UpdateSupplierShop($id: ID!, $input: SupplierShopInput!) {
    updateSupplierShop(id: $id, input: $input) {
      ...SupplierShopFragment
      template {
        ...SupplierShopTemplateFragment
      }
    }
  }
  ${SUPPLIER_SHOP_FRAGMENT}
  ${SUPPLIER_SHOP_TEMPLATE_FRAGMENT}
`

export const DELETE_SUPPLIER_SHOP = gql`
  mutation DeleteSupplierShop($id: ID!) {
    deleteSupplierShop(id: $id)
  }
`

export const CREATE_SUPPLIER_TEMPLATE = gql`
  mutation CreateSupplierTemplate($orgId: ID!, $fromSupplier: ID, $input: CreateSupplierTemplateInput!) {
    createSupplierTemplate(orgId: $orgId, fromSupplier: $fromSupplier, input: $input) {
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
export const CREATE_REQUISITE = gql`
  mutation CreateRequisite($orgId: ID!, $input: RequisiteInput!) {
    createRequisite(orgId: $orgId, input: $input) {
      ...OrgRequisiteFragment
    }
  }
  ${ORG_REQUISITE_FRAGMENT}
`
export const UPDATE_REQUISITE = gql`
  mutation UpdateRequisite($id: ID!, $input: RequisiteInput!) {
    updateRequisite(id: $id, input: $input) {
      ...OrgRequisiteFragment
    }
  }
  ${ORG_REQUISITE_FRAGMENT}
`

export const DELETE_REQUISITE = gql`
  mutation DeleteRequisite($id: ID!) {
    deleteRequisite(id: $id)
  }
`
