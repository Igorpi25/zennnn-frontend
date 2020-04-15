import gql from 'graphql-tag'

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    viewed
    clientViewed
    replyTo
    comment
    sender
    senderName
    createdAt
    updatedAt
  }
`

export const CONTAINER_FRAGMENT = gql`
  fragment ContainerFragment on Container {
    id
    size
    mode
    capacity
    shrink
    full
    loaded
  }
`

export const SHIPMENT_FRAGMENT = gql`
  fragment ShipmentFragment on Shipment {
    id
    sentFrom
    sentThrough
    sentDestination
    activeType
    marine {
      billOfLadingNo
      ship
      containersCount
      containersNo
      exportDate
    }
    air {
      airWaybillNo
      flight
      numbersOfPkg
      exportDate
    }
    railway {
      internationalWaybillNo
      train
      containersCount
      containersNo
      exportDate
    }
    car {
      internationalWaybillNo
      vehicleNo
      semitrailerNo
      exportDate
    }
    mixed {
      internationalWaybillNo
      ship
      flight
      train
      vehicleNo
      containersNo
      exportDate
    }
    express {
      postalNo
      deliveryService
      numbersOfPkg
      exportDate
    }
  }
`

export const CUSTOMS_FRAGMENT = gql`
  fragment CustomsFragment on Customs {
    id
    countryOfOrigin
    terms
    cost
    discount
  }
`

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    productStatus
    name
    article
    qty
    unit
    cost {
      clientPrice
      customClientPrice
      clientAmount
      purchasePrice
      customPurchasePrice
      purchaseAmount
      price
      amount
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
    comments {
      ...CommentFragment
    }
    createdAt
    updatedAt
  }
  ${COMMENT_FRAGMENT}
`

export const SUPPLIER_FRAGMENT = gql`
  fragment SupplierFragment on Supplier {
    id
    createdAt
    updatedAt
    language
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
    discountInCurrency
    prepayment
    prepaymentInCurrency
    prepaymentDate
    obtainCost
    obtainCostDate
    clientDebt
    clientDebtInCurrency
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
    language
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
    importerActive
    consignee
    shippingAddress
    contactPerson
    contactMobilePhone
    importerContactPerson
    importerFax
    importerEmail
    legalTypeNote
    # natural
    firstName
    lastName
    middleName
    passportId
    mobilePhone
    additionalPhone
    naturalEmail
    address
    deliveryAddress
    naturalTypeNote
    # computed value
    fullName
  }
`

export const SPEC_FRAGMENT = gql`
  fragment SpecFragment on Spec {
    id
    requisite
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
    comments {
      ...CommentFragment
    }
    containers {
      ...ContainerFragment
    }
    shipment {
      ...ShipmentFragment
    }
    customs {
      ...CustomsFragment
    }
    subtotal
    paid
    depositDue
    depositDueDate
    balanceDue
    total
    amount
    amountInWords
    amountInWordsClientLang
    createdAt
    updatedAt
  }
  ${CLIENT_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${SHIPMENT_FRAGMENT}
  ${CUSTOMS_FRAGMENT}
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
  fragment OrgRequisiteFragment on Requisite {
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
    website
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
    title
    country
    docHeader
    useDefaultDocHeader
    requisiteId
    docNo
    items {
      title
      paragraphs
    }
    specItems {
      title
      paragraphs
    }
  }
`

export const PAPER_PRODUCT_FRAGMENT = gql`
  fragment PaperProductFragment on PaperProduct {
    id
    productStatus
    name
    article
    qty
    comments {
      ...CommentFragment
    }
    createdAt
    updatedAt
    # cost
    price
    amount
    # store
    pkgQty
    pkgNo
    # info
    images
    description
    # link
    url
  }
  ${COMMENT_FRAGMENT}
`

export const PAPER_INVOICE_FRAGMENT = gql`
  fragment PaperInvoiceFragment on PaperInvoice {
    id
    invoiceStatus
    invoiceNo
    shippingDate
    discount
    prepayment
    prepaymentDate
    clientDebt
    clientDebtDate
    totalClientAmount
    createdAt
    updatedAt
  }
`

export const PAPER_INVOICE_PRODUCTS_FRAGMENT = gql`
  fragment PaperInvoiceProductsFragment on PaperInvoice {
    id
    products {
      ...PaperProductFragment
    }
  }
  ${PAPER_PRODUCT_FRAGMENT}
`

export const PAPER_SPEC_FRAGMENT = gql`
  fragment PaperSpecFragment on PaperSpec {
    id
    specStatus
    specNo
    estimateShippingDate
    shipped
    totalVolume
    totalWeight
    qtyOfPackages
    finalCost
    totalPrepay
    totalClientDebt
    total
    currency
    currencyRate
    terms
    sentFrom
    sentThrough
    sentDestination
    comments {
      ...CommentFragment
    }
    containers {
      ...ContainerFragment
    }
    createdAt
    updatedAt
  }
  ${COMMENT_FRAGMENT}
  ${CONTAINER_FRAGMENT}
`

export const PAPER_SPEC_INVOICES_FRAGMENT = gql`
  fragment PaperSpecInvoicesFragment on PaperSpec {
    id
    invoices {
      ...PaperInvoiceFragment
      products {
        ...PaperProductFragment
      }
    }
  }
  ${PAPER_INVOICE_FRAGMENT}
  ${PAPER_PRODUCT_FRAGMENT}
`

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean
    backendVersion: Boolean
    isSpecSync: Boolean
  }
  extend type Mutation {
    setSpecActiveTab(specId: ID!, tab: Int!): Boolean
    setSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
    addSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
    removeSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
  }
`

export default typeDefs
