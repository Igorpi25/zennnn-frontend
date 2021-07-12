<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.shippingInfo') }}
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
      <div v-show="expanded" :class="['pt-4', { 'lg:flex': isRequisite }]">
        <div :class="{ 'lg:w-1/2 lg:pr-5': isRequisite }">
          <div class="pb-2">
            <TextField
              :model-value="consignee"
              :label="$t('companyDetail.label.consignee')"
              :placeholder="$t('companyDetail.placeholder.consignee')"
              :loading="loading"
              readonly
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.deliveryAddress"
              :label="$t('companyDetail.label.deliveryAddress')"
              :placeholder="$t('companyDetail.placeholder.deliveryAddress')"
              :loading="loading"
              :disabled="isDeliveryAddressMatch"
              :rules="compRules"
              :state-icon="true"
              :state-error-color="hasStateIcon ? 'warn' : 'none'"
              :debounce="500"
              :lazy="create"
              @update:model-value="updateData({ deliveryAddress: $event })"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :model-value="item.deliveryAddressPostcode"
                :label="$t('companyDetail.label.deliveryAddressPostcode')"
                :placeholder="$t('companyDetail.placeholder.postcode')"
                :loading="loading"
                :disabled="isDeliveryAddressMatch"
                :rules="compRules"
                :state-icon="true"
                :state-error-color="hasStateIcon ? 'warn' : 'none'"
                :debounce="500"
                :lazy="create"
                class="w-48 pb-2"
                @update:model-value="
                  updateData({ deliveryAddressPostcode: $event })
                "
              />
              <div class="relative flex-shrink-0 pl-2.5">
                <label
                  class="
                    absolute
                    top-0
                    right-0
                    block
                    text-base text-gray-100
                    whitespace-nowrap
                    leading-5
                    py-2
                  "
                >
                  {{ $t('companyDetail.label.matches') }}
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <Switch
                    :model-value="isDeliveryAddressMatch"
                    @update:model-value="updateDeliveryAddressMatch"
                  />
                </div>
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div
                class="lg:absolute text-sm text-gray-200 leading-tight pl-2.5"
              >
                {{ $t('companyDetail.hint.deliveryAddress') }}
              </div>
            </div>
          </div>
        </div>
        <div :class="{ 'lg:w-1/2 lg:pl-5': isRequisite }">
          <div class="flex items-end pb-2">
            <TextField
              :model-value="importerContactPerson.firstName"
              :label="$t('companyDetail.label.contactPerson')"
              :placeholder="$t('companyDetail.label.firstName')"
              :loading="loading"
              :rules="compRules"
              :state-icon="true"
              :state-error-color="hasStateIcon ? 'warn' : 'none'"
              :debounce="500"
              :lazy="create"
              label-no-wrap
              class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
              @update:model-value="updateContactPerson({ firstName: $event })"
            />
            <TextField
              :model-value="importerContactPerson.lastName"
              :placeholder="$t('companyDetail.label.lastName')"
              :loading="loading"
              :rules="compRules"
              :state-icon="true"
              :state-error-color="hasStateIcon ? 'warn' : 'none'"
              :debounce="500"
              :lazy="create"
              class="flex-grow"
              @update:model-value="updateContactPerson({ lastName: $event })"
            />
          </div>
          <div>
            <Phone
              :model-value="item.importerMobilePhone"
              :locale="item.locale"
              :label="$t('companyDetail.label.mobilePhone')"
              :loading="loading"
              :state-error-color="hasStateIcon ? 'warn' : 'none'"
              :state-icon="true"
              :lazy="create"
              required
              @update:model-value="updateData({ importerMobilePhone: $event })"
            />
          </div>
          <div class="pt-10">
            <Alert
              v-if="isRequisite"
              :model-value="true"
              :close="false"
              color="warn"
              icon-class="items-start"
              max-width="none"
            >
              {{ $t('companyDetail.hint.companyLocale') }}
            </Alert>
          </div>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { ziChevronRight } from '@zennnn/icons'
import { Icon, Alert, Switch, TextField, ExpandTransition } from '@zennnn/core'

import clientDetail from '../../mixins/clientDetail'

import Phone from '../Phone'

export default {
  name: 'ShippingInfo',
  components: {
    Icon,
    Alert,
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
    isPrivate: Boolean,
    isRequisite: Boolean,
  },
  data() {
    return {
      isDeliveryAddressMatchLazy: false,
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
      },
      icons: {
        ziChevronRight,
      },
    }
  },
  computed: {
    consignee() {
      return this.item.companyNameLocal || this.item.companyName
    },
    hasStateIcon() {
      return !(this.isPrivate || this.isRequisite)
    },
    isDeliveryAddressMatch: {
      get() {
        return this.isDeliveryAddressMatchLazy
      },
      set(val) {
        this.isDeliveryAddressMatchLazy = val
      },
    },
    compRules() {
      return [this.rules.required]
    },
    importerContactPerson() {
      return this.item.importerContactPerson || {}
    },
  },
  watch: {
    'item.isDeliveryAddressMatch'(val) {
      this.isDeliveryAddressMatchLazy = val
    },
  },
  methods: {
    updateDeliveryAddressMatch(val) {
      this.isDeliveryAddressMatch = val
      const input = { isDeliveryAddressMatch: val }
      this.updateData(input)
    },
    updateContactPerson(personInput) {
      const value = Object.assign(
        {},
        {
          firstName: this.importerContactPerson.firstName,
          lastName: this.importerContactPerson.lastName,
        },
        personInput
      )
      const input = { importerContactPerson: value }
      this.updateData(input)
    },
  },
}
</script>
