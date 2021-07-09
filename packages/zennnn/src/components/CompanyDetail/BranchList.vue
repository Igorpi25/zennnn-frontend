<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.supplierBranchList') }}
      </div>
      <div>
        <button
          class="
            text-blue-500
            hover:text-blue-400
            focus:text-blue-400 focus:outline-none
          "
          @click="toggleExpand"
        >
          <Icon class="transition-transform" :class="{ 'rotate-90': expanded }">
            {{ icons.ziChevronRight }}
          </Icon>
        </button>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="expanded">
        <div v-if="items.length > 0" class="flex flex-wrap -mx-5 pt-4">
          <div v-for="(item, i) in items" :key="i" class="w-full lg:w-1/2 px-5">
            <div
              v-if="i > 0"
              :class="[
                'mt-10 mb-8 border-b border-gray-400',
                { 'lg:hidden': i === 1 },
              ]"
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
          <Btn
            :loading="createLoading"
            block
            outlined
            class="h-10 text-sm"
            @click="addData"
          >
            {{ $t('companyDetail.addBranch') }}
          </Btn>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import { ziChevronRight } from '@zennnn/icons'
import { Btn, Icon, ExpandTransition } from '@zennnn/core'

import { BranchType } from '../../graphql/enums'
import { GET_SUPPLIER } from '../../graphql/queries'
import {
  CREATE_SUPPLIER_BRANCH,
  UPDATE_SUPPLIER_BRANCH,
  DELETE_SUPPLIER_BRANCH,
} from '../../graphql/mutations'

import clientDetail from '../../mixins/clientDetail'

import BranchItem from './BranchItem.vue'

export default {
  name: 'BranchList',
  components: {
    Btn,
    Icon,
    ExpandTransition,
    BranchItem,
  },
  mixins: [clientDetail],
  props: {
    locale: String,
    emitChanges: Boolean,
    supplierId: String,
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    return {
      icons: {
        ziChevronRight,
      },
      apolloClient,
    }
  },
  data() {
    return {
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
    }
  },
  methods: {
    addData() {
      if (this.emitChanges) {
        this.$emit('update', {
          branches: [...this.items, { branchType: BranchType.WAREHOUSE }],
        })
      } else {
        this.addBranch()
      }
    },
    updateData(i, item, value) {
      if (this.emitChanges) {
        const updatedItem = Object.assign({}, item, value)
        const items = this.items.slice()
        items.splice(i, 1, updatedItem)
        this.$emit('update', { branches: items })
      } else {
        this.updateBranch(item.id, value)
      }
    },
    deleteData(i, id) {
      if (this.emitChanges) {
        const items = this.items.slice()
        items.splice(i, 1)
        this.$emit('update', { branches: items })
      } else {
        this.deleteBranch(id)
      }
    },
    async addBranch() {
      try {
        this.createLoading = true
        await this.apolloClient.mutate({
          mutation: CREATE_SUPPLIER_BRANCH,
          variables: { supplierId: this.supplierId, input: {} },
          update: (cache, { data: { createSupplierBranch } }) => {
            const variables = { id: this.supplierId }
            const data = cache.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            cache.writeQuery({
              query: GET_SUPPLIER,
              variables,
              data: {
                getSupplier: {
                  ...data.getSupplier,
                  branches: [
                    ...data.getSupplier.branches,
                    createSupplierBranch,
                  ],
                },
              },
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
    async updateBranch(id, input) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: UPDATE_SUPPLIER_BRANCH,
          variables: { id, input },
          update: (cache, { data: { updateSupplierBranch } }) => {
            const variables = { id: this.supplierId }
            const data = cache.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            const index = data.getSupplier.branches.findIndex(
              (el) => el.id === id
            )
            if (index !== -1) {
              cache.writeQuery({
                query: GET_SUPPLIER,
                variables,
                data: {
                  getSupplier: {
                    ...data.getSupplier,
                    branches: [
                      ...data.getSupplier.branches.slice(0, index),
                      updateSupplierBranch,
                      ...data.getSupplier.branches.slice(index + 1),
                    ],
                  },
                },
              })
            }
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
    async deleteBranch(id) {
      try {
        this.deleteLoading = true
        await this.apolloClient.mutate({
          mutation: DELETE_SUPPLIER_BRANCH,
          variables: { id },
          update: (cache) => {
            const variables = { id: this.supplierId }
            const data = cache.readQuery({
              query: GET_SUPPLIER,
              variables,
            })
            if (data.getSupplier.branches.some((el) => el.id === id)) {
              cache.writeQuery({
                query: GET_SUPPLIER,
                variables,
                data: {
                  getSupplier: {
                    ...data.getSupplier,
                    branches: data.getSupplier.branches.filter(
                      (el) => el.id !== id
                    ),
                  },
                },
              })
            }
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
