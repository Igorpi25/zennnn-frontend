<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          :model-value="contactPerson.firstName"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          :loading="loading"
          :rules="[
            (v) => !!v || this.$t('companyDetail.rule.contactPersonFirstName'),
          ]"
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          @update:model-value="updateContactPerson({ firstName: $event })"
        />
        <TextField
          :model-value="contactPerson.lastName"
          :placeholder="$t('companyDetail.placeholder.lastName')"
          :loading="loading"
          :rules="[
            (v) => !!v || this.$t('companyDetail.rule.contactPersonLastName'),
          ]"
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          class="flex-grow"
          @update:model-value="updateContactPerson({ lastName: $event })"
        />
      </div>
      <div class="pb-2">
        <Phone
          :model-value="item.mobilePhone"
          :locale="item.locale"
          :label="$t('companyDetail.label.mobilePhone')"
          :label-hint="$t('companyDetail.hint.mobilePhone')"
          :error-message="$t('companyDetail.rule.notificationMobilePhone')"
          :loading="loading"
          :lazy="create"
          state-icon
          required
          @update:model-value="updateData({ mobilePhone: $event })"
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
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          @update:model-value="updateData({ email: $event })"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <Select
          :model-value="item.locale"
          :items="locales"
          :label="$t('companyDetail.label.locale')"
          :placeholder="$t('companyDetail.placeholder.locale')"
          :loading="loading"
          :rules="[(v) => !!v || this.$t('companyDetail.rule.locale')]"
          :hide-details="false"
          state-icon
          required
          class="pb-2"
          @update:model-value="updateData({ locale: $event })"
        >
          <template v-slot:prepend>
            <img
              v-if="item.locale"
              :src="
                require(`@/assets/img/flags/locale/${item.locale}.svg`).default
              "
              :alt="item.locale"
              class="h-6 w-6 rounded-full ml-2 mr-4"
            />
            <img
              v-else
              src="@/assets/icons/earth.svg"
              class="h-6 w-6 rounded-full ml-2 mr-4"
            />
          </template>
          <template v-slot:item="{ item }">
            <img
              :src="
                require(`@/assets/img/flags/locale/${item.value}.svg`).default
              "
              :alt="item.text"
              class="h-6 w-6 rounded-full mr-4"
            />
            <span>{{ item.text }}</span>
          </template>
        </Select>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.clientLocale') }}
          </div>
        </div>
      </div>
      <div class="pb-2 lg:pb-0">
        <Alert
          :model-value="true"
          :close="false"
          content-class="text-pink-500"
          container-class="bg-pink-500 bg-opacity-10"
          icon-class="text-pink-500 items-start"
          max-width="none"
        >
          {{ $t('companyDetail.privacyWarning') }}
        </Alert>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          :model-value="person.firstName"
          :label="$t('companyDetail.label.givenName')"
          :placeholder="$t('companyDetail.placeholder.givenName')"
          :disabled="isPersonMatch"
          :loading="loading"
          :rules="[(v) => !!v || this.$t('companyDetail.rule.givenName')]"
          :hide-details="false"
          :debounce="500"
          :lazy="create"
          state-icon
          required
          @update:model-value="updatePerson({ firstName: $event })"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :model-value="person.lastName"
            :label="$t('companyDetail.label.familyName')"
            :placeholder="$t('companyDetail.placeholder.familyName')"
            :disabled="isPersonMatch"
            :loading="loading"
            :rules="[(v) => !!v || this.$t('companyDetail.rule.familyName')]"
            :hide-details="false"
            :debounce="500"
            :lazy="create"
            state-icon
            required
            class="pb-2 flex-grow"
            @update:model-value="updatePerson({ lastName: $event })"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
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
                :model-value="isPersonMatch"
                @update:model-value="updatePersonMatch"
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
          :model-value="person.middleName"
          :label="$t('companyDetail.label.middleName')"
          :placeholder="$t('companyDetail.placeholder.middleName')"
          :lazy="create"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updatePerson({ middleName: $event })"
        />
      </div>
      <div class="flex items-end pb-2">
        <DatePicker
          :model-value="item.birthdate"
          @update:model-value="updateData({ birthdate: $event })"
        >
          <template v-slot:activator>
            <div class="pr-4">
              <TextField
                :model-value="
                  item.birthdate
                    ? $d($parseDate(item.birthdate), 'short')
                    : null
                "
                :label="$t('companyDetail.label.birthdate')"
                :placeholder="$t('companyDetail.placeholder.date')"
                :loading="loading"
                :rules="[rules.required]"
                state-icon
                label-no-wrap
                readonly
              >
                <template v-slot:prepend>
                  <Icon small class="text-gray-200 mr-sm">
                    {{ icons.ziCalendar }}
                  </Icon>
                </template>
              </TextField>
            </div>
          </template>
        </DatePicker>
        <div class="w-1/2 pl-4 opacity-40">
          <label
            class="
              block
              text-base text-gray-100
              whitespace-nowrap
              leading-5
              py-2
            "
          >
            {{ $t('companyDetail.label.avatar') }}
          </label>
          <div class="h-10 flex justify-start relative pl-12">
            <div class="absolute bottom-0 pl-4">
              <div
                class="
                  flex
                  items-center
                  justify-center
                  w-14
                  h-14
                  border border-gray-200
                  text-gray-200
                  bg-gray-400
                  rounded-full
                "
              >
                <Icon large>
                  {{ icons.ziUser }}
                </Icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label
          class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2"
        >
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
import { ziUser, ziCalendar } from '@zennnn/icons'
import {
  Icon,
  Alert,
  Switch,
  Select,
  TextField,
  DatePicker,
} from '@zennnn/core'

import { LOCALES_LIST } from '../../config/globals'

import clientDetail from '../../mixins/clientDetail'

import Phone from '../Phone.vue'

export default {
  name: 'PrivateInfo',
  components: {
    Icon,
    Alert,
    Switch,
    Select,
    TextField,
    DatePicker,
    Phone,
  },
  mixins: [clientDetail],
  props: {
    uid: String,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isPersonMatchLazy: false,
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
        email: (v) =>
          (v && /.+@.+\..+/.test(v)) ||
          this.$t('companyDetail.rule.notificationEmail'),
      },
      icons: {
        ziUser,
        ziCalendar,
      },
    }
  },
  computed: {
    isPersonMatch: {
      get() {
        return this.isPersonMatchLazy
      },
      set(val) {
        this.isPersonMatchLazy = val
      },
    },
    person() {
      return this.item.person || {}
    },
    contactPerson() {
      return this.item.contactPerson || {}
    },
    locales() {
      return LOCALES_LIST
    },
  },
  watch: {
    'item.isPersonMatch'(val) {
      this.isPersonMatchLazy = !!val
    },
  },
  methods: {
    updatePersonMatch(val) {
      this.isPersonMatch = val
      const input = { isPersonMatch: val }
      this.updateData(input)
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
    updatePerson(input) {
      const value = Object.assign(
        {},
        {
          middleName: this.person.middleName,
        },
        input
      )
      this.updateData({ person: value })
    },
  },
}
</script>
