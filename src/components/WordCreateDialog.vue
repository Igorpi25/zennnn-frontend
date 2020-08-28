<template>
  <v-dialog
    v-model="dialog"
    :max-width="710"
  >
    <div class="relative bg-gray-400">
      <div class="flex items-center justify-center text-lg text-white font-semibold p-8 pb-2">
        <div class="text-white text-xl font-semibold">
          {{ $t('words.addWordTitle') }}
        </div>
      </div>
      <div class="text-gray-100 p-5">
        <div class="flex flex-wrap sm:flex-no-wrap pb-6">
          <div class="w-full sm:w-1/2 sm:pr-5 pb-8 sm:pb-0">
            <TextField
              v-model="model.en"
              :placeholder="localesMap.en.text"
              validate-on-blur
              class="w-full pb-8"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.en.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
            <TextField
              v-model="model.zhHans"
              :placeholder="localesMap.zhHans.text"
              validate-on-blur
              class="w-full pb-8"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.zhHans.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
            <TextField
              v-model="model.zhHant"
              :placeholder="localesMap.zhHant.text"
              validate-on-blur
              class="w-full"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.zhHant.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
          </div>
          <div class="w-full sm:w-1/2 sm:pl-5">
            <TextField
              v-model="model.fr"
              :placeholder="localesMap.fr.text"
              validate-on-blur
              class="w-full pb-8"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.fr.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
            <TextField
              v-model="model.ru"
              :placeholder="localesMap.ru.text"
              validate-on-blur
              class="w-full pb-8"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.ru.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
            <TextField
              v-model="model.uk"
              :placeholder="localesMap.uk.text"
              validate-on-blur
              class="w-full"
              prepend-slot-class="w-auto"
            >
              <template v-slot:prepend>
                <img
                  :src="require(`@/assets/img/flags/round/${localesMap.uk.value}.svg`)"
                  class="h-6 w-6 rounded-full ml-sm mr-5"
                >
              </template>
            </TextField>
          </div>
        </div>
        <div v-if="hasNavigateToDictionary" class="pb-8">
          <router-link
            :to="{ name: 'dictionary', params: { orgId } }"
            class="inline-flex items-center text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
          >
            <i class="zi-edit text-2xl mr-sm" />
            <span>{{ $t('header.dictionary') }}</span>
          </router-link>
        </div>
        <div class="flex justify-between">
          <Button
            :disabled="loading"
            min-width="120"
            outlined
            merge-class="border-gray-200"
            @click="dialog = false"
          >
            <span>{{ $t('words.cancel') }}</span>
          </Button>
          <Button
            :loading="loading"
            min-width="120"
            @click="createWord"
          >
            <span>{{ $t('words.add') }}</span>
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
import { CREATE_WORD } from '../graphql/mutations'

export default {
  name: 'WordCreateDialog',
  props: {
    value: Boolean,
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
      model: {
        en: '',
        zhHans: '',
        zhHant: '',
        fr: '',
        ru: '',
        uk: '',
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
      return LOCALES_LIST.map(el => {
        return {
          ...el,
          key: el.value.replace('-', ''),
        }
      })
    },
    localesMap () {
      return this.locales.reduce((acc, curr) => {
        acc[curr.key] = { ...curr }
        return acc
      }, {})
    },
  },
  watch: {
    value (val) {
      this.dialog = val
    },
    dialog (val) {
      this.$emit('input', val)
    },
  },
  methods: {
    async createWord () {
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
        setTimeout(() => {
          this.model = {
            en: '',
            zhHans: '',
            zhHant: '',
            fr: '',
            ru: '',
            uk: '',
          }
        }, 200)
      }
    },
  },
}
</script>
