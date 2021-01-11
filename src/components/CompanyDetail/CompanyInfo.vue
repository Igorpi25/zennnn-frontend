<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :model-value="item.companyName"
            :label="$t('companyDetail.label.companyName')"
            :placeholder="$t('companyDetail.placeholder.companyName')"
            :loading="loading"
            :rules="[v => !!v || this.$t('companyDetail.rule.companyName')]"
            :debounce="500"
            :lazy="create"
            state-icon
            required
            class="pb-2 flex-grow"
            @update:model-value="updateCompanyName"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
              {{ $t('companyDetail.label.englishOnly') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <Switch
                :model-value="isCompanyNameMatch"
                @update:model-value="updateCompanyNameMatch"
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
          :model-value="item.companyNameLocal"
          :label="$t('companyDetail.label.companyNameLocal')"
          :placeholder="$t('companyDetail.placeholder.companyNameLocal')"
          :loading="loading"
          :disabled="isCompanyNameMatch"
          :rules="[v => !!v || this.$t('companyDetail.rule.companyNameLocal')]"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          @update:model-value="updateData({ 'companyNameLocal': $event })"
        />
      </div>
      <div class="relative h-56 pt-9 mb-7">
        <div class="absolute pin-t inset-x">
          <Alert
            :model-value="true"
            :close="false"
            color="warn"
            info-icon-class="items-start"
            max-width="none"
          >
            {{ $t('companyDetail.hint.companyNameLocal') }}
          </Alert>
        </div>
      </div>
      <div class="flex flex-wrap lg:flex-nowrap pb-2">
        <Phone
          :model-value="item.phone"
          :locale="item.locale"
          :label="$t('companyDetail.label.phone')"
          :loading="loading"
          :lazy="create"
          state-icon
          required
          class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-sm"
          @update:model-value="updateData({ 'phone': $event })"
        />
        <TextField
          :model-value="item.phoneOption"
          :label="$t('companyDetail.label.phoneOption')"
          :placeholder="$t('companyDetail.placeholder.phoneOption')"
          :loading="loading"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="w-full sm:w-auto lg:w-full max-w-xs"
          @update:model-value="updateData({ 'phoneOption': $event })"
        />
      </div>
      <div class="pb-2">
        <Phone
          :model-value="item.fax"
          :locale="item.locale"
          :label="$t('companyDetail.label.fax')"
          :loading="loading"
          :lazy="create"
          state-icon
          state-error-color="none"
          required
          class="sm:w-4/6 max-w-xs sm:pr-sm"
          @update:model-value="updateData({ 'fax': $event })"
        />
      </div>
      <div>
        <TextField
          :model-value="item.website"
          :label="$t('companyDetail.label.site')"
          :placeholder="$t('companyDetail.placeholder.site')"
          :loading="loading"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          required
          @update:model-value="updateData({ 'website': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.email"
          :label="$t('companyDetail.label.email')"
          :label-hint="$t('companyDetail.hint.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :rules="[rules.email]"
          :debounce="500"
          :lazy="create"
          state-icon
          state-error-color="warn"
          required
          @update:model-value="updateData({ 'email': $event })"
        />
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          :model-value="item.vat"
          :label="$t('companyDetail.label.vat')"
          :placeholder="$t('companyDetail.placeholder.vat')"
          :loading="loading"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          state-icon
          state-error-color="warn"
          @update:model-value="updateData({ 'vat': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.legalAddress"
          :label="$t('companyDetail.label.legalAddress')"
          :placeholder="$t('companyDetail.placeholder.address')"
          :loading="loading"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          @update:model-value="updateLegalAddress"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.legalAddressPostcode"
          :label="$t('companyDetail.label.legalAddressPostcode')"
          :placeholder="$t('companyDetail.placeholder.postcode')"
          :loading="loading"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          state-icon
          label-no-wrap
          class="w-48"
          @update:model-value="updateLegalAddressPostcode"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.mailingAddress"
          :label="$t('companyDetail.label.mailingAddress')"
          :placeholder="$t('companyDetail.placeholder.address')"
          :loading="loading"
          :disabled="isMailingAddressMatch"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updateMailingAddress"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <div class="flex justify-between">
          <TextField
            :model-value="item.mailingAddressPostcode"
            :label="$t('companyDetail.label.mailingAddressPostcode')"
            :placeholder="$t('companyDetail.placeholder.postcode')"
            :loading="loading"
            :disabled="isMailingAddressMatch"
            :debounce="500"
            :lazy="create"
            :rules="[rules.required]"
            state-icon
            state-error-color="none"
            label-no-wrap
            class="w-48 pb-2"
            @update:model-value="updateMailingAddressPostcode"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
              {{ $t('companyDetail.label.matches') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <Switch
                :model-value="isMailingAddressMatch"
                @update:model-value="updateMailingAddressMatch"
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
          :model-value="item.iec"
          :label="$t('companyDetail.label.iec')"
          :placeholder="$t('companyDetail.placeholder.iec')"
          :loading="loading"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
          @update:model-value="updateData({ 'iec': $event })"
        />
        <TextField
          :model-value="item.okpo"
          :label="$t('companyDetail.label.okpo')"
          :placeholder="$t('companyDetail.placeholder.okpo')"
          :loading="loading"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="flex-grow"
          @update:model-value="updateData({ 'okpo': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="item.psrn"
          :label="$t('companyDetail.label.psrn')"
          :placeholder="$t('companyDetail.placeholder.psrn')"
          :loading="loading"
          :debounce="500"
          :lazy="create"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updateData({ 'psrn': $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <div class="h-10 flex-shrink-0 flex items-center pl-sm pr-3">
          <Radio
            v-model="ownerNameValue"
            name="owner-name"
            label="given-family"
            value="given-family"
            hide-details
            @update:model-value="updateCompanyOwnerType(false, 'given-name-input')"
          />
        </div>
        <TextField
          ref="given-name-input"
          :model-value="companyOwner.firstName"
          :label="$t('companyDetail.label.ownerFullName')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :disabled="isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          label-no-wrap
          state-icon
          required
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          @update:model-value="updateCompanyOwner({ firstName: $event })"
        />
        <TextField
          :model-value="companyOwner.lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :disabled="isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          class="flex-grow"
          state-icon
          required
          @update:model-value="updateCompanyOwner({ lastName: $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <div class="h-10 flex-shrink-0 flex items-center pl-sm pr-3">
          <Radio
            v-model="ownerNameValue"
            name="owner-name"
            label="name"
            value="name"
            hide-details
            @update:model-value="updateCompanyOwnerType(true, 'name-input')"
          />
        </div>
        <TextField
          ref="name-input"
          :model-value="companyOwner.name"
          :label="$t('companyDetail.label.ownerFullNameAlt')"
          :placeholder="$t('companyDetail.placeholder.ownerFullNameAlt')"
          :loading="loading"
          :disabled="!isOwnerName"
          :rules="[rules.required]"
          :debounce="500"
          :lazy="create"
          label-no-wrap
          state-icon
          required
          class="w-full"
          @update:model-value="updateCompanyOwner({ name: $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import companyDetail from '../../mixins/clientDetail'

import Alert from '../Base/Alert'
import Radio from '../Base/Radio'
import Switch from '../Base/Switch'
import TextField from '../Base/TextField'
import Phone from '../Phone.vue'

export default {
  name: 'CompanyInfo',
  components: {
    Alert,
    Radio,
    Switch,
    TextField,
    Phone,
  },
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
      // TODO: !!!
      if (!!val === !!this.isCompanyNameMatch) return
      this.isCompanyNameMatch = val
      const input = { isCompanyNameMatch: val }
      this.updateData(input)
    },
    updateCompanyName (val) {
      const input = { companyName: val }
      this.updateData(input)
    },
    updateMailingAddressMatch (val) {
      // TODO: !!!
      if (!!val === !!this.isMailingAddressMatch) return
      this.isMailingAddressMatch = val
      const input = { isMailingAddressMatch: val }
      this.updateData(input)
    },
    updateLegalAddress (val) {
      const input = { legalAddress: val }
      this.updateData(input)
    },
    updateLegalAddressPostcode (val) {
      const input = { legalAddressPostcode: val }
      this.updateData(input)
    },
    updateMailingAddress (val) {
      const input = { mailingAddress: val }
      this.updateData(input)
    },
    updateMailingAddressPostcode (val) {
      const input = { mailingAddressPostcode: val }
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
