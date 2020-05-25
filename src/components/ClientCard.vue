<template>
  <div>

    <v-dialog
      v-model="saveBeforeCloseDialog"
      max-width="463"
    >
      <SaveBeforeCloseModal
        :text="$t('label.saveChangesBeforeClose')"
        :postScriptum="$t('label.saveChangesHint')"
        @dontSave="$emit('confirm', 1)"
        @cancel="$emit('confirm', 0)"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div
      id="container"
      :class="['pt-8 pb-12', isComponent ? 'bg-gray-900 relative px-4 sm:px-5' : 'container container--sm']"
    >
      <span
        v-if="isComponent"
        class="absolute top-0 right-0 z-10 pt-3 pr-3"
      >
        <i
          class="zi-close text-2xl text-gray-100 hover:text-white cursor-pointer"
          @click="$emit('close')"
        />
      </span>
      <h1 class="text-2xl text-white font-semibold leading-tight mb-5">
        {{ create ? $t('client.createTitle') : $t('client.editTitle') }}
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="clientType === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t bg-gray-600',
              'select-none whitespace-no-wrap cursor-pointer',
              'transition-colors duration-100 ease-out px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
              clientType === tab.value ? 'text-white' : 'bg-opacity-30 text-gray-200',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchClientType(tab.value)"
            @keydown.enter.exact="switchClientType(tab.value)"
          >
            {{ tab.text }}
          </div>
        </div>
        <div
          v-if="clientType === ClientType.LEGAL || clientType === ClientType.OTHER"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Legal info -->
          <LegalInfo :uid="uid" :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ShippingInfo -->
              <ShippingInfo :item="client" @update="updateValue" />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ExtraInfo -->
              <ExtraInfo :item="client" @update="updateValue" />
            </div>
          </div>
        </div>
        <div
          v-else-if="clientType === ClientType.PRIVATE"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Private info -->
          <PrivateInfo :uid="uid" :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <PrivateDetail :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ShippingInfo -->
              <ShippingInfo :item="client" is-private @update="updateValue" />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ShippingInfo -->
              <ExtraInfo :item="client" is-private @update="updateValue" />
            </div>
          </div>
        </div>
      </div>
      <Button
        :loading="updateLoading"
        outlined
        merge-class="w-40"
        @click="update()"
      >
        {{ $t('client.save') }}
      </Button>
    </div>

  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { ClientType } from '../graphql/enums'
import { GET_CLIENT, GET_CLIENT_GROUP, GET_ORG_NEXT_CLIENT_UID } from '../graphql/queries'
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
} from '../graphql/mutations'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import LegalDetail from './CompanyDetail/LegalDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ShippingInfo from './CompanyDetail/ShippingInfo.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import PrivateInfo from './CompanyDetail/PrivateInfo.vue'
import PrivateDetail from './CompanyDetail/PrivateDetail.vue'
import SaveBeforeCloseModal from './SaveBeforeCloseModal.vue'

export default {
  name: 'ClientCard',
  components: {
    LegalInfo,
    LegalDetail,
    ContactList,
    ShippingInfo,
    ExtraInfo,
    PrivateInfo,
    PrivateDetail,
    SaveBeforeCloseModal,
  },
  props: {
    orgId: {
      type: String,
      required: true,
    },
    create: {
      type: Boolean,
      default: false,
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
  },
  apollo: {
    getOrgNextClientUid: {
      query: GET_ORG_NEXT_CLIENT_UID,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      skip () {
        return !this.create
      },
      fetchPolicy: 'network-only',
    },
    getClient: {
      query: GET_CLIENT,
      variables () {
        return {
          id: this.$route.params.clientId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        this.setData(data.getClient)
      },
      skip () {
        return this.create
      },
      fetchPolicy: 'cache-and-network',
    },
    getClientGroup: {
      query: GET_CLIENT_GROUP,
      variables () {
        return {
          orgId: this.$route.params.orgId,
          groupId: this.$route.params.groupId,
        }
      },
      skip () {
        return !this.$route.params.groupId
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      ClientType,
      activeClientType: null,
      languageInputError: {},
      wasValidate: false,
      saveBeforeCloseDialog: false,
      templateChanged: false,
      createTemplateLoading: false,
      deleteTemplateLoading: null,
      loading: false,
      updateLoading: false,
      isExpanded: false,
      expanded: [],
      legalFieldsSettings: {
        customUid: {
          disabled: true,
          defaultValueKey: 'uid',
          label: 'uid',
          placeholder: 'uid',
        },
        companyName: {
          ref: 'legalCompanyNameInput',
          rules: [v => !!v || this.$t('rule.required')],
          rows: 2,
        },
        legalAddress: {
          rows: 2,
        },
        legalAddressPostcode: {
          placeholder: 'postcode',
        },
        mailingAddress: {
          rows: 2,
        },
        mailingAddressPostcode: {
          placeholder: 'postcode',
        },
        phone: {},
        fax: {},
        email: {},
        itn: {},
        iec: {},
        psrn: {
          section: true,
        },
        bankName: {},
        bankAddress: {},
        bankAccountNumber: {
          placeholder: 'bankAccountNumberAbr',
        },
        correspondentAccountNumber: {
          placeholder: 'correspondentAccountNumberAbr',
        },
        bic: {},
        okpo: {},
        swift: {},
        ownerFullName: {},
        ownerJobPosition: {},
        contactPerson: {},
        consignee: {
          section: true,
          subtitle: 'shippingInfo',
        },
        shippingAddress: {
          label: 'deliveryAddress',
          placeholder: 'deliveryAddress',
          rows: 2,
        },
        importerContactPerson: {
          label: 'contactPerson',
          placeholder: 'contactPerson',
        },
        contactMobilePhone: {
          label: 'mobilePhone',
          placeholder: 'mobilePhone',
        },
        importerFax: {
          label: 'fax',
          placeholder: 'fax',
        },
        importerEmail: {
          label: 'email',
          placeholder: 'email',
        },
        legalTypeNote: {
          label: 'note',
          placeholder: 'note',
          section: true,
          subtitle: 'note',
          rows: 3,
        },
        language: {
          labelReadonly: true,
          section: true,
          subtitle: 'language',
          labelHint: 'languageDescription',
        },
      },
      naturalFieldsSettings: {
        customUid: {
          disabled: true,
          defaultValueKey: 'uid',
          label: 'uid',
          placeholder: 'uid',
        },
        firstName: {
          ref: 'naturalFirstNameInput',
          rules: [v => !!v || this.$t('rule.required')],
        },
        lastName: {
          ref: 'naturalLastNameInput',
          rules: [v => !!v || this.$t('rule.required')],
        },
        middleName: {},
        passportId: {},
        mobilePhone: {},
        additionalPhone: {},
        naturalEmail: {
          label: 'email',
          placeholder: 'email',
        },
        address: {
          rows: 2,
        },
        deliveryAddress: {
          rows: 2,
        },
        naturalTypeNote: {
          label: 'note',
          placeholder: 'note',
          section: true,
          subtitle: 'note',
          rows: 3,
        },
        language: {
          labelReadonly: true,
          section: true,
          subtitle: 'language',
          labelHint: 'languageDescription',
        },
      },
      client: {
        id: null,
        uid: null,
        clientType: null,
        language: '',
        template: {},
      },
      clientClone: {},
    }
  },
  computed: {
    clientType () {
      return this.getClientTypeFromNumeric(this.$route.query.clientType)
    },
    uid () {
      if (this.client.uid) {
        return this.client.uid
      }
      let nextUid = ''
      if (this.getClientGroup && this.getClientGroup.id) {
        nextUid = this.getClientGroup.uid
      } else {
        nextUid = this.getOrgNextClientUid || ''
      }
      if (this.clientType === ClientType.OTHER) {
        nextUid = nextUid.replace('A', 'C')
      } else if (this.clientType === ClientType.PRIVATE) {
        nextUid = nextUid.replace('A', 'B')
      }
      return nextUid
    },
    tabs () {
      return [
        {
          value: ClientType.LEGAL,
          text: this.$t('client.legalPerson'),
        },
        {
          value: ClientType.PRIVATE,
          text: this.$t('client.privatePerson'),
        },
        {
          value: ClientType.OTHER,
          text: this.$t('client.other'),
        },
      ]
    },
    privateField () {
      return [
        'locale', 'contactPerson',
        'legalAddress', 'legalAddressPostcode', 'mailingAddress', 'mailingAddressPostcode',
        'deliveryAddress', 'deliveryAddressPostcode', 'phone', 'phoneOption', 'fax',
        'mobilePhone', 'email',
        'vat', 'iec', 'okpo', 'psrn', 'bic', 'swift',
        'bankName', 'bankAddress', 'bankAccountNumber', 'correspondentBankName', 'correspondentAccountNumber',
        'importerActive', 'importerCompanyName', 'importerContactPerson',
        'importerMobilePhone', 'importerPhone', 'importerEmail', 'note',
        'person', 'birthdate', 'passportId', 'citizenship', 'issueDate', 'expireDate', 'issuedBy', 'avatar',
        'contacts', 'tags', 'files',
      ]
    },
    legalFields () {
      return [
        'locale', 'contactPerson',
        'companyName', 'companyNameLocal', 'companyOwner',
        'legalAddress', 'legalAddressPostcode', 'mailingAddress', 'mailingAddressPostcode',
        'deliveryAddress', 'deliveryAddressPostcode', 'phone', 'phoneOption', 'fax',
        'mobilePhone', 'email',
        'vat', 'iec', 'okpo', 'psrn', 'bic', 'swift',
        'bankName', 'bankAddress', 'bankAccountNumber', 'correspondentBankName', 'correspondentAccountNumber',
        'importerActive', 'importerCompanyName', 'importerContactPerson',
        'importerMobilePhone', 'importerPhone', 'importerEmail', 'note',
        'contacts', 'tags', 'files',
      ]
    },
    hasDeepChange () {
      return !deepEqual(this.client, this.clientClone)
    },
    isLegalPerson () {
      return this.clientType === ClientType.LEGAL
    },
    isPrivatePerson () {
      return this.clientType === ClientType.PRIVATE
    },
  },
  watch: {
    '$route' (to, from) {
      this.reset()
    },
    saveBeforeCloseDialog (val) {
      if (!val) {
        this.$emit('confirm', 0)
        this.$off('confirm')
      }
    },
  },
  created () {
    if (this.create) {
      this.reset()
    }
  },
  methods: {
    getClientTypeFromNumeric (type) {
      switch (type) {
        case 1:
        case '1': return ClientType.LEGAL
        case 2:
        case '2': return ClientType.PRIVATE
        case 3:
        case '3': return ClientType.OTHER
        default: return ClientType.LEGAL
      }
    },
    getClientTypeNumeric (type) {
      switch (type) {
        case ClientType.LEGAL: return 1
        case ClientType.PRIVATE: return 2
        case ClientType.OTHER: return 3
        default: return 1
      }
    },
    async toggleEditMode () {
      if (this.editMode && this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            const isValid = this.validate(true)
            if (!isValid) {
              this.saveBeforeCloseDialog = false
              this.$vuetify.goTo('#container')
              this.editMode = false
              this.$nextTick(() => {
                this.editMode = true
              })
              return
            }
            try {
              await this.update(this.clientType, false)
              this.saveBeforeCloseDialog = false
            } catch (error) {
              this.$logger.warn('Error: ', error)
            }
          } else {
            this.setData(this.clientClone)
            this.resetValidation()
            this.editMode = false
            this.saveBeforeCloseDialog = false
          }
        } else {
          this.editMode = false
          this.$nextTick(() => {
            this.editMode = true
          })
          this.saveBeforeCloseDialog = false
        }
      } else {
        this.editMode = !this.editMode
      }
    },
    async checkChangesBeforeLeave (next) {
      if (this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            // const isValid = this.validate(true)
            // if (!isValid) {
            //   this.saveBeforeCloseDialog = false
            //   this.$vuetify.goTo('#container')
            //   return next(false)
            // }
            try {
              await this.update(this.clientType, false)
              return next()
            } catch (error) {
              this.$logger.warn('Error: ', error)
              return next(false)
            }
          } else {
            this.saveBeforeCloseDialog = false
            return next()
          }
        } else {
          this.saveBeforeCloseDialog = false
          return next(false)
        }
      } else {
        return next()
      }
    },
    async openConfirmDialog () {
      this.saveBeforeCloseDialog = true
      return new Promise((resolve) => {
        this.$on('confirm', result => {
          resolve(result)
        })
      })
    },
    validate (focus) {
      if (!this.wasValidate) return
      const type = this.clientType
      const validateFields = []
      let errorsCount = 0
      let fields = []
      const refs = this.$refs[type].$refs
      if (type === ClientType.PRIVATE) {
        fields = this.naturalFieldsSettings
      } else {
        fields = this.legalFieldsSettings
      }
      for (const [, v] of Object.entries(fields)) {
        if (v.rules) {
          const field = refs[v.ref][0]
          if (field) {
            validateFields.push(field)
          }
        }
      }
      let firstNotValidInput = null
      validateFields.forEach(el => {
        const errCount = el.validate()
        if (errCount && !firstNotValidInput) {
          firstNotValidInput = el.$refs.input
        }
        errorsCount += errCount
      })
      // validate language input separately
      const languageInputValidity = this.validateLanguageInput()
      if (!languageInputValidity.valid) {
        errorsCount += 1
        if (!firstNotValidInput) {
          firstNotValidInput = languageInputValidity.el
        }
      }
      if (focus && errorsCount && firstNotValidInput) {
        this.$vuetify.goTo(firstNotValidInput)
        const delay = this.isComponent ? 0 : 200
        setTimeout(() => {
          firstNotValidInput.focus()
        }, delay)
      }
      return !errorsCount
    },
    validateLanguageInput () {
      const type = this.clientType
      const el = this.$refs[`${type}-languageInput`]
      if (!el.validity.valid) {
        const message = this.$t('rule.requiredSelect')
        this.$set(this.languageInputError, type, message)
        return { message, el, valid: false }
      } else {
        this.$set(this.languageInputError, type, '')
        return { valid: true }
      }
    },
    resetValidation () {
      const type = this.clientType
      const validateFields = []
      let fields = []
      const refs = this.$refs[type].$refs
      if (type === ClientType.PRIVATE) {
        fields = this.naturalFieldsSettings
      } else {
        fields = this.legalFieldsSettings
      }
      for (const [, v] of Object.entries(fields)) {
        if (v.rules) {
          const field = refs[v.ref][0]
          if (field) {
            validateFields.push(field)
          }
        }
      }
      validateFields.forEach(el => {
        el.resetValidation()
      })
    },
    updateLanguageInput (e) {
      const v = e.target.value
      const validity = this.validateLanguageInput()
      if (validity.valid) {
        this.updateValue('language', v)
      }
    },
    async update (type, redirectAfterCreate = true) {
      // this.wasValidate = true
      // // TODO: validate input Uniq number
      // const isValid = this.validate(true)
      // if (!isValid) {
      //   return
      // }
      try {
        const input = {}
        if (this.create) {
          input.clientType = this.clientType
        }
        const fieldsKeys = this.clientType === ClientType.PRIVATE ? this.privateField : this.legalFields
        fieldsKeys.forEach(key => {
          if (this.client[key] && (key === 'companyOwner' || key === 'contactPerson' || key === 'importerContactPerson' || key === 'person')) {
            input[key] = {
              firstName: this.client[key].firstName,
              lastName: this.client[key].lastName,
              middleName: this.client[key].middleName,
            }
          } else {
            input[key] = this.client[key] || null
          }
        })

        const query = this.create ? CREATE_CLIENT : UPDATE_CLIENT

        const variables = this.create
          ? { orgId: this.orgId, input, groupId: this.getClientGroup && this.getClientGroup.id }
          : { id: this.client.id, input }

        this.updateLoading = true
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          this.$apollo.queries.getClientGroup.refetch()
          const data = this.create
            ? response.data.createClient
            : response.data.updateClient
          this.setData(data)
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            if (this.create && redirectAfterCreate) {
              this.$router.push({
                name: 'client',
                params: {
                  orgId: this.orgId,
                  clientId: data.id,
                  groupId: data.groupId,
                },
                query: {
                  clientType: this.getClientTypeNumeric(data.clientType),
                },
              })
            } else {
              this.$vuetify.goTo('#container')
            }
          }
        }
      } catch (error) {
        this.$logger.warn('Error: ', error)
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.saveBeforeCloseDialog = false
        this.updateLoading = false
      }
    },
    reset () {
      this.client = {
        id: null,
        uid: null,
        clientType: null,
        language: '',
      }
      this.languageInputError = {}
      this.clientClone = cloneDeep(this.client)
      this.$apollo.queries.getOrgNextClientUid.refetch()
    },
    setData (item) {
      if (!item) return
      this.client = cloneDeep(item)
      this.clientClone = cloneDeep(this.client)
    },
    switchClientType (type) {
      if (this.clientType === type) return
      const group = this.getClientGroup || {}
      const groupId = group.id
      const clientId = group[type]
      const clientType = this.getClientTypeNumeric(type)
      if (groupId && clientId) {
        this.$router.push({ name: 'client', params: { groupId, clientId }, query: { clientType } }).catch(() => {})
      } else {
        this.$router.push({ name: 'client-create', params: { groupId }, query: { clientType } }).catch(() => {})
      }
      this.$apollo.queries.getClientGroup.refetch()
    },
    updateValue (key, value) {
      if (!this.client.hasOwnProperty(key)) {
        this.$set(this.client, key, value)
      } else {
        this.client[key] = value
      }
    },
  },
}
</script>
