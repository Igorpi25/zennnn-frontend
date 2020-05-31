<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.shippingInfo') }}
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
      <div v-show="expanded" :class="['pt-4', { 'lg:flex': isRequisite }]">
        <div :class="{ 'lg:w-1/2 lg:pr-5': isRequisite }">
          <div class="pb-2">
            <TextField
              :value="item.importerCompanyName"
              :label="$t('companyDetail.label.consignee')"
              :placeholder="$t('companyDetail.placeholder.consignee')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              @input="updateData({ 'importerCompanyName': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.deliveryAddress"
              :label="$t('companyDetail.label.deliveryAddress')"
              :placeholder="$t('companyDetail.placeholder.deliveryAddress')"
              :loading="loading"
              :disabled="isDeliveryAddressMatch"
              :rules="compRules"
              :state-icon="hasStateIcon"
              :debounce="500"
              :lazy="create"
              lazy-validation
              @input="updateData({ 'deliveryAddress': $event })"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :value="item.deliveryAddressPostcode"
                :label="$t('companyDetail.label.deliveryAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                :loading="loading"
                :disabled="isDeliveryAddressMatch"
                :rules="compRules"
                :state-icon="hasStateIcon"
                :debounce="500"
                :lazy="create"
                lazy-validation
                class="w-48 pb-2"
                @input="updateData({ 'deliveryAddressPostcode': $event })"
              />
              <div class="relative flex-shrink-0 relative pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <SwitchInput
                    :value="isDeliveryAddressMatch"
                    hide-details
                    @input="updateDeliveryAddressMatch"
                  />
                </div>
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
                {{ $t('companyDetail.hint.deliveryAddress') }}
              </div>
            </div>
          </div>
        </div>
        <div :class="{ 'lg:w-1/2 lg:pl-5': isRequisite }">
          <div class="flex items-end pb-2">
            <TextField
              :value="importerContactPerson.firstName"
              :label="$t('companyDetail.label.contactPerson')"
              :placeholder="$t('companyDetail.label.firstName')"
              :loading="loading"
              :rules="compRules"
              :state-icon="hasStateIcon"
              :debounce="500"
              :lazy="create"
              lazy-validation
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
              @input="updateContactPerson({ firstName: $event })"
            />
            <TextField
              :value="importerContactPerson.lastName"
              :placeholder="$t('companyDetail.label.lastName')"
              :loading="loading"
              :rules="compRules"
              :state-icon="hasStateIcon"
              :debounce="500"
              :lazy="create"
              lazy-validation
              class="flex-grow"
              @input="updateContactPerson({ lastName: $event })"
            />
          </div>
          <div>
            <PhoneInput
              :value="item.importerMobilePhone"
              :locale="item.locale"
              :label="$t('companyDetail.label.mobilePhone')"
              :loading="loading"
              :state-icon="hasStateIcon"
              required
              state-color="warn"
              @input="updateData({ 'importerMobilePhone': $event })"
            />
          </div>
          <div class="pt-10">
            <Alert
              v-if="isRequisite"
              :value="true"
              :close="false"
              color="warn"
              max-width="none"
            >
              {{ $t('companyDetail.hint.companyLocale') }}
            </Alert>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import clientDetail from '../../mixins/clientDetail'

export default {
  name: 'ShippingInfo',
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isPrivate: Boolean,
    isRequisite: Boolean,
  },
  data () {
    return {
      isDeliveryAddressMatchLazy: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    hasStateIcon () {
      return !(this.isPrivate || this.isRequisite)
    },
    isDeliveryAddressMatch: {
      get () {
        return this.isDeliveryAddressMatchLazy
      },
      set (val) {
        this.isDeliveryAddressMatchLazy = val
      },
    },
    compRules () {
      return !this.isPrivate ? [this.rules.required] : undefined
    },
    importerContactPerson () {
      return this.item.importerContactPerson || {}
    },
  },
  watch: {
    'item.isDeliveryAddressMatch' (val) {
      this.isDeliveryAddressMatchLazy = val
    },
  },
  methods: {
    updateDeliveryAddressMatch (val) {
      this.isDeliveryAddressMatch = val
      const input = { 'isDeliveryAddressMatch': val }
      if (val) {
        input.deliveryAddress = this.item.mailingAddress
        input.deliveryAddressPostcode = this.item.mailingAddressPostcode
      }
      this.updateData(input)
    },
    updateContactPerson (personInput) {
      const value = Object.assign({}, {
        firstName: this.importerContactPerson.firstName,
        lastName: this.importerContactPerson.lastName,
      }, personInput)
      const input = { 'importerContactPerson': value }
      this.updateData(input)
    },
  },
}
</script>
