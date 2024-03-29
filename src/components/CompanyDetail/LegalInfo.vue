<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          :value="contactPerson.firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :rules="[v => !!v || this.$t('companyDetail.rule.contactPersonFirstName')]"
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
          :rules="[v => !!v || this.$t('companyDetail.rule.contactPersonLastName')]"
          :debounce="500"
          :lazy="create"
          lazy-validation
          state-icon
          required
          class="flex-grow"
          @input="updateContactPerson({ lastName: $event })"
        />
      </div>
      <div class="pb-2">
        <PhoneInput
          :value="item.mobilePhone"
          :locale="item.locale"
          :label="$t('companyDetail.label.mobilePhone')"
          :label-hint="$t('companyDetail.hint.mobilePhone')"
          :rule-message="$t('companyDetail.rule.notificationMobilePhone')"
          :loading="loading"
          :lazy="create"
          lazy-validation
          state-icon
          required
          @input="updateData({ 'mobilePhone': $event })"
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
          required
          @input="updateData({ 'email': $event })"
        />
      </div>
      <div>
        <Select
          :value="item.locale"
          :items="locales"
          :label="$t('companyDetail.label.locale')"
          :placeholder="$t('companyDetail.placeholder.locale')"
          :loading="loading"
          :rules="[v => !!v || this.$t('companyDetail.rule.locale')]"
          lazy-validation
          state-icon
          required
          item-value="value"
          item-text="text"
          class="pb-2"
          prepend-slot-class="w-auto pl-2"
          @input="updateData({ 'locale': $event })"
        >
          <template v-slot:prepend>
            <img
              v-if="item.locale"
              :src="require(`@/assets/img/flags/round/${item.locale}.svg`)"
              :alt="item.locale"
              class="h-6 w-6 rounded-full mr-4"
            >
            <img
              v-else
              src="@/assets/icons/earth.svg"
              class="h-6 w-6 rounded-full mr-4"
            >
          </template>
          <template v-slot:item="{ item }">
            <img
              :src="require(`@/assets/img/flags/round/${item.value}.svg`)"
              :alt="item.text"
              class="h-6 w-6 rounded-full mr-4"
            >
            <span>{{ item.text }}</span>
          </template>
        </Select>
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
import companyDetail from '../../mixins/clientDetail'

export default {
  name: 'LegalInfo',
  mixins: [companyDetail],
  props: {
    uid: String,
    item: {
      type: Object,
      default: () => ({}),
    },
    isSupplier: Boolean,
  },
  data () {
    return {
      isCompanyNameMatchLazy: false,
      rules: {
        email: v => (v && /.+@.+\..+/.test(v)) || this.$t('companyDetail.rule.notificationEmail'),
      },
    }
  },
  computed: {
    isCompanyNameMatch: {
      get () {
        return this.isCompanyNameMatchLazy
      },
      set (val) {
        this.isCompanyNameMatchLazy = val
      },
    },
    contactPerson () {
      return this.item.contactPerson || {}
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
    'item.isCompanyNameMatch' (val) {
      this.isCompanyNameMatchLazy = val
    },
  },
  methods: {
    updateCompanyNameMatch (val) {
      this.isCompanyNameMatch = val
      const input = { isCompanyNameMatch: val }
      this.updateData(input)
    },
    updateCompanyName (val) {
      const input = { companyName: val }
      this.updateData(input)
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
