<template>
  <v-dialog
    v-model="dialog"
    :max-width="710"
  >
    <div class="relative bg-gray-400">
      <div class="flex items-center justify-center text-lg text-white font-semibold p-8 pb-2">
        <div class="text-white text-xl font-semibold">
          {{ create ? $t('words.addWordTitle') : $t('words.editWord') }}
        </div>
      </div>
      <div class="text-gray-100 p-5">
        <div
          class="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col gap-8"
        >
          <template v-for="(item, index) in locales">
            <Form
              ref="form"
              v-if="index === 0"
              v-model="formValidity"
              :key="index"
            >
              <TextField
                v-model="model[item.key]"
                :ref="item.value"
                :key="item.value"
                :placeholder="item.text"
                :rules="item.rules"
                required
                state-icon
                prepend-slot-class="w-auto"
              >
                <template v-slot:prepend>
                  <img
                    :src="require(`@/assets/img/flags/round/${item.value}.svg`)"
                    class="h-6 w-6 rounded-full ml-sm mr-5"
                  >
                </template>
              </TextField>
            </Form>
            <TextField
              v-else
              v-model="model[item.key]"
              :key="item.value"
              :placeholder="item.text"
              :rules="item.rules"
              state-icon
              state-icon-on-validate
              state-color="none"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${item.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
          </template>
        </div>
        <div v-if="hasNavigateToDictionary" class="flex pl-sm pt-5">
          <router-link
            :to="{ name: 'dictionary', params: { orgId } }"
            class="inline-flex items-center text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
          >
            <i class="zi-edit text-2xl mr-sm" />
            <span>{{ $t('header.dictionary') }}</span>
          </router-link>
        </div>
        <div class="flex justify-between pt-8">
          <Button
            :disabled="loading"
            min-width="120"
            outlined
            merge-class="border-gray-200 h-10 text-sm"
            @click="dialog = false"
          >
            <span>{{ $t('action.cancel') }}</span>
          </Button>
          <Button
            :loading="loading"
            :disabled="formValidity"
            merge-class="h-10 text-sm"
            min-width="120"
            @click="onSubmit"
          >
            <span>{{ create ? $t('action.add') : $t('action.apply') }}</span>
          </Button>
        </div>
      </div>
      <span
        class="absolute top-0 right-0 text-2xl text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
        @click="dialog = false"
      >
        <i class="zi-close" />
      </span>
    </div>
  </v-dialog>
</template>

<script>
import { LOCALES_LIST } from '../config/globals'
import { CREATE_WORD, UPDATE_WORD } from '../graphql/mutations'

export default {
  name: 'WordDialog',
  props: {
    value: Boolean,
    create: Boolean,
    item: Object,
    orgId: {
      type: String,
      required: true,
    },
    productId: String,
  },
  data () {
    return {
      loading: false,
      dialog: this.value,
      formValidity: false,
      model: {
        en: undefined,
        zhHans: undefined,
        zhHant: undefined,
        fr: undefined,
        ru: undefined,
        uk: undefined,
      },
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    wordLocale () {
      const locale = this.$i18n.locale
      return locale.replace('-', '')
    },
    hasNavigateToDictionary () {
      return this.$route.name !== 'dictionary'
    },
    locales () {
      const locale = this.$i18n.locale
      const items = LOCALES_LIST.map(el => {
        return {
          ...el,
          rules: [this.rules.required],
          key: el.value.replace('-', ''),
        }
      })
      const index = items.findIndex(el => el.value === locale)
      // move default locale input to start
      if (index > 0) {
        items.splice(0, 0, items.splice(index, 1)[0])
      }
      return items
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
    onOpen () {
      if (!this.create) {
        this.$nextTick(() => {
          const item = this.item || {}
          this.model = {
            en: item.en,
            zhHans: item.zhHans,
            zhHant: item.zhHant,
            fr: item.fr,
            ru: item.ru,
            uk: item.uk,
          }
        })
      }
      setTimeout(() => {
        if (this.$refs[this.$i18n.locale] && this.$refs[this.$i18n.locale][0]) {
          this.$refs[this.$i18n.locale][0].focus()
        }
      }, 75)
    },
    onClose () {
      setTimeout(() => {
        this.model = {
          en: undefined,
          zhHans: undefined,
          zhHant: undefined,
          fr: undefined,
          ru: undefined,
          uk: undefined,
        }
        if (this.$refs.form && this.$refs.form[0]) {
          this.$refs.form[0].reset()
        }
      }, 250)
    },
    onSubmit () {
      if (this.create) {
        this.createWord()
      } else {
        this.updateWord()
      }
    },
    async createWord () {
      if (!this.$refs.form[0].validate(true)) return
      try {
        this.loading = true
        const input = {
          ...this.model,
          defaultLocale: this.wordLocale,
        }
        const response = await this.$apollo.mutate({
          mutation: CREATE_WORD,
          variables: {
            orgId: this.orgId,
            productId: this.productId,
            input,
          },
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
      if (!this.$refs.form[0].validate(true)) return
      try {
        this.loading = true
        const input = {
          id,
          ...this.model,
        }
        const response = await this.$apollo.mutate({
          mutation: UPDATE_WORD,
          variables: {
            orgId: this.orgId,
            input,
          },
        })
        const result = response && response.data && response.data.updateWord
        this.$emit('update', result)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
