<template>
  <div>
    <div
      id="container"
      :class="[
        'pt-8 pb-12',
        isComponent ? 'bg-gray-900 relative px-4 sm:px-5' : 'container',
      ]"
    >
      <span v-if="isComponent" class="absolute top-0 right-0 z-10 pt-3 pr-3">
        <Icon
          class="text-gray-100 hover:text-white cursor-pointer"
          @click="$emit('close')"
        >
          {{ icons.ziCloseWindow }}
        </Icon>
      </span>
      <div class="relative flex flex-wrap pb-4">
        <h1 class="w-full text-2xl text-white font-semibold leading-tight">
          {{ create ? $t('requisite.createTitle') : $t('requisite.editTitle') }}
        </h1>
        <div
          class="
            order-first
            sm:order-none
            ml-auto
            sm:absolute
            sm:bottom-0
            sm:right-0
            mb-3.5
          "
        >
          <Btn v-if="!isComponent" outlined @click="goBack">
            <span>{{
              showFillLaterButton
                ? $t('requisite.fillLater')
                : $t('requisite.back')
            }}</span>
          </Btn>
        </div>
      </div>
      <div class="bg-gray-800 rounded-md p-2.5 mb-12">
        <div class="h-11 flex items-center justify-end text-gray-100">
          <transition name="slide-x-reverse-transition">
            <div
              v-if="!item.isRequiredFilled"
              class="flex items-center whitespace-nowrap pr-5 pb-1"
            >
              <span class="text-pink-500 mr-2">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.required') }}</span>
            </div>
          </transition>
          <transition name="slide-x-reverse-transition">
            <div
              v-if="!item.isOptionalFilled"
              class="flex items-center whitespace-nowrap pr-5 pb-1"
            >
              <span class="text-yellow-500 mr-2">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.warning') }}</span>
            </div>
          </transition>
        </div>
        <div class="bg-gray-600 rounded-md p-5 pt-6">
          <!-- Company Info -->
          <CompanyInfo
            :loading="loading"
            :item="item"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Bank Details -->
          <BankDetailList
            :loading="loading"
            :emit-changes="create"
            :req-id="reqId"
            :is-expanded="!create"
            :default-bank-detail="item.defaultBankDetail"
            :items="item.bankDetails"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList
            :loading="loading"
            :is-expanded="!create"
            :items="item.contacts"
            :create="create && !isComponent"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- ShippingInfo -->
          <div class="flex flex-wrap">
            <ShippingInfo
              :loading="loading"
              :item="item"
              :is-expanded="!create"
              :create="create && !isComponent"
              is-requisite
              class="w-full"
              @update="updateValue"
            />
          </div>
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <ExtraInfo
                :loading="loading"
                :is-expanded="!create"
                :item="item"
                :create="create && !isComponent"
                is-requisite
                @update="updateValue"
              />
            </div>
          </div>
        </div>
      </div>
      <Btn
        v-if="isComponent"
        :loading="updateLoading"
        outlined
        class="w-40"
        @click="createFromItem"
      >
        {{ create ? $t('action.create') : $t('action.save') }}
      </Btn>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  useApolloClient,
  useMutation,
  useQuery,
  useResult,
} from '@vue/apollo-composable'

import debounce from 'lodash-es/debounce'
import cloneDeep from 'clone-deep'

import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

import { validateCompanyDetail } from '../utils/validation'

import { GET_ORG_REQUISITE, GET_ORGS } from '../graphql/queries'
import { CREATE_REQUISITE, UPDATE_REQUISITE } from '../graphql/mutations'

import CompanyInfo from './CompanyDetail/CompanyInfo.vue'
import BankDetailList from './CompanyDetail/BankDetailList.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ShippingInfo from './CompanyDetail/ShippingInfo.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'

export default {
  name: 'RequisiteCard',
  components: {
    Btn,
    Icon,
    CompanyInfo,
    BankDetailList,
    ContactList,
    ShippingInfo,
    ExtraInfo,
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
    showFillLaterButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'create', 'update'],
  setup(props) {
    const route = useRoute()
    const reqId = route.params.reqId
    const item = ref({})

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result, loading, onResult } = useQuery(
      GET_ORG_REQUISITE,
      () => ({
        id: reqId,
      }),
      () => ({
        enabled: !props.create,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-fisrt',
      })
    )
    const getOrgRequisite = useResult(result)
    onResult(({ data, loading }) => {
      if (loading) return
      setData(data && data.getOrgRequisite)
    })

    const setData = (data) => {
      if (!data) return
      item.value = cloneDeep(data)
    }

    const { mutate: createRequisiteMutate } = useMutation(CREATE_REQUISITE)
    const { mutate: updateRequisiteMutate } = useMutation(UPDATE_REQUISITE)

    return {
      icons: {
        ziCloseWindow,
      },
      item,
      reqId,
      loading,
      apolloClient,
      getOrgRequisite,
      setData,
      createRequisiteMutate,
      updateRequisiteMutate,
    }
  },
  data() {
    return {
      updateLoading: false,
    }
  },
  created() {
    this.fetchOrgs = debounce(this.getOrgs, 1500)
  },
  methods: {
    async getOrgs() {
      await this.apolloClient.query({
        query: GET_ORGS,
        fetchPolicy: 'network-only',
      })
    },
    goBack() {
      if (this.showFillLaterButton) {
        this.$router.push({ name: 'home' })
      } else {
        this.$router.go(-1)
      }
    },
    updateValue(input) {
      if (this.create) {
        if (this.isComponent) {
          const newItem = Object.assign({}, this.item, input)
          const v = validateCompanyDetail(newItem)
          this.item = Object.assign({}, newItem, v)
        } else {
          this.createRequisite(input, true)
        }
      } else {
        this.updateRequisite(input)
      }
    },
    reset() {
      this.item = {}
    },
    createFromItem() {
      const item = {}
      for (const [k, v] of Object.entries(this.item)) {
        if (k !== 'isRequiredFilled' && k !== 'isOptionalFilled') {
          item[k] = v
        }
      }
      this.createRequisite(item)
    },
    async createRequisite(input, redirectAfterCreate = true) {
      try {
        this.updateLoading = true

        const variables = { orgId: this.orgId, input }

        const response = await this.createRequisiteMutate(variables)
        if (response && response.data) {
          const data = response.data.createRequisite
          // update orgs query, TODO listen sub to update company
          await this.apolloClient.query({
            query: GET_ORGS,
            fetchPolicy: 'network-only',
          })
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
              this.$notify(this.$t('requisite.created'))
              this.$router.replace({
                name: 'requisite',
                params: {
                  orgId: this.orgId,
                  reqId: data.id,
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
    async updateRequisite(input) {
      try {
        this.updateLoading = true

        const variables = { id: this.item.id, input }

        const response = await this.updateRequisiteMutate(variables)
        if (response && response.data) {
          const data = response.data.updateRequisite
          if (this.isComponent) {
            this.$emit('update', data)
          }
          // update orgs query, TODO listen sub to update company
          this.fetchOrgs()
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
