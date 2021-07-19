import { gql } from '@apollo/client/core'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  CLIENT_FRAGMENT,
  SUPPLIER_FRAGMENT,
  SUPPLIER_BRANCH_FRAGMENT,
  ORG_CONTRACT_FRAGMENT,
  ORG_REQUISITE_FRAGMENT,
  BANK_DETAIL_FRAGMENT,
} from './fragments'

export const CREATE_WORD = gql`
  mutation CreateWord($orgId: ID!, $input: CreateWordInput!) {
    createWord(orgId: $orgId, input: $input) {
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
`

export const UPDATE_WORD = gql`
  mutation UpdateWord($orgId: ID!, $input: UpdateWordInput!) {
    updateWord(orgId: $orgId, input: $input) {
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
`

export const UPDATE_PAYMENT_SUBSCRIPTION = gql`
  mutation UpdatePaymentSubscription(
    $priceId: String!
    $paymentMethodId: String
  ) {
    updatePaymentSubscription(
      priceId: $priceId
      paymentMethodId: $paymentMethodId
    )
  }
`

export const CREATE_PROMO_SUBSCRIPTION = gql`
  mutation CreatePromoSubscription($paymentMethodId: String!) {
    createPromoSubscription(paymentMethodId: $paymentMethodId)
  }
`

export const CANCEL_PAYMENT_SUBSCRIPTION = gql`
  mutation CancelPaymentSubscription {
    cancelPaymentSubscription
  }
`

export const RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD = gql`
  mutation RetryInvoiceWithNewPaymentMethod(
    $paymentMethodId: String!
    $invoiceId: String!
  ) {
    retryInvoiceWithNewPaymentMethod(
      paymentMethodId: $paymentMethodId
      invoiceId: $invoiceId
    )
  }
`

export const SET_DEFAULT_PAYMENT_METHOD = gql`
  mutation SetDefaultPaymentMethod($paymentMethodId: String!) {
    setDefaultPaymentMethod(paymentMethodId: $paymentMethodId)
  }
`

export const ATTACH_PAYMENT_METHOD = gql`
  mutation AttachPaymentMethod(
    $paymentMethodId: String!
    $setDefault: Boolean
  ) {
    attachPaymentMethod(
      paymentMethodId: $paymentMethodId
      setDefault: $setDefault
    )
  }
`

export const DETACH_PAYMENT_METHOD = gql`
  mutation DetachPaymentMethod($paymentMethodId: String!) {
    detachPaymentMethod(paymentMethodId: $paymentMethodId)
  }
`

export const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress(
    $country: String!
    $city: String!
    $street: String!
    $postcode: String!
  ) {
    setBillingAddress(
      country: $country
      city: $city
      street: $street
      postcode: $postcode
    )
  }
`

export const SIGNUP = gql`
  mutation Signup(
    $givenName: String!
    $familyName: String!
    $email: String!
    $password: String!
    $locale: String!
    $priceId: String
  ) {
    signup(
      givenName: $givenName
      familyName: $familyName
      email: $email
      password: $password
      locale: $locale
      priceId: $priceId
    ) {
      id
      email
      givenName
      familyName
      picture
      locale
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

export const NOTE_GREETING = gql`
  mutation NoteGreeting {
    noteGreeting
  }
`

export const PREMIUM_CONTACT = gql`
  mutation PremiumContact($name: String!, $email: String!) {
    premiumContact(name: $name, email: $email)
  }
`

export const COMPLITE_REGISTRATION = gql`
  mutation CompliteRegistration($givenName: String!, $familyName: String!) {
    compliteRegistration(givenName: $givenName, familyName: $familyName)
  }
`

export const CREATE_SPEC = gql`
  mutation CreateSpec($orgId: ID!, $clientId: ID) {
    createSpec(orgId: $orgId, clientId: $clientId) {
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
  mutation CreateInvoice($specId: ID!, $input: CreateInvoiceInput) {
    createInvoice(specId: $specId, input: $input) {
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
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      ...InvoiceFragment
    }
  }
  ${INVOICE_FRAGMENT}
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($invoiceId: ID!, $input: ProductInput) {
    createProduct(invoiceId: $invoiceId, input: $input) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const CREATE_PRODUCT_WITH_INVOICE = gql`
  mutation CreateProductWithInvoice($specId: ID!, $input: ProductInput) {
    createProductWithInvoice(specId: $specId, input: $input) {
      ...InvoiceFragment
      products {
        ...ProductFragment
      }
    }
  }
  ${INVOICE_FRAGMENT}
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
      images {
        url
        filename
        contentType
      }
      description
    }
  }
`
export const ADD_PRODUCT_IMAGE = gql`
  mutation AddProductImage(
    $id: ID!
    $inputImages: [AttachFileInput!]!
    $unshift: Boolean
  ) {
    addProductImage(id: $id, inputImages: $inputImages, unshift: $unshift)
  }
`
export const REMOVE_PRODUCT_IMAGE = gql`
  mutation RemoveProductImage($id: ID!, $inputImages: [AttachFileInput!]!) {
    removeProductImage(id: $id, inputImages: $inputImages)
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
  mutation CreateClient($orgId: ID!, $groupId: ID, $input: CreateClientInput!) {
    createClient(orgId: $orgId, groupId: $groupId, input: $input) {
      ...ClientFragment
    }
  }
  ${CLIENT_FRAGMENT}
`

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      ...ClientFragment
    }
  }
  ${CLIENT_FRAGMENT}
`

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($orgId: ID!, $input: CreateSupplierInput!) {
    createSupplier(orgId: $orgId, input: $input) {
      ...SupplierFragment
      branches {
        ...SupplierBranchFragment
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_BRANCH_FRAGMENT}
`

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      ...SupplierFragment
      branches {
        ...SupplierBranchFragment
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
  ${SUPPLIER_BRANCH_FRAGMENT}
`

export const DELETE_SUPPLIER = gql`
  mutation DeleteSupplier($id: ID!) {
    deleteSupplier(id: $id)
  }
`

export const CREATE_SUPPLIER_BRANCH = gql`
  mutation CreateSupplierBranch(
    $supplierId: ID!
    $input: SupplierBranchInput!
  ) {
    createSupplierBranch(supplierId: $supplierId, input: $input) {
      ...SupplierBranchFragment
    }
  }
  ${SUPPLIER_BRANCH_FRAGMENT}
`

export const UPDATE_SUPPLIER_BRANCH = gql`
  mutation UpdateSupplierBranch($id: ID!, $input: SupplierBranchInput!) {
    updateSupplierBranch(id: $id, input: $input) {
      ...SupplierBranchFragment
    }
  }
  ${SUPPLIER_BRANCH_FRAGMENT}
`

export const DELETE_SUPPLIER_BRANCH = gql`
  mutation DeleteSupplierBranch($id: ID!) {
    deleteSupplierBranch(id: $id)
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

export const CREATE_COMPANY_BANK_DETAIL = gql`
  mutation CreateCompanyBankDetail($companyId: ID!, $input: BankDetailInput!) {
    createCompanyBankDetail(companyId: $companyId, input: $input) {
      ...BankDetailFragment
    }
  }
  ${BANK_DETAIL_FRAGMENT}
`

export const UPDATE_COMPANY_BANK_DETAIL = gql`
  mutation UpdateCompanyBankDetail(
    $companyId: ID!
    $id: ID!
    $input: BankDetailInput!
  ) {
    updateCompanyBankDetail(companyId: $companyId, id: $id, input: $input) {
      ...BankDetailFragment
    }
  }
  ${BANK_DETAIL_FRAGMENT}
`

export const DELETE_COMPANY_BANK_DETAIL = gql`
  mutation DeleteCompanyBankDetail($companyId: ID!, $id: ID!) {
    deleteCompanyBankDetail(companyId: $companyId, id: $id)
  }
`

export const SET_DEFAULT_REQUISITE = gql`
  mutation SetDefaultReqisite($orgId: ID!, $id: ID!) {
    setDefaultReqisite(orgId: $orgId, id: $id)
  }
`

export const SET_ORG_AVATAR = gql`
  mutation SetOrgAvatar($orgId: ID!, $avatar: String!) {
    setOrgAvatar(orgId: $orgId, avatar: $avatar)
  }
`

export const CREATE_CONTRACT = gql`
  mutation CreateContract($orgId: ID!, $input: CreateContractInput!) {
    createContract(orgId: $orgId, input: $input) {
      ...OrgContractFragment
    }
  }
  ${ORG_CONTRACT_FRAGMENT}
`

export const UPDATE_CONTRACT = gql`
  mutation UpdateContract($id: ID!, $input: UpdateContractInput!) {
    updateContract(id: $id, input: $input) {
      ...OrgContractFragment
    }
  }
  ${ORG_CONTRACT_FRAGMENT}
`

export const DELETE_CONTRACT = gql`
  mutation DeleteContract($id: ID!) {
    deleteContract(id: $id)
  }
`

export const INVITE_USER_TO_ORG = gql`
  mutation InviteUserToOrg($orgId: ID!, $input: UserInvitationInput!) {
    inviteUserToOrg(orgId: $orgId, input: $input)
  }
`

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($id: ID!) {
    acceptInvitation(id: $id)
  }
`

export const DECLINE_INVITATION = gql`
  mutation DeclineInvitation($id: ID!) {
    declineInvitation(id: $id)
  }
`

export const CANCEL_INVITATION = gql`
  mutation CancelInvitation($id: ID!) {
    cancelInvitation(id: $id)
  }
`

export const REMOVE_USER_FROM_ORG = gql`
  mutation RemoveUserFromOrg($orgId: ID!, $userId: ID!) {
    removeUserFromOrg(orgId: $orgId, userId: $userId)
  }
`

export const OPEN_LINK_ACCESS = gql`
  mutation OpenLinkAccess($specId: ID!) {
    openLinkAccess(specId: $specId)
  }
`

export const CLOSE_LINK_ACCESS = gql`
  mutation CloseLinkAccess($specId: ID!) {
    closeLinkAccess(specId: $specId)
  }
`

export const ADD_EMAIL_ACCESS_TO_SPEC = gql`
  mutation AddEmailAccessToSpec($specId: ID!, $email: String!) {
    addEmailAccessToSpec(specId: $specId, email: $email)
  }
`

export const REMOVE_EMAIL_ACCESS_TO_SPEC = gql`
  mutation RemoveEmailAccessToSpec($specId: ID!, $email: String!) {
    removeEmailAccessToSpec(specId: $specId, email: $email)
  }
`

export const SEND_LINK_ACCESS_TO_EMAIL = gql`
  mutation SendLinkAccessToEmail($specId: ID!, $email: String!) {
    sendLinkAccessToEmail(specId: $specId, email: $email)
  }
`

export const ADD_COMMENT_TO_SPEC = gql`
  mutation AddCommentToSpec($specId: ID!, $comment: String!) {
    addCommentToSpec(specId: $specId, comment: $comment)
  }
`

export const REPLY_TO_SPEC_COMMENT = gql`
  mutation ReplyToSpecComment(
    $specId: ID!
    $commentId: ID!
    $comment: String!
  ) {
    replyToSpecComment(
      specId: $specId
      commentId: $commentId
      comment: $comment
    )
  }
`

export const ADD_COMMENT_TO_PRODUCT = gql`
  mutation AddCommentToProduct($productId: ID!, $comment: String!) {
    addCommentToProduct(productId: $productId, comment: $comment)
  }
`

export const REPLY_TO_PRODUCT_COMMENT = gql`
  mutation ReplyToProductComment(
    $productId: ID!
    $commentId: ID!
    $comment: String!
  ) {
    replyToProductComment(
      productId: $productId
      commentId: $commentId
      comment: $comment
    )
  }
`

export const ADD_COMMENT_TO_PAPER_SPEC = gql`
  mutation AddCommentToPaperSpec($specId: ID!, $comment: String!) {
    addCommentToPaperSpec(specId: $specId, comment: $comment)
  }
`

export const REPLY_TO_PAPER_SPEC_COMMENT = gql`
  mutation ReplyToPaperSpecComment(
    $specId: ID!
    $commentId: ID!
    $comment: String!
  ) {
    replyToPaperSpecComment(
      specId: $specId
      commentId: $commentId
      comment: $comment
    )
  }
`

export const ADD_COMMENT_TO_PAPER_PRODUCT = gql`
  mutation AddCommentToPaperProduct($productId: ID!, $comment: String!) {
    addCommentToPaperProduct(productId: $productId, comment: $comment)
  }
`

export const REPLY_TO_PAPER_PRODUCT_COMMENT = gql`
  mutation ReplyToPaperProductComment(
    $productId: ID!
    $commentId: ID!
    $comment: String!
  ) {
    replyToPaperProductComment(
      productId: $productId
      commentId: $commentId
      comment: $comment
    )
  }
`

export const MARK_SPEC_COMMENTS_AS_VIEWED = gql`
  mutation MarkSpecCommentsAsViewed($specId: ID!, $commentsIds: [ID!]) {
    markSpecCommentsAsViewed(specId: $specId, commentsIds: $commentsIds)
  }
`

export const MARK_PRODUCT_COMMENTS_AS_VIEWED = gql`
  mutation MarkProductCommentsAsViewed($productId: ID!, $commentsIds: [ID!]) {
    markProductCommentsAsViewed(
      productId: $productId
      commentsIds: $commentsIds
    )
  }
`

export const MARK_PAPER_SPEC_COMMENTS_AS_VIEWED = gql`
  mutation MarkPaperSpecCommentsAsViewed($specId: ID!, $commentsIds: [ID!]) {
    markPaperSpecCommentsAsViewed(specId: $specId, commentsIds: $commentsIds)
  }
`

export const MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED = gql`
  mutation MarkPaperProductCommentsAsViewed(
    $productId: ID!
    $commentsIds: [ID!]
  ) {
    markPaperProductCommentsAsViewed(
      productId: $productId
      commentsIds: $commentsIds
    )
  }
`

export const SET_SPEC_CONTAINER_SIZE = gql`
  mutation SetSpecContainerSize(
    $specId: ID!
    $containerId: ID!
    $inputSize: ContainerSize!
    $inputMode: ContainerMode
  ) {
    setSpecContainerSize(
      specId: $specId
      containerId: $containerId
      inputSize: $inputSize
      inputMode: $inputMode
    )
  }
`

export const SET_SPEC_CONTAINER_CUSTOM_CAPACITY = gql`
  mutation SetSpecContainerCustomCapacity(
    $specId: ID!
    $containerId: ID!
    $inputCapacity: Float
    $inputShrink: Float
  ) {
    setSpecContainerCustomCapacity(
      specId: $specId
      containerId: $containerId
      inputCapacity: $inputCapacity
      inputShrink: $inputShrink
    )
  }
`

export const INIT_SPEC_SIMPLE_UI = gql`
  mutation InitSpecSimpleUI {
    initSpecSimpleUI @client
  }
`

export const SET_SPEC_SIMPLE_UI = gql`
  mutation SetSpecSimpleUI($value: Boolean) {
    setSpecSimpleUI(value: $value) @client
  }
`

export const SET_SPEC_ACTIVE_TAB = gql`
  mutation SetSpecActiveTab($specId: ID!, $tab: Int!) {
    setSpecActiveTab(specId: $specId, tab: $tab) @client
  }
`

export const SET_SPEC_EXPANDED_INVOICES = gql`
  mutation SetSpecExpandedInvoices(
    $specId: ID!
    $ids: [ID!]!
    $prefix: String
  ) {
    setSpecExpandedInvoices(specId: $specId, ids: $ids, prefix: $prefix) @client
  }
`

export const ADD_SPEC_EXPANDED_INVOICES = gql`
  mutation AddSpecExpandedInvoices(
    $specId: ID!
    $ids: [ID!]!
    $prefix: String
  ) {
    addSpecExpandedInvoices(specId: $specId, ids: $ids, prefix: $prefix) @client
  }
`

export const REMOVE_SPEC_EXPANDED_INVOICES = gql`
  mutation RemoveSpecExpandedInvoices(
    $specId: ID!
    $ids: [ID!]!
    $prefix: String
  ) {
    removeSpecExpandedInvoices(specId: $specId, ids: $ids, prefix: $prefix)
      @client
  }
`
