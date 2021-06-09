<template>
  <div ref="container" class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2">
        <Select
          :model-value="item"
          :attach="$refs.container"
          :label="$t('clients.companyName')"
          :placeholder="$t('shipping.clientNotSetted')"
          v-model:search="search"
          :items="clients"
          :rules="[rules.required]"
          :hide-details="false"
          searchable
          item-value="id"
          item-text="fullName"
          state-icon
          required
          @update:model-value="$emit('select-client', $event)"
          @click:prepend-item="$emit('create-client', $event)"
        >
          <template v-slot:prepend-item>
            <span class="flex jusitfy-center text-blue-500">
              <Icon class="mr-2">
                {{ icons.ziPlusOutline }}
              </Icon>
              <span>{{ $t('shipping.clientAddCreateAndAttach') }}</span>
            </span>
          </template>
          <template v-slot:item="{ item }">
            <span v-if="item.companyName" class="text-white">
              <span>{{ item.companyName }}</span>
              <span
                class="
                  text-gray-100
                  bg-gray-400
                  rounded-lg
                  h-6
                  leading-6
                  inline-block
                  ml-2
                  px-1
                "
                >{{ getClientType(item.clientType) }}</span
              >
            </span>
            <span v-else class="flex items-center text-gray-200">
              <span>{{ $t('shipping.clientAddNoData') }}</span>
              <span
                class="
                  text-gray-100
                  bg-gray-400
                  rounded-lg
                  h-6
                  leading-6
                  inline-block
                  ml-2
                  px-1
                "
                >{{ getClientType(item.clientType) }}</span
              >
              <span class="text-white ml-2">{{ item.uid }}</span>
              <span class="text-pink-500 ml-2">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
          state-icon
          required
          @update:model-value="updateData({ legalAddress: $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          :model-value="contactPerson.firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :hide-details="false"
          :debounce="500"
          state-icon
          required
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
          @update:model-value="updateContactPerson({ firstName: $event })"
        />
        <TextField
          :model-value="contactPerson.lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :hide-details="false"
          :debounce="500"
          state-icon
          required
          class="flex-grow"
          @update:model-value="updateContactPerson({ lastName: $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="flex flex-wrap lg:flex-nowrap pb-2">
        <Phone
          :model-value="item.phone"
          :locale="item.locale"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :readonly="readonly"
          state-icon
          required
          class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-2.5"
          @update:model-value="updateData({ phone: $event })"
        />
        <TextField
          :model-value="item.phoneOption"
          :label="$t('companyDetail.label.phoneOption')"
          :placeholder="$t('companyDetail.placeholder.phoneOption')"
          :loading="loading"
          :readonly="readonly"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @update:model-value="updateData({ phoneOption: $event })"
        />
      </div>
      <div class="pb-2">
        <Phone
          :model-value="item.fax"
          :locale="item.locale"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :readonly="readonly"
          state-icon
          state-error-color="none"
          required
          class="sm:w-4/6 max-w-xs sm:pr-2.5"
          @update:model-value="updateData({ fax: $event })"
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
          state-icon
          required
          @update:model-value="updateData({ email: $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ziPlusOutline } from '@zennnn/icons'
import { Icon, TextField, Select } from '@zennnn/core'

import clientDetail from '../../mixins/clientDetail'

import { ClientType } from '../../graphql/enums'

import Phone from '../Phone.vue'

export default {
  name: 'PrintClient',
  components: {
    Icon,
    TextField,
    Select,
    Phone,
  },
  mixins: [clientDetail],
  props: {
    readonly: Boolean,
    client: {
      type: Object,
      default: () => ({}),
    },
    clients: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['select-client', 'create-client', 'update:search'],
  data() {
    return {
      lazyItem: {},
      search: '',
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
        email: (v) => (v && /.+@.+\..+/.test(v)) || this.$t('rule.email'),
      },
      icons: {
        ziPlusOutline,
      },
    }
  },
  computed: {
    item: {
      get() {
        return this.lazyItem || {}
      },
      set(val) {
        this.lazyItem = val
      },
    },
    contactPerson() {
      return this.item.contactPerson || {}
    },
  },
  watch: {
    search(val) {
      this.$emit('update:search', val)
    },
    client: {
      handler(val) {
        setTimeout(() => {
          this.lazyItem = val
        }, 100)
      },
      immediate: true,
    },
  },
  methods: {
    getClientType(type) {
      switch (type) {
        case ClientType.LEGAL:
          return this.$t('shipping.legalPerson')
        case ClientType.PRIVATE:
          return this.$t('shipping.privatePerson')
        case ClientType.OTHER:
          return this.$t('shipping.otherPerson')
      }
    },
    updateContactPerson(personInput) {
      const value = Object.assign(
        {},
        {
          firstName: this.contactPerson.firstName,
          lastName: this.contactPerson.lastName,
        },
        personInput
      )
      const input = { contactPerson: value }
      this.updateData(input)
    },
  },
}
</script>
