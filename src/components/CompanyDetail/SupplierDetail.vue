<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight" @click="toggleExpand">
        <span class="text-white uppercase font-semibold tracking-widest">
          {{ $t('companyDetail.legalDetail') }}
        </span>
        <span class="text-gray-200 mr-1">{{ titleHint }}</span>
        <v-tooltip top max-width="332" nudge-right="136">
          <template v-slot:activator="{ on }">
            <i class="zi-help align-middle text-base text-blue-500 hover:text-blue-600 cursor-pointer" v-on="on" />
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
              :label="$t('companyDetail.label.vat')"
              :placeholder="$t('companyDetail.placeholder.vat')"
              disabled
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddress"
              :label="$t('companyDetail.label.legalAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              @input="$emit('update', 'legalAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddressPostcode"
              :label="$t('companyDetail.label.legalAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              label-no-wrap
              class="w-48"
              @input="$emit('update', 'legalAddressPostcode', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.manufacturersAddress"
              :label="$t('companyDetail.label.mailingAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              @input="$emit('update', 'manufacturersAddress', $event)"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :label="$t('companyDetail.label.mailingAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                label-no-wrap
                class="w-48 pb-2"
                disabled
              />
              <div class="relative flex-shrink-0 relative w-12 pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <SwitchInput disabled hide-details />
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
              :label="$t('companyDetail.label.iec')"
              :placeholder="$t('companyDetail.placeholder.iec')"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              disabled
            />
            <TextField
              :label="$t('companyDetail.label.okpo')"
              :placeholder="$t('companyDetail.placeholder.okpo')"
              class="flex-grow"
              disabled
            />
          </div>
          <div class="pb-2">
            <TextField
              :label="$t('companyDetail.label.psrn')"
              :placeholder="$t('companyDetail.placeholder.psrn')"
              disabled
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.ownerFullName"
              :label="$t('companyDetail.label.ownerFullName')"
              :placeholder="$t('companyDetail.placeholder.firstName')"
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
              @input="$emit('update', 'ownerFullName', $event)"
            />
            <!-- <TextField
              :placeholder="$t('companyDetail.placeholder.lastName')"
              class="flex-grow"
            /> -->
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              :value="item.bankName"
              :label="$t('companyDetail.label.bankName')"
              :placeholder="$t('companyDetail.placeholder.bankName')"
              @input="$emit('update', 'bankName', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAddress"
              :label="$t('companyDetail.label.bankAddress')"
              :placeholder="$t('companyDetail.placeholder.bankAddress')"
              @input="$emit('update', 'bankAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.accountNumber"
              :label="$t('companyDetail.label.bankAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              @input="$emit('update', 'accountNumber', $event)"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.swift"
              :label="$t('companyDetail.label.swift')"
              :placeholder="$t('companyDetail.placeholder.swift')"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="$emit('update', 'swift', $event)"
            />
            <TextField
              :label="$t('companyDetail.label.bic')"
              :placeholder="$t('companyDetail.placeholder.bic')"
              class="flex-grow"
              disabled
            />
          </div>
          <div class="pb-2">
            <TextField
              :label="$t('companyDetail.label.correspondentBankName')"
              :placeholder="$t('companyDetail.placeholder.correspondentBankName')"
              disabled
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <TextField
              :label="$t('companyDetail.label.correspondentAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              class="pb-2"
              disabled
            />
            <div class="lg:pb-20 mr-10" />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.workPhone"
              :label="$t('companyDetail.label.phone')"
              :placeholder="$t('companyDetail.placeholder.phone')"
              class="w-1/2 pr-2"
              @input="$emit('update', 'workPhone', $event)"
            />
            <TextField
              :value="item.fax"
              :label="$t('companyDetail.label.fax')"
              :placeholder="$t('companyDetail.placeholder.phone')"
              class="w-1/2 pl-2"
              @input="$emit('update', 'fax', $event)"
            />
          </div>
          <div>
            <TextField
              :value="item.website"
              :label="$t('companyDetail.label.site')"
              :placeholder="$t('companyDetail.placeholder.site')"
              @input="$emit('update', 'website', $event)"
            />
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'SupplierDetail',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      expanded: true,
    }
  },
  computed: {
    titleHint () {
      return ` ${this.$t('companyDetail.supplierDetailDesc')}`
    },
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
