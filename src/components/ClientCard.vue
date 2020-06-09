<template>
  <div>

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
      <h1 class="text-2xl text-white font-semibold leading-tight mb-4">
        {{ create ? $t('client.createTitle') : $t('client.editTitle') }}
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="lg:h-11 flex flex-wrap lg:flex-no-wrap">
          <div class="h-11 flex order-last lg:order-none overflow-x-auto overflow-scroll-touch">
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
          <div class="flex-grow" />
          <div class="w-full lg:w-auto flex items-center justify-end">
            <v-slide-x-reverse-transition>
              <div v-if="!item.isRequiredFilled" class="flex items-center whitespace-no-wrap pr-5 pb-1">
                <span class="text-pink-500 mr-2">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" fill="currentColor" />
                  </svg>
                </span>
                <span>{{ $t('print.required') }}</span>
              </div>
            </v-slide-x-reverse-transition>
            <v-slide-x-reverse-transition>
              <div v-if="!item.isOptionalFilled" class="flex items-center whitespace-no-wrap pr-5 pb-1">
                <span class="text-yellow-500 mr-2">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" fill="currentColor" />
                  </svg>
                </span>
                <span>{{ $t('print.warning') }}</span>
              </div>
            </v-slide-x-reverse-transition>
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
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :items="item.contacts"
            :is-expanded="!create"
            :create="create && !isComponent"
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
                :create="create && !isComponent"
                @update="updateValue"
              />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ExtraInfo -->
              <ExtraInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                :create="create && !isComponent"
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
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <PrivateDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :items="item.contacts"
            :is-expanded="!create"
            :create="create && !isComponent"
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
                :create="create && !isComponent"
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
                :create="create && !isComponent"
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
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail
            :loading="loading"
            :item="item"
            :is-expanded="!create"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :items="item.contacts"
            :is-expanded="!create"
            :create="create && !isComponent"
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
                :create="create && !isComponent"
                @update="updateValue"
              />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- ExtraInfo -->
              <ExtraInfo
                :loading="loading"
                :item="item"
                :is-expanded="!create"
                :create="create && !isComponent"
                @update="updateValue"
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        v-if="create && isComponent"
        :loading="updateLoading"
        outlined
        merge-class="w-40"
        @click="createFromItem"
      >
        {{ $t('client.save') }}
      </Button>
    </div>

  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'
import { validateLegalClient, validatePrivateClient } from '../util/validation'

import { ClientType } from '../graphql/enums'
import { GET_CLIENT, GET_CLIENT_GROUP, GET_ORG_NEXT_CLIENT_UID } from '../graphql/queries'
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
} from '../graphql/mutations'
import { replaceAt } from '../util/helpers'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import LegalDetail from './CompanyDetail/LegalDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ShippingInfo from './CompanyDetail/ShippingInfo.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import PrivateInfo from './CompanyDetail/PrivateInfo.vue'
import PrivateDetail from './CompanyDetail/PrivateDetail.vue'

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
          id: this.clientId,
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
      updateLoading: false,
      item: {},
    }
  },
  computed: {
    loading () {
      return this.$apollo.queries.getClient.loading
    },
    clientId () {
      return this.$route.params.clientId
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
        nextUid = replaceAt(nextUid, 0, 'C')
      } else if (this.clientType === ClientType.PRIVATE) {
        nextUid = replaceAt(nextUid, 0, 'B')
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
    reset () {
      this.item = {}
      this.$apollo.queries.getOrgNextClientUid.refetch()
    },
    setData (item) {
      if (!item) return
      this.item = cloneDeep(item)
    },
    switchClientType (type) {
      if (this.create && this.isComponent) {
        this.internalClientType = type
        const clone = this.item
        this.reset()
        this.$nextTick(() => {
          let v = {}
          if (type === ClientType.PRIVATE) {
            v = validatePrivateClient(clone)
          } else {
            v = validateLegalClient(clone)
          }
          this.setData(Object.assign(clone, v))
        })
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
    updateValue (input) {
      if (this.create) {
        if (this.isComponent) {
          const newItem = Object.assign({}, this.item, input)
          let v = {}
          if (this.internalClientType === ClientType.PRIVATE) {
            v = validatePrivateClient(newItem)
          } else {
            v = validateLegalClient(newItem)
          }
          this.item = Object.assign({}, newItem, v)
        } else {
          this.createClient(input, true)
        }
      } else {
        this.updateClient(input)
      }
    },
    createFromItem () {
      const item = {}
      for (const [k, v] of Object.entries(this.item)) {
        if (k !== 'isRequiredFilled' && k !== 'isOptionalFilled') {
          item[k] = v
        }
      }
      this.createClient(item)
    },
    async createClient (input, redirectAfterCreate = true) {
      try {
        this.updateLoading = true
        input.clientType = this.clientType

        const variables = {
          orgId: this.orgId,
          groupId: this.getClientGroup && this.getClientGroup.id,
          input,
        }

        const response = await this.$apollo.mutate({
          mutation: CREATE_CLIENT,
          variables,
        })
        if (response && response.data) {
          this.$apollo.queries.getClientGroup.refetch()
          const data = response.data.createClient
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
              this.$notify(this.$t('client.created'))
              this.$router.replace({
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

        const variables = { id: this.clientId, input }

        const response = await this.$apollo.mutate({
          mutation: UPDATE_CLIENT,
          variables,
        })
        if (response && response.data) {
          const data = response.data.updateClient
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
  },
}
</script>
