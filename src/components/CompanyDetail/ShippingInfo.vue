<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase" @click="toggleExpand">
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
      <div v-show="expanded" class="pt-4">
        <div class="pb-2">
          <TextField
            :value="item.importerCompanyName"
            :label="$t('companyDetail.label.consignee')"
            :placeholder="$t('companyDetail.placeholder.consignee')"
            :loading="loading"
            lazy
            @input="$emit('update', 'importerCompanyName', $event)"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="item.deliveryAddress"
            :label="$t('companyDetail.label.deliveryAddress')"
            :placeholder="$t('companyDetail.placeholder.deliveryAddress')"
            :loading="loading"
            :disabled="item.isDeliveryAddressMatch"
            :rules="compRules"
            :state-icon="!isPrivate"
            lazy
            lazy-validation
            @input="$emit('update', 'deliveryAddress', $event)"
          />
        </div>
        <div class="pb-2 lg:pb-1">
          <div class="flex justify-between">
            <TextField
              :value="item.deliveryAddressPostcode"
              :label="$t('companyDetail.label.deliveryAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              :loading="loading"
              :disabled="item.isDeliveryAddressMatch"
              :rules="compRules"
              :state-icon="!isPrivate"
              lazy
              lazy-validation
              class="w-48 pb-2"
              @input="$emit('update', 'deliveryAddressPostcode', $event)"
            />
            <div class="relative flex-shrink-0 relative pl-sm">
              <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                {{ $t('companyDetail.label.matches') }}
              </label>
              <div class="h-full flex items-center justify-end pt-8 pb-1">
                <SwitchInput
                  :value="item.isDeliveryAddressMatch"
                  hide-details
                  @input="$emit('update', 'isDeliveryAddressMatch', $event)"
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
        <div class="flex items-end pb-2">
          <TextField
            v-model="firstName"
            :label="$t('companyDetail.label.contactPerson')"
            :placeholder="$t('companyDetail.label.firstName')"
            :loading="loading"
            :rules="compRules"
            :state-icon="!isPrivate"
            lazy
            lazy-validation
            label-no-wrap
            class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          />
          <TextField
            v-model="lastName"
            :placeholder="$t('companyDetail.label.lastName')"
            :loading="loading"
            :rules="compRules"
            :state-icon="!isPrivate"
            lazy
            lazy-validation
            class="flex-grow"
          />
        </div>
        <div>
          <TextField
            :value="item.importerMobilePhone"
            :label="$t('companyDetail.label.mobilePhone')"
            :placeholder="$t('companyDetail.label.mobilePhone')"
            :loading="loading"
            :rules="compRules"
            :state-icon="!isPrivate"
            lazy
            lazy-validation
            @input="$emit('update', 'importerMobilePhone', $event)"
          />
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
    loading: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
    isPrivate: Boolean,
  },
  data () {
    return {
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    compRules () {
      return !this.isPrivate ? [this.rules.required] : undefined
    },
    firstName: {
      get () {
        return this.item.importerContactPerson && this.item.importerContactPerson.firstName
      },
      set (val) {
        const person = Object.assign({}, this.item.importerContactPerson, { firstName: val })
        this.$emit('update', 'importerContactPerson', person)
      },
    },
    lastName: {
      get () {
        return this.item.importerContactPerson && this.item.importerContactPerson.lastName
      },
      set (val) {
        const person = Object.assign({}, this.item.importerContactPerson, { lastName: val })
        this.$emit('update', 'importerContactPerson', person)
      },
    },
  },
  watch: {
    'item.mailingAddress' (val) {
      if (this.item.isDeliveryAddressMatch) {
        this.$emit('update', 'deliveryAddress', val)
      }
    },
    'item.mailingAddressPostcode' (val) {
      if (this.item.isDeliveryAddressMatch) {
        this.$emit('update', 'deliveryAddressPostcode', val)
      }
    },
    'item.isDeliveryAddressMatch' (val) {
      if (val) {
        this.$emit('update', 'deliveryAddress', this.item.mailingAddress)
        this.$emit('update', 'deliveryAddressPostcode', this.item.mailingAddressPostcode)
      }
    },
  },
}
</script>
