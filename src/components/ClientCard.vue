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
              'transition-colors duration-100 ease-in px-10',
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
          v-if="isLegalType"
          key="legal"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Legal info -->
          <LegalInfo
            :loading="loading"
            :uid="uid"
            :item="item"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ShippingInfo -->
              <ShippingInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                @update="updateValue"
              />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ExtraInfo -->
              <ExtraInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                @update="updateValue"
              />
            </div>
          </div>
        </div>
        <div
          v-else-if="isPrivateType"
          key="private"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Private info -->
          <PrivateInfo
            :loading="loading"
            :uid="uid"
            :item="item"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <PrivateDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ShippingInfo -->
              <ShippingInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                is-private
                @update="updateValue"
              />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ShippingInfo -->
              <ExtraInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                is-private
                @update="updateValue"
              />
            </div>
          </div>
        </div>
        <div
          v-else-if="isOtherType"
          key="other"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Legal info -->
          <LegalInfo
            :loading="loading"
            :uid="uid"
            :item="item"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ShippingInfo -->
              <ShippingInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                @update="updateValue"
              />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ExtraInfo -->
              <ExtraInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                @update="updateValue"
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        v-if="isComponent"
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
import { isObject } from '../util/helpers'

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
      internalClientType: ClientType.LEGAL,
      saveBeforeCloseDialog: false,
      updateLoading: false,
      item: {},
      itemClone: {},
    }
  },
  computed: {
    loading () {
      return this.$apollo.queries.getClient.loading
    },
    clientType () {
      if (this.isComponent) return this.internalClientType
      return this.getClientTypeFromNumeric(this.$route.query.clientType)
    },
    uid () {
      if (this.item.uid) {
        return this.item.uid
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
        'isMailingAddressMatch', 'isDeliveryAddressMatch',
        'mobilePhone', 'email',
        'vat', 'iec', 'okpo', 'psrn', 'bic', 'swift',
        'bankName', 'bankAddress', 'bankAccountNumber', 'correspondentBankName', 'correspondentAccountNumber',
        'importerActive', 'importerCompanyName', 'importerContactPerson',
        'importerMobilePhone', 'importerPhone', 'importerEmail', 'note',
        'person', 'birthdate', 'passportId', 'citizenship', 'issueDate', 'expireDate', 'issuedBy', 'avatar', 'isPersonMatch',
        'contacts', 'tags', 'files',
      ]
    },
    legalFields () {
      return [
        'locale', 'contactPerson',
        'companyName', 'companyNameLocal', 'companyOwner', 'isCompanyNameMatch',
        'legalAddress', 'legalAddressPostcode', 'mailingAddress', 'mailingAddressPostcode',
        'deliveryAddress', 'deliveryAddressPostcode', 'phone', 'phoneOption', 'fax', 'website',
        'isMailingAddressMatch', 'isDeliveryAddressMatch',
        'mobilePhone', 'email',
        'vat', 'iec', 'okpo', 'psrn', 'bic', 'swift',
        'bankName', 'bankAddress', 'bankAccountNumber', 'correspondentBankName', 'correspondentAccountNumber',
        'importerActive', 'importerCompanyName', 'importerContactPerson',
        'importerMobilePhone', 'importerPhone', 'importerEmail', 'note',
        'contacts', 'tags', 'files',
      ]
    },
    hasDeepChange () {
      return !deepEqual(this.item, this.itemClone)
    },
    isLegalType () {
      return this.clientType === ClientType.LEGAL
    },
    isPrivateType () {
      return this.clientType === ClientType.PRIVATE
    },
    isOtherType () {
      return this.clientType === ClientType.OTHER
    },
  },
  watch: {
    '$route' (to, from) {
      if (this.isComponent) return
      this.$apollo.queries.getClientGroup.refetch()
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
    async checkChangesBeforeLeave (next) {
      if (this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
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
    async createClient (input, redirectAfterCreate = true) {
      try {
        this.updateLoading = true
        input.clientType = this.clientType

        const variables = { orgId: this.orgId, input, groupId: this.getClientGroup && this.getClientGroup.id }

        const response = await this.$apollo.mutate({
          mutation: CREATE_CLIENT,
          variables,
        })
        if (response && response.data) {
          this.$apollo.queries.getClientGroup.refetch()
          const data = response.data.createClient
          this.setData(data)
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
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
        this.updateLoading = false
      }
    },
    async updateClient (input) {
      try {
        this.updateLoading = true

        const variables = { id: this.$route.params.clientId, input }

        const response = await this.$apollo.mutate({
          mutation: UPDATE_CLIENT,
          variables,
        })
        if (response && response.data) {
          const data = response.data.updateClient
          this.setData(data)
          if (this.isComponent) {
            this.$emit('update', data)
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
        this.updateLoading = false
      }
    },
    async update (type, redirectAfterCreate = true) {
      try {
        const input = {}
        if (this.create) {
          input.clientType = this.clientType
        }
        const fieldsKeys = this.clientType === ClientType.PRIVATE ? this.privateField : this.legalFields
        fieldsKeys.forEach(key => {
          const val = this.item[key]
          if (val && (key === 'companyOwner' || key === 'contactPerson' || key === 'importerContactPerson' || key === 'person')) {
            input[key] = {
              firstName: val.firstName,
              lastName: val.lastName,
              middleName: val.middleName,
            }
          } else if (val) {
            input[key] = val
          }
        })

        const query = this.create ? CREATE_CLIENT : UPDATE_CLIENT

        const variables = this.create
          ? { orgId: this.orgId, input, groupId: this.getClientGroup && this.getClientGroup.id }
          : { id: this.item.id, input }

        this.updateLoading = true
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
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
      this.item = {}
      this.itemClone = cloneDeep(this.item)
      this.$apollo.queries.getOrgNextClientUid.refetch()
    },
    setData (item) {
      if (!item) return
      const clone = cloneDeep(item)
      this.item = clone
      this.itemClone = cloneDeep(item)
    },
    switchClientType (type) {
      if (this.isComponent) {
        this.internalClientType = type
        return
      }
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
      this.reset()
    },
    updateValue (key, value) {
      if (this.isComponent) {
        if (!this.item.hasOwnProperty(key)) {
          this.$set(this.item, key, value)
        } else {
          this.item[key] = value
        }
      } else if (this.create) {
        this.createClient({ [key]: value }, true)
      } else {
        // TODO: toggle's watcher update problem on data set
        if (deepEqual(this.item[key], value)) return
        let input = {}
        if (isObject(value)) {
          const val = {}
          for (let [k, v] of Object.entries(value)) {
            if (k !== '__typename' && k !== 'fullName') {
              val[k] = v
            }
          }
          input[key] = val
        } else {
          input[key] = value
        }
        this.updateClient(input)
      }
    },
  },
}
</script>
