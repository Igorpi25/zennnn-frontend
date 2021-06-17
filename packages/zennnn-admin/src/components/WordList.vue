<template>
  <div class="flex-grow flex flex-col relative">
    <div class="container pb-12">
      <div class="pt-4 pb-10">
        <div
          class="
            flex flex-wrap
            sm:flex-nowrap
            items-center
            justify-between
            pb-8
          "
        >
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            :content-class="[search ? 'shadow-blue-500' : '', 'bg-transparent']"
            class="w-full md:max-w-md"
            input-class="placeholder-blue-500"
            clearable
          >
            <template v-slot:prepend>
              <Icon class="text-gray-100">
                {{ icons.ziSearch }}
              </Icon>
            </template>
          </TextField>
          <div
            class="flex w-full sm:w-auto items-center justify-end"
            style="min-width: 165px"
          >
            <Menu
              v-model="filterMenu"
              v-model:value="currentFilter"
              placement="bottom-start"
            >
              <template v-slot:activator>
                <div
                  class="
                    group
                    flex
                    items-center
                    cursor-pointer
                    whitespace-nowrap
                  "
                >
                  <span
                    class="text-gray-100 group-hover:text-light-gray-400 pr-2"
                  >
                    {{ currentFilterText }}
                  </span>
                  <span class="relative">
                    <Icon class="text-gray-200 group-hover:text-gray-100">
                      {{
                        currentFilter ? icons.ziFilter : icons.ziFilterOutline
                      }}
                    </Icon>
                  </span>
                </div>
              </template>
              <MenuItem
                v-for="(item, i) in filtersItems"
                :key="item.value"
                :index="i"
                :value="item.value"
              >
                <span>{{ item.text }}</span>
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div
          class="
            sticky
            top-0
            bg-gray-800
            rounded-t-md
            px-2.5
            flex
            items-center
            h-12
            space-x-2
          "
          style="z-index: 1"
        >
          <Btn
            :loading="approveLoading"
            :disabled="selected.length === 0"
            class="h-8 text-sm ml-2.5"
            content-class="w-full flex items-center justify-center px-2"
            @click="approveWords"
          >
            {{ $t('words.approve') }}
          </Btn>
          <Btn
            :loading="hideLoading"
            :disabled="selected.length === 0"
            class="h-8 text-sm"
            content-class="w-full flex items-center justify-center px-2"
            outlined
            borderless
            @click="hideWords"
          >
            {{ $t('words.hide') }}
          </Btn>
          <Btn
            :loading="mergeLoading"
            :disabled="selected.length < 2"
            class="h-8 text-sm"
            content-class="w-full flex items-center justify-center px-2"
            outlined
            borderless
            @click="openMergeItem"
          >
            {{ $t('words.merge') }}
          </Btn>
          <div class="flex-grow" />
          <Progress v-if="queryLoading" indeterminate size="18" width="2" />
        </div>
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          :loading="loading"
          table-width="100%"
          table-class="table-fixed rounded-t-none"
          hoverable
        >
          <template v-slot:header-status="{ header }">
            <td :width="header.width" class="text-left p-0">
              <input
                ref="select-all"
                v-model="selectAll"
                id="select-all"
                type="checkbox"
                class="inline-flex align-middle ml-3"
                @change="onSelectAll"
              />
            </td>
          </template>
          <template v-slot:header-content-en="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-fr="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-zh-Hans="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-zh-Hant="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-ru="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-uk="{ header }">
            <span class="inline-flex items-center pt-3">
              <img
                :src="
                  require(`@/assets/img/flags/locale/${header.value}.svg`)
                    .default
                "
                class="h-6 w-6 rounded-full mr-2"
              />
              <span>{{ header.text }}</span>
            </span>
          </template>
          <template v-slot:header-content-more="{ header }">
            <span class="inline-flex items-center pt-3">
              <Icon class="mr-2">
                {{ icons.ziGlobe }}
              </Icon>
              <span>{{ header.text }}</span>
            </span>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="(item, index) in items">
              <tr
                v-if="item.group"
                :key="item.groupName"
                :style="{ background: 'transparent' }"
              >
                <td
                  :colspan="headers.length"
                  :style="{ height: '32px', paddingLeft: '46px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> ({{
                    item.groupItemsCount
                  }})
                </td>
              </tr>
              <tr
                v-else
                :key="index"
                class="cursor-default"
                :class="{
                  'text-white expanded': expanded.includes(item.id),
                  'text-gray-300': item.isHidden,
                }"
                tabindex="0"
              >
                <td
                  v-for="header in headers"
                  :key="header.value"
                  :class="[
                    'truncate',
                    { 'text-right': header.value === 'more' },
                    header.value === 'status' ? 'relative p-0' : 'px-3',
                  ]"
                  @click="header.value !== 'status' ? toggle(item.id) : null"
                >
                  <div v-if="header.value === 'status'" class="inline-block">
                    <span
                      :class="[
                        'absolute top-0 left-0 w-0.5 h-full',
                        item.status === 'DRAFT'
                          ? 'bg-pink-500'
                          : item.status === 'APPROVED'
                          ? 'bg-green-500'
                          : '',
                      ]"
                    />
                    <input
                      v-model="selected"
                      :id="item.id"
                      :value="item.id"
                      type="checkbox"
                      class="inline-flex align-middle ml-3"
                    />
                  </div>
                  <span
                    v-if="header.value === 'more'"
                    class="inline-flex items-center justify-end align-middle"
                  >
                    <button
                      class="
                        flex
                        items-center
                        jusitfy-center
                        text-blue-500
                        hover:text-blue-400
                        focus:text-blue-400
                        focus:outline-none
                        cursor-pointer
                        mr-2
                      "
                      @click.prevent.stop="openEditItem(item)"
                    >
                      <Icon small>
                        {{ icons.ziEdit }}
                      </Icon>
                    </button>
                    <button
                      class="
                        text-blue-500
                        focus:text-blue-400
                        hover:text-blue-400
                        focus:outline-none
                        ml-auto
                      "
                    >
                      <Icon
                        class="transition-transform"
                        :class="{
                          'transform rotate-90': expanded.includes(item.id),
                        }"
                      >
                        {{ icons.ziChevronRight }}
                      </Icon>
                    </button>
                  </span>
                  <span v-else class="inline-flex items-center max-w-full">
                    <span class="flex-grow truncate">
                      {{ item[header.key] }}
                    </span>
                    <i
                      v-if="item[`${header.key}_ct`]"
                      class="text-gray-200 flex-shrink-0 ml-1"
                    >
                      <Icon :base="false">
                        {{ icons.ziLanguages }}
                      </Icon>
                    </i>
                  </span>
                </td>
              </tr>
              <tr
                v-if="expanded.includes(item.id)"
                :key="`expand-${item.id}`"
                class="expand bg-transparent"
                style="background-color: transparent"
              >
                <td :colspan="headers.length" class="relative p-0">
                  <div
                    class="bg-gray-700 rounded-b-md py-2 px-3 -mt-1"
                    style="min-height: 52px"
                  >
                    <WordProducts
                      :word="item"
                      :items="item.products"
                      @refetch="refetchListWords"
                    />
                  </div>
                  <div
                    class="
                      absolute
                      inset-x-0
                      top-0
                      pointer-events-none
                      opacity-50
                      h-6
                      bg-gradient-to-b
                      from-gray-900
                      to-gray-900-a-0
                      -mt-1
                    "
                  />
                </td>
              </tr>
            </template>
          </template>

          <template v-slot:no-data>
            <div
              v-html="$t('words.noData')"
              class="text-center text-gray-200 leading-tight py-4"
            />
          </template>
        </DataTable>
        <Btn block outlined class="mt-4" @click="wordCreateDialog = true">
          <Icon class="text-gray-100 mr-2.5">
            {{ icons.ziEdit }}
          </Icon>
          <span>{{ $t('words.addWord') }}</span>
        </Btn>
      </div>
      <WordDialog
        v-model="wordCreateDialog"
        :org-id="orgId"
        create
        is-admin
        @create="onWordCreate"
      />
      <WordDialog
        v-model="wordEditDialog"
        :org-id="orgId"
        :item="editItem"
        is-admin
        @update="onWordUpdate"
      />
      <WordDialog
        v-model="wordMergeDialog"
        :org-id="orgId"
        :item="mergeItem"
        :title="$t('words.mergeWords')"
        is-admin
        submit-result
        @update="onWordMerge"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import {
  ziEdit,
  ziGlobe,
  ziLanguages,
  ziUserCircle,
  ziSearch,
  ziFilter,
  ziFilterOutline,
  ziChevronRight,
} from '@zennnn/icons'
import {
  Btn,
  Icon,
  Menu,
  MenuItem,
  Progress,
  TextField,
  DataTable,
} from '@zennnn/core'

import { LIST_WORDS } from '../../graphql/admin/queries'
import {
  APPROVE_WORDS,
  HIDE_WORDS,
  MERGE_WORDS,
} from '../../graphql/admin/mutations'
import { LOCALES_LIST } from '../../config/globals'

import WordProducts from '../../components/WordProducts.vue'
import LocalePicker from '../../components/LocalePicker.vue'
import WordDialog from '../../components/WordDialog.vue'

export default {
  name: 'WordList',
  components: {
    Btn,
    Icon,
    Menu,
    MenuItem,
    Progress,
    DataTable,
    TextField,
    WordProducts,
    LocalePicker,
    WordDialog,
  },
  setup() {
    const loggedOut = ref(false)
    const queryLoading = ref(false)
    const currentFilter = ref(null)

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const filters = computed(() => {
      return {
        status: statusFilter.value,
        showHiddens: currentFilter.value === 'HIDDEN',
        all: currentFilter.value === 'ALL',
      }
    })

    const statusFilter = computed(() => {
      switch (currentFilter.value) {
        case 'DRAFT':
          return 'DRAFT'
        case 'APPROVED':
          return 'APPROVED'
        default:
          return null
      }
    })

    const {
      result,
      loading,
      refetch: listWordsRefetch,
    } = useQuery(
      LIST_WORDS,
      () => ({
        filters: filters.value,
      }),
      () => ({
        enabled: !loggedOut.value,
        fetchPolicy: 'cache-and-network',
      })
    )
    const listWords = useResult(result)

    watch(loading, (val) => {
      if (val) {
        queryLoading.value = true
      } else {
        setTimeout(() => {
          queryLoading.value = false
        }, 200)
      }
    })

    return {
      icons: {
        ziGlobe,
        ziLanguages,
        ziUserCircle,
        ziEdit,
        ziSearch,
        ziFilter,
        ziFilterOutline,
        ziChevronRight,
      },
      apolloClient,
      loggedOut,
      queryLoading,
      currentFilter,
      filters,
      statusFilter,
      loading,
      listWords,
      listWordsRefetch,
    }
  },
  data() {
    return {
      orgId: '',
      search: undefined,
      deleteLoading: null,
      wordCreateDialog: false,
      wordEditDialog: false,
      wordMergeDialog: false,
      expanded: [],
      editItem: {},
      selected: [],
      selectAll: false,
      approveLoading: false,
      mergeLoading: false,
      filterMenu: false,
      mergeItem: {},
      hideLoading: false,
    }
  },
  computed: {
    currentFilterText() {
      switch (this.currentFilter) {
        case 'DRAFT':
          return this.$t('words.DRAFT')
        case 'APPROVED':
          return this.$t('words.APPROVED')
        case 'DUPLICATES':
          return this.$t('words.DUPLICATES')
        case 'HIDDEN':
          return this.$t('words.HIDDEN')
        case 'ALL':
          return this.$t('words.ALL')
        default:
          return this.$t('words.noFilter')
      }
    },
    filtersItems() {
      return [
        {
          text: this.$t('words.noFilter'),
          value: null,
        },
        {
          text: this.$t('words.DRAFT'),
          value: 'DRAFT',
        },
        {
          text: this.$t('words.APPROVED'),
          value: 'APPROVED',
        },
        {
          text: this.$t('words.DUPLICATES'),
          value: 'DUPLICATES',
        },
        {
          text: this.$t('words.HIDDEN'),
          value: 'HIDDEN',
        },
        {
          text: this.$t('words.ALL'),
          value: 'ALL',
        },
      ]
    },
    locales() {
      const items = LOCALES_LIST.map((el) => {
        return {
          ...el,
          key: el.value,
        }
      })
      const currentLocale = this.$i18n.locale
      const currentLocaleIndex = items.findIndex(
        (el) => el.value === currentLocale
      )
      if (currentLocaleIndex !== -1) {
        const removed = items.splice(currentLocaleIndex, 1)
        return [...removed, ...items]
      }
      return items
    },
    headers() {
      const locales = this.locales.map((el) => {
        return {
          ...el,
          width: '130px',
          sortable: false,
          align: 'left',
          class: 'px-3',
        }
      })
      const status = {
        text: '',
        value: 'status',
        width: '30px',
        sortable: false,
        class: 'p-0',
      }
      const more = {
        text: this.$t('words.more'),
        value: 'more',
        width: '80px',
        sortable: false,
        align: 'left',
        class: 'px-3',
      }
      return [status, ...locales, more]
    },
    items() {
      const items = (this.listWords && this.listWords.items) || []
      if (this.currentFilter === 'DUPLICATES') {
        const map = items.map((item) => {
          let duplicatesSearch = ''
          const result = Object.assign({}, item)
          const values = item.values || []
          LOCALES_LIST.forEach((locale) => {
            const key = locale.value
            const value = values.find((v) => v.k === key)
            if (value) {
              result[key] = value.v || value.tr || ''
              result[`${key}_ct`] = !value.v && value.tr
              const search = result[key].trim().toLocaleLowerCase()
              duplicatesSearch += `${search}~`
            }
          })
          result.duplicatesSearch = duplicatesSearch
          return result
        })
        return map
      }
      return items.map((item) => {
        const result = Object.assign({}, item)
        const values = item.values || []
        LOCALES_LIST.forEach((locale) => {
          const key = locale.value
          const value = values.find((v) => v.k === key)
          if (value) {
            result[key] = value.v || value.tr || ''
            result[`${key}_ct`] = !value.v && value.tr
          }
        })
        return result
      })
    },
    groupBy() {
      return this.currentFilter === 'DUPLICATES'
        ? ['duplicatesSearch']
        : [this.$i18n.locale]
    },
    groupDesc() {
      return [false]
    },
  },
  watch: {
    selected(val) {
      const el = this.$refs['select-all']
      if (!el) return
      if (val.length > 0 && val.length === this.items.length) {
        el.indeterminate = false
        el.checked = true
      } else if (val.length > 0 && val.length < this.items.length) {
        el.indeterminate = true
        el.checked = false
      } else if (val.length === 0) {
        el.indeterminate = false
        el.checked = false
      }
    },
    currentFilter() {
      this.selected = []
    },
    search() {
      this.selected = []
    },
  },
  methods: {
    async refetchListWords() {
      this.queryLoading = true
      await this.listWordsRefetch()
    },
    onSelectAll(e) {
      const target = e.target
      if (target.checked || target.indeterminate) {
        this.selected = this.items.map((el) => el.id)
      } else {
        this.selected = []
      }
    },
    openEditItem(item) {
      this.editItem = item
      this.$nextTick(() => {
        this.wordEditDialog = true
      })
    },
    toggle(id) {
      if (this.expanded.indexOf(id) > -1) {
        const expIndex = this.expanded.indexOf(id)
        this.expanded.splice(expIndex, 1)
      } else {
        this.expanded.push(id)
      }
    },
    onWordCreate() {
      this.wordCreateDialog = false
      this.refetchListWords()
    },
    onWordUpdate() {
      this.wordEditDialog = false
    },
    openMergeItem() {
      const items = this.items.filter((item) => this.selected.includes(item.id))
      const status = items.some((el) => el.status === 'APPROVED')
        ? 'APPROVED'
        : 'DRAFT'
      let itemIndex = 0
      if (status === 'APPROVED') {
        itemIndex = items.findIndex((el) => el.status === 'APPROVED')
      } else {
        // TODO: set value with max values?
        itemIndex = 0
      }
      const defaultItem = items[itemIndex]
      const item = {
        defaultLocale: defaultItem.defaultLocale,
        values: defaultItem.values.slice(),
      }
      this.mergeItem = item
      this.$nextTick(() => {
        this.wordMergeDialog = true
      })
    },
    async onWordMerge(input) {
      if (this.selected.length === 0) return
      this.wordMergeDialog = false
      const selected = this.selected.slice()
      try {
        this.mergeLoading = true
        await this.apolloClient.mutate({
          mutation: MERGE_WORDS,
          variables: {
            ids: selected,
            input,
          },
        })
        this.selected = []
        this.refetchListWords()
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.mergeLoading = false
      }
    },
    customGroup(items, groupBy, groupDesc) {
      const key = groupBy[0]
      const isDuplicatesSearch = key === 'duplicatesSearch'
      const desc = groupDesc[0]
      const re =
        /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
        if (isDuplicatesSearch) {
          if (Object.prototype.hasOwnProperty.call(acc, name)) {
            acc[name].push(curr)
          } else {
            acc[name] = [curr]
          }
        } else {
          const char = name.charAt(0).toLocaleUpperCase()
          if (re.test(char)) {
            if (Object.prototype.hasOwnProperty.call(acc, char)) {
              acc[char].push(curr)
            } else {
              acc[char] = [curr]
            }
          } else {
            others.push(curr)
          }
        }
        return acc
      }, {})
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.forEach((k) => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        if (isDuplicatesSearch) {
          if (groupItems.length > 1) {
            result.push(group)
          }
        } else {
          result.push(group)
        }
      })
      if (others.length > 0) {
        if (desc) {
          result.unshift({ name: '#', items: others })
        } else {
          result.push({ name: '#', items: others })
        }
      }
      return result
    },
    async logout() {
      await this.$auth.signOut()
      this.loggedOut = true
      this.apolloClient.resetStore()
      this.$router.push({ name: 'login' })
    },
    async approveWords() {
      if (this.selected.length === 0) return
      const selected = this.selected.slice()
      try {
        this.approveLoading = true
        await this.apolloClient.mutate({
          mutation: APPROVE_WORDS,
          variables: {
            ids: selected,
          },
          update: (store) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: LIST_WORDS,
              variables: { filters: this.filters },
            })
            // Add our tag from the mutation to the end
            selected.forEach((id) => {
              const index = data.listWords.items.findIndex((el) => el.id === id)
              if (index !== -1) {
                data.listWords.items[index].status = 'APPROVED'
              }
            })
            // Write our data back to the cache.
            store.writeQuery({
              query: LIST_WORDS,
              variables: { filters: this.filters },
              data,
            })
          },
        })
        this.selected = []
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.approveLoading = false
      }
    },
    async hideWords() {
      if (this.selected.length === 0) return
      const selected = this.selected.slice()
      try {
        this.hideLoading = true
        await this.apolloClient.mutate({
          mutation: HIDE_WORDS,
          variables: {
            ids: selected,
          },
          update: (store) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: LIST_WORDS,
              variables: { filters: this.filters },
            })
            // Add our tag from the mutation to the end
            if (this.filters.showHiddens) {
              selected.forEach((id) => {
                const index = data.listWords.items.findIndex(
                  (el) => el.id === id
                )
                if (index !== -1) {
                  data.listWords.items[index].isHidden = true
                }
              })
            } else {
              data.listWords.items = data.listWords.items.filter(
                (el) => !selected.includes(el.id)
              )
            }
            // Write our data back to the cache.
            store.writeQuery({
              query: LIST_WORDS,
              variables: { filters: this.filters },
              data,
            })
          },
        })
        this.selected = []
      } catch (error) {
        this.$notify({
          color: 'error',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.hideLoading = false
      }
    },
  },
}
</script>
