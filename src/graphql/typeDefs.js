import gql from 'graphql-tag'

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    productStatus
    name
    article
    qty
    cost {
      clientPrice
      customClientPrice
      clientAmount
      purchasePrice
      customPurchasePrice
      purchaseAmount
    }
    store {
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
    info {
      images
      description
    }
    link {
      url
    }
    createdAt
    updatedAt
  }
`

export const SUPPLIER_FRAGMENT = gql`
  fragment SupplierFragment on Supplier {
    id
    createdAt
    updatedAt
    companyNameSl
    companyNameCl
    website
    companyType
    fieldOfActivity
    legalAddress
    legalAddressPostcode
    manufacturersAddress
    manager
    workPhone
    fax
    mobilePhone
    wechat
    email
    skype
    qq
    bankName
    bankAddress
    accountNumber
    swift
    ownerFullName
    ownerJobPosition
    responsiblePerson
    deliveryAddress
    contactNumber
    note
  }
`

export const INVOICE_FRAGMENT = gql`
  fragment InvoiceFragment on Invoice {
    id
    supplier {
      ...SupplierFragment
    }
    invoiceStatus
    invoiceNo
    purchaseDate
    shippingDate
    profitType
    profitPercent
    profitForAll
    discount
    prepayment
    prepaymentDate
    obtainCost
    obtainCostDate
    clientDebt
    clientDebtDate
    totalClientAmount
    totalPurchaseAmount
    totalNet
    totalGross
    totalVolume
    totalWeight
    totalPkgQty
    createdAt
    updatedAt
  }
  ${SUPPLIER_FRAGMENT}
`

export const INVOICE_PRODUCTS_FRAGMENT = gql`
  fragment InvoiceProductsFragment on Invoice {
    id
    products {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const CLIENT_FRAGMENT = gql`
  fragment ClientFragment on Client {
    id
    uid
    customUid
    clientType
    createdAt
    updatedAt
    # legal
    companyName
    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    phone
    fax
    email
    itn
    iec
    psrn
    bankName
    bankAddress
    bankAccountNumber
    correspondentAccountNumber
    bic
    okpo
    swift
    ownerFullName
    ownerJobPosition
    consignee
    shippingAddress
    contactPerson
    contactMobilePhone
    legalTypeNote
    # natural
    firstName
    lastName
    middleName
    passportId
    mobilePhone
    additionalPhone
    address
    deliveryAddress
    naturalTypeNote
  }
`

export const SPEC_FRAGMENT = gql`
  fragment SpecFragment on Spec {
    id
    client {
      ...ClientFragment
    }
    specStatus
    specNo
    estimateShippingDate
    shipped
    totalVolume
    totalWeight
    qtyOfPackages
    finalCost
    finalObtainCost
    profit
    totalPrepay
    totalClientDebt
    currency
    currencyRate
    customCurrencyRate
    createdAt
    updatedAt
  }
  ${CLIENT_FRAGMENT}
`

export const CLIENT_TEMPLATE_FRAGMENT = gql`
  fragment ClientTemplateFragment on ClientTemplate {
    id
    templateName
    customUid
    # legal
    companyName
    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    phone
    fax
    email
    itn
    iec
    psrn
    bankName
    bankAddress
    bankAccountNumber
    correspondentAccountNumber
    bic
    okpo
    swift
    ownerFullName
    ownerJobPosition
    consignee
    shippingAddress
    contactPerson
    contactMobilePhone
    legalTypeNote
    # natural
    firstName
    lastName
    middleName
    passportId
    mobilePhone
    additionalPhone
    address
    deliveryAddress
    naturalTypeNote
  }
`

export const SUPPLIER_TEMPLATE_FRAGMENT = gql`
  fragment SupplierTemplateFragment on SupplierTemplate {
    id
    templateName
    companyNameSl
    companyNameCl
    website
    companyType
    fieldOfActivity
    legalAddress
    legalAddressPostcode
    manufacturersAddress
    manager
    workPhone
    fax
    mobilePhone
    wechat
    email
    skype
    qq
    bankName
    bankAddress
    accountNumber
    swift
    ownerFullName
    ownerJobPosition
    responsiblePerson
    deliveryAddress
    contactNumber
    note
  }
`

export const SUPPLIER_SHOP_FRAGMENT = gql`
  fragment SupplierShopFragment on SupplierShop {
    id
    name
    address
    seller
    workPhone
    mobilePhone
    wechat
    email
    qq
    skype
  }
`

export const SUPPLIER_SHOP_TEMPLATE_FRAGMENT = gql`
  fragment SupplierShopTemplateFragment on SupplierShopTemplate {
    id
    name
    address
    seller
    workPhone
    mobilePhone
    wechat
    email
    qq
    skype
  }
`

export const SPEC_INVOICES_FRAGMENT = gql`
  fragment SpecInvoicesFragment on Spec {
    id
    invoices {
      ...InvoiceFragment
      products {
        ...ProductFragment
      }
    }
  }
  ${INVOICE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`

export const ORG_REQUISITE_FRAGMENT = gql`
  fragment OrgRequisiteFragment on Contract {
    id
    name
    nameEng
    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    phone
    fax
    email
    itn
    iec
    psrn
    bankName
    bankAddress
    bankAccountNumber
    correspondentAccountNumber
    bic
    okpo
    swift
    ownerFullName
    ownerJobPosition
  }
`

export const ORG_CONTRACT_FRAGMENT = gql`
  fragment OrgContractFragment on Contract {
    id
    name
    docNo
    country
    items {
      title
      subtitle
    }
  }
`

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean
  }
`

export default typeDefs
