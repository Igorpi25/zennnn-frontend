<template>
  <div class="container">
    <div class="pt-4 pb-10">

      <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-6">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :control-class="search ? 'bg-transparent dark:bg-transparent ring-1 ring-blue-500' : 'bg-transparent dark:bg-transparent'"
          :prepend-icon="icons.ziSearch"
          class="w-full md:max-w-md"
          input-class="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
        >
        </TextField>
      </div>

      <div class="font-semibold text-white text-2xl leading-tight whitespace-nowrap overflow-x-auto scrolling-touch pb-4">
        <router-link
          :to="{ name: 'requisites', params: { orgId } }"
          class="text-gray-200 hover:text-white focus:text-white focus:outline-none transition-colors duration-75 ease-out mr-10"
        >
          {{ $t('requisites.title') }}
        </router-link>
        <span class="relative">
          {{ $t('header.dictionary') }}
          <transition name="fade-transition">
            <div
              v-if="loading"
              class="absolute right-0 -mr-6 inline-block text-gray-200"
            >
              <Progress
                indeterminate
                size="20"
                width="2"
              />
            </div>
          </transition>
        </span>
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
        table-class="table-fixed"
        hoverable
      >
        <template v-slot:header-content-en="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ header.text }}</span>
          </span>
        </template>
        <template v-slot:header-content-fr="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ header.text }}</span>
          </span>
        </template>
        <template v-slot:header-content-zh-Hans="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ header.text }}</span>
          </span>
        </template>
        <template v-slot:header-content-zh-Hant="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ header.text }}</span>
          </span>
        </template>
        <template v-slot:header-content-ru="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ header.text }}</span>
          </span>
        </template>
        <template v-slot:header-content-uk="{ header }">
          <span class="inline-flex items-center pt-3">
            <img
              :src="require(`@/assets/img/flags/locale/${header.value}.svg`).default"
              class="h-6 w-6 rounded-full mr-2"
            >
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
                :style="{ height: '32px', paddingLeft: '12px' }"
                class="text-gray-200 text-base leading-tight align-bottom p-0"
              >
                <span class="text-white">{{ item.groupName }}</span> ({{ item.groupItemsCount }})
              </td>
            </tr>
            <tr
              v-else
              :key="index"
              class="cursor-default"
              :class="{ 'text-white expanded': expanded.includes(item.id) }"
              tabindex="0"
              @click="toggle(item.id)"
            >
              <td
                v-for="header in headers"
                :key="header.value"
                :class="['truncate px-3', { 'text-right': header.value === 'more' }]"
              >
                <span v-if="header.value === 'more'" class="inline-flex items-center justify-end align-middle">
                  <button
                    class="flex items-center jusitfy-center text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none cursor-pointer mr-2"
                    @click.prevent.stop="openEditItem(item)"
                  >
                    <Icon size="20">
                      {{ icons.ziEdit }}
                    </Icon>
                  </button>
                  <button
                    class="flex items-center text-blue-500 focus:text-blue-400 hover:text-blue-400 focus:outline-none ml-auto"
                  >
                    <Icon
                      class="transition-transform"
                      :class="{ 'transform rotate-90': expanded.includes(item.id) }"
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
              style="background-color: transparent;"
            >
              <td :colspan="headers.length" class="relative p-0">
                <div class="bg-gray-700 rounded-b-md py-2 px-3 -mt-1" style="min-height: 52px;">
                  <WordSpecs
                    :org-id="orgId"
                    :word-id="item.id"
                  />
                </div>
                <div
                  class="absolute inset-x-0 top-0 pointer-events-none opacity-50 h-6 bg-gradient-to-b from-gray-900 to-gray-900-a-0 -mt-1"
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
      <Btn
        block
        outlined
        class="mt-4"
        @click="wordCreateDialog = true"
      >
        <Icon size="20" class="text-gray-200 mr-sm">
          {{ icons.ziEdit }}
        </Icon>
        <span>{{ $t('words.addWord') }}</span>
      </Btn>
    </div>
    <WordDialog
      v-model="wordCreateDialog"
      :org-id="orgId"
      create
      @create="onWordCreate"
    />
    <WordDialog
      v-model="wordEditDialog"
      :org-id="orgId"
      :item="editItem"
      @update="onWordUpdate"
    />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useQuery, useResult } from '@vue/apollo-composable'

import { ziEdit, ziGlobe, ziSearch, ziLanguages, ziChevronRight } from '@zennnn/icons'
import { Btn, Icon, Progress, TextField, DataTable } from '@zennnn/core'

import { LIST_WORDS } from '../graphql/queries'

import { LOCALES_LIST } from '../config/globals'

import WordDialog from '../components/WordDialog.vue'
import WordSpecs from '../components/WordSpecs.vue'

export default {
  name: 'WordList',
  components: {
    Btn,
    Icon,
    Progress,
    DataTable,
    TextField,
    WordDialog,
    WordSpecs,
  },
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId

    const { result, loading, refetch: listWordsRefetch } = useQuery(LIST_WORDS, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listWords = useResult(result)

    return {
      orgId,
      loading,
      listWords,
      listWordsRefetch,
    }
  },
  data () {
    return {
      search: undefined,
      deleteLoading: null,
      wordCreateDialog: false,
      wordEditDialog: false,
      expanded: [],
      editItem: {},
      icons: {
        ziEdit,
        ziGlobe,
        ziSearch,
        ziLanguages,
        ziChevronRight,
      },
    }
  },
  computed: {
    locales () {
      const items = LOCALES_LIST.map(el => {
        return {
          ...el,
          key: el.value,
        }
      })
      const currentLocale = this.$i18n.locale
      const currentLocaleIndex = items.findIndex(el => el.value === currentLocale)
      if (currentLocaleIndex !== -1) {
        const removed = items.splice(currentLocaleIndex, 1)
        return [...removed, ...items]
      }
      return items
    },
    localesMap () {
      return this.locales.reduce((acc, curr) => {
        acc[curr.key] = { ...curr }
        return acc
      }, {})
    },
    headers () {
      const locales = this.locales.map(el => {
        return {
          ...el,
          width: '130px',
          sortable: false,
          align: 'left',
          class: 'px-3',
        }
      })
      const more = {
        text: this.$t('words.more'),
        value: 'more',
        width: '80px',
        sortable: false,
        align: 'left',
        class: 'px-3',
      }
      return [...locales, more]
    },
    items () {
      const items = (this.listWords && this.listWords.items) || []
      return items.map(item => {
        const result = Object.assign({}, item)
        const values = item.values || []
        LOCALES_LIST.forEach(locale => {
          const key = locale.value
          const value = values.find(v => v.k === key)
          if (value) {
            result[key] = value.v || value.tr || ''
            result[`${key}_ct`] = !value.v && value.tr
          }
        })
        return result
      })
    },
    groupBy () {
      return [this.$i18n.locale]
    },
    groupDesc () {
      return [false]
    },
  },
  methods: {
    openEditItem (item) {
      this.editItem = item
      this.$nextTick(() => {
        this.wordEditDialog = true
      })
    },
    toggle (id) {
      if (this.expanded.indexOf(id) > -1) {
        const expIndex = this.expanded.indexOf(id)
        this.expanded.splice(expIndex, 1)
      } else {
        this.expanded.push(id)
      }
    },
    onWordCreate (result) {
      this.wordCreateDialog = false
      this.listWordsRefetch()
    },
    onWordUpdate () {
      this.wordEditDialog = false
    },
    customGroup (items, groupBy, groupDesc) {
      const key = groupBy[0]
      const desc = groupDesc[0]
      const re = /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
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
        return acc
      }, {})
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.forEach(k => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        result.push(group)
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
  },
}
</script>
