<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight">
        <span class="text-white uppercase font-semibold tracking-widest uppercase">
          {{ $t('companyDetail.legalDetail') }}
        </span>
        <span class="text-gray-200 mr-1">{{ titleDesc }}</span>
        <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="332">
          <template v-slot:activator>
            <Icon class="text-blue-500 align-middle">
              {{ icons.ziQuestionSign }}
            </Icon>
          </template>
          <span v-html="$t('companyDetail.legalDetailHint')" />
        </Tooltip>
      </div>
      <div>
        <button
          class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
          @click="toggleExpand"
        >
          <Icon
            class="transition-transform"
            :class="{ 'transform rotate-90': expanded }"
          >
            {{ icons.ziChevronRight }}
          </Icon>
        </button>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="expanded" class="flex flex-wrap pt-2">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="pb-2">
            <TextField
              :model-value="item.vat"
              :label="$t('companyDetail.label.vat')"
              :placeholder="$t('companyDetail.placeholder.vat')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'vat': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.legalAddress"
              :label="$t('companyDetail.label.legalAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :rules="[rules.required]"
              :debounce="500"
              :lazy="create"
              state-icon
              @update:model-value="updateLegalAddress"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.legalAddressPostcode"
              :label="$t('companyDetail.label.legalAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              :loading="loading"
              :rules="[rules.required]"
              :debounce="500"
              :lazy="create"
              state-icon
              label-no-wrap
              class="w-48"
              @update:model-value="updateLegalAddressPostcode"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.mailingAddress"
              :label="$t('companyDetail.label.mailingAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :disabled="isMailingAddressMatch"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateMailingAddress"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :model-value="item.mailingAddressPostcode"
                :label="$t('companyDetail.label.mailingAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                :loading="loading"
                :disabled="isMailingAddressMatch"
                :debounce="500"
                :lazy="create"
                :rules="[rules.required]"
                state-icon
                state-error-color="none"
                label-no-wrap
                class="w-48 pb-2"
                @update:model-value="updateMailingAddressPostcode"
              />
              <div class="relative flex-shrink-0 relative pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <Switch
                    :model-value="isMailingAddressMatch"
                    @update:model-value="updateMailingAddressMatch"
                  />
                </div>
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
                {{ $t('companyDetail.hint.mailingAddress') }}
              </div>
            </div>
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :model-value="item.iec"
              :label="$t('companyDetail.label.iec')"
              :placeholder="$t('companyDetail.placeholder.iec')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @update:model-value="updateData({ 'iec': $event })"
            />
            <TextField
              :model-value="item.okpo"
              :label="$t('companyDetail.label.okpo')"
              :placeholder="$t('companyDetail.placeholder.okpo')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="flex-grow"
              @update:model-value="updateData({ 'okpo': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.psrn"
              :label="$t('companyDetail.label.psrn')"
              :placeholder="$t('companyDetail.placeholder.psrn')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'psrn': $event })"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :model-value="companyOwner.firstName"
              :label="$t('companyDetail.label.ownerFullName')"
              :placeholder="$t('companyDetail.placeholder.firstName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
              @update:model-value="updateCompanyOwner({ firstName: $event })"
            />
            <TextField
              :model-value="companyOwner.lastName"
              :placeholder="$t('companyDetail.placeholder.lastName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="flex-grow"
              @update:model-value="updateCompanyOwner({ lastName: $event })"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              :model-value="item.bankName"
              :label="$t('companyDetail.label.bankName')"
              :placeholder="$t('companyDetail.placeholder.bankName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankName': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.bankAddress"
              :label="$t('companyDetail.label.bankAddress')"
              :placeholder="$t('companyDetail.placeholder.bankAddress')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankAddress': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.bankAccountNumber"
              :label="$t('companyDetail.label.bankAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankAccountNumber': $event })"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :model-value="item.swift"
              :label="$t('companyDetail.label.swift')"
              :placeholder="$t('companyDetail.placeholder.swift')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @update:model-value="updateData({ 'swift': $event })"
            />
            <TextField
              :model-value="item.bic"
              :label="$t('companyDetail.label.bic')"
              :placeholder="$t('companyDetail.placeholder.bic')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="flex-grow"
              @update:model-value="updateData({ 'bic': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.correspondentBankName"
              :label="$t('companyDetail.label.correspondentBankName')"
              :placeholder="$t('companyDetail.placeholder.correspondentBankName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'correspondentBankName': $event })"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <TextField
              :model-value="item.correspondentAccountNumber"
              :label="$t('companyDetail.label.correspondentAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="pb-2"
              @update:model-value="updateData({ 'correspondentAccountNumber': $event })"
            />
            <div class="lg:pb-20 mr-10" />
          </div>
          <div class="flex items-end pb-2">
            <Phone
              :model-value="item.phone"
              :locale="item.locale"
              :label="$t('companyDetail.label.phone')"
              :loading="loading"
              :lazy="create"
              state-icon
              state-error-color="warn"
              class="w-1/2 pr-2"
              @update:model-value="updateData({ 'phone': $event })"
            />
            <Phone
              :model-value="item.fax"
              :locale="item.locale"
              :label="$t('companyDetail.label.fax')"
              :loading="loading"
              :lazy="create"
              state-icon
              state-error-color="none"
              class="w-1/2 pl-2"
              @update:model-value="updateData({ 'fax': $event })"
            />
          </div>
          <div>
            <TextField
              :model-value="item.website"
              :label="$t('companyDetail.label.site')"
              :placeholder="$t('companyDetail.placeholder.site')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'website': $event })"
            />
          </div>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { ziQuestionSign, ziChevronRight } from '../../assets/icons'

import clientDetail from '../../mixins/clientDetail'

import Icon from '../Base/Icon'
import Tooltip from '../Base/Tooltip'
import Switch from '../Base/Switch'
import TextField from '../Base/TextField'
import ExpandTransition from '../Base/ExpandTransition'
import Phone from '../Phone.vue'

export default {
  name: 'LegalDetail',
  components: {
    Icon,
    Tooltip,
    Switch,
    TextField,
    ExpandTransition,
    Phone,
  },
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isSupplier: Boolean,
  },
  data () {
    return {
      isMailingAddressMatchLazy: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
      icons: {
        ziQuestionSign,
        ziChevronRight,
      },
    }
  },
  computed: {
    isMailingAddressMatch: {
      get () {
        return this.isMailingAddressMatchLazy
      },
      set (val) {
        this.isMailingAddressMatchLazy = val
      },
    },
    companyOwner () {
      return this.item.companyOwner || {}
    },
    titleDesc () {
      return this.isSupplier
        ? ` ${this.$t('companyDetail.supplierDetailDesc')}`
        : ` ${this.$t('companyDetail.legalDetailDesc')}`
    },
  },
  watch: {
    'item.isMailingAddressMatch' (val) {
      this.isMailingAddressMatchLazy = val
    },
  },
  methods: {
    updateMailingAddressMatch (val) {
      this.isMailingAddressMatch = val
      const input = { isMailingAddressMatch: val }
      this.updateData(input)
    },
    updateLegalAddress (val) {
      const input = { legalAddress: val }
      this.updateData(input)
    },
    updateLegalAddressPostcode (val) {
      const input = { legalAddressPostcode: val }
      this.updateData(input)
    },
    updateMailingAddress (val) {
      const input = { mailingAddress: val }
      this.updateData(input)
    },
    updateMailingAddressPostcode (val) {
      const input = { mailingAddressPostcode: val }
      this.updateData(input)
    },
    updateCompanyOwner (personInput) {
      const value = Object.assign({}, {
        firstName: this.companyOwner.firstName,
        lastName: this.companyOwner.lastName,
      }, personInput)
      const input = { companyOwner: value }
      this.updateData(input)
    },
  },
}
</script>
