<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight">
        <span class="text-white uppercase font-semibold tracking-widest">
          {{ $t('companyDetail.privateDetail') }}
        </span>
        <span class="text-gray-200 mr-1">
          <span> </span><span>{{ $t('companyDetail.privateDetailDesc') }}</span>
        </span>
        <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="332">
          <template v-slot:activator>
            <Icon class="text-blue-500 align-middle">
              {{ icons.ziQuestionSign }}
            </Icon>
          </template>
          <span>
            {{ $t('companyDetail.privateDetailHint') }}
          </span>
        </Tooltip>
      </div>
      <div>
        <button
          class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
          @click="toggleExpand"
        >
          <Icon
            class="transition-transform"
            :class="{ 'transform rotate-90': expanded }"
          >
            {{ icons.ziChevronRight }}
          </Icon>
        </button>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="expanded" class="flex flex-wrap pt-2">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="pb-2">
            <TextField
              :model-value="item.passportId"
              :label="$t('companyDetail.label.passportId')"
              :placeholder="$t('companyDetail.placeholder.passportId')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'passportId': $event })"
            />
          </div>
          <div class="pb-2">
            <Select
              :model-value="item.citizenship"
              v-model:search="countriesSearch"
              :items="countries"
              :label="$t('companyDetail.label.citizenship')"
              :placeholder="$t('companyDetail.placeholder.citizenship')"
              :loading="loading"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              searchable
              @update:model-value="updateData({ 'citizenship': $event })"
            >
              <template v-slot:prepend>
                <img
                  v-if="item.citizenship"
                  :src="require(`@/assets/img/flags/square/${item.citizenship}.svg`).default"
                  class="w-6 rounded-sm ml-2 mr-4"
                >
                <img
                  v-else
                  src="@/assets/icons/earth.svg"
                  class="h-6 w-6 rounded-full ml-2 mr-4"
                >
              </template>
              <template v-slot:item="{ item }">
                <img
                  :src="require(`@/assets/img/flags/square/${item.value}.svg`).default"
                  class="w-6 rounded-sm mr-4"
                >
                <span>{{ item.text }}</span>
              </template>
            </Select>
          </div>
          <div class="pb-2">
            <div class="flex">
              <DatePicker
                :model-value="item.issueDate"
                @update:model-value="updateData({ 'issueDate': $event })"
              >
                <template v-slot:activator>
                  <div
                    class="pr-sm"
                    style="max-width: 232px;"
                  >
                    <TextField
                      :model-value="item.issueDate ? $d($parseDate(item.issueDate), 'short') : null"
                      :label="$t('companyDetail.label.issueDate')"
                      :placeholder="$t('companyDetail.placeholder.date')"
                      :loading="loading"
                      :rules="[rules.required]"
                      state-icon
                      state-error-color="none"
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
              <DatePicker
                :model-value="item.expireDate"
                @update:model-value="updateData({ 'expireDate': $event })"
              >
                <template v-slot:activator>
                  <div
                    class="pr-sm"
                    style="max-width: 232px;"
                  >
                    <TextField
                      :model-value="item.expireDate ? $d($parseDate(item.expireDate), 'short') : null"
                      :label="$t('companyDetail.label.expireDate')"
                      :placeholder="$t('companyDetail.placeholder.date')"
                      :loading="loading"
                      :rules="[rules.required]"
                      state-icon
                      state-error-color="none"
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
            </div>
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.issuedBy"
              :label="$t('companyDetail.label.issuedBy')"
              :placeholder="$t('companyDetail.placeholder.issuedBy')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'issuedBy': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.legalAddress"
              :label="$t('companyDetail.label.placeOfResidence')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateLegalAddress"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.legalAddressPostcode"
              :label="$t('companyDetail.label.placeOfResidencePostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              label-no-wrap
              class="w-48"
              @update:model-value="updateLegalAddressPostcode"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.mailingAddress"
              :label="$t('companyDetail.label.privateMailingAddress')"
              :placeholder="$t('companyDetail.placeholder.address')"
              :disabled="isMailingAddressMatch"
              :loading="loading"
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
                {{ $t('companyDetail.hint.privateAddress') }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              :model-value="item.vat"
              :label="$t('companyDetail.label.vat')"
              :placeholder="$t('companyDetail.placeholder.vat')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'vat': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.bankName"
              :label="$t('companyDetail.label.bankName')"
              :placeholder="$t('companyDetail.placeholder.bankName')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankName': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.bankAddress"
              :label="$t('companyDetail.label.bankAddress')"
              :placeholder="$t('companyDetail.placeholder.bankAddress')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankAddress': $event })"
            />
          </div>
          <div class="pb-2">
            <TextField
              :model-value="item.bankAccountNumber"
              :label="$t('companyDetail.label.bankAccountNumber')"
              :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              @update:model-value="updateData({ 'bankAccountNumber': $event })"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :model-value="item.swift"
              :label="$t('companyDetail.label.swift')"
              :placeholder="$t('companyDetail.placeholder.swift')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @update:model-value="updateData({ 'swift': $event })"
            />
            <TextField
              :model-value="item.bic"
              :label="$t('companyDetail.label.bic')"
              :placeholder="$t('companyDetail.placeholder.bic')"
              :loading="loading"
              :debounce="500"
              :lazy="create"
              :rules="[rules.required]"
              state-icon
              state-error-color="none"
              class="flex-grow"
              @update:model-value="updateData({ 'bic': $event })"
            />
          </div>
          <div>
            <div class="flex items-end pb-2">
              <Phone
                :model-value="item.phone"
                :locale="item.locale"
                :label="$t('companyDetail.label.phone')"
                :loading="loading"
                :rules="[rules.required]"
                :lazy="create"
                state-icon
                state-error-color="none"
                required
                class="w-1/2 pr-2"
                @update:model-value="updateData({ 'phone': $event })"
              />
              <Phone
                :model-value="item.fax"
                :locale="item.locale"
                :label="$t('companyDetail.label.fax')"
                :loading="loading"
                :rules="[rules.required]"
                :lazy="create"
                state-icon
                state-error-color="none"
                required
                class="w-1/2 pl-2"
                @update:model-value="updateData({ 'fax': $event })"
              />
            </div>
            <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
              {{ $t('companyDetail.hint.phoneAndFax') }}
            </div>
          </div>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import Countries from '../../config/countries-iso3.json'

import { ziCalendar, ziChevronRight, ziQuestionSign } from '../../assets/icons'

import clientDetail from '../../mixins/clientDetail'

import { Icon, Tooltip, Switch, Select, TextField, DatePicker, ExpandTransition } from '@zennnn/core'
import Phone from '../Phone.vue'

export default {
  name: 'PrivateDetail',
  components: {
    Icon,
    Tooltip,
    Switch,
    Select,
    TextField,
    DatePicker,
    ExpandTransition,
    Phone,
  },
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      isMailingAddressMatchLazy: false,
      countriesSearch: '',
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
      icons: {
        ziCalendar,
        ziChevronRight,
        ziQuestionSign,
      },
    }
  },
  computed: {
    isMailingAddressMatch: {
      get () {
        return this.isMailingAddressMatchLazy
      },
      set (val) {
        this.isMailingAddressMatchLazy = val
      },
    },
    countries () {
      return Object.entries(Countries).map(([k, v]) => {
        const name = this.$te(`countries.${k}`, 'en') ? this.$t(`countries.${k}`, 'en') : v
        return {
          text: this.$te(`countries.${k}`) ? this.$t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    },
  },
  watch: {
    'item.isMailingAddressMatch' (val) {
      this.isMailingAddressMatchLazy = val
    },
  },
  methods: {
    updateMailingAddressMatch (val) {
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
  },
}
</script>
