<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          v-model="contactFirstName"
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
          v-model="contactLastName"
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
      <div class="pb-2 lg:pb-1">
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
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.clientLocale') }}
          </div>
        </div>
      </div>
      <div class="pb-2 lg:pb-0">
        <Alert
          :value="true"
          :close="false"
          text-color="text-pink-500"
          bg-color="bg-pink-500 bg-opacity-10"
          icon-color="text-pink-500"
          max-width="none"
          class="py-4"
        >
          {{ $t('companyDetail.privacyWarning') }}
        </Alert>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          v-model="firstName"
          :label="$t('companyDetail.label.givenName')"
          :placeholder="$t('companyDetail.placeholder.givenName')"
          :disabled="item.isPersonMatch"
          :loading="loading"
          :rules="[rules.required]"
          lazy
          lazy-validation
          state-icon
          required
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            v-model="lastName"
            :label="$t('companyDetail.label.familyName')"
            :placeholder="$t('companyDetail.placeholder.familyName')"
            :disabled="item.isPersonMatch"
            :loading="loading"
            :rules="[rules.required]"
            lazy
            lazy-validation
            state-icon
            required
            class="pb-2 flex-grow"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              {{ $t('companyDetail.label.matches') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput
                :value="item.isPersonMatch"
                hide-details
                @input="$emit('update', 'isPersonMatch', $event)"
              />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.familyName') }}
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          v-model="middleName"
          :label="$t('companyDetail.label.middleName')"
          :placeholder="$t('companyDetail.placeholder.middleName')"
          lazy
        />
      </div>
      <div class="flex items-end pb-2">
        <DatePicker
          :value="item.birthdate"
          @input="$emit('update', 'birthdate', $event)"
        >
          <template v-slot:activator="{ on }">
            <div v-on="on" class="w-1/2 pr-4">
              <TextField
                :value="item.birthdate ? $d($parseDate(item.birthdate), 'short') : null"
                :label="$t('companyDetail.label.birthdate')"
                :placeholder="$t('companyDetail.placeholder.date')"
                :loading="loading"
                :rules="[rules.required]"
                lazy
                lazy-validation
                state-icon
                label-no-wrap
                readonly
              >
                <template v-slot:prepend>
                  <i class="zi-calendar text-lg" />
                </template>
              </TextField>
            </div>
          </template>
        </DatePicker>
        <div class="w-1/2 pl-4 opacity-40">
          <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
            {{ $t('companyDetail.label.avatar') }}
          </label>
          <div class="h-10 flex justify-start relative pl-12">
            <div class="absolute bottom-0 pl-4">
              <div class="flex items-center justify-center w-14 h-14 border border-gray-200 text-gray-200 bg-gray-400 rounded-full">
                <i class="zi-user text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          {{ $t('companyDetail.label.ucn') }}
        </label>
        <div class="h-10 flex items-center text-white mb-2 px-sm">
          {{ item.uid || uid || 'B00001' }}
        </div>
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ $t('companyDetail.hint.ucn') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LOCALES_LIST } from '../../config/globals'

export default {
  name: 'PrivateInfo',
  props: {
    loading: Boolean,
    uid: String,
    item: {
      type: Object,
      default: () => ({}),
    },
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
    contactFirstName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.firstName
      },
      set (val) {
        const person = Object.assign({}, this.item.contactPerson, { firstName: val })
        this.$emit('update', 'contactPerson', person)
      },
    },
    contactLastName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.lastName
      },
      set (val) {
        const person = Object.assign({}, this.item.contactPerson, { lastName: val })
        this.$emit('update', 'contactPerson', person)
      },
    },
    firstName: {
      get () {
        return this.item.person && this.item.person.firstName
      },
      set (val) {
        const person = Object.assign({}, this.item.person, { firstName: val })
        this.$emit('update', 'person', person)
      },
    },
    lastName: {
      get () {
        return this.item.person && this.item.person.lastName
      },
      set (val) {
        const person = Object.assign({}, this.item.person, { lastName: val })
        this.$emit('update', 'person', person)
      },
    },
    middleName: {
      get () {
        return this.item.person && this.item.person.middleName
      },
      set (val) {
        const person = Object.assign({}, this.item.person, { middleName: val })
        this.$emit('update', 'person', person)
      },
    },
    locales () {
      return LOCALES_LIST
    },
  },
  watch: {
    contactFirstName (val) {
      if (this.item.isPersonMatch) {
        const person = Object.assign({}, this.item.contactPerson, {
          firstName: val,
          middleName: this.item.person && this.item.person.middleName,
        })
        this.$emit('update', 'person', person)
      }
    },
    contactLastName (val) {
      if (this.item.isPersonMatch) {
        const person = Object.assign({}, this.item.contactPerson, {
          lastName: val,
          middleName: this.item.person && this.item.person.middleName,
        })
        this.$emit('update', 'person', person)
      }
    },
    'item.isPersonMatch' (val) {
      if (val) {
        const person = Object.assign({}, this.item.contactPerson, {
          middleName: this.item.person && this.item.person.middleName,
        })
        this.$emit('update', 'person', person)
      }
    },
  },
}
</script>
