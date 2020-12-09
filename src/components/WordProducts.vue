<template>
  <div class="w-full flex flex-wrap relative">
    <div
      v-for="item in items"
      :key="item.id"
      class="w-1/4 text-gray-100"
    >
      <div class="flex py-1">
        <input
          v-model="selected"
          :id="item.id"
          :value="item.id"
          type="checkbox"
          class="self-center mb-1 mr-2"
        />
        <WordProduct
          :images="item.images"
        />
        <label :for="item.id" class="flex items-center leading-none overflow-hidden">
          <div class="truncate" style="min-height: 16px;">{{ item.article }}</div>
        </label>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="selected.length > 0" class="w-full flex justify-end pt-3 pb-2">
        <Button
          :loading="addProductsLoading"
          min-width="100px"
          merge-class="h-8 text-sm"
          content-class="w-full flex items-center justify-center px-2"
          @click="addProductsDialog = true"
        >
          {{ $t('words.addToWord') }}
        </Button>
        <Button
          :loading="createWordLoading"
          min-width="100px"
          merge-class="h-8 text-sm ml-3"
          content-class="w-full flex items-center justify-center px-2"
          outlined
          @click="newWordDialog = true"
        >
          {{ $t('words.newWord') }}
        </Button>
      </div>
    </v-expand-transition>
    <WordDialog
      v-model="newWordDialog"
      :item="word"
      :title="$t('words.addWordTitle')"
      :action-text="$t('action.add')"
      orgId=""
      is-admin
      submit-result
      @update="createWordWithProducts"
    />
    <v-dialog
      v-model="addProductsDialog"
      :max-width="458"
    >
      <div class="relative bg-gray-400">
        <div class="flex items-center justify-center text-lg text-white font-semibold p-8 pb-2">
          <div class="text-white text-xl font-semibold">
            {{ $t('words.addToWord') }}
          </div>
        </div>
        <div class="text-gray-100 p-5 pt-2">
          <div>
            <Select
              ref="word-select"
              :value="selectedItemId"
              :placeholder="$t('placeholder.startTyping')"
              v-model:search="wordSearch"
              :items="words"
              :label="$t('words.wordFromDictionary')"
              item-value="id"
              item-text="text"
              searchable
              no-filter
              class="relative"
              append-slot-class="w-auto pr-sm"
              @click:prepend-item="openCreateDialog"
              @input="(v) => selectedItemId = v"
            >
              <template v-slot:prepend-item>
                <span class="flex items-center jusitfy-center text-blue-500">
                  <i class="zi-plus-outline text-2xl mr-1" />
                  <span>{{ $t('words.addNewWord') }}</span>
                </span>
              </template>
              <template v-slot:prepend>
                <i class="zi-magnifier text-gray-200" />
              </template>
            </Select>
          </div>
          <div class="flex justify-between pt-8">
            <Button
              :disabled="addProductsLoading"
              min-width="120"
              outlined
              merge-class="border-gray-200 h-10 text-sm"
              @click="addProductsDialog = false"
            >
              <span>{{ $t('action.cancel') }}</span>
            </Button>
            <Button
              :loading="addProductsLoading"
              :disabled="!selectedItemId"
              merge-class="h-10 text-sm"
              min-width="120"
              @click="addProductsToWord(selectedItemId)"
            >
              <span>{{ $t('action.add') }}</span>
            </Button>
          </div>
        </div>
        <span
          class="absolute top-0 right-0 text-2xl text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
          @click="addProductsDialog = false"
        >
          <i class="zi-close" />
        </span>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import WordProduct from './WordProduct.vue'
import WordDialog from './WordDialog.vue'
import { SEARCH_WORDS } from '../graphql/admin/queries'
import { ADD_PRODUCTS_TO_WORD, CREATE_WORD_WITH_PRODUCTS } from '../graphql/admin/mutations'

export default {
  name: 'WordProducts',
  components: {
    WordProduct,
    WordDialog,
  },
  props: {
    word: Object,
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  apollo: {
    searchWords: {
      query: SEARCH_WORDS,
      variables () {
        return {
          search: this.wordSearch,
        }
      },
      fetchPolicy: 'cache-and-network',
      skip () {
        return !this.wordSearch
      },
      debounce: 300,
    },
  },
  data () {
    return {
      wordSearch: '',
      selectedItemId: null,
      selected: [],
      newWordDialog: false,
      addProductsDialog: false,
      createWordLoading: false,
      addProductsLoading: false,
    }
  },
  computed: {
    words () {
      const items = (this.searchWords && this.searchWords.items) || []
      return items.map(word => {
        const values = word.values || []
        const result = {}
        values.forEach(el => {
          const v = el.v || el.tr
          if (v) {
            result[el.k] = v
          }
        })
        const text = result[this.$i18n.locale] || result[word.defaultLocale]
        return {
          ...word,
          text,
        }
      })
    },
  },
  watch: {
    addProductsDialog (val) {
      if (val) {
        this.wordSearch = ''
        this.selectedItemId = null
        setTimeout(() => {
          if (this.$refs['word-select']) {
            this.$refs['word-select'].focus()
          }
        }, 450)
      }
    },
  },
  methods: {
    openCreateDialog () {
      this.addProductsDialog = false
      this.$nextTick(() => {
        this.newWordDialog = true
      })
    },
    async createWordWithProducts (input) {
      try {
        this.createWordLoading = true
        await this.$apollo.mutate({
          mutation: CREATE_WORD_WITH_PRODUCTS,
          variables: {
            productsIds: this.selected,
            input,
          },
        })
        this.selected = []
        this.newWordDialog = false
        this.$emit('refetch', true)
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.createWordLoading = false
      }
    },
    async addProductsToWord (wordId) {
      if (!wordId) return
      try {
        this.addProductsLoading = true
        await this.$apollo.mutate({
          mutation: ADD_PRODUCTS_TO_WORD,
          variables: {
            productsIds: this.selected,
            wordId,
          },
        })
        this.selected = []
        this.addProductsDialog = false
        this.$emit('refetch', true)
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.addProductsLoading = false
      }
    },
  },
}
</script>
