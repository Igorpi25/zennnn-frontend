import { gql } from '@apollo/client/core'

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

export const ATTACH_FILE_FRAGMENT = gql`
  fragment AttachFileFragment on AttachFile {
    url
    filename
    contentType
  }
`

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    productStatus
    name {
      id
      status
      defaultLocale
      values {
        k
        v
        tr
      }
    }
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
      images {
        ...AttachFileFragment
      }
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
  ${ATTACH_FILE_FRAGMENT}
`

export const PERSON_FRAGMENT = gql`
  fragment PersonFragment on Person {
    isName
    name
    firstName
    lastName
    middleName
    fullName
  }
`

export const PHONE_FRAGMENT = gql`
  fragment PhoneFragment on Phone {
    countryCode
    phone
  }
`

export const CONTACT_FRAGMENT = gql`
  fragment ContactFragment on Contact {
    contactType
    contact
  }
`

export const SUPPLIER_FRAGMENT = gql`
  fragment SupplierFragment on Supplier {
    id
    uid
    locale
    createdAt
    updatedAt

    companyType
    contactPerson {
      ...PersonFragment
    }
    companyName
    companyNameLocal
    isCompanyNameMatch
    companyOwner {
      ...PersonFragment
    }

    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    isMailingAddressMatch

    phone {
      ...PhoneFragment
    }
    phoneOption
    fax {
      ...PhoneFragment
    }
    website
    # for contact
    mobilePhone {
      ...PhoneFragment
    }
    email

    vat
    iec
    okpo
    psrn
    bic
    swift

    bankName
    bankAddress
    bankAccountNumber
    correspondentBankName
    correspondentAccountNumber

    note

    contacts {
      ...ContactFragment
    }
    tags
    files {
      ...AttachFileFragment
    }

    isRequiredFilled
    isOptionalFilled
  }
  ${PERSON_FRAGMENT}
  ${PHONE_FRAGMENT}
  ${CONTACT_FRAGMENT}
  ${ATTACH_FILE_FRAGMENT}
`

export const SUPPLIER_ITEM_FRAGMENT = gql`
  fragment SupplierItemFragment on SupplierItem {
    id
    uid
    locale
    createdAt
    updatedAt
    companyName
    contactPersonFullName
    contactPhone
    email
    tags
    dealsCount
    cost
    debt
    totalCost
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
    groupId
    uid
    clientType
    locale
    createdAt
    updatedAt
    # LEGAL
    contactPerson {
      ...PersonFragment
    }
    companyName
    companyNameLocal
    isCompanyNameMatch
    companyOwner {
      ...PersonFragment
    }

    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    isMailingAddressMatch
    deliveryAddress
    deliveryAddressPostcode
    isDeliveryAddressMatch

    phone {
      ...PhoneFragment
    }
    phoneOption
    fax {
      ...PhoneFragment
    }
    website
    # for contact
    mobilePhone {
      ...PhoneFragment
    }
    email

    vat
    iec
    okpo
    psrn
    bic
    swift

    bankName
    bankAddress
    bankAccountNumber
    correspondentBankName
    correspondentAccountNumber

    importerActive
    importerCompanyName
    importerContactPerson {
      ...PersonFragment
    }
    importerMobilePhone {
      ...PhoneFragment
    }
    importerPhone {
      ...PhoneFragment
    }
    importerEmail
    note
    # PRIVATE
    person {
      ...PersonFragment
    }
    isPersonMatch
    birthdate
    passportId
    citizenship
    issueDate
    expireDate
    issuedBy

    avatar
    contacts {
      ...ContactFragment
    }
    tags
    files {
      ...AttachFileFragment
    }

    # computed value
    fullName

    isRequiredFilled
    isOptionalFilled
  }
  ${PERSON_FRAGMENT}
  ${PHONE_FRAGMENT}
  ${CONTACT_FRAGMENT}
  ${ATTACH_FILE_FRAGMENT}
`

export const CLIENT_ITEM_FRAGMENT = gql`
  fragment ClientItemFragment on ClientItem {
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
    tags
    dealsCount
    prepayment
    debt
    turnover
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
    shippingDate
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
    readyToPrint
    createdAt
    updatedAt
  }
  ${CLIENT_FRAGMENT}
  ${COMMENT_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${SHIPMENT_FRAGMENT}
  ${CUSTOMS_FRAGMENT}
`

export const SUPPLIER_BRANCH_FRAGMENT = gql`
  fragment SupplierBranchFragment on SupplierBranch {
    id
    branchType
    name
    address
    contactPerson {
      ...PersonFragment
    }
    workPhone {
      ...PhoneFragment
    }
    mobilePhone {
      ...PhoneFragment
    }
    contacts {
      ...ContactFragment
    }
  }
  ${PERSON_FRAGMENT}
  ${PHONE_FRAGMENT}
  ${CONTACT_FRAGMENT}
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

export const BANK_DETAIL_FRAGMENT = gql`
  fragment BankDetailFragment on BankDetail {
    id
    bic
    swift
    bankName
    bankAddress
    bankAccountNumber
    correspondentBankName
    correspondentAccountNumber
  }
`

export const ORG_REQUISITE_FRAGMENT = gql`
  fragment OrgRequisiteFragment on Requisite {
    id
    createdAt
    updatedAt

    companyName
    companyNameLocal
    isCompanyNameMatch
    companyOwner {
      ...PersonFragment
    }

    legalAddress
    legalAddressPostcode
    mailingAddress
    mailingAddressPostcode
    isMailingAddressMatch
    deliveryAddress
    deliveryAddressPostcode
    isDeliveryAddressMatch

    phone {
      ...PhoneFragment
    }
    phoneOption
    fax {
      ...PhoneFragment
    }
    website
    # for contact
    mobilePhone {
      ...PhoneFragment
    }
    email

    vat
    iec
    okpo
    psrn

    defaultBankDetail

    bankDetails {
      ...BankDetailFragment
    }

    importerCompanyName
    importerContactPerson {
      ...PersonFragment
    }
    importerMobilePhone {
      ...PhoneFragment
    }
    importerPhone {
      ...PhoneFragment
    }
    importerEmail

    contacts {
      ...ContactFragment
    }
    tags

    isRequiredFilled
    isOptionalFilled
  }
  ${PERSON_FRAGMENT}
  ${PHONE_FRAGMENT}
  ${CONTACT_FRAGMENT}
  ${BANK_DETAIL_FRAGMENT}
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
    name {
      id
      status
      defaultLocale
      values {
        k
        v
        tr
      }
    }
    article
    qty
    unit
    comments {
      ...CommentFragment
    }
    createdAt
    updatedAt
    # cost
    price
    customPrice
    amount
    # store
    pkgQty
    pkgNo
    # info
    images {
      ...AttachFileFragment
    }
    description
    # link
    url
    # print
    costPrice
    costAmount
  }
  ${COMMENT_FRAGMENT}
  ${ATTACH_FILE_FRAGMENT}
`

export const PAPER_INVOICE_FRAGMENT = gql`
  fragment PaperInvoiceFragment on PaperInvoice {
    id
    invoiceStatus
    profitForAll
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
    # print
    discountInCurrency
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
    shippingDate
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
    readyToPrint
    orgName
    createdAt
    updatedAt
    requisite {
      ...OrgRequisiteFragment
    }
    client {
      ...ClientFragment
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
    amountInWords
    amountInWordsClientLang
  }
  ${COMMENT_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${ORG_REQUISITE_FRAGMENT}
  ${SHIPMENT_FRAGMENT}
  ${CUSTOMS_FRAGMENT}
  ${CLIENT_FRAGMENT}
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
