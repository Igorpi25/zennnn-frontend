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
      <h1 class="text-2xl text-white font-semibold leading-tight mb-5">
        {{ create ? $t('supplier.createTitle') : $t('supplier.editTitle') }}
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch" />
        <div
          class="bg-gray-600 rounded-md p-5 pt-6"
        >
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
            :item="item"
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
        @click="createSupplier(item)"
      >
        {{ $t('supplier.save') }}
      </Button>
    </div>

  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'

import { GET_SUPPLIER, GET_ORG_NEXT_SUPPLIER_UID } from '../graphql/queries'
import {
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
} from '../graphql/mutations'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import LegalDetail from './CompanyDetail/LegalDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import BranchList from './CompanyDetail/BranchList.vue'

export default {
  name: 'SupplierCard',
  components: {
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
  apollo: {
    getOrgNextSupplierUid: {
      query: GET_ORG_NEXT_SUPPLIER_UID,
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
    getSupplier: {
      query: GET_SUPPLIER,
      variables () {
        return {
          id: this.supplierId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        this.setData(data.getSupplier)
      },
      skip () {
        return this.create
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      updateLoading: false,
      item: {},
    }
  },
  computed: {
    loading () {
      return this.$apollo.queries.getSupplier.loading
    },
    uid () {
      if (this.item.uid) {
        return this.item.uid
      }
      return this.getOrgNextSupplierUid || ''
    },
    supplierId () {
      return this.$route.params.supplierId
    },
  },
  methods: {
    setData (item) {
      if (!item) return
      this.item = cloneDeep(item)
    },
    updateValue (input) {
      if (this.create) {
        if (this.isComponent) {
          this.item = Object.assign({}, this.item, input)
        } else {
          this.createSupplier(input, true)
        }
      } else {
        this.updateSupplier(input)
      }
    },
    reset () {
      this.item = {}
    },
    async createSupplier (input, redirectAfterCreate = true) {
      try {
        this.updateLoading = true

        const variables = { orgId: this.orgId, input }

        const response = await this.$apollo.mutate({
          mutation: CREATE_SUPPLIER,
          variables,
        })
        if (response && response.data) {
          const data = response.data.createSupplier
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
              this.$notify(this.$t('supplier.created'))
              this.$router.push({
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
    async updateSupplier (input) {
      try {
        this.updateLoading = true

        const variables = { id: this.item.id, input }

        const response = await this.$apollo.mutate({
          mutation: UPDATE_SUPPLIER,
          variables,
        })
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
