<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.bankDetail') }}
      </div>
      <div>
        <button
          class="w-6 h-6 flex items-center justify-center text-2xl text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none select-none"
           @click="toggleExpand"
        >
          <i v-if="expanded" class="zi-chevron-down" />
          <i v-else class="zi-chevron-up" />
        </button>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="expanded">
        <div
          v-if="items.length > 0"
          class="flex flex-wrap pt-4"
        >
          <div
            v-for="(item, i) in items"
            :key="i"
            class="w-full relative"
          >
            <div
              v-if="i > 0"
              :class="['mt-10 mb-8 border-b border-gray-400']"
            />
            <div
              v-if="i > 0"
              class="absolute top-0 right-0 pt-12"
            >
              <button
                class="flex justify-center items-center text-2xl text-gray-200 cursor-pointer focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-1"
                @click="deleteData(i, item.id)"
              >
                <i class="zi-close" />
              </button>
            </div>
            <BankDetailItem
              :loading="loading"
              :create="i === items.length - 1"
              :create-loading="createLoading"
              :item="item"
              :is-default-bank-detail="item.id && item.id === defaultBankDetail"
              @create="addData"
              @update="updateData(i, item, $event)"
              @delete="deleteData(i, item.id)"
              @set-main-bank-detail="$emit('update', { 'defaultBankDetail': $event })"
            />
          </div>
        </div>
        <div v-else class="w-full lg:w-1/2 pt-10">
          <Btn
            :loading="createLoading"
            block
            outlined
            merge-class="h-10 text-sm"
            @click="addData"
          >
            {{ $t('companyDetail.addBankDetail') }}
          </Btn>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import Btn from '../Base/Btn'
import ExpandTransition from '../Base/ExpandTransition'
import BankDetailItem from './BankDetailItem.vue'

import clientDetail from '../../mixins/clientDetail'
import { validateCompanyDetail } from '../../util/validation'

import { GET_ORG_REQUISITE } from '../../graphql/queries'
import {
  CREATE_COMPANY_BANK_DETAIL,
  UPDATE_COMPANY_BANK_DETAIL,
  DELETE_COMPANY_BANK_DETAIL,
} from '../../graphql/mutations'

export default {
  name: 'BankDetailList',
  components: {
    Btn,
    ExpandTransition,
    BankDetailItem,
  },
  mixins: [clientDetail],
  props: {
    locale: String,
    emitChanges: Boolean,
    reqId: String,
    defaultBankDetail: String,
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    return {
      apolloClient,
    }
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
        this.$emit('update', { bankDetails: [...this.items, {}] })
      } else {
        this.addBankDetail()
      }
    },
    updateData (i, item, value) {
      if (this.emitChanges) {
        const updatedItem = Object.assign({}, item, value)
        const items = this.items.slice()
        items.splice(i, 1, updatedItem)
        this.$emit('update', { bankDetails: items })
      } else {
        this.updateBankDetail(item.id, value)
      }
    },
    deleteData (i, id) {
      if (this.emitChanges) {
        const items = this.items.slice()
        items.splice(i, 1)
        this.$emit('update', { bankDetails: items })
      } else {
        this.deleteBankDetail(id)
      }
    },
    async addBankDetail () {
      try {
        this.createLoading = true
        await this.apolloClient.mutate({
          mutation: CREATE_COMPANY_BANK_DETAIL,
          variables: { companyId: this.reqId, input: {} },
          update: (store, { data: { createCompanyBankDetail } }) => {
            const variables = { id: this.reqId }
            const data = store.readQuery({
              query: GET_ORG_REQUISITE,
              variables,
            })
            data.getOrgRequisite.bankDetails.push(createCompanyBankDetail)
            // update validation state
            // should be fixed with subs
            const v = validateCompanyDetail(data.getOrgRequisite)
            data.getOrgRequisite.isRequiredFilled = v.isRequiredFilled
            data.getOrgRequisite.isOptionalFilled = v.isOptionalFilled
            store.writeQuery({
              query: GET_ORG_REQUISITE,
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
    async updateBankDetail (id, input) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: UPDATE_COMPANY_BANK_DETAIL,
          variables: { companyId: this.reqId, id, input },
          update: (store, { data: { updateCompanyBankDetail } }) => {
            const variables = { id: this.reqId }
            const data = store.readQuery({
              query: GET_ORG_REQUISITE,
              variables,
            })
            const index = data.getOrgRequisite.bankDetails.findIndex(el => el.id === id)
            if (index !== -1) {
              data.getOrgRequisite.bankDetails.splice(index, 1, updateCompanyBankDetail)
              // update validation state
              // should be fixed with subs
              const v = validateCompanyDetail(data.getOrgRequisite)
              data.getOrgRequisite.isRequiredFilled = v.isRequiredFilled
              data.getOrgRequisite.isOptionalFilled = v.isOptionalFilled
            }
            store.writeQuery({
              query: GET_ORG_REQUISITE,
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
    async deleteBankDetail (id) {
      try {
        this.deleteLoading = true
        await this.apolloClient.mutate({
          mutation: DELETE_COMPANY_BANK_DETAIL,
          variables: { companyId: this.reqId, id },
          update: (store) => {
            const variables = { id: this.reqId }
            const data = store.readQuery({
              query: GET_ORG_REQUISITE,
              variables,
            })
            const index = data.getOrgRequisite.bankDetails.findIndex(el => el.id === id)
            if (index !== -1) {
              data.getOrgRequisite.bankDetails.splice(index, 1)
              // update validation state
              // should be fixed with subs
              const v = validateCompanyDetail(data.getOrgRequisite)
              data.getOrgRequisite.isRequiredFilled = v.isRequiredFilled
              data.getOrgRequisite.isOptionalFilled = v.isOptionalFilled
            }
            store.writeQuery({
              query: GET_ORG_REQUISITE,
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
