<template>
  <Modal
    v-model="dialog"
    :max-width="710"
  >
    <div class="relative bg-gray-400">
      <div class="flex items-center justify-center text-lg text-white font-semibold p-8 pb-2">
        <div class="text-white text-xl font-semibold">
          {{ title ? title : create ? $t('words.addWordTitle') : $t('words.editWord') }}
        </div>
      </div>
      <div class="text-gray-100 p-5">
        <Form
          ref="form"
          class="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col gap-8"
        >
          <TextField
            v-for="item in locales"
            :value="model[item.key]"
            :ref="item.value"
            :key="item.value"
            :placeholder="item.text"
            :rules="item.value === defaultLocale ? [rules.required] : undefined"
            :state-icon="item.value === defaultLocale"
            :required="item.value === defaultLocale"
            :state-color="item.value === defaultLocale ? undefined : 'none'"
            force-update
            lazy-validation
            content-class="pr-sm"
            state-icon-user
            prepend-slot-class="w-auto"
            append-slot-class="w-auto"
            @blur="onBlur(item.key)"
            @input="onInput(item.key, $event)"
          >
            <template v-slot:prepend>
              <img
                :src="require(`@/assets/img/flags/locale/${item.value}.svg`)"
                class="h-6 w-6 rounded-full ml-sm mr-5"
              >
            </template>
            <template
              v-if="item.value !== defaultLocale"
              v-slot:append
            >
              <i v-if="googleTranslateIconMap[item.key]">
                <Icon>
                  {{ icons.mdiGoogleTranslate }}
                </Icon>
              </i>
              <div v-else-if="model[item.key]" class="px-1">
                <i class="text-blue-500">
                  <svg  width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5754 8.01019C11.5124 8.31943 12.402 8.88729 13.1424 9.66794C14.3403 10.9308 15 12.5667 15 14.2742V15H0V14.2742C0 12.5667 0.659693 10.9308 1.85753 9.66797C2.59793 8.88737 3.48754 8.31947 4.42456 8.01019C3.49101 7.16821 2.90322 5.94991 2.90322 4.59677C2.90322 2.06211 4.96536 0 7.50002 0C10.0347 0 12.0968 2.06211 12.0968 4.59677C12.0968 5.94991 11.509 7.16821 10.5754 8.01019ZM7.49998 1.45161C5.76575 1.45161 4.35483 2.86254 4.35483 4.59677C4.35483 6.33101 5.76575 7.74193 7.49998 7.74193C9.23422 7.74193 10.6451 6.33101 10.6451 4.59677C10.6451 2.86254 9.23422 1.45161 7.49998 1.45161ZM6.04837 9.19355C4.06324 9.19355 1.86298 11.0122 1.50275 13.5484H13.4972C13.137 11.0122 10.9367 9.19355 8.95159 9.19355H6.04837Z" fill="currentColor" />
                  </svg>
                </i>
              </div>
            </template>
          </TextField>
        </Form>
        <div :class="['flex px-sm pt-5', hasNavigateToDictionary || isAdmin ? 'justify-between' : 'justify-end']">
          <router-link
            v-if="hasNavigateToDictionary"
            :to="{ name: 'dictionary', params: { orgId } }"
            class="inline-flex items-center text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none mr-2"
          >
            <i class="zi-edit text-2xl mr-sm" />
            <span>{{ $t('header.dictionary') }}</span>
          </router-link>
          <div v-else-if="isAdmin">
            <div class="flex items-center">
              <span class="w-1/2 text-right mr-1">{{ $t('words.defaultLanguage') }}:</span>
              <Select
                v-model="defaultLocaleLazy"
                :items="locales"
                :has-arrow-icon="false"
                solo
                hide-details
                class="w-1/2"
              />
            </div>
          </div>
          <button
            class="inline-flex justify-end items-center text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
            @click="translateWord"
          >
            <Progress
              v-if="translateLoading"
              indeterminate
              size="16"
              width="2"
              class="mr-1"
            />
            <i class="text-2xl mr-sm">
              <Icon>
                {{ icons.mdiGoogleTranslate }}
              </Icon>
            </i>
            <span>{{ $t('words.translate') }}</span>
          </button>
        </div>
        <div class="flex justify-between pt-8">
          <Btn
            :disabled="loading"
            min-width="120"
            outlined
            merge-class="border-gray-200 h-10 text-sm"
            @click="dialog = false"
          >
            <span>{{ $t('action.cancel') }}</span>
          </Btn>
          <Btn
            :loading="loading"
            merge-class="h-10 text-sm"
            min-width="120"
            @click="onSubmit"
          >
            <span>{{ actionText ? actionText : create ? $t('action.add') : $t('action.apply') }}</span>
          </Btn>
        </div>
      </div>
      <span
        class="absolute top-0 right-0 text-2xl text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
        @click="dialog = false"
      >
        <i class="zi-close" />
      </span>
    </div>
  </Modal>
</template>

<script>
import { mdiGoogleTranslate } from '@mdi/js'

import { LOCALES_LIST } from '../config/globals'
import { CREATE_WORD, UPDATE_WORD } from '../graphql/mutations'
import { CREATE_WORD as ADMIN_CREATE_WORD, UPDATE_WORD as ADMIN_UPDATE_WORD } from '../graphql/admin/mutations'
import { TRANSLATE_WORD } from '../graphql/queries'
import { TRANSLATE_WORD as ADMIN_TRANSLATE_WORD } from '../graphql/admin/queries'

export default {
  name: 'WordDialog',
  props: {
    value: Boolean,
    create: Boolean,
    initValue: String,
    item: Object,
    orgId: {
      type: String,
      required: true,
    },
    productId: String,
    title: String,
    actionText: String,
    isAdmin: Boolean,
    submitResult: Boolean,
  },
  data () {
    return {
      loading: false,
      dialog: this.value,
      formValidity: false,
      model: {},
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
      icons: {
        mdiGoogleTranslate,
      },
      translateLoading: false,
      translations: {},
      defaultLocaleLazy: this.$i18n.locale,
    }
  },
  computed: {
    defaultLocale () {
      if (this.isAdmin) {
        return this.defaultLocaleLazy
      }
      if (this.create) {
        return this.$i18n.locale
      } else {
        return this.item && this.item.defaultLocale
      }
    },
    googleTranslateIconMap () {
      const result = {}
      LOCALES_LIST.forEach(el => {
        const key = el.value
        result[key] = this.translations[key] && this.model[key] === this.translations[key]
      })
      return result
    },
    hasNavigateToDictionary () {
      return this.$route.name !== 'dictionary' && !this.isAdmin
    },
    locales () {
      const locale = this.$i18n.locale
      const items = LOCALES_LIST.map(el => {
        return {
          ...el,
          key: el.value,
        }
      })
      const index = items.findIndex(el => el.value === locale)
      // move default locale input to start
      if (index > 0) {
        items.splice(0, 0, items.splice(index, 1)[0])
      }
      return items
    },
    statuses () {
      return [
        {
          text: this.$t('words.DRAFT'),
          value: 'DRAFT',
        },
        {
          text: this.$t('words.APPROVED'),
          value: 'APPROVED',
        },
      ]
    },
  },
  watch: {
    value (val) {
      this.dialog = val
    },
    dialog (val) {
      this.$emit('input', val)
      if (val) {
        this.onOpen()
      } else {
        this.onClose()
      }
    },
  },
  methods: {
    onInput (key, value) {
      this.model[key] = value
    },
    onBlur (key) {
      if (!this.model[key] && this.translations[key]) {
        this.model[key] = this.translations[key]
      }
    },
    onOpen () {
      this.defaultLocaleLazy = this.create ? this.$i18n.locale : this.item && this.item.defaultLocale
      if (!this.create) {
        this.$nextTick(() => {
          const values = (this.item && this.item.values) || []
          const valuesMap = {}
          const trMap = {}
          LOCALES_LIST.forEach(el => {
            const v = values.find(val => val.k === el.value) || {}
            valuesMap[el.value] = v.v || v.tr || undefined
            trMap[el.value] = v.tr || undefined
          })
          this.model = valuesMap
          this.translations = trMap
        })
      } else {
        const valuesMap = {}
        const trMap = {}
        LOCALES_LIST.forEach(el => {
          valuesMap[el.value] = undefined
          trMap[el.value] = undefined
        })
        if (this.initValue) {
          valuesMap[this.$i18n.locale] = this.initValue
        }
        this.model = valuesMap
        this.translations = trMap
      }
      setTimeout(() => {
        if (this.$refs[this.$i18n.locale] && this.$refs[this.$i18n.locale][0]) {
          this.$refs[this.$i18n.locale][0].focus()
        }
      }, 250)
    },
    onClose () {
      setTimeout(() => {
        this.model = {}
        this.translations = {}
        if (this.$refs.form) {
          this.$refs.form.reset()
        }
      }, 250)
    },
    onSubmit () {
      const isValid = this.$refs.form.validate(true)
      if (!isValid) return
      if (this.submitResult) {
        const input = {
          defaultLocale: this.defaultLocale,
          values: this.getValues(),
        }
        this.$emit('update', input)
      } else if (this.create) {
        this.createWord()
      } else {
        this.updateWord()
      }
    },
    async translateWord () {
      const isValid = this.$refs.form.validate(true)
      if (!isValid) return
      const text = this.model[this.defaultLocale]
      try {
        this.translateLoading = true
        const query = this.isAdmin ? ADMIN_TRANSLATE_WORD : TRANSLATE_WORD
        const response = await this.$apollo.query({
          query,
          variables: {
            orgId: this.orgId,
            text,
            sourceLang: this.defaultLocale,
          },
        })
        const result = (response && response.data && response.data.translateWord) || []
        this.$logger.info('Translate result', result)
        result.forEach(el => {
          const key = el.k
          if (!this.model[key] || this.model[key] === this.translations[key]) {
            this.model[key] = el.tr
          }
          this.translations[key] = el.tr
        })
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.translateLoading = false
      }
    },
    async createWord () {
      try {
        this.loading = true
        const input = {
          defaultLocale: this.isAdmin ? this.defaultLocale : this.$i18n.locale,
          values: this.getValues(),
        }
        const mutation = this.isAdmin ? ADMIN_CREATE_WORD : CREATE_WORD
        const variables = {
          input,
        }
        if (!this.isAdmin) {
          variables.orgId = this.orgId
          variables.productId = this.productId
        }
        const response = await this.$apollo.mutate({
          mutation,
          variables,
        })
        const result = response && response.data && response.data.createWord
        this.$emit('create', result)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
    async updateWord () {
      const id = this.item && this.item.id
      if (!id) return
      try {
        this.loading = true
        const input = {
          id,
          values: this.getValues(),
        }
        if (this.isAdmin) {
          input.defaultLocale = this.defaultLocale
        }
        const mutation = this.isAdmin ? ADMIN_UPDATE_WORD : UPDATE_WORD
        const variables = {
          input,
        }
        if (!this.isAdmin) {
          variables.orgId = this.orgId
        }
        const response = await this.$apollo.mutate({
          mutation,
          variables,
        })
        const result = response && response.data && response.data.updateWord
        this.$emit('update', result)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
    getValues () {
      const result = []
      LOCALES_LIST.forEach(el => {
        const k = el.value
        const tr = this.translations[k]
        const v = this.model[k] && this.model[k] === tr
          ? null
          : this.model[k] || null
        const r = {
          k,
          v,
        }
        if (tr) {
          r.tr = tr
        }
        if (k && (v || tr)) {
          result.push(r)
        }
      })
      return result
    },
  },
}
</script>
