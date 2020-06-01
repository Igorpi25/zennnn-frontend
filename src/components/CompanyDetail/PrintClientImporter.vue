<template>
  <div ref="container" class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2">
        <TextField
          :value="item.importerCompanyName"
          :label="$t('companyDetail.label.consignee')"
          :placeholder="$t('companyDetail.placeholder.consignee')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          required
          @input="updateData({ 'importerCompanyName': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.deliveryAddress"
          :label="$t('companyDetail.label.legalAddress')"
          :placeholder="$t('companyDetail.placeholder.address')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          required
          @input="updateData({ deliveryAddress: $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          :value="contactPerson.firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          lazy-validation
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
          :disabled="disabled"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          lazy-validation
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
          :value="item.importerPhone"
          :locale="item.locale"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :lazy="create"
          lazy-validation
          state-icon
          required
          class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-sm"
          @input="updateData({ 'importerPhone': $event })"
        />
        <!-- <TextField
          :value="item.phoneOption"
          :label="$t('companyDetail.label.phoneOption')"
          :placeholder="$t('companyDetail.placeholder.phoneOption')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @input="updateData({ 'phoneOption': $event })"
        /> -->
      </div>
      <!-- <div class="pb-2">
        <PhoneInput
          :value="item.fax"
          :locale="item.locale"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :lazy="create"
          state-icon
          state-color="none"
          lazy-validation
          required
          class="sm:w-4/6 max-w-xs sm:pr-sm"
          @input="updateData({ 'fax': $event })"
        />
      </div> -->
      <div class="pb-2">
        <TextField
          :value="item.importerEmail"
          :label="$t('companyDetail.label.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :readonly="readonly"
          :disabled="disabled"
          :rules="[rules.email]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          required
          @input="updateData({ 'importerEmail': $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import companyDetail from '../../mixins/clientDetail'

export default {
  name: 'PrintClientImporter',
  mixins: [companyDetail],
  props: {
    readonly: Boolean,
    disabled: Boolean,
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
      itemLazy: {},
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
      return this.item.importerContactPerson || {}
    },
  },
  watch: {
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
    updateContactPerson (personInput) {
      const value = Object.assign({}, {
        firstName: this.contactPerson.firstName,
        lastName: this.contactPerson.lastName,
      }, personInput)
      const input = { 'importerContactPerson': value }
      this.updateData(input)
    },
  },
}
</script>
