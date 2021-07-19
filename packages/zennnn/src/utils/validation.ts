import phonesMask from '@/assets/countries/phones-unformatted.json'
import { ShipmentType } from '@/graphql/types'

import type {
  ClientFragment,
  SupplierFragment,
  OrgRequisiteFragment,
  PersonFragment,
  PhoneFragment,
  BankDetailFragment,
  ShipmentFragment,
  CustomsFragment,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

enum VALIDATION_TYPE {
  PERSON = 1,
  PHONE = 2,
  EMAIL = 3,
  LOCALE = 4,
  REQUIRE = 5,
}

const LEGAL_CLIENT_VALIDATION_FIELDS = {
  REQUIRED: [
    {
      path: 'contactPerson',
      type: VALIDATION_TYPE.PERSON,
    },
    {
      path: 'mobilePhone',
      type: VALIDATION_TYPE.PHONE,
    },
    {
      path: 'email',
      type: VALIDATION_TYPE.EMAIL,
    },
    {
      path: 'locale',
      type: VALIDATION_TYPE.LOCALE,
    },
    {
      path: 'companyName',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'companyNameLocal',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
  OPTIONAL: [
    {
      path: 'legalAddress',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'legalAddressPostcode',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'phone',
      type: VALIDATION_TYPE.PHONE,
    },
    {
      path: 'deliveryAddress',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'deliveryAddressPostcode',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'importerContactPerson',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'importerMobilePhone',
      type: VALIDATION_TYPE.PHONE,
    },
  ],
} as {
  REQUIRED: {
    path: keyof ClientFragment
    type: VALIDATION_TYPE
  }[]
  OPTIONAL: {
    path: keyof ClientFragment
    type: VALIDATION_TYPE
  }[]
}

const PRIVATE_CLIENT_VALIDATION_FIELDS = {
  REQUIRED: [
    {
      path: 'contactPerson',
      type: VALIDATION_TYPE.PERSON,
    },
    {
      path: 'mobilePhone',
      type: VALIDATION_TYPE.PHONE,
    },
    {
      path: 'email',
      type: VALIDATION_TYPE.EMAIL,
    },
    {
      path: 'locale',
      type: VALIDATION_TYPE.LOCALE,
    },
    {
      path: 'person',
      type: VALIDATION_TYPE.PERSON,
    },
  ],
  OPTIONAL: [
    {
      path: 'birthdate',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
} as {
  REQUIRED: {
    path: keyof ClientFragment
    type: VALIDATION_TYPE
  }[]
  OPTIONAL: {
    path: keyof ClientFragment
    type: VALIDATION_TYPE
  }[]
}

const SUPPLIER_VALIDATION_FIELDS = {
  REQUIRED: [
    {
      path: 'contactPerson',
      type: VALIDATION_TYPE.PERSON,
    },
    {
      path: 'mobilePhone',
      type: VALIDATION_TYPE.PHONE,
    },
    {
      path: 'email',
      type: VALIDATION_TYPE.EMAIL,
    },
    {
      path: 'locale',
      type: VALIDATION_TYPE.LOCALE,
    },
    {
      path: 'companyName',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'companyNameLocal',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
  OPTIONAL: [
    {
      path: 'legalAddress',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'legalAddressPostcode',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'phone',
      type: VALIDATION_TYPE.PHONE,
    },
  ],
} as {
  REQUIRED: {
    path: keyof SupplierFragment
    type: VALIDATION_TYPE
  }[]
  OPTIONAL: {
    path: keyof SupplierFragment
    type: VALIDATION_TYPE
  }[]
}

const COMPANY_DETAIL_VALIDATION_FIELDS = {
  REQUIRED: [
    {
      path: 'companyName',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'companyNameLocal',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'phone',
      type: VALIDATION_TYPE.PHONE,
    },
    {
      path: 'legalAddress',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'companyOwner',
      type: VALIDATION_TYPE.PERSON,
    },
  ],
  OPTIONAL: [
    {
      path: 'email',
      type: VALIDATION_TYPE.EMAIL,
    },
    {
      path: 'vat',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'legalAddressPostcode',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
} as {
  REQUIRED: {
    path: keyof OrgRequisiteFragment
    type: VALIDATION_TYPE
  }[]
  OPTIONAL: {
    path: keyof OrgRequisiteFragment
    type: VALIDATION_TYPE
  }[]
}

const COMPANY_BANK_DETAIL_VALIDATION_FIELDS = {
  REQUIRED: [
    {
      path: 'bankName',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'bankAccountNumber',
      type: VALIDATION_TYPE.REQUIRE,
    },
    {
      path: 'swift',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
  OPTIONAL: [
    {
      path: 'bankAddress',
      type: VALIDATION_TYPE.REQUIRE,
    },
  ],
} as {
  REQUIRED: {
    path: keyof BankDetailFragment
    type: VALIDATION_TYPE
  }[]
  OPTIONAL: {
    path: keyof BankDetailFragment
    type: VALIDATION_TYPE
  }[]
}

const validatePerson = (val: PersonFragment) => {
  const person = val || {}
  let result = false
  if (person.isName) {
    result = !!person.name
  } else {
    result = !!(person.firstName && person.lastName)
  }
  return result
}

const validatePhone = (val: PhoneFragment) => {
  const countryCode = val && val.countryCode
  if (!countryCode) return false
  const mask = phonesMask[countryCode]
  if (!mask) return false
  let phone = (val && val.phone) || ''
  phone = `+${phone.replace(/\D/g, '')}`
  return phone.length === mask.length
}

const validateEmail = (val: EmptyString) => {
  return val && /.+@.+\..+/.test(val)
}

const validateRequire = (val: any) => !!val

const validateValue = (type: VALIDATION_TYPE, value: any) => {
  switch (type) {
    case VALIDATION_TYPE.PERSON:
      return validatePerson(value)
    case VALIDATION_TYPE.PHONE:
      return validatePhone(value)
    case VALIDATION_TYPE.EMAIL:
      return validateEmail(value)
    case VALIDATION_TYPE.LOCALE:
    case VALIDATION_TYPE.REQUIRE:
      return validateRequire(value)
    default:
      return false
  }
}

export const validateLegalClient = (doc: ClientFragment) => {
  const isRequiredFilled = LEGAL_CLIENT_VALIDATION_FIELDS.REQUIRED.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  const isOptionalFilled = LEGAL_CLIENT_VALIDATION_FIELDS.OPTIONAL.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validatePrivateClient = (doc: ClientFragment) => {
  const isRequiredFilled = PRIVATE_CLIENT_VALIDATION_FIELDS.REQUIRED.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  const isOptionalFilled = PRIVATE_CLIENT_VALIDATION_FIELDS.OPTIONAL.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validateSupplier = (doc: SupplierFragment) => {
  const isRequiredFilled = SUPPLIER_VALIDATION_FIELDS.REQUIRED.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  const isOptionalFilled = SUPPLIER_VALIDATION_FIELDS.OPTIONAL.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validateCompanyDetail = (doc: OrgRequisiteFragment) => {
  const bankDetails = doc.bankDetails
  let isRequiredFilled = COMPANY_DETAIL_VALIDATION_FIELDS.REQUIRED.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  let isOptionalFilled = COMPANY_DETAIL_VALIDATION_FIELDS.OPTIONAL.every(
    (field) => {
      const value = doc[field.path]
      return validateValue(field.type, value)
    }
  )
  if (bankDetails && bankDetails.length > 0) {
    if (isRequiredFilled) {
      isRequiredFilled = bankDetails.every((item) => {
        return COMPANY_BANK_DETAIL_VALIDATION_FIELDS.REQUIRED.every((field) => {
          const value = item[field.path]
          return validateValue(field.type, value)
        })
      })
    }
    if (isOptionalFilled && bankDetails) {
      isOptionalFilled = bankDetails.every((item) => {
        return COMPANY_BANK_DETAIL_VALIDATION_FIELDS.OPTIONAL.every((field) => {
          const value = item[field.path]
          return validateValue(field.type, value)
        })
      })
    }
  }
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validateInvoicePrint = (
  company: OrgRequisiteFragment,
  client: ClientFragment,
  shipment: ShipmentFragment,
  customs: CustomsFragment,
  amountInWords: EmptyString,
  amountInWordsClientLang: EmptyString
) => {
  const requireValidations = []
  const optionalValidations = []
  // COMPANY
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, company.companyName)
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, company.legalAddress)
  )
  requireValidations.push(validateValue(VALIDATION_TYPE.PHONE, company.phone))
  requireValidations.push(validateValue(VALIDATION_TYPE.EMAIL, company.email))
  // bank details
  const bankDetail = (company.bankDetails || []).find(
    (el) => el.id === company.defaultBankDetail
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, bankDetail?.bankName)
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, bankDetail?.bankAddress)
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, bankDetail?.bankAccountNumber)
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, bankDetail?.swift)
  )

  optionalValidations.push(validateValue(VALIDATION_TYPE.REQUIRE, company.vat))

  // CLIENT
  requireValidations.push(client.fullName)
  requireValidations.push(
    validateValue(VALIDATION_TYPE.REQUIRE, client.legalAddress)
  )
  requireValidations.push(
    validateValue(VALIDATION_TYPE.PERSON, client.contactPerson)
  )
  requireValidations.push(validateValue(VALIDATION_TYPE.PHONE, client.phone))
  requireValidations.push(validateValue(VALIDATION_TYPE.EMAIL, client.email))

  if (client.importerActive) {
    requireValidations.push(
      validateValue(VALIDATION_TYPE.REQUIRE, client.importerCompanyName)
    )
    requireValidations.push(
      validateValue(VALIDATION_TYPE.REQUIRE, client.deliveryAddress)
    )
    requireValidations.push(
      validateValue(VALIDATION_TYPE.PERSON, client.importerContactPerson)
    )
    requireValidations.push(
      validateValue(VALIDATION_TYPE.PHONE, client.importerPhone)
    )
    requireValidations.push(
      validateValue(VALIDATION_TYPE.EMAIL, client.importerEmail)
    )
  }

  // SPEC
  const shipmentType = shipment.activeType

  requireValidations.push(shipment.sentFrom)
  optionalValidations.push(shipment.sentThrough)
  requireValidations.push(shipment.sentDestination)
  requireValidations.push(shipment.activeType)
  requireValidations.push(customs.countryOfOrigin)

  if (shipmentType !== ShipmentType.UNDEFINED) {
    if (shipmentType === ShipmentType.MARINE) {
      const marine = shipment.marine
      requireValidations.push(customs.terms)
      requireValidations.push(marine?.billOfLadingNo)
      requireValidations.push(marine?.containersCount)
      optionalValidations.push(marine?.ship)
      optionalValidations.push(marine?.containersNo)
      optionalValidations.push(marine?.exportDate)
    } else if (shipmentType === ShipmentType.AIR) {
      const air = shipment.air
      requireValidations.push(air?.airWaybillNo)
      requireValidations.push(air?.numbersOfPkg)
      optionalValidations.push(air?.flight)
    } else if (shipmentType === ShipmentType.RAILWAY) {
      const railway = shipment.railway
      requireValidations.push(customs.terms)
      requireValidations.push(railway?.internationalWaybillNo)
      requireValidations.push(railway?.containersCount)
      optionalValidations.push(railway?.train)
      optionalValidations.push(railway?.containersNo)
      optionalValidations.push(railway?.exportDate)
    } else if (shipmentType === ShipmentType.CAR) {
      const car = shipment.car
      requireValidations.push(customs.terms)
      requireValidations.push(car?.internationalWaybillNo)
      optionalValidations.push(car?.vehicleNo)
      optionalValidations.push(car?.semitrailerNo)
      optionalValidations.push(car?.exportDate)
    } else if (shipmentType === ShipmentType.MIXED) {
      const mixed = shipment.mixed
      requireValidations.push(customs.terms)
      requireValidations.push(mixed?.internationalWaybillNo)
      optionalValidations.push(mixed?.ship)
      optionalValidations.push(mixed?.flight)
      optionalValidations.push(mixed?.train)
      optionalValidations.push(mixed?.vehicleNo)
      optionalValidations.push(mixed?.containersNo)
      optionalValidations.push(mixed?.exportDate)
    } else if (shipmentType === ShipmentType.EXPRESS) {
      const express = shipment.express
      requireValidations.push(express?.postalNo)
      requireValidations.push(express?.numbersOfPkg)
      optionalValidations.push(express?.deliveryService)
    }
  }
  optionalValidations.push(amountInWords)
  optionalValidations.push(amountInWordsClientLang)

  const isRequiredFilled = requireValidations.every((el) => el)
  const isOptionalFilled = optionalValidations.every((el) => el)

  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}
