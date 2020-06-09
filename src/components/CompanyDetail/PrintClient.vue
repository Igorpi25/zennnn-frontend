<template>
  <div ref="container" class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2">
        <Select
          :value="item"
          :menu-attach="$refs.container"
          :label="$t('clients.companyName')"
          :placeholder="$t('shipping.clientNotSetted')"
          :search.sync="search"
          :items="clients"
          :rules="[rules.required]"
          searchable
          item-value="id"
          item-text="fullName"
          hide-no-data
          state-icon
          required
          @input="$emit('select-client', $event)"
          @click:prepend-item="$emit('create-client', $event)"
        >
          <template v-slot:prepend-item>
            <span class="flex jusitfy-center text-blue-500">
              <i class="zi-plus-outline text-2xl mr-2" />
              <span>{{ $t('shipping.clientAddCreateAndAttach') }}</span>
            </span>
          </template>
          <template v-slot:item="{ item }">
            <span v-if="item.companyName" class="text-white">
              <span>{{ item.companyName }}</span>
              <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">{{ getClientType(item.clientType) }}</span>
            </span>
            <span v-else class="flex items-center text-gray-200">
              <span>{{ $t('shipping.clientAddNoData') }}</span>
              <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">{{ getClientType(item.clientType) }}</span>
              <span class="text-white ml-2">{{ item.uid }}</span>
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
          state-icon
          required
          @input="updateData({ legalAddress: $event })"
        />
        </div>
      <div class="flex items-end pb-2">
        <TextField
          :value="contactPerson.firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :debounce="500"
          state-icon
          required
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          @input="updateContactPerson({ firstName: $event })"
        />
        <TextField
          :value="contactPerson.lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :readonly="readonly"
          :rules="[rules.required]"
          :debounce="500"
          state-icon
          required
          class="flex-grow"
          @input="updateContactPerson({ lastName: $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="flex flex-wrap lg:flex-no-wrap pb-2">
        <PhoneInput
          :value="item.phone"
          :locale="item.locale"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :readonly="readonly"
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @input="updateData({ 'phoneOption': $event })"
        />
      </div>
      <div class="pb-2">
        <PhoneInput
          :value="item.fax"
          :locale="item.locale"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :readonly="readonly"
          state-icon
          state-color="none"
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
          state-icon
          required
          @input="updateData({ 'email': $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import companyDetail from '../../mixins/clientDetail'
import { ClientType } from '../../graphql/enums'

export default {
  name: 'PrintClient',
  mixins: [companyDetail],
  props: {
    readonly: Boolean,
    client: {
      type: Object,
      default: () => ({}),
    },
    clients: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      lazyItem: {},
      search: '',
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => (v && /.+@.+\..+/.test(v)) || this.$t('rule.email'),
      },
    }
  },
  computed: {
    item: {
      get () {
        return this.lazyItem || {}
      },
      set (val) {
        this.lazyItem = val
      },
    },
    contactPerson () {
      return this.item.contactPerson || {}
    },
  },
  watch: {
    search (val) {
      this.$emit('update:search', val)
    },
    client: {
      handler (val) {
        setTimeout(() => {
          this.lazyItem = val
        }, 100)
      },
      immediate: true,
    },
  },
  methods: {
    getClientType (type) {
      switch (type) {
        case ClientType.LEGAL: return this.$t('shipping.legalPerson')
        case ClientType.PRIVATE: return this.$t('shipping.privatePerson')
        case ClientType.OTHER: return this.$t('shipping.otherPerson')
      }
    },
    updateContactPerson (personInput) {
      const value = Object.assign({}, {
        firstName: this.contactPerson.firstName,
        lastName: this.contactPerson.lastName,
      }, personInput)
      const input = { contactPerson: value }
      this.updateData(input)
    },
  },
}
</script>
