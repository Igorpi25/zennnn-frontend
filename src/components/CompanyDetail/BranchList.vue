<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase" @click="toggleExpand">
        {{ $t('companyDetail.supplierBranchList') }}
      </div>
      <div>
        <button
          class="w-6 h-6 flex items-center justify-center text-2xl text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none select-none"
           @click="toggleExpand"
        >
          <i v-if="expanded" class="zi-chevron-down" />
          <i v-else class="zi-chevron-up" />
        </button>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="expanded">
        <div
          v-if="items.length > 0"
          class="flex flex-wrap -mx-5 pt-4"
        >
          <div
            v-for="(item, i) in items"
            :key="i"
            class="w-full lg:w-1/2 px-5"
          >
            <div
              v-if="i > 0"
              :class="['mt-10 mb-8 border-b border-gray-400', { 'lg:hidden': i === 1 }]"
            />
            <BranchItem
              :loading="loading"
              :item="item"
              :locale="locale"
              @update="updateData(i, item, $event)"
              @delete="deleteData(i, item.id)"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 pt-10 pr-5">
          <Button
            :loading="createLoading"
            block
            outlined
            merge-class="h-10 text-sm"
            @click="addData"
          >
            {{ $t('companyDetail.addBranch') }}
          </Button>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import BranchItem from './BranchItem.vue'
import clientDetail from '../../mixins/clientDetail'

import { BranchType } from '../../graphql/enums'
import { GET_SUPPLIER } from '../../graphql/queries'
import {
  CREATE_SUPPLIER_BRANCH,
  UPDATE_SUPPLIER_BRANCH,
  DELETE_SUPPLIER_BRANCH,
} from '../../graphql/mutations'

export default {
  name: 'BranchList',
  components: {
    BranchItem,
  },
  mixins: [clientDetail],
  props: {
    locale: String,
    emitChanges: Boolean,
    supplierId: String,
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
    }
  },
  methods: {
    addData () {
      if (this.emitChanges) {
        this.$emit('update', { 'branches': [...this.items, { branchType: BranchType.WAREHOUSE }] })
      } else {
        this.addBranch()
      }
    },
    updateData (i, item, value) {
      if (this.emitChanges) {
        const updatedItem = Object.assign({}, item, value)
        const items = this.items.slice()
        items.splice(i, 1, updatedItem)
        this.$emit('update', { 'branches': items })
      } else {
        this.updateBranch(item.id, value)
      }
    },
    deleteData (i, id) {
      if (this.emitChanges) {
        const items = this.items.slice()
        items.splice(i, 1)
        this.$emit('update', { 'branches': items })
      } else {
        this.deleteBranch(id)
      }
    },
    async addBranch () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: CREATE_SUPPLIER_BRANCH,
          variables: { supplierId: this.supplierId, input: {} },
          update: (store, { data: { createSupplierBranch } }) => {
            const variables = { id: this.supplierId }
            const data = store.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            data.getSupplier.branches.push(createSupplierBranch)
            store.writeQuery({
              query: GET_SUPPLIER,
              variables,
              data,
            })
          },
        })
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateBranch (id, input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_SUPPLIER_BRANCH,
          variables: { id, input },
          update: (store, { data: { updateSupplierBranch } }) => {
            const variables = { id: this.supplierId }
            const data = store.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            const index = data.getSupplier.branches.findIndex(el => el.id === id)
            if (index !== -1) {
              data.getSupplier.branches.splice(index, 1, updateSupplierBranch)
            }
            store.writeQuery({
              query: GET_SUPPLIER,
              variables,
              data,
            })
          },
        })
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async deleteBranch (id) {
      try {
        this.deleteLoading = true
        await this.$apollo.mutate({
          mutation: DELETE_SUPPLIER_BRANCH,
          variables: { id },
          update: (store) => {
            const variables = { id: this.supplierId }
            const data = store.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            const index = data.getSupplier.branches.findIndex(el => el.id === id)
            if (index !== -1) {
              data.getSupplier.branches.splice(index, 1)
            }
            store.writeQuery({
              query: GET_SUPPLIER,
              variables,
              data,
            })
          },
        })
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.deleteLoading = false
      }
    },
  },
}
</script>
