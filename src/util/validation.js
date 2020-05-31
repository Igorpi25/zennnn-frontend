import phonesMask from '../config/countries-phones-unformatted.json'

const VALIDATION_TYPE = {
  PERSON: 1,
  PHONE: 2,
  EMAIL: 3,
  LOCALE: 4,
  REQUIRE: 5,
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
}

const validatePerson = (val) => {
  const person = val || {}
  let result = false
  if (person.isName) {
    result = !!person.name
  } else {
    result = !!(person.firstName && person.lastName)
  }
  return result
}

const validatePhone = (val) => {
  const countryCode = val && val.countryCode
  if (!countryCode) return false
  const mask = phonesMask[countryCode]
  if (!mask) return false
  let phone = (val && val.phone) || ''
  phone = `+${phone.replace(/\D/g, '')}`
  return phone.length === mask.length
}

const validateEmail = (val) => {
  return val && /.+@.+\..+/.test(val)
}

const validateRequire = (val) => !!val

const validateValue = (type, value) => {
  switch (type) {
    case VALIDATION_TYPE.PERSON: return validatePerson(value)
    case VALIDATION_TYPE.PHONE: return validatePhone(value)
    case VALIDATION_TYPE.EMAIL: return validateEmail(value)
    case VALIDATION_TYPE.LOCALE:
    case VALIDATION_TYPE.REQUIRE: return validateRequire(value)
    default: return false
  }
}

export const validateLegalClient = (doc) => {
  const isRequiredFilled = LEGAL_CLIENT_VALIDATION_FIELDS.REQUIRED.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  const isOptionalFilled = LEGAL_CLIENT_VALIDATION_FIELDS.OPTIONAL.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validatePrivateClient = (doc) => {
  const isRequiredFilled = PRIVATE_CLIENT_VALIDATION_FIELDS.REQUIRED.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  const isOptionalFilled = PRIVATE_CLIENT_VALIDATION_FIELDS.OPTIONAL.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validateSupplier = (doc) => {
  const isRequiredFilled = SUPPLIER_VALIDATION_FIELDS.REQUIRED.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  const isOptionalFilled = SUPPLIER_VALIDATION_FIELDS.OPTIONAL.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  return {
    isRequiredFilled,
    isOptionalFilled,
  }
}

export const validateCompanyDetail = (doc) => {
  const bankDetails = doc.bankDetails || []
  let isRequiredFilled = COMPANY_DETAIL_VALIDATION_FIELDS.REQUIRED.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  let isOptionalFilled = COMPANY_DETAIL_VALIDATION_FIELDS.OPTIONAL.every(field => {
    const value = doc[field.path]
    return validateValue(field.type, value)
  })
  if (bankDetails.length > 0) {
    if (isRequiredFilled) {
      isRequiredFilled = bankDetails.every(item => {
        return COMPANY_BANK_DETAIL_VALIDATION_FIELDS.REQUIRED.every(field => {
          const value = item[field.path]
          return validateValue(field.type, value)
        })
      })
    }
    if (isOptionalFilled) {
      isOptionalFilled = bankDetails.every(item => {
        return COMPANY_BANK_DETAIL_VALIDATION_FIELDS.OPTIONAL.every(field => {
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
