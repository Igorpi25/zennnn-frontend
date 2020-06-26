<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :value="item.companyName"
            :label="$t('companyDetail.label.companyName')"
            :placeholder="$t('companyDetail.placeholder.companyName')"
            :loading="loading"
            :rules="[v => !!v || this.$t('companyDetail.rule.companyName')]"
            :debounce="500"
            :lazy="create"
            lazy-validation
            state-icon
            required
            class="pb-2 flex-grow"
            @input="updateCompanyName"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              {{ $t('companyDetail.label.englishOnly') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput
                :value="isCompanyNameMatch"
                hide-details
                @input="updateCompanyNameMatch"
              />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.companyName') }}
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          :value="item.companyNameLocal"
          :label="$t('companyDetail.label.companyNameLocal')"
          :placeholder="$t('companyDetail.placeholder.companyNameLocal')"
          :loading="loading"
          :disabled="isCompanyNameMatch"
          :rules="[v => !!v || this.$t('companyDetail.rule.companyNameLocal')]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          required
          @input="updateData({ 'companyNameLocal': $event })"
        />
      </div>
      <div class="relative h-56 pt-9 mb-7">
        <div class="absolute pin-t inset-x">
          <Alert
            :value="true"
            :close="false"
            color="warn"
            max-width="none"
          >
            {{ $t('companyDetail.hint.companyNameLocal') }}
          </Alert>
        </div>
      </div>
      <div class="flex flex-wrap lg:flex-no-wrap pb-2">
        <PhoneInput
          :value="item.phone"
          :locale="item.locale"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :lazy="create"
          lazy-validation
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
          :debounce="500"
          :lazy="create"
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
          :lazy="create"
          state-icon
          state-color="none"
          lazy-validation
          required
          class="sm:w-4/6 max-w-xs sm:pr-sm"
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
          required
          @input="updateData({ 'website': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.email"
          :label="$t('companyDetail.label.email')"
          :label-hint="$t('companyDetail.hint.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :rules="[rules.email]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          state-color="warn"
          required
          @input="updateData({ 'email': $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          :value="item.vat"
          :label="$t('companyDetail.label.vat')"
          :placeholder="$t('companyDetail.placeholder.vat')"
          :loading="loading"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          state-color="warn"
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
          required
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
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
            :rules="[rules.required]"
            state-icon
            state-color="none"
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
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
          :rules="[rules.required]"
          state-icon
          state-color="none"
          @input="updateData({ 'psrn': $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <div class="h-10 flex-shrink-0 flex items-center pl-sm pr-3">
          <RadioInput
            v-model="ownerNameValue"
            name="owner-name"
            label="given-family"
            value="given-family"
            hide-details
            @input="updateCompanyOwnerType(false, 'given-name-input')"
          />
        </div>
        <TextField
          ref="given-name-input"
          :value="companyOwner.firstName"
          :label="$t('companyDetail.label.ownerFullName')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :disabled="isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          label-no-wrap
          lazy-validation
          state-icon
          required
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          @input="updateCompanyOwner({ firstName: $event })"
        />
        <TextField
          :value="companyOwner.lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :disabled="isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          class="flex-grow"
          lazy-validation
          state-icon
          required
          @input="updateCompanyOwner({ lastName: $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <div class="h-10 flex-shrink-0 flex items-center pl-sm pr-3">
          <RadioInput
            v-model="ownerNameValue"
            name="owner-name"
            label="name"
            value="name"
            hide-details
            @input="updateCompanyOwnerType(true, 'name-input')"
          />
        </div>
        <TextField
          ref="name-input"
          :value="companyOwner.name"
          :label="$t('companyDetail.label.ownerFullNameAlt')"
          :placeholder="$t('companyDetail.placeholder.ownerFullNameAlt')"
          :loading="loading"
          :disabled="!isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          label-no-wrap
          lazy-validation
          state-icon
          required
          class="w-full"
          @input="updateCompanyOwner({ name: $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import companyDetail from '../../mixins/clientDetail'

export default {
  name: 'CompanyInfo',
  mixins: [companyDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      ownerNameValue: 'given-family',
      isCompanyNameMatchLazy: false,
      isMailingAddressMatchLazy: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => (v && /.+@.+\..+/.test(v)) || this.$t('companyDetail.rule.notificationEmail'),
      },
    }
  },
  computed: {
    isOwnerName () {
      return this.ownerNameValue === 'name'
    },
    isCompanyNameMatch: {
      get () {
        return this.isCompanyNameMatchLazy
      },
      set (val) {
        this.isCompanyNameMatchLazy = val
      },
    },
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
  },
  watch: {
    'companyOwner.isName' (val) {
      this.ownerNameValue = val ? 'name' : 'given-family'
    },
    'item.isCompanyNameMatch' (val) {
      this.isCompanyNameMatchLazy = val
    },
    'item.isMailingAddressMatch' (val) {
      this.isMailingAddressMatchLazy = val
    },
  },
  methods: {
    updateCompanyOwnerType (val, inputRef) {
      this.updateCompanyOwner({ isName: val })
      this.$nextTick(() => {
        this.$refs[inputRef].focus()
      })
    },
    updateCompanyNameMatch (val) {
      this.isCompanyNameMatch = val
      const input = { isCompanyNameMatch: val }
      if (val) {
        input.companyNameLocal = this.item.companyName
      }
      this.updateData(input)
    },
    updateCompanyName (val) {
      const input = { companyName: val }
      if (this.isCompanyNameMatch) {
        input.companyNameLocal = val
      }
      this.updateData(input)
    },
    updateMailingAddressMatch (val) {
      this.isMailingAddressMatch = val
      const input = { isMailingAddressMatch: val }
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
        isName: !!this.companyOwner.isName,
        name: this.companyOwner.name,
        firstName: this.companyOwner.firstName,
        lastName: this.companyOwner.lastName,
      }, personInput)
      const input = { companyOwner: value }
      this.updateData(input)
    },
  },
}
</script>
