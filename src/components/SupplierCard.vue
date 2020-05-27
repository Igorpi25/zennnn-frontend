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
            @update="updateValue"
          />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Branches -->
          <BranchList
            :loading="loading"
            :emit-changes="create || isComponent"
            :supplier-id="supplierId"
            :is-expanded="!create"
            :items="item.branches"
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
        {{ $t('supplier.save') }}
      </Button>
    </div>

  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { GET_SUPPLIER, GET_ORG_NEXT_SUPPLIER_UID } from '../graphql/queries'
import {
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
} from '../graphql/mutations'
import { isObject } from '../util/helpers'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import LegalDetail from './CompanyDetail/LegalDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import BranchList from './CompanyDetail/BranchList.vue'
import SaveBeforeCloseModal from './SaveBeforeCloseModal.vue'

export default {
  name: 'SupplierCard',
  components: {
    LegalInfo,
    LegalDetail,
    ContactList,
    ExtraInfo,
    BranchList,
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
      saveBeforeCloseDialog: false,
      updateLoading: false,
      item: {},
      itemClone: {},
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
    fieldsKeys () {
      return [
        'locale', 'contactPerson', 'companyType',
        'companyName', 'companyNameLocal', 'companyOwner', 'isCompanyNameMatch',
        'legalAddress', 'legalAddressPostcode', 'mailingAddress', 'mailingAddressPostcode',
        'phone', 'phoneOption', 'fax', 'website',
        'isMailingAddressMatch',
        'mobilePhone', 'email',
        'vat', 'iec', 'okpo', 'psrn', 'bic', 'swift',
        'bankName', 'bankAddress', 'bankAccountNumber', 'correspondentBankName', 'correspondentAccountNumber',
        'note', 'tags', 'files',
        // 'contacts',
      ]
    },
    branchFieldsKeys () {
      return [
        'name', 'address', 'contactPerson',
        'workPhone', 'mobilePhone', 'contacts',
      ]
    },
    hasDeepChange () {
      return !deepEqual(this.item, this.itemClone)
    },
  },
  watch: {
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
    async checkChangesBeforeLeave (next) {
      if (this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            try {
              await this.update(false, true)
              return next()
            } catch (error) {
              this.$logger.warn('Error: ', error)
              return next(false)
            }
          } else {
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
    setData (item) {
      if (!item) return
      this.item = cloneDeep(item)
      this.itemClone = cloneDeep(item)
    },
    updateValue (key, value) {
      if (this.isComponent) {
        if (!this.item.hasOwnProperty(key)) {
          this.$set(this.item, key, value)
        } else {
          this.item[key] = value
        }
      } else if (this.create) {
        this.createSupplier({ [key]: value }, true)
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
        this.updateSupplier(input)
      }
    },
    reset () {
      this.item = {}
      this.itemClone = {}
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
          this.setData(data)
          if (this.isComponent) {
            this.$emit('create', data)
          } else {
            if (redirectAfterCreate) {
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
    async update (redirectAfterCreate = true, fullUpdate) {
      try {
        this.updateLoading = true
        let input = {}
        this.fieldsKeys.forEach(key => {
          const val = this.item[key]
          if (val && (key === 'companyOwner' || key === 'contactPerson')) {
            input[key] = {
              firstName: val.firstName,
              lastName: val.lastName,
            }
          } else if (val) {
            input[key] = val
          }
        })
        if (this.create || fullUpdate) {
          const brunches = this.item.branches || []
          input.branches = brunches.map(b => {
            let branch = {}
            this.branchFieldsKeys.forEach(key => {
              const val = b[key]
              if (val && (key === 'contactPerson')) {
                branch[key] = {
                  firstName: val.firstName,
                  lastName: val.lastName,
                }
              } else if (val) {
                branch[key] = val
              }
            })
            return branch
          })
        }

        const query = this.create ? CREATE_SUPPLIER : UPDATE_SUPPLIER

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.item.id, input }

        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          const data = this.create
            ? response.data.createSupplier
            : response.data.updateSupplier
          this.setData(data)
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            if (this.create && redirectAfterCreate) {
              this.$router.push({
                name: 'supplier',
                params: {
                  orgId: this.orgId,
                  supplierId: data.id,
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
        this.updateLoading = false
      }
    },
  },
}
</script>
