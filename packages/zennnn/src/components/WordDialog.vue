<template>
  <Modal
    v-model="dialog"
    width="100%"
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
            :model-value="model[item.key]"
            :ref="item.value"
            :key="item.value"
            :placeholder="item.text"
            :rules="item.value === defaultLocale ? [rules.required] : undefined"
            :state-icon="item.value === defaultLocale"
            :required="item.value === defaultLocale"
            :state-succes-icon="item.value === defaultLocale ? icons.ziUser : undefined"
            :state-succes-color="item.value === defaultLocale ? 'text-blue-500' : undefined"
            force-update
            content-class="pr-sm"
            @blur="onBlur(item.key)"
            @update:model-value="onInput(item.key, $event)"
          >
            <template v-slot:prepend>
              <img
                :src="require(`@/assets/img/flags/locale/${item.value}.svg`).default"
                class="h-6 w-6 rounded-full ml-sm mr-5"
              >
            </template>
            <template
              v-if="item.value !== defaultLocale"
              v-slot:append
            >
              <i>
                <Icon v-if="googleTranslateIconMap[item.key]" :base="false">
                  {{ icons.ziLanguages }}
                </Icon>
                <Icon v-else-if="model[item.key]" :base="false" class="text-blue-500">
                  {{ icons.ziUser }}
                </Icon>
              </i>
            </template>
          </TextField>
        </Form>
        <div :class="['flex px-sm pt-5', hasNavigateToDictionary || isAdmin ? 'justify-between' : 'justify-end']">
          <router-link
            v-if="hasNavigateToDictionary"
            :to="{ name: 'dictionary', params: { orgId } }"
            class="inline-flex items-center text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none mr-2"
          >
            <Icon class="mr-sm">
              {{ icons.ziEdit }}
            </Icon>
            <span>{{ $t('header.dictionary') }}</span>
          </router-link>
          <div v-else-if="isAdmin">
            <div class="flex items-center">
              <span class="w-1/2 text-right mr-1">{{ $t('words.defaultLanguage') }}:</span>
              <Select
                v-model="defaultLocaleLazy"
                :items="locales"
                :show-arrow="false"
                solo
                hide-details
                class="w-1/2"
              />
            </div>
          </div>
          <button
            class="inline-flex justify-end items-center text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
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
              <Icon :base="false">
                {{ icons.ziLanguages }}
              </Icon>
            </i>
            <span>{{ $t('words.translate') }}</span>
          </button>
        </div>
        <div class="flex justify-between pt-8">
          <Btn
            :disabled="loading"
            outlined
            class="border-gray-200 h-10 text-sm"
            @click="dialog = false"
          >
            <span>{{ $t('action.cancel') }}</span>
          </Btn>
          <Btn
            :loading="loading"
            class="h-10 text-sm"
            @click="onSubmit"
          >
            <span>{{ actionText ? actionText : create ? $t('action.add') : $t('action.apply') }}</span>
          </Btn>
        </div>
      </div>
      <span
        class="absolute top-0 right-0 text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
        @click="dialog = false"
      >
        <Icon>
          {{  icons.ziCloseDelete }}
        </Icon>
      </span>
    </div>
  </Modal>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import {
  ziEdit,
  ziUser,
  ziCloseDelete,
  ziLanguages,
  ziCheckedSm,
} from '../assets/icons'

import { LOCALES_LIST } from '../config/globals'
import { CREATE_WORD, UPDATE_WORD } from '../graphql/mutations'
import { CREATE_WORD as ADMIN_CREATE_WORD, UPDATE_WORD as ADMIN_UPDATE_WORD } from '../graphql/admin/mutations'
import { TRANSLATE_WORD } from '../graphql/queries'
import { TRANSLATE_WORD as ADMIN_TRANSLATE_WORD } from '../graphql/admin/queries'

import { Btn, Modal, Progress, Icon, Form, Select, TextField } from '@zennnn/core'

export default {
  name: 'WordDialog',
  components: {
    Btn,
    Modal,
    Progress,
    Icon,
    Form,
    Select,
    TextField,
  },
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
  emits: ['update:modelValue'],
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    return {
      icons: {
        ziEdit,
        ziUser,
        ziCloseDelete,
        ziLanguages,
        ziCheckedSm,
      },
      apolloClient,
    }
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
      this.$emit('update:modelValue', val)
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
        const response = await this.apolloClient.query({
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
        const response = await this.apolloClient.mutate({
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
        const response = await this.apolloClient.mutate({
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
