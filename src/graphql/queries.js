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
  ORG_CONTRACT_FRAGMENT,
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
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
        language
      }
      role
      defaultRequisite
      name
      nameEng
      location
      picture
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

export const GET_BACKEND_VERSION = gql`
  query GetBackendVersion {
    backendVersion @client
  }
`

export const GET_IS_SPEC_SYNC = gql`
  query GetIsSpecSync {
    isSpecSync @client
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
      initialized
      language
    }
  }
`

export const GET_SPECS = gql`
  query GetSpecs($orgId: ID!) {
    getSpecs(orgId: $orgId) {
      ...SpecFragment
      client {
        id
        uid
        customUid
        clientType
        createdAt
        updatedAt
        # legal
        companyName
        phone
        fax
        # natural
        firstName
        lastName
        middleName
        passportId
        mobilePhone
        additionalPhone
      }
    }
  }
  ${SPEC_FRAGMENT}
`

export const GET_SPEC = gql`
  query GetSpec($id: ID!) {
    getSpec(id: $id) {
      activeTab @client
      expandedInvoices @client
      ...SpecFragment
      invoices {
        ...InvoiceFragment
        products {
          ...ProductFragment
        }
      }
      client {
        id
        uid
        customUid
        clientType
        createdAt
        updatedAt
        # legal
        companyName
        phone
        fax
        # natural
        firstName
        lastName
        middleName
        passportId
        mobilePhone
        additionalPhone
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
  query ListClients($orgId: ID!) {
    listClients(orgId: $orgId) {
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
  query ListClientTemplates($orgId: ID!) {
    listClientTemplates(orgId: $orgId) {
      items {
        ...ClientTemplateFragment
      }
    }
  }
  ${CLIENT_TEMPLATE_FRAGMENT}
`

export const SEARCH_CLIENTS = gql`
  query SearchClients($orgId: ID!, $search: String!) {
    searchClients(orgId: $orgId, search: $search) {
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
  query ListSuppliers($orgId: ID!) {
    listSuppliers(orgId: $orgId) {
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
  query ListSupplierTemplates($orgId: ID!) {
    listSupplierTemplates(orgId: $orgId) {
      items {
        ...SupplierTemplateFragment
      }
    }
  }
  ${SUPPLIER_TEMPLATE_FRAGMENT}
`

export const SEARCH_SUPPLIERS = gql`
  query SearchSuppliers($orgId: ID!, $search: String!) {
    searchSuppliers(orgId: $orgId, search: $search) {
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
export const GET_ORG_REQUISITE = gql`
  query GetOrgRequisite($id: ID!) {
    getOrgRequisite(id: $id) {
      ...OrgRequisiteFragment
    }
  }
  ${ORG_REQUISITE_FRAGMENT}
`

export const LIST_ORG_REQUISITES = gql`
  query ListOrgRequisites($orgId: ID!) {
    listOrgRequisites(orgId: $orgId) {
      ...OrgRequisiteFragment
    }
  }
  ${ORG_REQUISITE_FRAGMENT}
`

export const LIST_ORG_CONTRACTS = gql`
  query ListOrgContracts($orgId: ID!) {
    listOrgContracts(orgId: $orgId) {
      ...OrgContractFragment
    }
  }
  ${ORG_CONTRACT_FRAGMENT}
`

export const CHECK_INVITATION = gql`
  query CheckInvitation($id: ID!) {
    checkInvitation(id: $id) {
      orgId
      owner {
        givenName
        familyName
        picture
      }
    }
  }
`

export const LIST_ORG_INVITATIONS = gql`
  query ListOrgInvitations($orgId: ID!) {
    listOrgInvitations(orgId: $orgId) {
      id
      invitationEmail
      invitationGivenName
      invitationFamilyName
      invitationRole
      status
      createdAt
      updatedAt
    }
  }
`

export const LIST_STAFF = gql`
  query ListStaff($orgId: ID!) {
    listStaff(orgId: $orgId) {
      items {
        id
        givenName
        familyName
        picture
        role
        inWorkCount
        finalCost
        finalObtainCost
        profit
        totalPrepay
        totalClientDebt
        specs {
          ...SpecFragment
        }
      }
    }
  }
  ${SPEC_FRAGMENT}
`

export const GET_SPEC_LINK_ACCESS = gql`
  query GetSpecLinkAccess($id: ID!) {
    getSpecLinkAccess(id: $id)
  }
`

export const GET_SPEC_EMAIL_ACCESS = gql`
  query GetSpecEmailAccess($id: ID!) {
    getSpecEmailAccess(id: $id) {
      email
    }
  }
`

export const GET_PAPER_SPEC = gql`
  query GetPaperSpec($id: ID!) {
    getPaperSpec(id: $id) {
      expandedInvoices @client
      ...PaperSpecFragment
      invoices {
        ...PaperInvoiceFragment
        products {
          ...PaperProductFragment
        }
      }
    }
  }
  ${PAPER_SPEC_FRAGMENT}
  ${PAPER_INVOICE_FRAGMENT}
  ${PAPER_PRODUCT_FRAGMENT}
`
