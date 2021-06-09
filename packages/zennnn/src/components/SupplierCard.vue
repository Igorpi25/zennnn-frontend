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
      <h1 class="text-2xl text-white font-semibold leading-tight mb-4">
        {{ create ? $t('supplier.createTitle') : $t('supplier.editTitle') }}
      </h1>
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
          <!-- Legal info -->
          <LegalInfo
            :loading="loading"
            :uid="uid"
            :item="item"
            :create="create && !isComponent"
            is-supplier
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <LegalDetail
            :loading="loading"
            :is-expanded="!create"
            :item="item"
            :create="create && !isComponent"
            is-supplier
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
          <!-- Branches -->
          <BranchList
            :loading="loading"
            :emit-changes="create"
            :supplier-id="supplierId"
            :is-expanded="!create"
            :items="item.branches"
            :create="create && !isComponent"
            :locale="item.locale"
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ExtraInfo -->
              <ExtraInfo
                :loading="loading"
                :is-expanded="!create"
                :item="item"
                :create="create && !isComponent"
                is-supplier
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
        {{ $t('supplier.save') }}
      </Btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'

import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

import { GET_SUPPLIER, GET_ORG_NEXT_SUPPLIER_UID } from '../graphql/queries'
import { CREATE_SUPPLIER, UPDATE_SUPPLIER } from '../graphql/mutations'

import { validateSupplier } from '../utils/validation'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import LegalDetail from './CompanyDetail/LegalDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import BranchList from './CompanyDetail/BranchList.vue'

export default {
  name: 'SupplierCard',
  components: {
    Btn,
    Icon,
    LegalInfo,
    LegalDetail,
    ContactList,
    ExtraInfo,
    BranchList,
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
  emits: ['close', 'create', 'update'],
  setup(props) {
    const route = useRoute()
    const supplierId = route.params.supplierId
    const item = ref({})

    const { result: result1 } = useQuery(
      GET_ORG_NEXT_SUPPLIER_UID,
      () => ({
        orgId: props.orgId,
      }),
      () => ({
        enabled: props.create,
        fetchPolicy: 'network-only',
      })
    )
    const getOrgNextSupplierUid = useResult(result1)

    const {
      result: result2,
      loading,
      onResult,
    } = useQuery(
      GET_SUPPLIER,
      () => ({
        id: supplierId,
      }),
      () => ({
        enabled: !props.create,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-fisrt',
      })
    )
    const getSupplier = useResult(result2)
    onResult(({ data, loading }) => {
      if (loading) return
      setData(data && data.getSupplier)
    })

    const setData = (data) => {
      if (!data) return
      item.value = cloneDeep(data)
    }

    const { mutate: createSupplierMutate } = useMutation(CREATE_SUPPLIER)
    const { mutate: updateSupplierMutate } = useMutation(UPDATE_SUPPLIER)

    return {
      icons: {
        ziCloseWindow,
      },
      item,
      supplierId,
      getOrgNextSupplierUid,
      loading,
      getSupplier,
      setData,
      createSupplierMutate,
      updateSupplierMutate,
    }
  },
  data() {
    return {
      updateLoading: false,
    }
  },
  computed: {
    uid() {
      if (this.item.uid) {
        return this.item.uid
      }
      return this.getOrgNextSupplierUid || ''
    },
  },
  methods: {
    updateValue(input) {
      if (this.create) {
        if (this.isComponent) {
          const newItem = Object.assign({}, this.item, input)
          const v = validateSupplier(newItem)
          this.item = Object.assign({}, newItem, v)
        } else {
          this.createSupplier(input, true)
        }
      } else {
        this.updateSupplier(input)
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
      this.createSupplier(item)
    },
    async createSupplier(input, redirectAfterCreate = true) {
      try {
        this.updateLoading = true

        const variables = { orgId: this.orgId, input }

        const response = await this.createSupplierMutate(variables)

        if (response && response.data) {
          const data = response.data.createSupplier
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
              this.$notify(this.$t('supplier.created'))
              this.$router.replace({
                name: 'supplier',
                params: {
                  orgId: this.orgId,
                  supplierId: data.id,
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
    async updateSupplier(input) {
      try {
        this.updateLoading = true

        const variables = { id: this.item.id, input }

        const response = await this.updateSupplierMutate(variables)

        if (response && response.data) {
          const data = response.data.updateSupplier
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
