<template>
  <div ref="container" class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2">
        <Select
          :value="item"
          :menu-attach="$refs.container"
          :label="$t('requisite.label.companyName')"
          :placeholder="$t('shipping.companyNotSetted')"
          v-model:search="search"
          :items="items"
          :rules="[rules.required]"
          state-icon
          required
          searchable
          item-value="id"
          item-text="companyName"
          @input="$emit('select-company', $event)"
          @click:prepend-item="$emit('create-company', $event)"
        >
          <template v-slot:prepend-item>
            <span class="flex jusitfy-center text-blue-500">
              <i class="zi-plus-outline text-2xl mr-2" />
              <span>{{ $t('action.create') }}</span>
            </span>
          </template>
          <template v-slot:item="{ item }">
            <span v-if="item.companyName" class="text-white">
              {{ item.companyName }}
            </span>
            <span v-else class="flex items-center text-gray-200">
              {{ $t('shipping.clientAddNoData') }}
              <span class="text-pink-500 ml-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
            </span>
          </template>
        </Select>
      </div>
      <div class="pb-2">
        <TextField
          :value="item.legalAddress"
          :label="$t('companyDetail.label.legalAddress')"
          :placeholder="$t('companyDetail.placeholder.address')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          required
          @input="updateData({ legalAddress: $event })"
        />
      </div>
      <div class="flex flex-wrap lg:flex-nowrap pb-2">
        <Phone
          :value="item.phone"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :readonly="readonly"
          :lazy="create"
          lazy-validation
          state-icon
          required
          class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-sm"
          @input="updateData({ 'phone': $event })"
        />
        <TextField
          :value="item.phoneOption"
          :label="$t('companyDetail.label.phoneOption')"
          :placeholder="$t('companyDetail.placeholder.phoneOption')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @input="updateData({ 'phoneOption': $event })"
        />
      </div>
      <div class="pb-2">
        <Phone
          :value="item.fax"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :readonly="readonly"
          :lazy="create"
          state-icon
          state-color="none"
          lazy-validation
          required
          class="sm:w-4/6 max-w-xs sm:pr-sm"
          @input="updateData({ 'fax': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.email"
          :label="$t('companyDetail.label.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.email]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          state-color="warn"
          required
          @input="updateData({ 'email': $event })"
        />
      </div>
      <div>
        <TextField
          :value="item.website"
          :label="$t('companyDetail.label.site')"
          :placeholder="$t('companyDetail.placeholder.site')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          @input="updateData({ 'website': $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <Select
          :value="bankDetailItem"
          :menu-attach="$refs.container"
          :label="$t('companyDetail.label.bankName')"
          :placeholder="$t('companyDetail.placeholder.bankName')"
          :items="bankDetailList"
          item-value="id"
          item-text="bankName"
          :rules="[rules.required]"
          state-icon
          required
          @input="setDefaultBankDetail"
        >
          <template v-slot:item="{ item }">
            <span v-if="item.bankName" class="text-white">
              {{ item.bankName }}
            </span>
            <span v-else class="flex items-center text-gray-200">
              {{ $t('shipping.clientAddNoData') }}
              <span class="text-pink-500 ml-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
            </span>
          </template>
        </Select>
      </div>
      <div class="pb-2">
        <TextField
          :value="bankDetailItem.bankAddress"
          :label="$t('companyDetail.label.bankAddress')"
          :placeholder="$t('companyDetail.placeholder.bankAddress')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          lazy-validation
          state-icon
          required
          @input="updateBankDetail({ 'bankAddress': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="bankDetailItem.bankAccountNumber"
          :label="$t('companyDetail.label.bankAccountNumber')"
          :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          lazy-validation
          state-icon
          required
          @input="updateBankDetail({ 'bankAccountNumber': $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          :value="bankDetailItem.swift"
          :label="$t('companyDetail.label.swift')"
          :placeholder="$t('companyDetail.placeholder.swift')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          lazy-validation
          state-icon
          required
          class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
          @input="updateBankDetail({ 'swift': $event })"
        />
        <TextField
          :value="bankDetailItem.bic"
          :label="$t('companyDetail.label.bic')"
          :placeholder="$t('companyDetail.placeholder.bic')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="flex-grow"
          @input="updateBankDetail({ 'bic': $event })"
        />
      </div>
      <div class="flex pb-2">
        <TextField
          :value="item.vat"
          :label="$t('companyDetail.label.vat')"
          :placeholder="$t('companyDetail.placeholder.vat')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="w-7/12 pr-sm"
          @input="updateData({ 'vat': $event })"
        />
        <TextField
          :value="item.okpo"
          :label="$t('companyDetail.label.okpo')"
          :placeholder="$t('companyDetail.placeholder.okpo')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="flex-grow"
          @input="updateData({ 'okpo': $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import companyDetail from '../../mixins/clientDetail'
import { UPDATE_COMPANY_BANK_DETAIL } from '../../graphql/mutations'

import Select from '../Base/Select'
import TextField from '../Base/TextField'
import Phone from '../Phone.vue'

export default {
  name: 'CompanyInfoPrint',
  components: {
    Select,
    TextField,
    Phone,
  },
  mixins: [companyDetail],
  props: {
    readonly: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
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
      search: '',
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => (v && /.+@.+\..+/.test(v)) || this.$t('companyDetail.rule.notificationEmail'),
      },
    }
  },
  computed: {
    bankDetailItem () {
      return this.bankDetailList.find(el => el.id === this.item.defaultBankDetail) || {}
    },
    bankDetailList () {
      return this.item.bankDetails || []
    },
    companyOwner () {
      return this.item.companyOwner || {}
    },
  },
  methods: {
    setDefaultBankDetail (id) {
      this.$emit('update', { defaultBankDetail: id })
    },
    updateBankDetail (input) {
      this.updateRequisiteBankDetail(this.item.id, this.bankDetailItem.id, input)
    },
    updateData (input) {
      this.$emit('update', input)
    },
    async updateRequisiteBankDetail (companyId, id, input) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: UPDATE_COMPANY_BANK_DETAIL,
          variables: { companyId, id, input },
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
  },
}
</script>
