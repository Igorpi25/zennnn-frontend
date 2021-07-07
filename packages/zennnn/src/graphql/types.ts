/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateWord
// ====================================================

export interface CreateWord_createWord_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateWord_createWord {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: CreateWord_createWord_values[] | null;
}

export interface CreateWord {
  createWord: CreateWord_createWord | null;
}

export interface CreateWordVariables {
  orgId: string;
  input: CreateWordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateWord
// ====================================================

export interface UpdateWord_updateWord_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface UpdateWord_updateWord {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: UpdateWord_updateWord_values[] | null;
}

export interface UpdateWord {
  updateWord: UpdateWord_updateWord | null;
}

export interface UpdateWordVariables {
  orgId: string;
  input: UpdateWordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePaymentSubscription
// ====================================================

export interface UpdatePaymentSubscription {
  updatePaymentSubscription: any | null;
}

export interface UpdatePaymentSubscriptionVariables {
  priceId: string;
  paymentMethodId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePromoSubscription
// ====================================================

export interface CreatePromoSubscription {
  createPromoSubscription: any | null;
}

export interface CreatePromoSubscriptionVariables {
  paymentMethodId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CancelPaymentSubscription
// ====================================================

export interface CancelPaymentSubscription {
  cancelPaymentSubscription: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RetryInvoiceWithNewPaymentMethod
// ====================================================

export interface RetryInvoiceWithNewPaymentMethod {
  retryInvoiceWithNewPaymentMethod: any | null;
}

export interface RetryInvoiceWithNewPaymentMethodVariables {
  paymentMethodId: string;
  invoiceId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetDefaultPaymentMethod
// ====================================================

export interface SetDefaultPaymentMethod {
  setDefaultPaymentMethod: number | null;
}

export interface SetDefaultPaymentMethodVariables {
  paymentMethodId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AttachPaymentMethod
// ====================================================

export interface AttachPaymentMethod {
  attachPaymentMethod: number | null;
}

export interface AttachPaymentMethodVariables {
  paymentMethodId: string;
  setDefault?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DetachPaymentMethod
// ====================================================

export interface DetachPaymentMethod {
  detachPaymentMethod: number | null;
}

export interface DetachPaymentMethodVariables {
  paymentMethodId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetBillingAddress
// ====================================================

export interface SetBillingAddress {
  setBillingAddress: any | null;
}

export interface SetBillingAddressVariables {
  country: string;
  city: string;
  street: string;
  postcode: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Signup
// ====================================================

export interface Signup_signup_account {
  id: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  latestInvoiceId: string | null;
  price: string | null;
  productId: string | null;
  priceId: string | null;
  canPromo: boolean | null;
  hasBillingAddress: boolean | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean | null;
  org: string | null;
}

export interface Signup_signup {
  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
  locale: string | null;
  account: Signup_signup_account | null;
}

export interface Signup {
  signup: Signup_signup | null;
}

export interface SignupVariables {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
  locale: string;
  priceId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NoteGreeting
// ====================================================

export interface NoteGreeting {
  noteGreeting: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PremiumContact
// ====================================================

export interface PremiumContact {
  premiumContact: number | null;
}

export interface PremiumContactVariables {
  name: string;
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompliteRegistration
// ====================================================

export interface CompliteRegistration {
  compliteRegistration: number | null;
}

export interface CompliteRegistrationVariables {
  givenName: string;
  familyName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSpec
// ====================================================

export interface CreateSpec_createSpec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSpec_createSpec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSpec_createSpec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSpec_createSpec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSpec_createSpec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSpec_createSpec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSpec_createSpec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSpec_createSpec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSpec_createSpec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSpec_createSpec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateSpec_createSpec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateSpec_createSpec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: CreateSpec_createSpec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateSpec_createSpec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: CreateSpec_createSpec_client_phone | null;
  phoneOption: string | null;
  fax: CreateSpec_createSpec_client_fax | null;
  website: string | null;
  mobilePhone: CreateSpec_createSpec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: CreateSpec_createSpec_client_importerContactPerson | null;
  importerMobilePhone: CreateSpec_createSpec_client_importerMobilePhone | null;
  importerPhone: CreateSpec_createSpec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: CreateSpec_createSpec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (CreateSpec_createSpec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (CreateSpec_createSpec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface CreateSpec_createSpec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateSpec_createSpec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface CreateSpec_createSpec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface CreateSpec_createSpec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: CreateSpec_createSpec_shipment_marine | null;
  air: CreateSpec_createSpec_shipment_air | null;
  railway: CreateSpec_createSpec_shipment_railway | null;
  car: CreateSpec_createSpec_shipment_car | null;
  mixed: CreateSpec_createSpec_shipment_mixed | null;
  express: CreateSpec_createSpec_shipment_express | null;
}

export interface CreateSpec_createSpec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface CreateSpec_createSpec {
  id: string;
  requisite: string | null;
  client: CreateSpec_createSpec_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (CreateSpec_createSpec_comments | null)[] | null;
  containers: (CreateSpec_createSpec_containers | null)[] | null;
  shipment: CreateSpec_createSpec_shipment | null;
  customs: CreateSpec_createSpec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateSpec {
  createSpec: CreateSpec_createSpec | null;
}

export interface CreateSpecVariables {
  orgId: string;
  clientId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSpec
// ====================================================

export interface UpdateSpec_updateSpec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSpec_updateSpec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSpec_updateSpec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSpec_updateSpec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSpec_updateSpec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSpec_updateSpec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSpec_updateSpec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSpec_updateSpec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSpec_updateSpec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSpec_updateSpec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateSpec_updateSpec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateSpec_updateSpec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: UpdateSpec_updateSpec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: UpdateSpec_updateSpec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: UpdateSpec_updateSpec_client_phone | null;
  phoneOption: string | null;
  fax: UpdateSpec_updateSpec_client_fax | null;
  website: string | null;
  mobilePhone: UpdateSpec_updateSpec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: UpdateSpec_updateSpec_client_importerContactPerson | null;
  importerMobilePhone: UpdateSpec_updateSpec_client_importerMobilePhone | null;
  importerPhone: UpdateSpec_updateSpec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: UpdateSpec_updateSpec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (UpdateSpec_updateSpec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (UpdateSpec_updateSpec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface UpdateSpec_updateSpec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateSpec_updateSpec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface UpdateSpec_updateSpec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface UpdateSpec_updateSpec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: UpdateSpec_updateSpec_shipment_marine | null;
  air: UpdateSpec_updateSpec_shipment_air | null;
  railway: UpdateSpec_updateSpec_shipment_railway | null;
  car: UpdateSpec_updateSpec_shipment_car | null;
  mixed: UpdateSpec_updateSpec_shipment_mixed | null;
  express: UpdateSpec_updateSpec_shipment_express | null;
}

export interface UpdateSpec_updateSpec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface UpdateSpec_updateSpec {
  id: string;
  requisite: string | null;
  client: UpdateSpec_updateSpec_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (UpdateSpec_updateSpec_comments | null)[] | null;
  containers: (UpdateSpec_updateSpec_containers | null)[] | null;
  shipment: UpdateSpec_updateSpec_shipment | null;
  customs: UpdateSpec_updateSpec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateSpec {
  updateSpec: UpdateSpec_updateSpec | null;
}

export interface UpdateSpecVariables {
  id: string;
  input: SpecInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSpec
// ====================================================

export interface DeleteSpec {
  deleteSpec: number | null;
}

export interface DeleteSpecVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateInvoice
// ====================================================

export interface CreateInvoice_createInvoice_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateInvoice_createInvoice_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateInvoice_createInvoice_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateInvoice_createInvoice_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateInvoice_createInvoice_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateInvoice_createInvoice_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateInvoice_createInvoice_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateInvoice_createInvoice_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: CreateInvoice_createInvoice_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateInvoice_createInvoice_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: CreateInvoice_createInvoice_supplier_phone | null;
  phoneOption: string | null;
  fax: CreateInvoice_createInvoice_supplier_fax | null;
  website: string | null;
  mobilePhone: CreateInvoice_createInvoice_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (CreateInvoice_createInvoice_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (CreateInvoice_createInvoice_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface CreateInvoice_createInvoice_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateInvoice_createInvoice_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: CreateInvoice_createInvoice_products_name_values[] | null;
}

export interface CreateInvoice_createInvoice_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface CreateInvoice_createInvoice_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface CreateInvoice_createInvoice_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateInvoice_createInvoice_products_info {
  images: CreateInvoice_createInvoice_products_info_images[] | null;
  description: string | null;
}

export interface CreateInvoice_createInvoice_products_link {
  url: string | null;
}

export interface CreateInvoice_createInvoice_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateInvoice_createInvoice_products {
  id: string;
  productStatus: ProductStatus | null;
  name: CreateInvoice_createInvoice_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: CreateInvoice_createInvoice_products_cost | null;
  store: CreateInvoice_createInvoice_products_store | null;
  info: CreateInvoice_createInvoice_products_info | null;
  link: CreateInvoice_createInvoice_products_link | null;
  comments: (CreateInvoice_createInvoice_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateInvoice_createInvoice {
  id: string;
  supplier: CreateInvoice_createInvoice_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (CreateInvoice_createInvoice_products | null)[] | null;
}

export interface CreateInvoice {
  createInvoice: CreateInvoice_createInvoice | null;
}

export interface CreateInvoiceVariables {
  specId: string;
  input?: CreateInvoiceInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateInvoice
// ====================================================

export interface UpdateInvoice_updateInvoice_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateInvoice_updateInvoice_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: UpdateInvoice_updateInvoice_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: UpdateInvoice_updateInvoice_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: UpdateInvoice_updateInvoice_supplier_phone | null;
  phoneOption: string | null;
  fax: UpdateInvoice_updateInvoice_supplier_fax | null;
  website: string | null;
  mobilePhone: UpdateInvoice_updateInvoice_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (UpdateInvoice_updateInvoice_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (UpdateInvoice_updateInvoice_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface UpdateInvoice_updateInvoice {
  id: string;
  supplier: UpdateInvoice_updateInvoice_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateInvoice {
  updateInvoice: UpdateInvoice_updateInvoice | null;
}

export interface UpdateInvoiceVariables {
  id: string;
  input: UpdateInvoiceInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProduct
// ====================================================

export interface CreateProduct_createProduct_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateProduct_createProduct_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: CreateProduct_createProduct_name_values[] | null;
}

export interface CreateProduct_createProduct_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface CreateProduct_createProduct_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface CreateProduct_createProduct_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateProduct_createProduct_info {
  images: CreateProduct_createProduct_info_images[] | null;
  description: string | null;
}

export interface CreateProduct_createProduct_link {
  url: string | null;
}

export interface CreateProduct_createProduct_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProduct_createProduct {
  id: string;
  productStatus: ProductStatus | null;
  name: CreateProduct_createProduct_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: CreateProduct_createProduct_cost | null;
  store: CreateProduct_createProduct_store | null;
  info: CreateProduct_createProduct_info | null;
  link: CreateProduct_createProduct_link | null;
  comments: (CreateProduct_createProduct_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProduct {
  createProduct: CreateProduct_createProduct | null;
}

export interface CreateProductVariables {
  invoiceId: string;
  input?: ProductInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProductWithInvoice
// ====================================================

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: CreateProductWithInvoice_createProductWithInvoice_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateProductWithInvoice_createProductWithInvoice_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: CreateProductWithInvoice_createProductWithInvoice_supplier_phone | null;
  phoneOption: string | null;
  fax: CreateProductWithInvoice_createProductWithInvoice_supplier_fax | null;
  website: string | null;
  mobilePhone: CreateProductWithInvoice_createProductWithInvoice_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (CreateProductWithInvoice_createProductWithInvoice_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (CreateProductWithInvoice_createProductWithInvoice_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: CreateProductWithInvoice_createProductWithInvoice_products_name_values[] | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_info {
  images: CreateProductWithInvoice_createProductWithInvoice_products_info_images[] | null;
  description: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_link {
  url: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice_products {
  id: string;
  productStatus: ProductStatus | null;
  name: CreateProductWithInvoice_createProductWithInvoice_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: CreateProductWithInvoice_createProductWithInvoice_products_cost | null;
  store: CreateProductWithInvoice_createProductWithInvoice_products_store | null;
  info: CreateProductWithInvoice_createProductWithInvoice_products_info | null;
  link: CreateProductWithInvoice_createProductWithInvoice_products_link | null;
  comments: (CreateProductWithInvoice_createProductWithInvoice_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProductWithInvoice_createProductWithInvoice {
  id: string;
  supplier: CreateProductWithInvoice_createProductWithInvoice_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (CreateProductWithInvoice_createProductWithInvoice_products | null)[] | null;
}

export interface CreateProductWithInvoice {
  createProductWithInvoice: CreateProductWithInvoice_createProductWithInvoice | null;
}

export interface CreateProductWithInvoiceVariables {
  specId: string;
  input?: ProductInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProduct
// ====================================================

export interface UpdateProduct_updateProduct_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface UpdateProduct_updateProduct_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: UpdateProduct_updateProduct_name_values[] | null;
}

export interface UpdateProduct_updateProduct_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface UpdateProduct_updateProduct_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface UpdateProduct_updateProduct_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateProduct_updateProduct_info {
  images: UpdateProduct_updateProduct_info_images[] | null;
  description: string | null;
}

export interface UpdateProduct_updateProduct_link {
  url: string | null;
}

export interface UpdateProduct_updateProduct_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateProduct_updateProduct {
  id: string;
  productStatus: ProductStatus | null;
  name: UpdateProduct_updateProduct_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: UpdateProduct_updateProduct_cost | null;
  store: UpdateProduct_updateProduct_store | null;
  info: UpdateProduct_updateProduct_info | null;
  link: UpdateProduct_updateProduct_link | null;
  comments: (UpdateProduct_updateProduct_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateProduct {
  updateProduct: UpdateProduct_updateProduct | null;
}

export interface UpdateProductVariables {
  id: string;
  input: ProductInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProductCost
// ====================================================

export interface UpdateProductCost_updateProductCost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
}

export interface UpdateProductCost {
  updateProductCost: UpdateProductCost_updateProductCost | null;
}

export interface UpdateProductCostVariables {
  id: string;
  input: ProductCostInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProductStore
// ====================================================

export interface UpdateProductStore_updateProductStore {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface UpdateProductStore {
  updateProductStore: UpdateProductStore_updateProductStore | null;
}

export interface UpdateProductStoreVariables {
  id: string;
  input: ProductStoreInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProductInfo
// ====================================================

export interface UpdateProductInfo_updateProductInfo_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateProductInfo_updateProductInfo {
  images: UpdateProductInfo_updateProductInfo_images[] | null;
  description: string | null;
}

export interface UpdateProductInfo {
  updateProductInfo: UpdateProductInfo_updateProductInfo | null;
}

export interface UpdateProductInfoVariables {
  id: string;
  input: ProductInfoInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddProductImage
// ====================================================

export interface AddProductImage {
  addProductImage: number | null;
}

export interface AddProductImageVariables {
  id: string;
  inputImages: AttachFileInput[];
  unshift?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveProductImage
// ====================================================

export interface RemoveProductImage {
  removeProductImage: number | null;
}

export interface RemoveProductImageVariables {
  id: string;
  inputImages: AttachFileInput[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProductLink
// ====================================================

export interface UpdateProductLink_updateProductLink {
  url: string | null;
}

export interface UpdateProductLink {
  updateProductLink: UpdateProductLink_updateProductLink | null;
}

export interface UpdateProductLinkVariables {
  id: string;
  input: ProductLinkInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProduct
// ====================================================

export interface DeleteProduct {
  deleteProduct: number | null;
}

export interface DeleteProductVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecClient
// ====================================================

export interface SetSpecClient_setSpecClient_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetSpecClient_setSpecClient_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetSpecClient_setSpecClient_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetSpecClient_setSpecClient_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SetSpecClient_setSpecClient_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetSpecClient_setSpecClient_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetSpecClient_setSpecClient_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetSpecClient_setSpecClient_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetSpecClient_setSpecClient_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetSpecClient_setSpecClient_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SetSpecClient_setSpecClient_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SetSpecClient_setSpecClient {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: SetSpecClient_setSpecClient_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SetSpecClient_setSpecClient_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SetSpecClient_setSpecClient_phone | null;
  phoneOption: string | null;
  fax: SetSpecClient_setSpecClient_fax | null;
  website: string | null;
  mobilePhone: SetSpecClient_setSpecClient_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: SetSpecClient_setSpecClient_importerContactPerson | null;
  importerMobilePhone: SetSpecClient_setSpecClient_importerMobilePhone | null;
  importerPhone: SetSpecClient_setSpecClient_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: SetSpecClient_setSpecClient_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (SetSpecClient_setSpecClient_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SetSpecClient_setSpecClient_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SetSpecClient {
  setSpecClient: SetSpecClient_setSpecClient | null;
}

export interface SetSpecClientVariables {
  specId: string;
  clientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetInvoiceSupplier
// ====================================================

export interface SetInvoiceSupplier_setInvoiceSupplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SetInvoiceSupplier_setInvoiceSupplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SetInvoiceSupplier_setInvoiceSupplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SetInvoiceSupplier_setInvoiceSupplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SetInvoiceSupplier_setInvoiceSupplier_phone | null;
  phoneOption: string | null;
  fax: SetInvoiceSupplier_setInvoiceSupplier_fax | null;
  website: string | null;
  mobilePhone: SetInvoiceSupplier_setInvoiceSupplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SetInvoiceSupplier_setInvoiceSupplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SetInvoiceSupplier_setInvoiceSupplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SetInvoiceSupplier {
  setInvoiceSupplier: SetInvoiceSupplier_setInvoiceSupplier | null;
}

export interface SetInvoiceSupplierVariables {
  invoiceId: string;
  supplierId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateClient
// ====================================================

export interface CreateClient_createClient_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateClient_createClient_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateClient_createClient_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateClient_createClient_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateClient_createClient_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateClient_createClient_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateClient_createClient_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateClient_createClient_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateClient_createClient_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateClient_createClient_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateClient_createClient_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateClient_createClient {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: CreateClient_createClient_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateClient_createClient_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: CreateClient_createClient_phone | null;
  phoneOption: string | null;
  fax: CreateClient_createClient_fax | null;
  website: string | null;
  mobilePhone: CreateClient_createClient_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: CreateClient_createClient_importerContactPerson | null;
  importerMobilePhone: CreateClient_createClient_importerMobilePhone | null;
  importerPhone: CreateClient_createClient_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: CreateClient_createClient_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (CreateClient_createClient_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (CreateClient_createClient_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface CreateClient {
  createClient: CreateClient_createClient | null;
}

export interface CreateClientVariables {
  orgId: string;
  groupId?: string | null;
  input: CreateClientInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateClient
// ====================================================

export interface UpdateClient_updateClient_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateClient_updateClient_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateClient_updateClient_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateClient_updateClient_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateClient_updateClient_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateClient_updateClient_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateClient_updateClient_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateClient_updateClient_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateClient_updateClient_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateClient_updateClient_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateClient_updateClient_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateClient_updateClient {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: UpdateClient_updateClient_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: UpdateClient_updateClient_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: UpdateClient_updateClient_phone | null;
  phoneOption: string | null;
  fax: UpdateClient_updateClient_fax | null;
  website: string | null;
  mobilePhone: UpdateClient_updateClient_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: UpdateClient_updateClient_importerContactPerson | null;
  importerMobilePhone: UpdateClient_updateClient_importerMobilePhone | null;
  importerPhone: UpdateClient_updateClient_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: UpdateClient_updateClient_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (UpdateClient_updateClient_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (UpdateClient_updateClient_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface UpdateClient {
  updateClient: UpdateClient_updateClient | null;
}

export interface UpdateClientVariables {
  id: string;
  input: UpdateClientInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteClient
// ====================================================

export interface DeleteClient {
  deleteClient: number | null;
}

export interface DeleteClientVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSupplier
// ====================================================

export interface CreateSupplier_createSupplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSupplier_createSupplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSupplier_createSupplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplier_createSupplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplier_createSupplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplier_createSupplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateSupplier_createSupplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface CreateSupplier_createSupplier_branches_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSupplier_createSupplier_branches_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplier_createSupplier_branches_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplier_createSupplier_branches_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateSupplier_createSupplier_branches {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: CreateSupplier_createSupplier_branches_contactPerson | null;
  workPhone: CreateSupplier_createSupplier_branches_workPhone | null;
  mobilePhone: CreateSupplier_createSupplier_branches_mobilePhone | null;
  contacts: (CreateSupplier_createSupplier_branches_contacts | null)[] | null;
}

export interface CreateSupplier_createSupplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: CreateSupplier_createSupplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateSupplier_createSupplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: CreateSupplier_createSupplier_phone | null;
  phoneOption: string | null;
  fax: CreateSupplier_createSupplier_fax | null;
  website: string | null;
  mobilePhone: CreateSupplier_createSupplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (CreateSupplier_createSupplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (CreateSupplier_createSupplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
  branches: CreateSupplier_createSupplier_branches[] | null;
}

export interface CreateSupplier {
  createSupplier: CreateSupplier_createSupplier | null;
}

export interface CreateSupplierVariables {
  orgId: string;
  input: CreateSupplierInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSupplier
// ====================================================

export interface UpdateSupplier_updateSupplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSupplier_updateSupplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSupplier_updateSupplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplier_updateSupplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplier_updateSupplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplier_updateSupplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateSupplier_updateSupplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface UpdateSupplier_updateSupplier_branches_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSupplier_updateSupplier_branches_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplier_updateSupplier_branches_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplier_updateSupplier_branches_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateSupplier_updateSupplier_branches {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: UpdateSupplier_updateSupplier_branches_contactPerson | null;
  workPhone: UpdateSupplier_updateSupplier_branches_workPhone | null;
  mobilePhone: UpdateSupplier_updateSupplier_branches_mobilePhone | null;
  contacts: (UpdateSupplier_updateSupplier_branches_contacts | null)[] | null;
}

export interface UpdateSupplier_updateSupplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: UpdateSupplier_updateSupplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: UpdateSupplier_updateSupplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: UpdateSupplier_updateSupplier_phone | null;
  phoneOption: string | null;
  fax: UpdateSupplier_updateSupplier_fax | null;
  website: string | null;
  mobilePhone: UpdateSupplier_updateSupplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (UpdateSupplier_updateSupplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (UpdateSupplier_updateSupplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
  branches: UpdateSupplier_updateSupplier_branches[] | null;
}

export interface UpdateSupplier {
  updateSupplier: UpdateSupplier_updateSupplier | null;
}

export interface UpdateSupplierVariables {
  id: string;
  input: UpdateSupplierInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSupplier
// ====================================================

export interface DeleteSupplier {
  deleteSupplier: number | null;
}

export interface DeleteSupplierVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSupplierBranch
// ====================================================

export interface CreateSupplierBranch_createSupplierBranch_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateSupplierBranch_createSupplierBranch_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplierBranch_createSupplierBranch_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateSupplierBranch_createSupplierBranch_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateSupplierBranch_createSupplierBranch {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: CreateSupplierBranch_createSupplierBranch_contactPerson | null;
  workPhone: CreateSupplierBranch_createSupplierBranch_workPhone | null;
  mobilePhone: CreateSupplierBranch_createSupplierBranch_mobilePhone | null;
  contacts: (CreateSupplierBranch_createSupplierBranch_contacts | null)[] | null;
}

export interface CreateSupplierBranch {
  createSupplierBranch: CreateSupplierBranch_createSupplierBranch | null;
}

export interface CreateSupplierBranchVariables {
  supplierId: string;
  input: SupplierBranchInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSupplierBranch
// ====================================================

export interface UpdateSupplierBranch_updateSupplierBranch_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateSupplierBranch_updateSupplierBranch_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplierBranch_updateSupplierBranch_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateSupplierBranch_updateSupplierBranch_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateSupplierBranch_updateSupplierBranch {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: UpdateSupplierBranch_updateSupplierBranch_contactPerson | null;
  workPhone: UpdateSupplierBranch_updateSupplierBranch_workPhone | null;
  mobilePhone: UpdateSupplierBranch_updateSupplierBranch_mobilePhone | null;
  contacts: (UpdateSupplierBranch_updateSupplierBranch_contacts | null)[] | null;
}

export interface UpdateSupplierBranch {
  updateSupplierBranch: UpdateSupplierBranch_updateSupplierBranch | null;
}

export interface UpdateSupplierBranchVariables {
  id: string;
  input: SupplierBranchInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSupplierShop
// ====================================================

export interface DeleteSupplierShop {
  deleteSupplierBranch: number | null;
}

export interface DeleteSupplierShopVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRequisite
// ====================================================

export interface CreateRequisite_createRequisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateRequisite_createRequisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateRequisite_createRequisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateRequisite_createRequisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateRequisite_createRequisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface CreateRequisite_createRequisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface CreateRequisite_createRequisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateRequisite_createRequisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface CreateRequisite_createRequisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface CreateRequisite_createRequisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: CreateRequisite_createRequisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: CreateRequisite_createRequisite_phone | null;
  phoneOption: string | null;
  fax: CreateRequisite_createRequisite_fax | null;
  website: string | null;
  mobilePhone: CreateRequisite_createRequisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: CreateRequisite_createRequisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: CreateRequisite_createRequisite_importerContactPerson | null;
  importerMobilePhone: CreateRequisite_createRequisite_importerMobilePhone | null;
  importerPhone: CreateRequisite_createRequisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (CreateRequisite_createRequisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface CreateRequisite {
  createRequisite: CreateRequisite_createRequisite | null;
}

export interface CreateRequisiteVariables {
  orgId: string;
  input: RequisiteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRequisite
// ====================================================

export interface UpdateRequisite_updateRequisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateRequisite_updateRequisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateRequisite_updateRequisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateRequisite_updateRequisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateRequisite_updateRequisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface UpdateRequisite_updateRequisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface UpdateRequisite_updateRequisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateRequisite_updateRequisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface UpdateRequisite_updateRequisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface UpdateRequisite_updateRequisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: UpdateRequisite_updateRequisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: UpdateRequisite_updateRequisite_phone | null;
  phoneOption: string | null;
  fax: UpdateRequisite_updateRequisite_fax | null;
  website: string | null;
  mobilePhone: UpdateRequisite_updateRequisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: UpdateRequisite_updateRequisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: UpdateRequisite_updateRequisite_importerContactPerson | null;
  importerMobilePhone: UpdateRequisite_updateRequisite_importerMobilePhone | null;
  importerPhone: UpdateRequisite_updateRequisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (UpdateRequisite_updateRequisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface UpdateRequisite {
  updateRequisite: UpdateRequisite_updateRequisite | null;
}

export interface UpdateRequisiteVariables {
  id: string;
  input: RequisiteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteRequisite
// ====================================================

export interface DeleteRequisite {
  deleteRequisite: number | null;
}

export interface DeleteRequisiteVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCompanyBankDetail
// ====================================================

export interface CreateCompanyBankDetail_createCompanyBankDetail {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface CreateCompanyBankDetail {
  createCompanyBankDetail: CreateCompanyBankDetail_createCompanyBankDetail | null;
}

export interface CreateCompanyBankDetailVariables {
  companyId: string;
  input: BankDetailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCompanyBankDetail
// ====================================================

export interface UpdateCompanyBankDetail_updateCompanyBankDetail {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface UpdateCompanyBankDetail {
  updateCompanyBankDetail: UpdateCompanyBankDetail_updateCompanyBankDetail | null;
}

export interface UpdateCompanyBankDetailVariables {
  companyId: string;
  id: string;
  input: BankDetailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteCompanyBankDetail
// ====================================================

export interface DeleteCompanyBankDetail {
  deleteCompanyBankDetail: number | null;
}

export interface DeleteCompanyBankDetailVariables {
  companyId: string;
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetDefaultReqisite
// ====================================================

export interface SetDefaultReqisite {
  setDefaultReqisite: number | null;
}

export interface SetDefaultReqisiteVariables {
  orgId: string;
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetOrgAvatar
// ====================================================

export interface SetOrgAvatar {
  setOrgAvatar: number | null;
}

export interface SetOrgAvatarVariables {
  orgId: string;
  avatar: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateContract
// ====================================================

export interface CreateContract_createContract_items {
  title: string | null;
  paragraphs: string[] | null;
}

export interface CreateContract_createContract_specItems {
  title: string | null;
  paragraphs: string[] | null;
}

export interface CreateContract_createContract {
  id: string;
  name: string | null;
  title: string | null;
  country: string | null;
  docHeader: string | null;
  useDefaultDocHeader: boolean | null;
  requisiteId: string | null;
  docNo: string | null;
  items: CreateContract_createContract_items[] | null;
  specItems: CreateContract_createContract_specItems[] | null;
}

export interface CreateContract {
  createContract: CreateContract_createContract | null;
}

export interface CreateContractVariables {
  orgId: string;
  input: CreateContractInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateContract
// ====================================================

export interface UpdateContract_updateContract_items {
  title: string | null;
  paragraphs: string[] | null;
}

export interface UpdateContract_updateContract_specItems {
  title: string | null;
  paragraphs: string[] | null;
}

export interface UpdateContract_updateContract {
  id: string;
  name: string | null;
  title: string | null;
  country: string | null;
  docHeader: string | null;
  useDefaultDocHeader: boolean | null;
  requisiteId: string | null;
  docNo: string | null;
  items: UpdateContract_updateContract_items[] | null;
  specItems: UpdateContract_updateContract_specItems[] | null;
}

export interface UpdateContract {
  updateContract: UpdateContract_updateContract | null;
}

export interface UpdateContractVariables {
  id: string;
  input: UpdateContractInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteContract
// ====================================================

export interface DeleteContract {
  deleteContract: number | null;
}

export interface DeleteContractVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteUserToOrg
// ====================================================

export interface InviteUserToOrg {
  inviteUserToOrg: number | null;
}

export interface InviteUserToOrgVariables {
  orgId: string;
  input: UserInvitationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AcceptInvitation
// ====================================================

export interface AcceptInvitation {
  acceptInvitation: number | null;
}

export interface AcceptInvitationVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeclineInvitation
// ====================================================

export interface DeclineInvitation {
  declineInvitation: number | null;
}

export interface DeclineInvitationVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CancelInvitation
// ====================================================

export interface CancelInvitation {
  cancelInvitation: number | null;
}

export interface CancelInvitationVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveUserFromOrg
// ====================================================

export interface RemoveUserFromOrg {
  removeUserFromOrg: number | null;
}

export interface RemoveUserFromOrgVariables {
  orgId: string;
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OpenLinkAccess
// ====================================================

export interface OpenLinkAccess {
  openLinkAccess: number | null;
}

export interface OpenLinkAccessVariables {
  specId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CloseLinkAccess
// ====================================================

export interface CloseLinkAccess {
  closeLinkAccess: number | null;
}

export interface CloseLinkAccessVariables {
  specId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddEmailAccessToSpec
// ====================================================

export interface AddEmailAccessToSpec {
  addEmailAccessToSpec: number | null;
}

export interface AddEmailAccessToSpecVariables {
  specId: string;
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveEmailAccessToSpec
// ====================================================

export interface RemoveEmailAccessToSpec {
  removeEmailAccessToSpec: number | null;
}

export interface RemoveEmailAccessToSpecVariables {
  specId: string;
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendLinkAccessToEmail
// ====================================================

export interface SendLinkAccessToEmail {
  sendLinkAccessToEmail: number | null;
}

export interface SendLinkAccessToEmailVariables {
  specId: string;
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddCommentToSpec
// ====================================================

export interface AddCommentToSpec {
  addCommentToSpec: number | null;
}

export interface AddCommentToSpecVariables {
  specId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReplyToSpecComment
// ====================================================

export interface ReplyToSpecComment {
  replyToSpecComment: number | null;
}

export interface ReplyToSpecCommentVariables {
  specId: string;
  commentId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddCommentToProduct
// ====================================================

export interface AddCommentToProduct {
  addCommentToProduct: number | null;
}

export interface AddCommentToProductVariables {
  productId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReplyToProductComment
// ====================================================

export interface ReplyToProductComment {
  replyToProductComment: number | null;
}

export interface ReplyToProductCommentVariables {
  productId: string;
  commentId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddCommentToPaperSpec
// ====================================================

export interface AddCommentToPaperSpec {
  addCommentToPaperSpec: number | null;
}

export interface AddCommentToPaperSpecVariables {
  specId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReplyToPaperSpecComment
// ====================================================

export interface ReplyToPaperSpecComment {
  replyToPaperSpecComment: number | null;
}

export interface ReplyToPaperSpecCommentVariables {
  specId: string;
  commentId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddCommentToPaperProduct
// ====================================================

export interface AddCommentToPaperProduct {
  addCommentToPaperProduct: number | null;
}

export interface AddCommentToPaperProductVariables {
  productId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReplyToPaperProductComment
// ====================================================

export interface ReplyToPaperProductComment {
  replyToPaperProductComment: number | null;
}

export interface ReplyToPaperProductCommentVariables {
  productId: string;
  commentId: string;
  comment: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkSpecCommentsAsViewed
// ====================================================

export interface MarkSpecCommentsAsViewed {
  markSpecCommentsAsViewed: number | null;
}

export interface MarkSpecCommentsAsViewedVariables {
  specId: string;
  commentsIds?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkProductCommentsAsViewed
// ====================================================

export interface MarkProductCommentsAsViewed {
  markProductCommentsAsViewed: number | null;
}

export interface MarkProductCommentsAsViewedVariables {
  productId: string;
  commentsIds?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkPaperSpecCommentsAsViewed
// ====================================================

export interface MarkPaperSpecCommentsAsViewed {
  markPaperSpecCommentsAsViewed: number | null;
}

export interface MarkPaperSpecCommentsAsViewedVariables {
  specId: string;
  commentsIds?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkPaperProductCommentsAsViewed
// ====================================================

export interface MarkPaperProductCommentsAsViewed {
  markPaperProductCommentsAsViewed: number | null;
}

export interface MarkPaperProductCommentsAsViewedVariables {
  productId: string;
  commentsIds?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecContainerSize
// ====================================================

export interface SetSpecContainerSize {
  setSpecContainerSize: number | null;
}

export interface SetSpecContainerSizeVariables {
  specId: string;
  containerId: string;
  inputSize: ContainerSize;
  inputMode?: ContainerMode | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecContainerCustomCapacity
// ====================================================

export interface SetSpecContainerCustomCapacity {
  setSpecContainerCustomCapacity: number | null;
}

export interface SetSpecContainerCustomCapacityVariables {
  specId: string;
  containerId: string;
  inputCapacity?: number | null;
  inputShrink?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InitSpecSimpleUI
// ====================================================

export interface InitSpecSimpleUI {
  initSpecSimpleUI: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecSimpleUI
// ====================================================

export interface SetSpecSimpleUI {
  setSpecSimpleUI: boolean | null;
}

export interface SetSpecSimpleUIVariables {
  value?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecActiveTab
// ====================================================

export interface SetSpecActiveTab {
  setSpecActiveTab: boolean | null;
}

export interface SetSpecActiveTabVariables {
  specId: string;
  tab: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSpecExpandedInvoices
// ====================================================

export interface SetSpecExpandedInvoices {
  setSpecExpandedInvoices: boolean | null;
}

export interface SetSpecExpandedInvoicesVariables {
  specId: string;
  ids: string[];
  prefix?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddSpecExpandedInvoices
// ====================================================

export interface AddSpecExpandedInvoices {
  addSpecExpandedInvoices: boolean | null;
}

export interface AddSpecExpandedInvoicesVariables {
  specId: string;
  ids: string[];
  prefix?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveSpecExpandedInvoices
// ====================================================

export interface RemoveSpecExpandedInvoices {
  removeSpecExpandedInvoices: boolean | null;
}

export interface RemoveSpecExpandedInvoicesVariables {
  specId: string;
  ids: string[];
  prefix?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListWords
// ====================================================

export interface ListWords_listWords_items_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface ListWords_listWords_items {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: ListWords_listWords_items_values[] | null;
}

export interface ListWords_listWords {
  items: (ListWords_listWords_items | null)[] | null;
}

export interface ListWords {
  listWords: ListWords_listWords | null;
}

export interface ListWordsVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchWords
// ====================================================

export interface SearchWords_searchWords_items_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SearchWords_searchWords_items {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: SearchWords_searchWords_items_values[] | null;
}

export interface SearchWords_searchWords {
  items: (SearchWords_searchWords_items | null)[] | null;
}

export interface SearchWords {
  searchWords: SearchWords_searchWords | null;
}

export interface SearchWordsVariables {
  orgId: string;
  search: string;
  locale: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWordSpecs
// ====================================================

export interface GetWordSpecs_getWordSpecs {
  specId: string;
  specNo: string | null;
}

export interface GetWordSpecs {
  getWordSpecs: (GetWordSpecs_getWordSpecs | null)[] | null;
}

export interface GetWordSpecsVariables {
  orgId: string;
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TranslateWord
// ====================================================

export interface TranslateWord_translateWord {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface TranslateWord {
  translateWord: TranslateWord_translateWord[] | null;
}

export interface TranslateWordVariables {
  orgId: string;
  text: string;
  sourceLang: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListPrices
// ====================================================

export interface ListPrices {
  listPrices: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListPaymentMethods
// ====================================================

export interface ListPaymentMethods {
  listPaymentMethods: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListPaymentInvoices
// ====================================================

export interface ListPaymentInvoices {
  listPaymentInvoices: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInviteUserToOrg
// ====================================================

export interface GetInviteUserToOrg_getInviteUserToOrg {
  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
  locale: string | null;
}

export interface GetInviteUserToOrg {
  getInviteUserToOrg: GetInviteUserToOrg_getInviteUserToOrg | null;
}

export interface GetInviteUserToOrgVariables {
  orgId: string;
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrgs
// ====================================================

export interface GetOrgs_getOrgs_owner {
  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
  locale: string | null;
}

export interface GetOrgs_getOrgs {
  id: string;
  owner: GetOrgs_getOrgs_owner | null;
  role: RoleInProject | null;
  defaultRequisite: string | null;
  name: string | null;
  nameEng: string | null;
  location: string | null;
  picture: string | null;
}

export interface GetOrgs {
  getOrgs: GetOrgs_getOrgs[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRoleInProject
// ====================================================

export interface GetRoleInProject {
  roleInProject: RoleInProject;
}

export interface GetRoleInProjectVariables {
  specId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetIsSpecSync
// ====================================================

export interface GetIsSpecSync {
  isSpecSync: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SpecSimpleUIOff
// ====================================================

export interface SpecSimpleUIOff {
  specSimpleUIOff: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProfile
// ====================================================

export interface GetProfile_getProfile_account {
  id: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  latestInvoiceId: string | null;
  price: string | null;
  productId: string | null;
  priceId: string | null;
  canPromo: boolean | null;
  hasBillingAddress: boolean | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean | null;
  org: string | null;
}

export interface GetProfile_getProfile {
  id: string;
  email: string;
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
  locale: string | null;
  isGreeted: boolean | null;
  account: GetProfile_getProfile_account | null;
}

export interface GetProfile {
  getProfile: GetProfile_getProfile | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpecs
// ====================================================

export interface GetSpecs_getSpecs_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  fullName: string | null;
  contactPersonFullName: string | null;
  contactPhone: string | null;
  email: string | null;
}

export interface GetSpecs_getSpecs {
  id: string;
  specStatus: SpecStatus | null;
  isMoneyRecieved: boolean | null;
  isExpensesPaid: boolean | null;
  finalCost: number | null;
  margin: number | null;
  specNo: string | null;
  shipped: boolean | null;
  hasNewComment: boolean | null;
  employeeId: string | null;
  employeeFullName: string | null;
  employeeRole: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  client: GetSpecs_getSpecs_client | null;
}

export interface GetSpecs {
  getSpecs: GetSpecs_getSpecs[] | null;
}

export interface GetSpecsVariables {
  orgId: string;
  clientsIds?: string[] | null;
  clientType?: ClientType | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpec
// ====================================================

export interface GetSpec_getSpec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetSpec_getSpec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetSpec_getSpec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: GetSpec_getSpec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetSpec_getSpec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: GetSpec_getSpec_client_phone | null;
  phoneOption: string | null;
  fax: GetSpec_getSpec_client_fax | null;
  website: string | null;
  mobilePhone: GetSpec_getSpec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: GetSpec_getSpec_client_importerContactPerson | null;
  importerMobilePhone: GetSpec_getSpec_client_importerMobilePhone | null;
  importerPhone: GetSpec_getSpec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: GetSpec_getSpec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (GetSpec_getSpec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (GetSpec_getSpec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetSpec_getSpec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetSpec_getSpec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface GetSpec_getSpec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface GetSpec_getSpec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: GetSpec_getSpec_shipment_marine | null;
  air: GetSpec_getSpec_shipment_air | null;
  railway: GetSpec_getSpec_shipment_railway | null;
  car: GetSpec_getSpec_shipment_car | null;
  mixed: GetSpec_getSpec_shipment_mixed | null;
  express: GetSpec_getSpec_shipment_express | null;
}

export interface GetSpec_getSpec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface GetSpec_getSpec_invoices_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetSpec_getSpec_invoices_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetSpec_getSpec_invoices_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: GetSpec_getSpec_invoices_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetSpec_getSpec_invoices_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: GetSpec_getSpec_invoices_supplier_phone | null;
  phoneOption: string | null;
  fax: GetSpec_getSpec_invoices_supplier_fax | null;
  website: string | null;
  mobilePhone: GetSpec_getSpec_invoices_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (GetSpec_getSpec_invoices_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (GetSpec_getSpec_invoices_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetSpec_getSpec_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface GetSpec_getSpec_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: GetSpec_getSpec_invoices_products_name_values[] | null;
}

export interface GetSpec_getSpec_invoices_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface GetSpec_getSpec_invoices_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface GetSpec_getSpec_invoices_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetSpec_getSpec_invoices_products_info {
  images: GetSpec_getSpec_invoices_products_info_images[] | null;
  description: string | null;
}

export interface GetSpec_getSpec_invoices_products_link {
  url: string | null;
}

export interface GetSpec_getSpec_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetSpec_getSpec_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: GetSpec_getSpec_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: GetSpec_getSpec_invoices_products_cost | null;
  store: GetSpec_getSpec_invoices_products_store | null;
  info: GetSpec_getSpec_invoices_products_info | null;
  link: GetSpec_getSpec_invoices_products_link | null;
  comments: (GetSpec_getSpec_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetSpec_getSpec_invoices {
  id: string;
  supplier: GetSpec_getSpec_invoices_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (GetSpec_getSpec_invoices_products | null)[] | null;
}

export interface GetSpec_getSpec {
  activeTab: number | null;
  expandedInvoices: string[] | null;
  id: string;
  requisite: string | null;
  client: GetSpec_getSpec_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (GetSpec_getSpec_comments | null)[] | null;
  containers: (GetSpec_getSpec_containers | null)[] | null;
  shipment: GetSpec_getSpec_shipment | null;
  customs: GetSpec_getSpec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  invoices: (GetSpec_getSpec_invoices | null)[] | null;
}

export interface GetSpec {
  getSpec: GetSpec_getSpec | null;
}

export interface GetSpecVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrgNextClientUid
// ====================================================

export interface GetOrgNextClientUid {
  getOrgNextClientUid: string | null;
}

export interface GetOrgNextClientUidVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClient
// ====================================================

export interface GetClient_getClient_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetClient_getClient_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetClient_getClient_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetClient_getClient_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetClient_getClient_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetClient_getClient_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetClient_getClient_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetClient_getClient_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetClient_getClient_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetClient_getClient_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetClient_getClient_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetClient_getClient {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: GetClient_getClient_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetClient_getClient_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: GetClient_getClient_phone | null;
  phoneOption: string | null;
  fax: GetClient_getClient_fax | null;
  website: string | null;
  mobilePhone: GetClient_getClient_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: GetClient_getClient_importerContactPerson | null;
  importerMobilePhone: GetClient_getClient_importerMobilePhone | null;
  importerPhone: GetClient_getClient_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: GetClient_getClient_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (GetClient_getClient_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (GetClient_getClient_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetClient {
  getClient: GetClient_getClient | null;
}

export interface GetClientVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClientGroup
// ====================================================

export interface GetClientGroup_getClientGroup {
  id: string;
  uid: string | null;
  LEGAL: string | null;
  PRIVATE: string | null;
  OTHER: string | null;
}

export interface GetClientGroup {
  getClientGroup: GetClientGroup_getClientGroup | null;
}

export interface GetClientGroupVariables {
  orgId: string;
  groupId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListClients
// ====================================================

export interface ListClients_listClients_items {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  fullName: string | null;
  contactPersonFullName: string | null;
  contactPhone: string | null;
  email: string | null;
  tags: (string | null)[] | null;
  dealsCount: number | null;
  prepayment: number | null;
  debt: number | null;
  turnover: number | null;
}

export interface ListClients_listClients {
  items: ListClients_listClients_items[] | null;
}

export interface ListClients {
  listClients: ListClients_listClients | null;
}

export interface ListClientsVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClientsById
// ====================================================

export interface GetClientsById_getClientsById_items_contactPerson {
  fullName: string | null;
}

export interface GetClientsById_getClientsById_items {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: GetClientsById_getClientsById_items_contactPerson | null;
  tags: (string | null)[] | null;
}

export interface GetClientsById_getClientsById {
  items: GetClientsById_getClientsById_items[] | null;
}

export interface GetClientsById {
  getClientsById: GetClientsById_getClientsById | null;
}

export interface GetClientsByIdVariables {
  orgId: string;
  ids?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchClients
// ====================================================

export interface SearchClients_searchClients_items_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchClients_searchClients_items_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchClients_searchClients_items_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchClients_searchClients_items_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchClients_searchClients_items_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchClients_searchClients_items_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchClients_searchClients_items_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchClients_searchClients_items_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchClients_searchClients_items_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchClients_searchClients_items_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SearchClients_searchClients_items_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SearchClients_searchClients_items {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: SearchClients_searchClients_items_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SearchClients_searchClients_items_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SearchClients_searchClients_items_phone | null;
  phoneOption: string | null;
  fax: SearchClients_searchClients_items_fax | null;
  website: string | null;
  mobilePhone: SearchClients_searchClients_items_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: SearchClients_searchClients_items_importerContactPerson | null;
  importerMobilePhone: SearchClients_searchClients_items_importerMobilePhone | null;
  importerPhone: SearchClients_searchClients_items_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: SearchClients_searchClients_items_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (SearchClients_searchClients_items_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SearchClients_searchClients_items_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SearchClients_searchClients {
  items: SearchClients_searchClients_items[] | null;
}

export interface SearchClients {
  searchClients: SearchClients_searchClients | null;
}

export interface SearchClientsVariables {
  orgId: string;
  search: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrgNextSupplierUid
// ====================================================

export interface GetOrgNextSupplierUid {
  getOrgNextSupplierUid: string | null;
}

export interface GetOrgNextSupplierUidVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSupplier
// ====================================================

export interface GetSupplier_getSupplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSupplier_getSupplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSupplier_getSupplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSupplier_getSupplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSupplier_getSupplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSupplier_getSupplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetSupplier_getSupplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetSupplier_getSupplier_branches_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetSupplier_getSupplier_branches_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSupplier_getSupplier_branches_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetSupplier_getSupplier_branches_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetSupplier_getSupplier_branches {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: GetSupplier_getSupplier_branches_contactPerson | null;
  workPhone: GetSupplier_getSupplier_branches_workPhone | null;
  mobilePhone: GetSupplier_getSupplier_branches_mobilePhone | null;
  contacts: (GetSupplier_getSupplier_branches_contacts | null)[] | null;
}

export interface GetSupplier_getSupplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: GetSupplier_getSupplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetSupplier_getSupplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: GetSupplier_getSupplier_phone | null;
  phoneOption: string | null;
  fax: GetSupplier_getSupplier_fax | null;
  website: string | null;
  mobilePhone: GetSupplier_getSupplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (GetSupplier_getSupplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (GetSupplier_getSupplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
  branches: GetSupplier_getSupplier_branches[] | null;
}

export interface GetSupplier {
  getSupplier: GetSupplier_getSupplier | null;
}

export interface GetSupplierVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListSuppliers
// ====================================================

export interface ListSuppliers_listSuppliers_items {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  contactPersonFullName: string | null;
  contactPhone: string | null;
  email: string | null;
  tags: (string | null)[] | null;
  dealsCount: number | null;
  cost: number | null;
  debt: number | null;
  totalCost: number | null;
}

export interface ListSuppliers_listSuppliers {
  items: ListSuppliers_listSuppliers_items[] | null;
}

export interface ListSuppliers {
  listSuppliers: ListSuppliers_listSuppliers | null;
}

export interface ListSuppliersVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchSuppliers
// ====================================================

export interface SearchSuppliers_searchSuppliers_items_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SearchSuppliers_searchSuppliers_items_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SearchSuppliers_searchSuppliers_items {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SearchSuppliers_searchSuppliers_items_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SearchSuppliers_searchSuppliers_items_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SearchSuppliers_searchSuppliers_items_phone | null;
  phoneOption: string | null;
  fax: SearchSuppliers_searchSuppliers_items_fax | null;
  website: string | null;
  mobilePhone: SearchSuppliers_searchSuppliers_items_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SearchSuppliers_searchSuppliers_items_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SearchSuppliers_searchSuppliers_items_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SearchSuppliers_searchSuppliers {
  items: SearchSuppliers_searchSuppliers_items[] | null;
}

export interface SearchSuppliers {
  searchSuppliers: SearchSuppliers_searchSuppliers | null;
}

export interface SearchSuppliersVariables {
  orgId: string;
  search: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrgRequisite
// ====================================================

export interface GetOrgRequisite_getOrgRequisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetOrgRequisite_getOrgRequisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetOrgRequisite_getOrgRequisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetOrgRequisite_getOrgRequisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: GetOrgRequisite_getOrgRequisite_phone | null;
  phoneOption: string | null;
  fax: GetOrgRequisite_getOrgRequisite_fax | null;
  website: string | null;
  mobilePhone: GetOrgRequisite_getOrgRequisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: GetOrgRequisite_getOrgRequisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: GetOrgRequisite_getOrgRequisite_importerContactPerson | null;
  importerMobilePhone: GetOrgRequisite_getOrgRequisite_importerMobilePhone | null;
  importerPhone: GetOrgRequisite_getOrgRequisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (GetOrgRequisite_getOrgRequisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetOrgRequisite {
  getOrgRequisite: GetOrgRequisite_getOrgRequisite | null;
}

export interface GetOrgRequisiteVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListOrgRequisites
// ====================================================

export interface ListOrgRequisites_listOrgRequisites_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ListOrgRequisites_listOrgRequisites_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface ListOrgRequisites_listOrgRequisites {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: ListOrgRequisites_listOrgRequisites_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: ListOrgRequisites_listOrgRequisites_phone | null;
  phoneOption: string | null;
  fax: ListOrgRequisites_listOrgRequisites_fax | null;
  website: string | null;
  mobilePhone: ListOrgRequisites_listOrgRequisites_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: ListOrgRequisites_listOrgRequisites_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: ListOrgRequisites_listOrgRequisites_importerContactPerson | null;
  importerMobilePhone: ListOrgRequisites_listOrgRequisites_importerMobilePhone | null;
  importerPhone: ListOrgRequisites_listOrgRequisites_importerPhone | null;
  importerEmail: string | null;
  contacts: (ListOrgRequisites_listOrgRequisites_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface ListOrgRequisites {
  listOrgRequisites: ListOrgRequisites_listOrgRequisites[] | null;
}

export interface ListOrgRequisitesVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListOrgContracts
// ====================================================

export interface ListOrgContracts_listOrgContracts_items {
  title: string | null;
  paragraphs: string[] | null;
}

export interface ListOrgContracts_listOrgContracts_specItems {
  title: string | null;
  paragraphs: string[] | null;
}

export interface ListOrgContracts_listOrgContracts {
  id: string;
  name: string | null;
  title: string | null;
  country: string | null;
  docHeader: string | null;
  useDefaultDocHeader: boolean | null;
  requisiteId: string | null;
  docNo: string | null;
  items: ListOrgContracts_listOrgContracts_items[] | null;
  specItems: ListOrgContracts_listOrgContracts_specItems[] | null;
}

export interface ListOrgContracts {
  listOrgContracts: ListOrgContracts_listOrgContracts[] | null;
}

export interface ListOrgContractsVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckInvitation
// ====================================================

export interface CheckInvitation_checkInvitation_owner {
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
}

export interface CheckInvitation_checkInvitation {
  orgId: string;
  owner: CheckInvitation_checkInvitation_owner | null;
  orgName: string | null;
}

export interface CheckInvitation {
  checkInvitation: CheckInvitation_checkInvitation | null;
}

export interface CheckInvitationVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListOrgInvitations
// ====================================================

export interface ListOrgInvitations_listOrgInvitations {
  id: string;
  invitationEmail: string;
  invitationGivenName: string | null;
  invitationFamilyName: string | null;
  invitationRole: InvitationRole;
  status: InvitationStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ListOrgInvitations {
  listOrgInvitations: ListOrgInvitations_listOrgInvitations[] | null;
}

export interface ListOrgInvitationsVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListStaff
// ====================================================

export interface ListStaff_listStaff_items_specs {
  id: string;
  specStatus: SpecStatus | null;
  isMoneyRecieved: boolean | null;
  isExpensesPaid: boolean | null;
  specNo: string | null;
  clientFullName: string | null;
  shipped: boolean | null;
  revenue: number | null;
  totalItemsCost: number | null;
  totalMargin: number | null;
  diff: number | null;
}

export interface ListStaff_listStaff_items {
  id: string;
  givenName: string | null;
  familyName: string | null;
  picture: string | null;
  role: RoleInProject | null;
  processing: number | null;
  revenue: number | null;
  totalItemsCost: number | null;
  totalMargin: number | null;
  diff: number | null;
  specStatus: SpecStatus | null;
  specs: (ListStaff_listStaff_items_specs | null)[] | null;
}

export interface ListStaff_listStaff_invitations {
  id: string;
  invitationEmail: string;
  invitationGivenName: string | null;
  invitationFamilyName: string | null;
  invitationRole: InvitationRole;
  status: InvitationStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ListStaff_listStaff {
  items: ListStaff_listStaff_items[] | null;
  invitations: ListStaff_listStaff_invitations[] | null;
}

export interface ListStaff {
  listStaff: ListStaff_listStaff | null;
}

export interface ListStaffVariables {
  orgId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpecLinkAccess
// ====================================================

export interface GetSpecLinkAccess {
  getSpecLinkAccess: boolean | null;
}

export interface GetSpecLinkAccessVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpecEmailAccess
// ====================================================

export interface GetSpecEmailAccess_getSpecEmailAccess {
  email: string;
}

export interface GetSpecEmailAccess {
  getSpecEmailAccess: GetSpecEmailAccess_getSpecEmailAccess[] | null;
}

export interface GetSpecEmailAccessVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPaperSpec
// ====================================================

export interface GetPaperSpec_getPaperSpec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetPaperSpec_getPaperSpec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetPaperSpec_getPaperSpec_requisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetPaperSpec_getPaperSpec_requisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: GetPaperSpec_getPaperSpec_requisite_phone | null;
  phoneOption: string | null;
  fax: GetPaperSpec_getPaperSpec_requisite_fax | null;
  website: string | null;
  mobilePhone: GetPaperSpec_getPaperSpec_requisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: GetPaperSpec_getPaperSpec_requisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: GetPaperSpec_getPaperSpec_requisite_importerContactPerson | null;
  importerMobilePhone: GetPaperSpec_getPaperSpec_requisite_importerMobilePhone | null;
  importerPhone: GetPaperSpec_getPaperSpec_requisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (GetPaperSpec_getPaperSpec_requisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetPaperSpec_getPaperSpec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface GetPaperSpec_getPaperSpec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetPaperSpec_getPaperSpec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: GetPaperSpec_getPaperSpec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: GetPaperSpec_getPaperSpec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: GetPaperSpec_getPaperSpec_client_phone | null;
  phoneOption: string | null;
  fax: GetPaperSpec_getPaperSpec_client_fax | null;
  website: string | null;
  mobilePhone: GetPaperSpec_getPaperSpec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: GetPaperSpec_getPaperSpec_client_importerContactPerson | null;
  importerMobilePhone: GetPaperSpec_getPaperSpec_client_importerMobilePhone | null;
  importerPhone: GetPaperSpec_getPaperSpec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: GetPaperSpec_getPaperSpec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (GetPaperSpec_getPaperSpec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (GetPaperSpec_getPaperSpec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface GetPaperSpec_getPaperSpec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: GetPaperSpec_getPaperSpec_shipment_marine | null;
  air: GetPaperSpec_getPaperSpec_shipment_air | null;
  railway: GetPaperSpec_getPaperSpec_shipment_railway | null;
  car: GetPaperSpec_getPaperSpec_shipment_car | null;
  mixed: GetPaperSpec_getPaperSpec_shipment_mixed | null;
  express: GetPaperSpec_getPaperSpec_shipment_express | null;
}

export interface GetPaperSpec_getPaperSpec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface GetPaperSpec_getPaperSpec_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface GetPaperSpec_getPaperSpec_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: GetPaperSpec_getPaperSpec_invoices_products_name_values[] | null;
}

export interface GetPaperSpec_getPaperSpec_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetPaperSpec_getPaperSpec_invoices_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface GetPaperSpec_getPaperSpec_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: GetPaperSpec_getPaperSpec_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (GetPaperSpec_getPaperSpec_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: GetPaperSpec_getPaperSpec_invoices_products_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface GetPaperSpec_getPaperSpec_invoices {
  id: string;
  invoiceStatus: InvoiceStatus | null;
  profitForAll: boolean | null;
  invoiceNo: string | null;
  shippingDate: string | null;
  discount: number | null;
  prepayment: number | null;
  prepaymentDate: string | null;
  clientDebt: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  discountInCurrency: number | null;
  products: (GetPaperSpec_getPaperSpec_invoices_products | null)[] | null;
}

export interface GetPaperSpec_getPaperSpec {
  expandedInvoices: string[] | null;
  id: string;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  total: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  terms: string | null;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  comments: (GetPaperSpec_getPaperSpec_comments | null)[] | null;
  containers: (GetPaperSpec_getPaperSpec_containers | null)[] | null;
  readyToPrint: boolean | null;
  orgName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  requisite: GetPaperSpec_getPaperSpec_requisite | null;
  client: GetPaperSpec_getPaperSpec_client | null;
  shipment: GetPaperSpec_getPaperSpec_shipment | null;
  customs: GetPaperSpec_getPaperSpec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  invoices: (GetPaperSpec_getPaperSpec_invoices | null)[] | null;
}

export interface GetPaperSpec {
  getPaperSpec: GetPaperSpec_getPaperSpec | null;
}

export interface GetPaperSpecVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: PaymentData
// ====================================================

export interface PaymentData_paymentData {
  operation: string | null;
  payload: any | null;
}

export interface PaymentData {
  paymentData: PaymentData_paymentData | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: delta
// ====================================================

export interface delta_delta_payload_Invoice {
  __typename: "Invoice" | "Product" | "PayloadFields" | "Client" | "RequisiteItems";
}

export interface delta_delta_payload_Spec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface delta_delta_payload_Spec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface delta_delta_payload_Spec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface delta_delta_payload_Spec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface delta_delta_payload_Spec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface delta_delta_payload_Spec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface delta_delta_payload_Spec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface delta_delta_payload_Spec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface delta_delta_payload_Spec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface delta_delta_payload_Spec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface delta_delta_payload_Spec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface delta_delta_payload_Spec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: delta_delta_payload_Spec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: delta_delta_payload_Spec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: delta_delta_payload_Spec_client_phone | null;
  phoneOption: string | null;
  fax: delta_delta_payload_Spec_client_fax | null;
  website: string | null;
  mobilePhone: delta_delta_payload_Spec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: delta_delta_payload_Spec_client_importerContactPerson | null;
  importerMobilePhone: delta_delta_payload_Spec_client_importerMobilePhone | null;
  importerPhone: delta_delta_payload_Spec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: delta_delta_payload_Spec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (delta_delta_payload_Spec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (delta_delta_payload_Spec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface delta_delta_payload_Spec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface delta_delta_payload_Spec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface delta_delta_payload_Spec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface delta_delta_payload_Spec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: delta_delta_payload_Spec_shipment_marine | null;
  air: delta_delta_payload_Spec_shipment_air | null;
  railway: delta_delta_payload_Spec_shipment_railway | null;
  car: delta_delta_payload_Spec_shipment_car | null;
  mixed: delta_delta_payload_Spec_shipment_mixed | null;
  express: delta_delta_payload_Spec_shipment_express | null;
}

export interface delta_delta_payload_Spec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface delta_delta_payload_Spec {
  __typename: "Spec";
  id: string;
  requisite: string | null;
  client: delta_delta_payload_Spec_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (delta_delta_payload_Spec_comments | null)[] | null;
  containers: (delta_delta_payload_Spec_containers | null)[] | null;
  shipment: delta_delta_payload_Spec_shipment | null;
  customs: delta_delta_payload_Spec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type delta_delta_payload = delta_delta_payload_Invoice | delta_delta_payload_Spec;

export interface delta_delta {
  operation: Operation | null;
  parentId: string | null;
  payload: delta_delta_payload | null;
}

export interface delta {
  delta: delta_delta | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: SpecDelta
// ====================================================

export interface SpecDelta_specDelta_payload_PayloadFields {
  __typename: "PayloadFields";
  id: string;
  fields: any | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems_items {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecDelta_specDelta_payload_RequisiteItems_items_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SpecDelta_specDelta_payload_RequisiteItems_items_phone | null;
  phoneOption: string | null;
  fax: SpecDelta_specDelta_payload_RequisiteItems_items_fax | null;
  website: string | null;
  mobilePhone: SpecDelta_specDelta_payload_RequisiteItems_items_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: SpecDelta_specDelta_payload_RequisiteItems_items_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: SpecDelta_specDelta_payload_RequisiteItems_items_importerContactPerson | null;
  importerMobilePhone: SpecDelta_specDelta_payload_RequisiteItems_items_importerMobilePhone | null;
  importerPhone: SpecDelta_specDelta_payload_RequisiteItems_items_importerPhone | null;
  importerEmail: string | null;
  contacts: (SpecDelta_specDelta_payload_RequisiteItems_items_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecDelta_specDelta_payload_RequisiteItems {
  __typename: "RequisiteItems";
  items: SpecDelta_specDelta_payload_RequisiteItems_items[] | null;
}

export interface SpecDelta_specDelta_payload_Client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecDelta_specDelta_payload_Client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Client {
  __typename: "Client";
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: SpecDelta_specDelta_payload_Client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecDelta_specDelta_payload_Client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SpecDelta_specDelta_payload_Client_phone | null;
  phoneOption: string | null;
  fax: SpecDelta_specDelta_payload_Client_fax | null;
  website: string | null;
  mobilePhone: SpecDelta_specDelta_payload_Client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: SpecDelta_specDelta_payload_Client_importerContactPerson | null;
  importerMobilePhone: SpecDelta_specDelta_payload_Client_importerMobilePhone | null;
  importerPhone: SpecDelta_specDelta_payload_Client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: SpecDelta_specDelta_payload_Client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (SpecDelta_specDelta_payload_Client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecDelta_specDelta_payload_Client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecDelta_specDelta_payload_Product_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SpecDelta_specDelta_payload_Product_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: SpecDelta_specDelta_payload_Product_name_values[] | null;
}

export interface SpecDelta_specDelta_payload_Product_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface SpecDelta_specDelta_payload_Product_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface SpecDelta_specDelta_payload_Product_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Product_info {
  images: SpecDelta_specDelta_payload_Product_info_images[] | null;
  description: string | null;
}

export interface SpecDelta_specDelta_payload_Product_link {
  url: string | null;
}

export interface SpecDelta_specDelta_payload_Product_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Product {
  __typename: "Product";
  id: string;
  productStatus: ProductStatus | null;
  name: SpecDelta_specDelta_payload_Product_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: SpecDelta_specDelta_payload_Product_cost | null;
  store: SpecDelta_specDelta_payload_Product_store | null;
  info: SpecDelta_specDelta_payload_Product_info | null;
  link: SpecDelta_specDelta_payload_Product_link | null;
  comments: (SpecDelta_specDelta_payload_Product_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SpecDelta_specDelta_payload_Invoice_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecDelta_specDelta_payload_Invoice_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SpecDelta_specDelta_payload_Invoice_supplier_phone | null;
  phoneOption: string | null;
  fax: SpecDelta_specDelta_payload_Invoice_supplier_fax | null;
  website: string | null;
  mobilePhone: SpecDelta_specDelta_payload_Invoice_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SpecDelta_specDelta_payload_Invoice_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecDelta_specDelta_payload_Invoice_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: SpecDelta_specDelta_payload_Invoice_products_name_values[] | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_info {
  images: SpecDelta_specDelta_payload_Invoice_products_info_images[] | null;
  description: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_link {
  url: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice_products {
  id: string;
  productStatus: ProductStatus | null;
  name: SpecDelta_specDelta_payload_Invoice_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: SpecDelta_specDelta_payload_Invoice_products_cost | null;
  store: SpecDelta_specDelta_payload_Invoice_products_store | null;
  info: SpecDelta_specDelta_payload_Invoice_products_info | null;
  link: SpecDelta_specDelta_payload_Invoice_products_link | null;
  comments: (SpecDelta_specDelta_payload_Invoice_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Invoice {
  __typename: "Invoice";
  id: string;
  supplier: SpecDelta_specDelta_payload_Invoice_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (SpecDelta_specDelta_payload_Invoice_products | null)[] | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: SpecDelta_specDelta_payload_Spec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecDelta_specDelta_payload_Spec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SpecDelta_specDelta_payload_Spec_client_phone | null;
  phoneOption: string | null;
  fax: SpecDelta_specDelta_payload_Spec_client_fax | null;
  website: string | null;
  mobilePhone: SpecDelta_specDelta_payload_Spec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: SpecDelta_specDelta_payload_Spec_client_importerContactPerson | null;
  importerMobilePhone: SpecDelta_specDelta_payload_Spec_client_importerMobilePhone | null;
  importerPhone: SpecDelta_specDelta_payload_Spec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: SpecDelta_specDelta_payload_Spec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (SpecDelta_specDelta_payload_Spec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecDelta_specDelta_payload_Spec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecDelta_specDelta_payload_Spec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: SpecDelta_specDelta_payload_Spec_shipment_marine | null;
  air: SpecDelta_specDelta_payload_Spec_shipment_air | null;
  railway: SpecDelta_specDelta_payload_Spec_shipment_railway | null;
  car: SpecDelta_specDelta_payload_Spec_shipment_car | null;
  mixed: SpecDelta_specDelta_payload_Spec_shipment_mixed | null;
  express: SpecDelta_specDelta_payload_Spec_shipment_express | null;
}

export interface SpecDelta_specDelta_payload_Spec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SpecDelta_specDelta_payload_Spec_invoices_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecDelta_specDelta_payload_Spec_invoices_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SpecDelta_specDelta_payload_Spec_invoices_supplier_phone | null;
  phoneOption: string | null;
  fax: SpecDelta_specDelta_payload_Spec_invoices_supplier_fax | null;
  website: string | null;
  mobilePhone: SpecDelta_specDelta_payload_Spec_invoices_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SpecDelta_specDelta_payload_Spec_invoices_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecDelta_specDelta_payload_Spec_invoices_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: SpecDelta_specDelta_payload_Spec_invoices_products_name_values[] | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_info {
  images: SpecDelta_specDelta_payload_Spec_invoices_products_info_images[] | null;
  description: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_link {
  url: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: SpecDelta_specDelta_payload_Spec_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: SpecDelta_specDelta_payload_Spec_invoices_products_cost | null;
  store: SpecDelta_specDelta_payload_Spec_invoices_products_store | null;
  info: SpecDelta_specDelta_payload_Spec_invoices_products_info | null;
  link: SpecDelta_specDelta_payload_Spec_invoices_products_link | null;
  comments: (SpecDelta_specDelta_payload_Spec_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecDelta_specDelta_payload_Spec_invoices {
  id: string;
  supplier: SpecDelta_specDelta_payload_Spec_invoices_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (SpecDelta_specDelta_payload_Spec_invoices_products | null)[] | null;
}

export interface SpecDelta_specDelta_payload_Spec {
  __typename: "Spec";
  id: string;
  requisite: string | null;
  client: SpecDelta_specDelta_payload_Spec_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (SpecDelta_specDelta_payload_Spec_comments | null)[] | null;
  containers: (SpecDelta_specDelta_payload_Spec_containers | null)[] | null;
  shipment: SpecDelta_specDelta_payload_Spec_shipment | null;
  customs: SpecDelta_specDelta_payload_Spec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  invoices: (SpecDelta_specDelta_payload_Spec_invoices | null)[] | null;
}

export type SpecDelta_specDelta_payload = SpecDelta_specDelta_payload_PayloadFields | SpecDelta_specDelta_payload_RequisiteItems | SpecDelta_specDelta_payload_Client | SpecDelta_specDelta_payload_Product | SpecDelta_specDelta_payload_Invoice | SpecDelta_specDelta_payload_Spec;

export interface SpecDelta_specDelta {
  operation: Operation | null;
  parentId: string | null;
  payload: SpecDelta_specDelta_payload | null;
}

export interface SpecDelta {
  specDelta: SpecDelta_specDelta | null;
}

export interface SpecDeltaVariables {
  specId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: PaperSpecDelta
// ====================================================

export interface PaperSpecDelta_paperSpecDelta_payload_PayloadFields {
  __typename: "PayloadFields";
  id: string;
  fields: any | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperProduct_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperProduct_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperSpecDelta_paperSpecDelta_payload_PaperProduct_name_values[] | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperProduct_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperProduct_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperProduct {
  __typename: "PaperProduct";
  id: string;
  productStatus: ProductStatus | null;
  name: PaperSpecDelta_paperSpecDelta_payload_PaperProduct_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperSpecDelta_paperSpecDelta_payload_PaperProduct_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperSpecDelta_paperSpecDelta_payload_PaperProduct_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_name_values[] | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products {
  id: string;
  productStatus: ProductStatus | null;
  name: PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperInvoice {
  __typename: "PaperInvoice";
  id: string;
  invoiceStatus: InvoiceStatus | null;
  profitForAll: boolean | null;
  invoiceNo: string | null;
  shippingDate: string | null;
  discount: number | null;
  prepayment: number | null;
  prepaymentDate: string | null;
  clientDebt: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  discountInCurrency: number | null;
  products: (PaperSpecDelta_paperSpecDelta_payload_PaperInvoice_products | null)[] | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_phone | null;
  phoneOption: string | null;
  fax: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_fax | null;
  website: string | null;
  mobilePhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerContactPerson | null;
  importerMobilePhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerMobilePhone | null;
  importerPhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_phone | null;
  phoneOption: string | null;
  fax: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_fax | null;
  website: string | null;
  mobilePhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerContactPerson | null;
  importerMobilePhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerMobilePhone | null;
  importerPhone: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_marine | null;
  air: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_air | null;
  railway: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_railway | null;
  car: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_car | null;
  mixed: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_mixed | null;
  express: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment_express | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_name_values[] | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices {
  id: string;
  invoiceStatus: InvoiceStatus | null;
  profitForAll: boolean | null;
  invoiceNo: string | null;
  shippingDate: string | null;
  discount: number | null;
  prepayment: number | null;
  prepaymentDate: string | null;
  clientDebt: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  discountInCurrency: number | null;
  products: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices_products | null)[] | null;
}

export interface PaperSpecDelta_paperSpecDelta_payload_PaperSpec {
  __typename: "PaperSpec";
  id: string;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  total: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  terms: string | null;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  comments: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_comments | null)[] | null;
  containers: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_containers | null)[] | null;
  readyToPrint: boolean | null;
  orgName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  requisite: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_requisite | null;
  client: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_client | null;
  shipment: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_shipment | null;
  customs: PaperSpecDelta_paperSpecDelta_payload_PaperSpec_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  invoices: (PaperSpecDelta_paperSpecDelta_payload_PaperSpec_invoices | null)[] | null;
}

export type PaperSpecDelta_paperSpecDelta_payload = PaperSpecDelta_paperSpecDelta_payload_PayloadFields | PaperSpecDelta_paperSpecDelta_payload_PaperProduct | PaperSpecDelta_paperSpecDelta_payload_PaperInvoice | PaperSpecDelta_paperSpecDelta_payload_PaperSpec;

export interface PaperSpecDelta_paperSpecDelta {
  operation: Operation | null;
  parentId: string | null;
  payload: PaperSpecDelta_paperSpecDelta_payload | null;
}

export interface PaperSpecDelta {
  paperSpecDelta: PaperSpecDelta_paperSpecDelta | null;
}

export interface PaperSpecDeltaVariables {
  specId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentFragment
// ====================================================

export interface CommentFragment {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ContainerFragment
// ====================================================

export interface ContainerFragment {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShipmentFragment
// ====================================================

export interface ShipmentFragment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface ShipmentFragment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: ShipmentFragment_marine | null;
  air: ShipmentFragment_air | null;
  railway: ShipmentFragment_railway | null;
  car: ShipmentFragment_car | null;
  mixed: ShipmentFragment_mixed | null;
  express: ShipmentFragment_express | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CustomsFragment
// ====================================================

export interface CustomsFragment {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AttachFileFragment
// ====================================================

export interface AttachFileFragment {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductFragment
// ====================================================

export interface ProductFragment_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface ProductFragment_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: ProductFragment_name_values[] | null;
}

export interface ProductFragment_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface ProductFragment_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface ProductFragment_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface ProductFragment_info {
  images: ProductFragment_info_images[] | null;
  description: string | null;
}

export interface ProductFragment_link {
  url: string | null;
}

export interface ProductFragment_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProductFragment {
  id: string;
  productStatus: ProductStatus | null;
  name: ProductFragment_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: ProductFragment_cost | null;
  store: ProductFragment_store | null;
  info: ProductFragment_info | null;
  link: ProductFragment_link | null;
  comments: (ProductFragment_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PersonFragment
// ====================================================

export interface PersonFragment {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PhoneFragment
// ====================================================

export interface PhoneFragment {
  countryCode: string | null;
  phone: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ContactFragment
// ====================================================

export interface ContactFragment {
  contactType: ContactType | null;
  contact: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SupplierFragment
// ====================================================

export interface SupplierFragment_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SupplierFragment_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SupplierFragment_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SupplierFragment_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SupplierFragment_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SupplierFragment_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SupplierFragment_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SupplierFragment {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SupplierFragment_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SupplierFragment_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SupplierFragment_phone | null;
  phoneOption: string | null;
  fax: SupplierFragment_fax | null;
  website: string | null;
  mobilePhone: SupplierFragment_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SupplierFragment_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SupplierFragment_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SupplierItemFragment
// ====================================================

export interface SupplierItemFragment {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  contactPersonFullName: string | null;
  contactPhone: string | null;
  email: string | null;
  tags: (string | null)[] | null;
  dealsCount: number | null;
  cost: number | null;
  debt: number | null;
  totalCost: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InvoiceFragment
// ====================================================

export interface InvoiceFragment_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface InvoiceFragment_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface InvoiceFragment_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface InvoiceFragment_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface InvoiceFragment_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface InvoiceFragment_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface InvoiceFragment_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface InvoiceFragment_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: InvoiceFragment_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: InvoiceFragment_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: InvoiceFragment_supplier_phone | null;
  phoneOption: string | null;
  fax: InvoiceFragment_supplier_fax | null;
  website: string | null;
  mobilePhone: InvoiceFragment_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (InvoiceFragment_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (InvoiceFragment_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface InvoiceFragment {
  id: string;
  supplier: InvoiceFragment_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InvoiceProductsFragment
// ====================================================

export interface InvoiceProductsFragment_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface InvoiceProductsFragment_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: InvoiceProductsFragment_products_name_values[] | null;
}

export interface InvoiceProductsFragment_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface InvoiceProductsFragment_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface InvoiceProductsFragment_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface InvoiceProductsFragment_products_info {
  images: InvoiceProductsFragment_products_info_images[] | null;
  description: string | null;
}

export interface InvoiceProductsFragment_products_link {
  url: string | null;
}

export interface InvoiceProductsFragment_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface InvoiceProductsFragment_products {
  id: string;
  productStatus: ProductStatus | null;
  name: InvoiceProductsFragment_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: InvoiceProductsFragment_products_cost | null;
  store: InvoiceProductsFragment_products_store | null;
  info: InvoiceProductsFragment_products_info | null;
  link: InvoiceProductsFragment_products_link | null;
  comments: (InvoiceProductsFragment_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface InvoiceProductsFragment {
  id: string;
  products: (InvoiceProductsFragment_products | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ClientFragment
// ====================================================

export interface ClientFragment_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ClientFragment_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ClientFragment_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface ClientFragment_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface ClientFragment_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ClientFragment_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ClientFragment_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ClientFragment_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface ClientFragment_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface ClientFragment_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface ClientFragment_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface ClientFragment {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: ClientFragment_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: ClientFragment_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: ClientFragment_phone | null;
  phoneOption: string | null;
  fax: ClientFragment_fax | null;
  website: string | null;
  mobilePhone: ClientFragment_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: ClientFragment_importerContactPerson | null;
  importerMobilePhone: ClientFragment_importerMobilePhone | null;
  importerPhone: ClientFragment_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: ClientFragment_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (ClientFragment_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (ClientFragment_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ClientItemFragment
// ====================================================

export interface ClientItemFragment {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  fullName: string | null;
  contactPersonFullName: string | null;
  contactPhone: string | null;
  email: string | null;
  tags: (string | null)[] | null;
  dealsCount: number | null;
  prepayment: number | null;
  debt: number | null;
  turnover: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SpecFragment
// ====================================================

export interface SpecFragment_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecFragment_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecFragment_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecFragment_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecFragment_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecFragment_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecFragment_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecFragment_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecFragment_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecFragment_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecFragment_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecFragment_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: SpecFragment_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecFragment_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: SpecFragment_client_phone | null;
  phoneOption: string | null;
  fax: SpecFragment_client_fax | null;
  website: string | null;
  mobilePhone: SpecFragment_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: SpecFragment_client_importerContactPerson | null;
  importerMobilePhone: SpecFragment_client_importerMobilePhone | null;
  importerPhone: SpecFragment_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: SpecFragment_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (SpecFragment_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecFragment_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecFragment_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecFragment_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface SpecFragment_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface SpecFragment_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: SpecFragment_shipment_marine | null;
  air: SpecFragment_shipment_air | null;
  railway: SpecFragment_shipment_railway | null;
  car: SpecFragment_shipment_car | null;
  mixed: SpecFragment_shipment_mixed | null;
  express: SpecFragment_shipment_express | null;
}

export interface SpecFragment_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface SpecFragment {
  id: string;
  requisite: string | null;
  client: SpecFragment_client | null;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  finalObtainCost: number | null;
  profit: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  comments: (SpecFragment_comments | null)[] | null;
  containers: (SpecFragment_containers | null)[] | null;
  shipment: SpecFragment_shipment | null;
  customs: SpecFragment_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  total: number | null;
  amount: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
  readyToPrint: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SupplierBranchFragment
// ====================================================

export interface SupplierBranchFragment_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SupplierBranchFragment_workPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SupplierBranchFragment_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SupplierBranchFragment_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SupplierBranchFragment {
  id: string;
  branchType: BranchType | null;
  name: string | null;
  address: string | null;
  contactPerson: SupplierBranchFragment_contactPerson | null;
  workPhone: SupplierBranchFragment_workPhone | null;
  mobilePhone: SupplierBranchFragment_mobilePhone | null;
  contacts: (SupplierBranchFragment_contacts | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SpecInvoicesFragment
// ====================================================

export interface SpecInvoicesFragment_invoices_supplier_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecInvoicesFragment_invoices_supplier {
  id: string;
  uid: string | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  companyType: string | null;
  contactPerson: SpecInvoicesFragment_invoices_supplier_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: SpecInvoicesFragment_invoices_supplier_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  phone: SpecInvoicesFragment_invoices_supplier_phone | null;
  phoneOption: string | null;
  fax: SpecInvoicesFragment_invoices_supplier_fax | null;
  website: string | null;
  mobilePhone: SpecInvoicesFragment_invoices_supplier_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  note: string | null;
  contacts: (SpecInvoicesFragment_invoices_supplier_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (SpecInvoicesFragment_invoices_supplier_files | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface SpecInvoicesFragment_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface SpecInvoicesFragment_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: SpecInvoicesFragment_invoices_products_name_values[] | null;
}

export interface SpecInvoicesFragment_invoices_products_cost {
  clientPrice: number | null;
  customClientPrice: number | null;
  clientAmount: number | null;
  purchasePrice: number | null;
  customPurchasePrice: number | null;
  purchaseAmount: number | null;
  price: number | null;
  amount: number | null;
}

export interface SpecInvoicesFragment_invoices_products_store {
  net: number | null;
  gross: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  volume: number | null;
  weight: number | null;
  atWhouse: boolean | null;
  pkgQty: number | null;
  pkgNo: number | null;
}

export interface SpecInvoicesFragment_invoices_products_info_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface SpecInvoicesFragment_invoices_products_info {
  images: SpecInvoicesFragment_invoices_products_info_images[] | null;
  description: string | null;
}

export interface SpecInvoicesFragment_invoices_products_link {
  url: string | null;
}

export interface SpecInvoicesFragment_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecInvoicesFragment_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: SpecInvoicesFragment_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  cost: SpecInvoicesFragment_invoices_products_cost | null;
  store: SpecInvoicesFragment_invoices_products_store | null;
  info: SpecInvoicesFragment_invoices_products_info | null;
  link: SpecInvoicesFragment_invoices_products_link | null;
  comments: (SpecInvoicesFragment_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SpecInvoicesFragment_invoices {
  id: string;
  supplier: SpecInvoicesFragment_invoices_supplier | null;
  invoiceStatus: InvoiceStatus | null;
  invoiceNo: string | null;
  purchaseDate: string | null;
  shippingDate: string | null;
  profitType: InvoiceProfitType | null;
  profitPercent: number | null;
  profitForAll: boolean | null;
  discount: number | null;
  discountInCurrency: number | null;
  prepayment: number | null;
  prepaymentInCurrency: number | null;
  prepaymentDate: string | null;
  obtainCost: number | null;
  obtainCostDate: string | null;
  clientDebt: number | null;
  clientDebtInCurrency: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  totalPurchaseAmount: number | null;
  totalNet: number | null;
  totalGross: number | null;
  totalVolume: number | null;
  totalWeight: number | null;
  totalPkgQty: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: (SpecInvoicesFragment_invoices_products | null)[] | null;
}

export interface SpecInvoicesFragment {
  id: string;
  invoices: (SpecInvoicesFragment_invoices | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BankDetailFragment
// ====================================================

export interface BankDetailFragment {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrgRequisiteFragment
// ====================================================

export interface OrgRequisiteFragment_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface OrgRequisiteFragment_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface OrgRequisiteFragment_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface OrgRequisiteFragment_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface OrgRequisiteFragment_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface OrgRequisiteFragment_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface OrgRequisiteFragment_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface OrgRequisiteFragment_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface OrgRequisiteFragment_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface OrgRequisiteFragment {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: OrgRequisiteFragment_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: OrgRequisiteFragment_phone | null;
  phoneOption: string | null;
  fax: OrgRequisiteFragment_fax | null;
  website: string | null;
  mobilePhone: OrgRequisiteFragment_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: OrgRequisiteFragment_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: OrgRequisiteFragment_importerContactPerson | null;
  importerMobilePhone: OrgRequisiteFragment_importerMobilePhone | null;
  importerPhone: OrgRequisiteFragment_importerPhone | null;
  importerEmail: string | null;
  contacts: (OrgRequisiteFragment_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OrgContractFragment
// ====================================================

export interface OrgContractFragment_items {
  title: string | null;
  paragraphs: string[] | null;
}

export interface OrgContractFragment_specItems {
  title: string | null;
  paragraphs: string[] | null;
}

export interface OrgContractFragment {
  id: string;
  name: string | null;
  title: string | null;
  country: string | null;
  docHeader: string | null;
  useDefaultDocHeader: boolean | null;
  requisiteId: string | null;
  docNo: string | null;
  items: OrgContractFragment_items[] | null;
  specItems: OrgContractFragment_specItems[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaperProductFragment
// ====================================================

export interface PaperProductFragment_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperProductFragment_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperProductFragment_name_values[] | null;
}

export interface PaperProductFragment_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperProductFragment_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperProductFragment {
  id: string;
  productStatus: ProductStatus | null;
  name: PaperProductFragment_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperProductFragment_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperProductFragment_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaperInvoiceFragment
// ====================================================

export interface PaperInvoiceFragment {
  id: string;
  invoiceStatus: InvoiceStatus | null;
  profitForAll: boolean | null;
  invoiceNo: string | null;
  shippingDate: string | null;
  discount: number | null;
  prepayment: number | null;
  prepaymentDate: string | null;
  clientDebt: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  discountInCurrency: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaperInvoiceProductsFragment
// ====================================================

export interface PaperInvoiceProductsFragment_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperInvoiceProductsFragment_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperInvoiceProductsFragment_products_name_values[] | null;
}

export interface PaperInvoiceProductsFragment_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperInvoiceProductsFragment_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperInvoiceProductsFragment_products {
  id: string;
  productStatus: ProductStatus | null;
  name: PaperInvoiceProductsFragment_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperInvoiceProductsFragment_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperInvoiceProductsFragment_products_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface PaperInvoiceProductsFragment {
  id: string;
  products: (PaperInvoiceProductsFragment_products | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaperSpecFragment
// ====================================================

export interface PaperSpecFragment_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecFragment_containers {
  id: string;
  size: ContainerSize | null;
  mode: ContainerMode | null;
  capacity: number | null;
  shrink: number | null;
  full: number | null;
  loaded: number | null;
}

export interface PaperSpecFragment_requisite_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_requisite_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_requisite_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_requisite_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_requisite_bankDetails {
  id: string;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
}

export interface PaperSpecFragment_requisite_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_requisite_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_requisite_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_requisite_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface PaperSpecFragment_requisite {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: PaperSpecFragment_requisite_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: PaperSpecFragment_requisite_phone | null;
  phoneOption: string | null;
  fax: PaperSpecFragment_requisite_fax | null;
  website: string | null;
  mobilePhone: PaperSpecFragment_requisite_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  defaultBankDetail: string | null;
  bankDetails: PaperSpecFragment_requisite_bankDetails[] | null;
  importerCompanyName: string | null;
  importerContactPerson: PaperSpecFragment_requisite_importerContactPerson | null;
  importerMobilePhone: PaperSpecFragment_requisite_importerMobilePhone | null;
  importerPhone: PaperSpecFragment_requisite_importerPhone | null;
  importerEmail: string | null;
  contacts: (PaperSpecFragment_requisite_contacts | null)[] | null;
  tags: (string | null)[] | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface PaperSpecFragment_client_contactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_client_companyOwner {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_client_phone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_client_fax {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_client_mobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_client_importerContactPerson {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_client_importerMobilePhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_client_importerPhone {
  countryCode: string | null;
  phone: string | null;
}

export interface PaperSpecFragment_client_person {
  isName: boolean | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  fullName: string | null;
}

export interface PaperSpecFragment_client_contacts {
  contactType: ContactType | null;
  contact: string | null;
}

export interface PaperSpecFragment_client_files {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecFragment_client {
  id: string;
  groupId: string;
  uid: string | null;
  clientType: ClientType | null;
  locale: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  contactPerson: PaperSpecFragment_client_contactPerson | null;
  companyName: string | null;
  companyNameLocal: string | null;
  isCompanyNameMatch: boolean | null;
  companyOwner: PaperSpecFragment_client_companyOwner | null;
  legalAddress: string | null;
  legalAddressPostcode: string | null;
  mailingAddress: string | null;
  mailingAddressPostcode: string | null;
  isMailingAddressMatch: boolean | null;
  deliveryAddress: string | null;
  deliveryAddressPostcode: string | null;
  isDeliveryAddressMatch: boolean | null;
  phone: PaperSpecFragment_client_phone | null;
  phoneOption: string | null;
  fax: PaperSpecFragment_client_fax | null;
  website: string | null;
  mobilePhone: PaperSpecFragment_client_mobilePhone | null;
  email: string | null;
  vat: string | null;
  iec: string | null;
  okpo: string | null;
  psrn: string | null;
  bic: string | null;
  swift: string | null;
  bankName: string | null;
  bankAddress: string | null;
  bankAccountNumber: string | null;
  correspondentBankName: string | null;
  correspondentAccountNumber: string | null;
  importerActive: boolean | null;
  importerCompanyName: string | null;
  importerContactPerson: PaperSpecFragment_client_importerContactPerson | null;
  importerMobilePhone: PaperSpecFragment_client_importerMobilePhone | null;
  importerPhone: PaperSpecFragment_client_importerPhone | null;
  importerEmail: string | null;
  note: string | null;
  person: PaperSpecFragment_client_person | null;
  isPersonMatch: boolean | null;
  birthdate: string | null;
  passportId: string | null;
  citizenship: string | null;
  issueDate: string | null;
  expireDate: string | null;
  issuedBy: string | null;
  avatar: string | null;
  contacts: (PaperSpecFragment_client_contacts | null)[] | null;
  tags: (string | null)[] | null;
  files: (PaperSpecFragment_client_files | null)[] | null;
  fullName: string | null;
  isRequiredFilled: boolean | null;
  isOptionalFilled: boolean | null;
}

export interface PaperSpecFragment_shipment_marine {
  billOfLadingNo: string | null;
  ship: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment_air {
  airWaybillNo: string | null;
  flight: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment_railway {
  internationalWaybillNo: string | null;
  train: string | null;
  containersCount: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment_car {
  internationalWaybillNo: string | null;
  vehicleNo: string | null;
  semitrailerNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment_mixed {
  internationalWaybillNo: string | null;
  ship: string | null;
  flight: string | null;
  train: string | null;
  vehicleNo: string | null;
  containersNo: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment_express {
  postalNo: string | null;
  deliveryService: string | null;
  numbersOfPkg: string | null;
  exportDate: string | null;
}

export interface PaperSpecFragment_shipment {
  id: string;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  activeType: ShipmentType | null;
  marine: PaperSpecFragment_shipment_marine | null;
  air: PaperSpecFragment_shipment_air | null;
  railway: PaperSpecFragment_shipment_railway | null;
  car: PaperSpecFragment_shipment_car | null;
  mixed: PaperSpecFragment_shipment_mixed | null;
  express: PaperSpecFragment_shipment_express | null;
}

export interface PaperSpecFragment_customs {
  id: string;
  countryOfOrigin: string | null;
  terms: string | null;
  cost: number | null;
  discount: number | null;
}

export interface PaperSpecFragment {
  id: string;
  specStatus: SpecStatus | null;
  specNo: string | null;
  shippingDate: string | null;
  estimateShippingDate: string | null;
  shipped: boolean | null;
  totalVolume: number | null;
  totalWeight: number | null;
  qtyOfPackages: number | null;
  finalCost: number | null;
  totalPrepay: number | null;
  totalClientDebt: number | null;
  total: number | null;
  currency: SpecCurrency | null;
  currencyRate: number | null;
  terms: string | null;
  sentFrom: string | null;
  sentThrough: string | null;
  sentDestination: string | null;
  comments: (PaperSpecFragment_comments | null)[] | null;
  containers: (PaperSpecFragment_containers | null)[] | null;
  readyToPrint: boolean | null;
  orgName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  requisite: PaperSpecFragment_requisite | null;
  client: PaperSpecFragment_client | null;
  shipment: PaperSpecFragment_shipment | null;
  customs: PaperSpecFragment_customs | null;
  subtotal: number | null;
  paid: number | null;
  depositDue: number | null;
  depositDueDate: string | null;
  balanceDue: number | null;
  amountInWords: string | null;
  amountInWordsClientLang: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaperSpecInvoicesFragment
// ====================================================

export interface PaperSpecInvoicesFragment_invoices_products_name_values {
  k: string;
  v: string | null;
  tr: string | null;
}

export interface PaperSpecInvoicesFragment_invoices_products_name {
  id: string;
  status: string | null;
  defaultLocale: string | null;
  values: PaperSpecInvoicesFragment_invoices_products_name_values[] | null;
}

export interface PaperSpecInvoicesFragment_invoices_products_comments {
  id: string;
  viewed: boolean | null;
  clientViewed: boolean | null;
  replyTo: string | null;
  comment: string | null;
  sender: string | null;
  senderName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaperSpecInvoicesFragment_invoices_products_images {
  url: string | null;
  filename: string | null;
  contentType: string | null;
}

export interface PaperSpecInvoicesFragment_invoices_products {
  id: string;
  productStatus: ProductStatus | null;
  name: PaperSpecInvoicesFragment_invoices_products_name | null;
  article: string | null;
  qty: number | null;
  unit: string | null;
  comments: (PaperSpecInvoicesFragment_invoices_products_comments | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  price: number | null;
  customPrice: number | null;
  amount: number | null;
  pkgQty: number | null;
  pkgNo: number | null;
  images: PaperSpecInvoicesFragment_invoices_products_images[] | null;
  description: string | null;
  url: string | null;
  costPrice: number | null;
  costAmount: number | null;
}

export interface PaperSpecInvoicesFragment_invoices {
  id: string;
  invoiceStatus: InvoiceStatus | null;
  profitForAll: boolean | null;
  invoiceNo: string | null;
  shippingDate: string | null;
  discount: number | null;
  prepayment: number | null;
  prepaymentDate: string | null;
  clientDebt: number | null;
  clientDebtDate: string | null;
  totalClientAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  discountInCurrency: number | null;
  products: (PaperSpecInvoicesFragment_invoices_products | null)[] | null;
}

export interface PaperSpecInvoicesFragment {
  id: string;
  invoices: (PaperSpecInvoicesFragment_invoices | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BranchType {
  OFFICE = "OFFICE",
  PRODUCTION = "PRODUCTION",
  SHOP = "SHOP",
  WAREHOUSE = "WAREHOUSE",
}

export enum ClientType {
  LEGAL = "LEGAL",
  OTHER = "OTHER",
  PRIVATE = "PRIVATE",
}

export enum ContactType {
  EMAIL = "EMAIL",
  KAKAO_TALK = "KAKAO_TALK",
  MESSENGER = "MESSENGER",
  QQ = "QQ",
  SKYPE = "SKYPE",
  TELEGRAM = "TELEGRAM",
  VIBER = "VIBER",
  WE_CHAT = "WE_CHAT",
  WHATSAPP = "WHATSAPP",
}

export enum ContainerMode {
  _DC = "_DC",
  _HC = "_HC",
}

export enum ContainerSize {
  _20 = "_20",
  _40 = "_40",
  _45 = "_45",
}

export enum InvitationRole {
  ACCOUNTANT = "ACCOUNTANT",
  FREELANCER = "FREELANCER",
  MANAGER = "MANAGER",
  WAREHOUSEMAN = "WAREHOUSEMAN",
}

export enum InvitationStatus {
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  DECLINED = "DECLINED",
  PENDING = "PENDING",
}

export enum InvoiceProfitType {
  COMMISSION = "COMMISSION",
  MARGIN = "MARGIN",
}

export enum InvoiceStatus {
  IN_DRAFT = "IN_DRAFT",
  IN_PROCESSING = "IN_PROCESSING",
  IN_PRODUCTION = "IN_PRODUCTION",
  IN_STOCK = "IN_STOCK",
}

export enum Operation {
  DELETE_CLIENT = "DELETE_CLIENT",
  DELETE_INVOICE = "DELETE_INVOICE",
  DELETE_PRODUCT = "DELETE_PRODUCT",
  DELETE_SPEC = "DELETE_SPEC",
  INSERT_CLIENT = "INSERT_CLIENT",
  INSERT_INVOICE = "INSERT_INVOICE",
  INSERT_PRODUCT = "INSERT_PRODUCT",
  INSERT_SPEC = "INSERT_SPEC",
  SET_REQUISITES = "SET_REQUISITES",
  UPDATE_CLIENT = "UPDATE_CLIENT",
  UPDATE_INVOICE = "UPDATE_INVOICE",
  UPDATE_INVOICE_WITH_PRODUCTS = "UPDATE_INVOICE_WITH_PRODUCTS",
  UPDATE_PRODUCT = "UPDATE_PRODUCT",
  UPDATE_REQUISITES = "UPDATE_REQUISITES",
  UPDATE_SPEC = "UPDATE_SPEC",
  UPDATE_SPEC_WITH_INVOICES = "UPDATE_SPEC_WITH_INVOICES",
}

export enum ProductStatus {
  IN_DRAFT = "IN_DRAFT",
  IN_PROCESSING = "IN_PROCESSING",
  IN_PRODUCTION = "IN_PRODUCTION",
  IN_STOCK = "IN_STOCK",
}

export enum RoleInProject {
  ACCOUNTANT = "ACCOUNTANT",
  FREELANCER = "FREELANCER",
  MANAGER = "MANAGER",
  OWNER = "OWNER",
  WAREHOUSEMAN = "WAREHOUSEMAN",
}

export enum ShipmentType {
  AIR = "AIR",
  CAR = "CAR",
  EXPRESS = "EXPRESS",
  MARINE = "MARINE",
  MIXED = "MIXED",
  RAILWAY = "RAILWAY",
  UNDEFINED = "UNDEFINED",
}

export enum SpecCurrency {
  CNY = "CNY",
  EUR = "EUR",
  RUB = "RUB",
  UAH = "UAH",
  USD = "USD",
}

export enum SpecStatus {
  IN_DRAFT = "IN_DRAFT",
  IN_PROCESSING = "IN_PROCESSING",
  IN_PRODUCTION = "IN_PRODUCTION",
  IN_STOCK = "IN_STOCK",
}

export interface AttachFileInput {
  url?: string | null;
  filename?: string | null;
  contentType?: string | null;
}

export interface BankDetailInput {
  bic?: string | null;
  swift?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankAccountNumber?: string | null;
  correspondentBankName?: string | null;
  correspondentAccountNumber?: string | null;
}

export interface ContactInput {
  contactType?: ContactType | null;
  contact?: string | null;
}

export interface ContractItemInput {
  id?: string | null;
  title?: string | null;
  paragraphs?: string[] | null;
}

export interface CreateClientInput {
  clientType: ClientType;
  locale?: string | null;
  contactPerson?: PersonInput | null;
  companyName?: string | null;
  companyNameLocal?: string | null;
  isCompanyNameMatch?: boolean | null;
  companyOwner?: PersonInput | null;
  legalAddress?: string | null;
  legalAddressPostcode?: string | null;
  mailingAddress?: string | null;
  mailingAddressPostcode?: string | null;
  isMailingAddressMatch?: boolean | null;
  deliveryAddress?: string | null;
  deliveryAddressPostcode?: string | null;
  isDeliveryAddressMatch?: boolean | null;
  phone?: PhoneInput | null;
  phoneOption?: string | null;
  fax?: PhoneInput | null;
  website?: string | null;
  mobilePhone?: PhoneInput | null;
  email?: string | null;
  vat?: string | null;
  iec?: string | null;
  okpo?: string | null;
  psrn?: string | null;
  bic?: string | null;
  swift?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankAccountNumber?: string | null;
  correspondentBankName?: string | null;
  correspondentAccountNumber?: string | null;
  importerActive?: boolean | null;
  importerCompanyName?: string | null;
  importerContactPerson?: PersonInput | null;
  importerMobilePhone?: PhoneInput | null;
  importerPhone?: PhoneInput | null;
  importerEmail?: string | null;
  note?: string | null;
  person?: PersonInput | null;
  isPersonMatch?: boolean | null;
  birthdate?: string | null;
  passportId?: string | null;
  citizenship?: string | null;
  issueDate?: string | null;
  expireDate?: string | null;
  issuedBy?: string | null;
  avatar?: string | null;
  contacts?: (ContactInput | null)[] | null;
  tags?: (string | null)[] | null;
  files?: (AttachFileInput | null)[] | null;
}

export interface CreateContractInput {
  name?: string | null;
  title?: string | null;
  country?: string | null;
  docHeader?: string | null;
  useDefaultDocHeader?: boolean | null;
  requisiteId?: string | null;
  items?: ContractItemInput[] | null;
  specItems?: ContractItemInput[] | null;
}

export interface CreateInvoiceInput {
  invoiceNo?: string | null;
  purchaseDate?: string | null;
  shippingDate?: string | null;
  supplier?: string | null;
}

export interface CreateSupplierInput {
  locale?: string | null;
  companyType?: string | null;
  contactPerson?: PersonInput | null;
  companyName?: string | null;
  companyNameLocal?: string | null;
  isCompanyNameMatch?: boolean | null;
  companyOwner?: PersonInput | null;
  legalAddress?: string | null;
  legalAddressPostcode?: string | null;
  mailingAddress?: string | null;
  mailingAddressPostcode?: string | null;
  isMailingAddressMatch?: boolean | null;
  phone?: PhoneInput | null;
  phoneOption?: string | null;
  fax?: PhoneInput | null;
  website?: string | null;
  mobilePhone?: PhoneInput | null;
  email?: string | null;
  vat?: string | null;
  iec?: string | null;
  okpo?: string | null;
  psrn?: string | null;
  bic?: string | null;
  swift?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankAccountNumber?: string | null;
  correspondentBankName?: string | null;
  correspondentAccountNumber?: string | null;
  note?: string | null;
  contacts?: (ContactInput | null)[] | null;
  tags?: (string | null)[] | null;
  files?: (AttachFileInput | null)[] | null;
  branches?: SupplierBranchInput[] | null;
}

export interface CreateWordInput {
  defaultLocale?: string | null;
  values?: WordTranslationInput[] | null;
}

export interface CustomsInput {
  countryOfOrigin?: string | null;
  terms?: string | null;
  cost?: number | null;
  discount?: number | null;
}

export interface PersonInput {
  isName?: boolean | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
}

export interface PhoneInput {
  countryCode?: string | null;
  phone?: string | null;
}

export interface ProductCostInput {
  clientPrice?: number | null;
  purchasePrice?: number | null;
}

export interface ProductInfoInput {
  images?: AttachFileInput[] | null;
  description?: string | null;
}

export interface ProductInput {
  name?: string | null;
  article?: string | null;
  qty?: number | null;
  unit?: string | null;
}

export interface ProductLinkInput {
  url?: string | null;
}

export interface ProductStoreInput {
  net?: number | null;
  gross?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
  atWhouse?: boolean | null;
  pkgQty?: number | null;
  pkgNo?: number | null;
}

export interface RequisiteInput {
  companyName?: string | null;
  companyNameLocal?: string | null;
  isCompanyNameMatch?: boolean | null;
  companyOwner?: PersonInput | null;
  legalAddress?: string | null;
  legalAddressPostcode?: string | null;
  mailingAddress?: string | null;
  mailingAddressPostcode?: string | null;
  isMailingAddressMatch?: boolean | null;
  deliveryAddress?: string | null;
  deliveryAddressPostcode?: string | null;
  isDeliveryAddressMatch?: boolean | null;
  phone?: PhoneInput | null;
  phoneOption?: string | null;
  fax?: PhoneInput | null;
  website?: string | null;
  mobilePhone?: PhoneInput | null;
  email?: string | null;
  vat?: string | null;
  iec?: string | null;
  okpo?: string | null;
  psrn?: string | null;
  defaultBankDetail?: string | null;
  bankDetails?: BankDetailInput[] | null;
  importerCompanyName?: string | null;
  importerContactPerson?: PersonInput | null;
  importerMobilePhone?: PhoneInput | null;
  importerPhone?: PhoneInput | null;
  importerEmail?: string | null;
  contacts?: (ContactInput | null)[] | null;
  tags?: (string | null)[] | null;
}

export interface ShipmentAirInput {
  airWaybillNo?: string | null;
  flight?: string | null;
  numbersOfPkg?: string | null;
  exportDate?: string | null;
}

export interface ShipmentCarInput {
  internationalWaybillNo?: string | null;
  vehicleNo?: string | null;
  semitrailerNo?: string | null;
  exportDate?: string | null;
}

export interface ShipmentExpressInput {
  postalNo?: string | null;
  deliveryService?: string | null;
  numbersOfPkg?: string | null;
  exportDate?: string | null;
}

export interface ShipmentInput {
  sentFrom?: string | null;
  sentThrough?: string | null;
  sentDestination?: string | null;
  activeType?: ShipmentType | null;
  marine?: ShipmentMarineInput | null;
  air?: ShipmentAirInput | null;
  railway?: ShipmentRailwayInput | null;
  car?: ShipmentCarInput | null;
  mixed?: ShipmentMixedInput | null;
  express?: ShipmentExpressInput | null;
}

export interface ShipmentMarineInput {
  billOfLadingNo?: string | null;
  ship?: string | null;
  containersCount?: string | null;
  containersNo?: string | null;
  exportDate?: string | null;
}

export interface ShipmentMixedInput {
  internationalWaybillNo?: string | null;
  ship?: string | null;
  flight?: string | null;
  train?: string | null;
  vehicleNo?: string | null;
  containersNo?: string | null;
  exportDate?: string | null;
}

export interface ShipmentRailwayInput {
  internationalWaybillNo?: string | null;
  train?: string | null;
  containersCount?: string | null;
  containersNo?: string | null;
  exportDate?: string | null;
}

export interface SpecInput {
  requisite?: string | null;
  estimateShippingDate?: string | null;
  shipped?: boolean | null;
  currency?: SpecCurrency | null;
  currencyRate?: number | null;
  shipment?: ShipmentInput | null;
  customs?: CustomsInput | null;
  amountInWords?: string | null;
  amountInWordsClientLang?: string | null;
}

export interface SupplierBranchInput {
  branchType?: BranchType | null;
  name?: string | null;
  address?: string | null;
  contactPerson?: PersonInput | null;
  workPhone?: PhoneInput | null;
  mobilePhone?: PhoneInput | null;
  contacts?: (ContactInput | null)[] | null;
}

export interface UpdateClientInput {
  locale?: string | null;
  contactPerson?: PersonInput | null;
  companyName?: string | null;
  companyNameLocal?: string | null;
  isCompanyNameMatch?: boolean | null;
  companyOwner?: PersonInput | null;
  legalAddress?: string | null;
  legalAddressPostcode?: string | null;
  mailingAddress?: string | null;
  mailingAddressPostcode?: string | null;
  isMailingAddressMatch?: boolean | null;
  deliveryAddress?: string | null;
  deliveryAddressPostcode?: string | null;
  isDeliveryAddressMatch?: boolean | null;
  phone?: PhoneInput | null;
  phoneOption?: string | null;
  fax?: PhoneInput | null;
  website?: string | null;
  mobilePhone?: PhoneInput | null;
  email?: string | null;
  vat?: string | null;
  iec?: string | null;
  okpo?: string | null;
  psrn?: string | null;
  bic?: string | null;
  swift?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankAccountNumber?: string | null;
  correspondentBankName?: string | null;
  correspondentAccountNumber?: string | null;
  importerActive?: boolean | null;
  importerCompanyName?: string | null;
  importerContactPerson?: PersonInput | null;
  importerMobilePhone?: PhoneInput | null;
  importerPhone?: PhoneInput | null;
  importerEmail?: string | null;
  note?: string | null;
  person?: PersonInput | null;
  isPersonMatch?: boolean | null;
  birthdate?: string | null;
  passportId?: string | null;
  citizenship?: string | null;
  issueDate?: string | null;
  expireDate?: string | null;
  issuedBy?: string | null;
  avatar?: string | null;
  contacts?: (ContactInput | null)[] | null;
  tags?: (string | null)[] | null;
  files?: (AttachFileInput | null)[] | null;
}

export interface UpdateContractInput {
  id: string;
  name?: string | null;
  title?: string | null;
  country?: string | null;
  docHeader?: string | null;
  useDefaultDocHeader?: boolean | null;
  requisiteId?: string | null;
  items?: ContractItemInput[] | null;
  specItems?: ContractItemInput[] | null;
}

export interface UpdateInvoiceInput {
  invoiceNo?: string | null;
  purchaseDate?: string | null;
  shippingDate?: string | null;
  profitType?: InvoiceProfitType | null;
  profitPercent?: number | null;
  profitForAll?: boolean | null;
  discount?: number | null;
  prepayment?: number | null;
  prepaymentDate?: string | null;
  obtainCost?: number | null;
  obtainCostDate?: string | null;
  clientDebt?: number | null;
  clientDebtDate?: string | null;
}

export interface UpdateSupplierInput {
  locale?: string | null;
  companyType?: string | null;
  contactPerson?: PersonInput | null;
  companyName?: string | null;
  companyNameLocal?: string | null;
  isCompanyNameMatch?: boolean | null;
  companyOwner?: PersonInput | null;
  legalAddress?: string | null;
  legalAddressPostcode?: string | null;
  mailingAddress?: string | null;
  mailingAddressPostcode?: string | null;
  isMailingAddressMatch?: boolean | null;
  phone?: PhoneInput | null;
  phoneOption?: string | null;
  fax?: PhoneInput | null;
  website?: string | null;
  mobilePhone?: PhoneInput | null;
  email?: string | null;
  vat?: string | null;
  iec?: string | null;
  okpo?: string | null;
  psrn?: string | null;
  bic?: string | null;
  swift?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankAccountNumber?: string | null;
  correspondentBankName?: string | null;
  correspondentAccountNumber?: string | null;
  note?: string | null;
  contacts?: (ContactInput | null)[] | null;
  tags?: (string | null)[] | null;
  files?: (AttachFileInput | null)[] | null;
  branches?: SupplierBranchInput[] | null;
}

export interface UpdateWordInput {
  id: string;
  values?: WordTranslationInput[] | null;
}

export interface UserInvitationInput {
  invitationEmail: string;
  invitationGivenName?: string | null;
  invitationFamilyName?: string | null;
  invitationRole: InvitationRole;
  invitationLocale?: string | null;
}

export interface WordTranslationInput {
  k: string;
  v?: string | null;
  tr?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
