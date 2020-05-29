<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight" @click="toggleExpand">
        <span class="text-white uppercase font-semibold tracking-widest uppercase">
          {{ $t('companyDetail.legalDetail') }}
        </span>
        <span class="text-gray-200 mr-1">{{ titleDesc }}</span>
        <v-tooltip top max-width="332" nudge-right="136">
          <template v-slot:activator="{ on }">
            <i class="zi-help align-middle text-base text-blue-500 cursor-pointer" v-on="on" />
          </template>
          <span v-html="$t('companyDetail.legalDetailHint')" />
        </v-tooltip>
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
      <div v-show="expanded" class="flex flex-wrap pt-2">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="pb-2">
            <TextField
              :value="item.vat"
              :label="$t('companyDetail.label.vat')"
              :placeholder="$t('companyDetail.placeholder.vat')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'vat': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddress"
              :label="$t('companyDetail.label.legalAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :rules="[rules.required]"
              :debounce="500"
              :lazy="create"
              lazy-validation
              state-icon
              @input="updateLegalAddress"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddressPostcode"
              :label="$t('companyDetail.label.legalAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              :loading="loading"
              :rules="[rules.required]"
              :debounce="500"
              :lazy="create"
              lazy-validation
              state-icon
              label-no-wrap
              class="w-48"
              @input="updateLegalAddressPostcode"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.mailingAddress"
              :label="$t('companyDetail.label.mailingAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :disabled="isMailingAddressMatch"
              :debounce="500"
              :lazy="create"
              @input="updateMailingAddress"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :value="item.mailingAddressPostcode"
                :label="$t('companyDetail.label.mailingAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                :loading="loading"
                :disabled="isMailingAddressMatch"
                :debounce="500"
                :lazy="create"
                label-no-wrap
                class="w-48 pb-2"
                @input="updateMailingAddressPostcode"
              />
              <div class="relative flex-shrink-0 relative pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <SwitchInput
                    :value="isMailingAddressMatch"
                    hide-details
                    @input="updateMailingAddressMatch"
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
              :value="item.iec"
              :label="$t('companyDetail.label.iec')"
              :placeholder="$t('companyDetail.placeholder.iec')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="updateData({ 'iec': $event })"
            />
            <TextField
              :value="item.okpo"
              :label="$t('companyDetail.label.okpo')"
              :placeholder="$t('companyDetail.placeholder.okpo')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="flex-grow"
              @input="updateData({ 'okpo': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.psrn"
              :label="$t('companyDetail.label.psrn')"
              :placeholder="$t('companyDetail.placeholder.psrn')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'psrn': $event })"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="companyOwner.firstName"
              :label="$t('companyDetail.label.ownerFullName')"
              :placeholder="$t('companyDetail.placeholder.firstName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
              @input="updateCompanyOwner({ firstName: $event })"
            />
            <TextField
              :value="companyOwner.lastName"
              :placeholder="$t('companyDetail.placeholder.lastName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="flex-grow"
              @input="updateCompanyOwner({ lastName: $event })"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              :value="item.bankName"
              :label="$t('companyDetail.label.bankName')"
              :placeholder="$t('companyDetail.placeholder.bankName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'bankName': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAddress"
              :label="$t('companyDetail.label.bankAddress')"
              :placeholder="$t('companyDetail.placeholder.bankAddress')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'bankAddress': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAccountNumber"
              :label="$t('companyDetail.label.bankAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'bankAccountNumber': $event })"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.swift"
              :label="$t('companyDetail.label.swift')"
              :placeholder="$t('companyDetail.placeholder.swift')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="updateData({ 'swift': $event })"
            />
            <TextField
              :value="item.bic"
              :label="$t('companyDetail.label.bic')"
              :placeholder="$t('companyDetail.placeholder.bic')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="flex-grow"
              @input="updateData({ 'bic': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.correspondentBankName"
              :label="$t('companyDetail.label.correspondentBankName')"
              :placeholder="$t('companyDetail.placeholder.correspondentBankName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'correspondentBankName': $event })"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <TextField
              :value="item.correspondentAccountNumber"
              :label="$t('companyDetail.label.correspondentAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              class="pb-2"
              @input="updateData({ 'correspondentAccountNumber': $event })"
            />
            <div class="lg:pb-20 mr-10" />
          </div>
          <div class="flex items-end pb-2">
            <PhoneInput
              :value="item.phone"
              :label="$t('companyDetail.label.phone')"
              :loading="loading"
              state-icon
              state-color="warn"
              required
              class="w-1/2 pr-2"
              @input="updateData({ 'phone': $event })"
            />
            <PhoneInput
              :value="item.fax"
              :label="$t('companyDetail.label.fax')"
              :loading="loading"
              class="w-1/2 pl-2"
              @input="updateData({ 'fax': $event })"
            />
          </div>
          <div>
            <TextField
              :value="item.website"
              :label="$t('companyDetail.label.site')"
              :placeholder="$t('companyDetail.placeholder.site')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'website': $event })"
            />
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import clientDetail from '../../mixins/clientDetail'

export default {
  name: 'LegalDetail',
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
      const input = { 'isMailingAddressMatch': val }
      if (val) {
        input.mailingAddress = this.item.legalAddress
        input.mailingAddressPostcode = this.item.legalAddressPostcode
        if (this.item.isDeliveryAddressMatch) {
          input.deliveryAddress = this.item.legalAddress
          input.deliveryAddressPostcode = this.item.legalAddressPostcode
        }
      }
      this.updateData(input)
    },
    updateLegalAddress (val) {
      const input = { legalAddress: val }
      if (this.isMailingAddressMatch) {
        input.mailingAddress = val
      }
      this.updateData(input)
    },
    updateLegalAddressPostcode (val) {
      const input = { legalAddressPostcode: val }
      if (this.isMailingAddressMatch) {
        input.mailingAddressPostcode = val
      }
      this.updateData(input)
    },
    updateMailingAddress (val) {
      const input = { mailingAddress: val }
      if (this.item.isDeliveryAddressMatch) {
        input.deliveryAddress = val
      }
      this.updateData(input)
    },
    updateMailingAddressPostcode (val) {
      const input = { mailingAddressPostcode: val }
      if (this.item.isDeliveryAddressMatch) {
        input.deliveryAddressPostcode = val
      }
      this.updateData(input)
    },
    updateCompanyOwner (personInput) {
      const value = Object.assign({}, {
        firstName: this.companyOwner.firstName,
        lastName: this.companyOwner.lastName,
      }, personInput)
      const input = { 'companyOwner': value }
      this.updateData(input)
    },
  },
}
</script>
