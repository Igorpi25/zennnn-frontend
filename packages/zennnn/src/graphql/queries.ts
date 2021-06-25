import { gql } from '@apollo/client/core'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  CLIENT_FRAGMENT,
  CLIENT_ITEM_FRAGMENT,
  SUPPLIER_FRAGMENT,
  SUPPLIER_ITEM_FRAGMENT,
  SUPPLIER_BRANCH_FRAGMENT,
  ORG_REQUISITE_FRAGMENT,
  ORG_CONTRACT_FRAGMENT,
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
} from './fragments'

export const LIST_WORDS = gql`
  query ListWords($orgId: ID!) {
    listWords(orgId: $orgId) {
      items {
        id
        status
        defaultLocale
        values {
          k
          v
          tr
        }
      }
    }
  }
`

export const SEARCH_WORDS = gql`
  query SearchWords($orgId: ID!, $search: String!, $locale: String!) {
    searchWords(orgId: $orgId, search: $search, locale: $locale) {
      items {
        id
        status
        defaultLocale
        values {
          k
          v
          tr
        }
      }
    }
  }
`

export const GET_WORD_SPECS = gql`
  query GetWordSpecs($orgId: ID!, $id: ID!) {
    getWordSpecs(orgId: $orgId, id: $id) {
      specId
      specNo
    }
  }
`

export const TRANSLATE_WORD = gql`
  query TranslateWord($orgId: ID!, $text: String!, $sourceLang: String!) {
    translateWord(orgId: $orgId, text: $text, sourceLang: $sourceLang) {
      k
      v
      tr
    }
  }
`

export const LIST_PRICES = gql`
  query ListPrices {
    listPrices
  }
`

export const LIST_PAYMENT_METHODS = gql`
  query ListPaymentMethods {
    listPaymentMethods
  }
`

export const LIST_PAYMENT_INVOICES = gql`
  query ListPaymentInvoices {
    listPaymentInvoices
  }
`

export const GET_INVITE_USER_TO_ORG = gql`
  query GetInviteUserToOrg($orgId: ID!, $email: String!) {
    getInviteUserToOrg(orgId: $orgId, email: $email) {
      id
      email
      givenName
      familyName
      picture
      locale
    }
  }
`

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
        locale
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

export const GET_IS_SPEC_SYNC = gql`
  query GetIsSpecSync {
    isSpecSync @client
  }
`

export const SPEC_SIMPLE_UI_OFF = gql`
  query SpecSimpleUIOff {
    specSimpleUIOff @client
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
      locale
      isGreeted
      account {
        id
        customerId
        subscriptionId
        subscriptionStatus
        latestInvoiceId
        price
        productId
        priceId
        canPromo
        hasBillingAddress
        periodEnd
        cancelAtPeriodEnd
        org
      }
    }
  }
`

export const GET_SPECS = gql`
  query GetSpecs($orgId: ID!, $clientsIds: [ID!], $clientType: ClientType) {
    getSpecs(orgId: $orgId, clientsIds: $clientsIds, clientType: $clientType) {
      id
      specStatus
      isMoneyRecieved
      isExpensesPaid
      finalCost
      margin
      specNo
      shipped
      hasNewComment
      employeeId
      employeeFullName
      employeeRole
      createdAt
      updatedAt
      client {
        id
        groupId
        uid
        clientType
        locale
        createdAt
        updatedAt
        fullName
        contactPersonFullName
        contactPhone
        email
      }
    }
  }
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
        clientType
        createdAt
        updatedAt
        # legal
        companyName
        phone {
          phone
        }
        fax {
          phone
        }
        # private
        passportId
        mobilePhone {
          phone
        }
        fullName
      }
    }
  }
  ${SPEC_FRAGMENT}
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`

export const GET_ORG_NEXT_CLIENT_UID = gql`
  query GetOrgNextClientUid($orgId: ID!) {
    getOrgNextClientUid(orgId: $orgId)
  }
`

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    getClient(id: $id) {
      ...ClientFragment
    }
  }
  ${CLIENT_FRAGMENT}
`

export const GET_CLIENT_GROUP = gql`
  query GetClientGroup($orgId: ID!, $groupId: ID!) {
    getClientGroup(orgId: $orgId, groupId: $groupId) {
      id
      uid
      LEGAL
      PRIVATE
      OTHER
    }
  }
`

export const LIST_CLIENTS = gql`
  query ListClients($orgId: ID!) {
    listClients(orgId: $orgId) {
      items {
        ...ClientItemFragment
      }
    }
  }
  ${CLIENT_ITEM_FRAGMENT}
`

export const GET_CLIENTS_BY_ID = gql`
  query GetClientsById($orgId: ID!, $ids: [ID!]) {
    getClientsById(orgId: $orgId, ids: $ids) {
      items {
        id
        groupId
        uid
        clientType
        createdAt
        updatedAt
        contactPerson {
          fullName
        }
        tags
      }
    }
  }
`

export const SEARCH_CLIENTS = gql`
  query SearchClients($orgId: ID!, $search: String!) {
    searchClients(orgId: $orgId, search: $search) {
      items {
        ...ClientFragment
      }
    }
  }
  ${CLIENT_FRAGMENT}
`

export const GET_ORG_NEXT_SUPPLIER_UID = gql`
  query GetOrgNextSupplierUid($orgId: ID!) {
    getOrgNextSupplierUid(orgId: $orgId)
  }
`

export const GET_SUPPLIER = gql`
  query GetSupplier($id: ID!) {
    getSupplier(id: $id) {
      ...SupplierFragment
      branches {
        ...SupplierBranchFragment
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_BRANCH_FRAGMENT}
`

export const LIST_SUPPLIERS = gql`
  query ListSuppliers($orgId: ID!) {
    listSuppliers(orgId: $orgId) {
      items {
        ...SupplierItemFragment
      }
    }
  }
  ${SUPPLIER_ITEM_FRAGMENT}
`

export const SEARCH_SUPPLIERS = gql`
  query SearchSuppliers($orgId: ID!, $search: String!) {
    searchSuppliers(orgId: $orgId, search: $search) {
      items {
        ...SupplierFragment
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
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
      orgName
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
        processing
        revenue
        totalItemsCost
        totalMargin
        diff
        specStatus
        specs {
          id
          specStatus
          isMoneyRecieved
          isExpensesPaid
          specNo
          clientFullName
          shipped
          revenue
          totalItemsCost
          totalMargin
          diff
        }
      }
      invitations {
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
  }
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
