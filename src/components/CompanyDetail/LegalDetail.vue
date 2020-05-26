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
              lazy
              @input="$emit('update', 'vat', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddress"
              :label="$t('companyDetail.label.legalAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :rules="[rules.required]"
              lazy
              lazy-validation
              state-icon
              @input="$emit('update', 'legalAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddressPostcode"
              :label="$t('companyDetail.label.legalAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              :loading="loading"
              :rules="[rules.required]"
              lazy
              lazy-validation
              state-icon
              label-no-wrap
              class="w-48"
              @input="$emit('update', 'legalAddressPostcode', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.mailingAddress"
              :label="$t('companyDetail.label.mailingAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :disabled="item.isMailingAddressMatch"
              lazy
              @input="$emit('update', 'mailingAddress', $event)"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :value="item.mailingAddressPostcode"
                :label="$t('companyDetail.label.mailingAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                :loading="loading"
                :disabled="item.isMailingAddressMatch"
                lazy
                label-no-wrap
                class="w-48 pb-2"
                @input="$emit('update', 'mailingAddressPostcode', $event)"
              />
              <div class="relative flex-shrink-0 relative pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <SwitchInput
                    :value="item.isMailingAddressMatch"
                    hide-details
                    @input="$emit('update', 'isMailingAddressMatch', $event)"
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
              lazy
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="$emit('update', 'iec', $event)"
            />
            <TextField
              :value="item.okpo"
              :label="$t('companyDetail.label.okpo')"
              :placeholder="$t('companyDetail.placeholder.okpo')"
              :loading="loading"
              lazy
              class="flex-grow"
              @input="$emit('update', 'okpo', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.psrn"
              :label="$t('companyDetail.label.psrn')"
              :placeholder="$t('companyDetail.placeholder.psrn')"
              :loading="loading"
              lazy
              @input="$emit('update', 'psrn', $event)"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              v-model="firstName"
              :label="$t('companyDetail.label.ownerFullName')"
              :placeholder="$t('companyDetail.placeholder.firstName')"
              :loading="loading"
              lazy
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
            />
            <TextField
              v-model="lastName"
              :placeholder="$t('companyDetail.placeholder.lastName')"
              :loading="loading"
              lazy
              class="flex-grow"
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
              lazy
              @input="$emit('update', 'bankName', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAddress"
              :label="$t('companyDetail.label.bankAddress')"
              :placeholder="$t('companyDetail.placeholder.bankAddress')"
              :loading="loading"
              lazy
              @input="$emit('update', 'bankAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAccountNumber"
              :label="$t('companyDetail.label.bankAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              lazy
              @input="$emit('update', 'bankAccountNumber', $event)"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.swift"
              :label="$t('companyDetail.label.swift')"
              :placeholder="$t('companyDetail.placeholder.swift')"
              :loading="loading"
              lazy
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="$emit('update', 'swift', $event)"
            />
            <TextField
              :value="item.bic"
              :label="$t('companyDetail.label.bic')"
              :placeholder="$t('companyDetail.placeholder.bic')"
              :loading="loading"
              lazy
              class="flex-grow"
              @input="$emit('update', 'bic', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.correspondentBankName"
              :label="$t('companyDetail.label.correspondentBankName')"
              :placeholder="$t('companyDetail.placeholder.correspondentBankName')"
              :loading="loading"
              lazy
              @input="$emit('update', 'correspondentBankName', $event)"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <TextField
              :value="item.correspondentAccountNumber"
              :label="$t('companyDetail.label.correspondentAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              lazy
              class="pb-2"
              @input="$emit('update', 'correspondentAccountNumber', $event)"
            />
            <div class="lg:pb-20 mr-10" />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.phone"
              :label="$t('companyDetail.label.phone')"
              :placeholder="$t('companyDetail.placeholder.phone')"
              :loading="loading"
              :rules="[rules.required]"
              lazy
              lazy-validation
              state-icon
              class="w-1/2 pr-2"
              @input="$emit('update', 'phone', $event)"
            />
            <TextField
              :value="item.fax"
              :label="$t('companyDetail.label.fax')"
              :placeholder="$t('companyDetail.placeholder.phone')"
              :loading="loading"
              lazy
              class="w-1/2 pl-2"
              @input="$emit('update', 'fax', $event)"
            />
          </div>
          <div>
            <TextField
              :value="item.website"
              :label="$t('companyDetail.label.site')"
              :placeholder="$t('companyDetail.placeholder.site')"
              :loading="loading"
              lazy
              @input="$emit('update', 'website', $event)"
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
    loading: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
    isSupplier: Boolean,
  },
  data () {
    return {
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    firstName: {
      get () {
        return this.item.companyOwner && this.item.companyOwner.firstName
      },
      set (val) {
        const person = Object.assign({}, this.item.companyOwner, { firstName: val })
        this.$emit('update', 'companyOwner', person)
      },
    },
    lastName: {
      get () {
        return this.item.companyOwner && this.item.companyOwner.lastName
      },
      set (val) {
        const person = Object.assign({}, this.item.companyOwner, { lastName: val })
        this.$emit('update', 'companyOwner', person)
      },
    },
    titleDesc () {
      return this.isSupplier
        ? ` ${this.$t('companyDetail.supplierDetailDesc')}`
        : ` ${this.$t('companyDetail.legalDetailDesc')}`
    },
  },
  watch: {
    'item.legalAddress' (val) {
      if (this.item.isMailingAddressMatch) {
        this.$emit('update', 'mailingAddress', val)
      }
    },
    'item.legalAddressPostcode' (val) {
      if (this.item.isMailingAddressMatch) {
        this.$emit('update', 'mailingAddressPostcode', val)
      }
    },
    'item.isMailingAddressMatch' (val) {
      if (val) {
        this.$emit('update', 'mailingAddress', this.item.legalAddress)
        this.$emit('update', 'mailingAddressPostcode', this.item.legalAddressPostcode)
      }
    },
  },
}
</script>
