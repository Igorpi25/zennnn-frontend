<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          v-model="firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :rules="[rules.required]"
          lazy
          lazy-validation
          state-icon
          required
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
        />
        <TextField
          v-model="lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :rules="[rules.required]"
          lazy
          lazy-validation
          state-icon
          required
          class="flex-grow"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.mobilePhone"
          :label="$t('companyDetail.label.mobilePhone')"
          :label-hint="$t('companyDetail.hint.mobilePhone')"
          :placeholder="$t('companyDetail.placeholder.mobilePhone')"
          :loading="loading"
          :rules="[rules.required]"
          lazy
          lazy-validation
          state-icon
          required
          @input="$emit('update', 'mobilePhone', $event)"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.email"
          :label="$t('companyDetail.label.email')"
          :label-hint="$t('companyDetail.hint.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          :loading="loading"
          :rules="[rules.required, rules.email]"
          lazy
          lazy-validation
          state-icon
          required
          @input="$emit('update', 'email', $event)"
        />
      </div>
      <div>
        <Select
          :value="item.locale"
          :items="locales"
          :label="$t('companyDetail.label.locale')"
          :placeholder="$t('companyDetail.placeholder.locale')"
          :loading="loading"
          :rules="[rules.required]"
          lazy-validation
          state-icon
          required
          item-value="value"
          item-text="text"
          class="pb-2"
          @input="$emit('update', 'locale', $event)"
        />
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ localeSelectHint }}
        </div>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :value="item.companyName"
            :label="$t('companyDetail.label.companyName')"
            :placeholder="$t('companyDetail.placeholder.companyName')"
            :loading="loading"
            :rules="[rules.required]"
            lazy
            lazy-validation
            state-icon
            required
            class="pb-2 flex-grow"
            @input="$emit('update', 'companyName', $event)"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              {{ $t('companyDetail.label.englishOnly') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput
                :value="item.isCompanyNameMatch"
                hide-details
                @input="$emit('update', 'isCompanyNameMatch', $event)"
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
          :disabled="item.isCompanyNameMatch"
          :rules="[rules.required]"
          lazy
          lazy-validation
          state-icon
          required
          @input="$emit('update', 'companyNameLocal', $event)"
        />
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          {{ $t('companyDetail.label.ucn') }}
        </label>
        <div class="h-10 flex items-center text-white mb-2 px-sm">
          {{ item.uid || uid || uidPlaceholder }}
        </div>
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ uidHint }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LOCALES_LIST } from '../../config/globals'

export default {
  name: 'LegalInfo',
  props: {
    loading: Boolean,
    uid: String,
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
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
      },
    }
  },
  computed: {
    firstName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.firstName
      },
      set (val) {
        const person = Object.assign({}, this.item.contactPerson, { firstName: val })
        this.$emit('update', 'contactPerson', person)
      },
    },
    lastName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.lastName
      },
      set (val) {
        const person = Object.assign({}, this.item.contactPerson, { lastName: val })
        this.$emit('update', 'contactPerson', person)
      },
    },
    locales () {
      return LOCALES_LIST
    },
    localeSelectHint () {
      return this.isSupplier
        ? this.$t('companyDetail.hint.supplierLocale')
        : this.$t('companyDetail.hint.clientLocale')
    },
    uidHint () {
      return this.isSupplier
        ? this.$t('companyDetail.hint.usn')
        : this.$t('companyDetail.hint.ucn')
    },
    uidPlaceholder () {
      return this.isSupplier ? 'Z00001' : 'A00001'
    },
  },
  watch: {
    'item.companyName' (val) {
      if (this.item.isCompanyNameMatch) {
        this.$emit('update', 'companyNameLocal', val)
      }
    },
    'item.isCompanyNameMatch' (val) {
      if (val) {
        this.$emit('update', 'companyNameLocal', this.item.companyName)
      }
    },
  },
}
</script>
