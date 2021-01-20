<template>
  <div ref="container" class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2">
        <Select
          :model-value="item"
          :attach="$refs.container"
          :label="$t('requisite.label.companyName')"
          :placeholder="$t('shipping.companyNotSetted')"
          v-model:search="search"
          :items="items"
          :rules="[rules.required]"
          :hide-details="false"
          state-icon
          required
          searchable
          item-value="id"
          item-text="companyName"
          @update:model-value="$emit('select-company', $event)"
          @click:prepend-item="$emit('create-company', $event)"
        >
          <template v-slot:prepend-item>
            <span class="flex jusitfy-center text-blue-500">
              <Icon class="mr-2">
                {{ icons.ziPlusOutline }}
              </Icon>
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
          :model-value="item.legalAddress"
          :label="$t('companyDetail.label.legalAddress')"
          :placeholder="$t('companyDetail.placeholder.address')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          @update:model-value="updateData({ legalAddress: $event })"
        />
      </div>
      <div class="flex flex-wrap lg:flex-nowrap pb-2">
        <Phone
          :model-value="item.phone"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :readonly="readonly"
          :lazy="create"
          state-icon
          required
          class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-sm"
          @update:model-value="updateData({ 'phone': $event })"
        />
        <TextField
          :model-value="item.phoneOption"
          :label="$t('companyDetail.label.phoneOption')"
          :placeholder="$t('companyDetail.placeholder.phoneOption')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @update:model-value="updateData({ 'phoneOption': $event })"
        />
      </div>
      <div class="pb-2">
        <Phone
          :model-value="item.fax"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :readonly="readonly"
          :lazy="create"
          state-icon
          state-error-color="none"
          required
          class="sm:w-4/6 max-w-xs sm:pr-sm"
          @update:model-value="updateData({ 'fax': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.email"
          :label="$t('companyDetail.label.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.email]"
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          state-error-color="warn"
          required
          @update:model-value="updateData({ 'email': $event })"
        />
      </div>
      <div>
        <TextField
          :model-value="item.website"
          :label="$t('companyDetail.label.site')"
          :placeholder="$t('companyDetail.placeholder.site')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updateData({ 'website': $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <Select
          :model-value="bankDetailItem"
          :attach="$refs.container"
          :label="$t('companyDetail.label.bankName')"
          :placeholder="$t('companyDetail.placeholder.bankName')"
          :items="bankDetailList"
          :rules="[rules.required]"
          :hide-details="false"
          item-value="id"
          item-text="bankName"
          state-icon
          required
          @update:model-value="setDefaultBankDetail"
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
          :model-value="bankDetailItem.bankAddress"
          :label="$t('companyDetail.label.bankAddress')"
          :placeholder="$t('companyDetail.placeholder.bankAddress')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          :hide-details="false"
          state-icon
          required
          @update:model-value="updateBankDetail({ 'bankAddress': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="bankDetailItem.bankAccountNumber"
          :label="$t('companyDetail.label.bankAccountNumber')"
          :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          :hide-details="false"
          state-icon
          required
          @update:model-value="updateBankDetail({ 'bankAccountNumber': $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          :model-value="bankDetailItem.swift"
          :label="$t('companyDetail.label.swift')"
          :placeholder="$t('companyDetail.placeholder.swift')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          :hide-details="false"
          state-icon
          required
          class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
          @update:model-value="updateBankDetail({ 'swift': $event })"
        />
        <TextField
          :model-value="bankDetailItem.bic"
          :label="$t('companyDetail.label.bic')"
          :placeholder="$t('companyDetail.placeholder.bic')"
          :loading="loading"
          :readonly="readonly || !bankDetailItem.id"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="flex-grow"
          @update:model-value="updateBankDetail({ 'bic': $event })"
        />
      </div>
      <div class="flex pb-2">
        <TextField
          :model-value="item.vat"
          :label="$t('companyDetail.label.vat')"
          :placeholder="$t('companyDetail.placeholder.vat')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="w-7/12 pr-sm"
          @update:model-value="updateData({ 'vat': $event })"
        />
        <TextField
          :model-value="item.okpo"
          :label="$t('companyDetail.label.okpo')"
          :placeholder="$t('companyDetail.placeholder.okpo')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="flex-grow"
          @update:model-value="updateData({ 'okpo': $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import clientDetail from '../../mixins/clientDetail'

import { UPDATE_COMPANY_BANK_DETAIL } from '../../graphql/mutations'

import { ziPlusOutline } from '../../assets/icons'

import Icon from '../Base/Icon'
import Select from '../Base/Select'
import TextField from '../Base/TextField'
import Phone from '../Phone.vue'

export default {
  name: 'CompanyInfoPrint',
  components: {
    Icon,
    Select,
    TextField,
    Phone,
  },
  mixins: [clientDetail],
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
  emits: ['select-company', 'create-company', 'update'],
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    return {
      icons: {
        ziPlusOutline,
      },
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
