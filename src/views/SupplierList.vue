<template>
  <div>
    <div class="container container--sm">
      <div class="pt-4 pb-10">
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-4">
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

        <DataTable
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          :headers="headers"
          :items="items"
          :search="search"
          :custom-filter="customFilter"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          :loading="loading"
          table-width="100%"
          table-class="table-fixed"
          hoverable
        >
          <template v-slot:header-content-dealsCount>
            <Icon size="20" class="align-middle">
              {{ icons.ziBagDeal }}
            </Icon>
            <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="188">
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span>
                {{ $t('suppliers.currentDealsAmount') }}
              </span>
            </Tooltip>
          </template>
          <template v-slot:header-content-cost>
            <Icon class="align-middle">
              {{ icons.ziMoneyPlus }}
            </Icon>
            <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="190">
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span>
                {{ $t('suppliers.dealsAmountHint') }}
              </span>
            </Tooltip>
          </template>
          <template v-slot:header-content-debt>
            <Icon class="align-middle">
              {{ icons.ziMoneyMinus }}
            </Icon>
            <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="210">
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span>
                {{ $t('suppliers.totalDebtHint') }}
              </span>
            </Tooltip>
          </template>
          <template v-slot:header-content-totalCost>
            <Icon class="align-middle">
              {{ icons.ziMoneyTernover }}
            </Icon>
            <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="190">
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span>
                {{ $t('suppliers.turnoverHint') }}
              </span>
            </Tooltip>
          </template>
          <template v-slot:header-content-contactPhone>
            <Icon class="align-middle">
              {{ icons.ziPhone }}
            </Icon>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="(item, i) in items">
              <tr
                v-if="item.group"
                :key="item.groupName"
                :style="{ background: 'transparent' }"
              >
                <td
                  :colspan="headers.length"
                  :style="{ height: i === 0 ? '16px' : '32px', paddingLeft: '51px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> ({{ item.groupItemsCount }})
                </td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="cursor-default"
                tabindex="0"
                @click="goToSupplier(item.id)"
                @keydown.enter.exact.self="goToSupplier(item.id)"
              >
                <td></td>
                <td class="truncate">{{ item.companyName }}</td>
                <td class="truncate text-right">{{ $n(item.dealsCount || 0) }}</td>
                <td class="truncate text-right">{{ $n(item.cost || 0) }}</td>
                <td :class="['truncate text-right', { 'text-pink-500': item.debt > 0 }]">{{ $n(item.debt || 0) }}</td>
                <td class="truncate text-right">{{ $n(item.totalCost || 0) }}</td>
                <td class="truncate pl-8 pr-2">{{ item.contactPersonFullName }}</td>
                <td class="whitespace-nowrap pr-4">
                  <div class="overflow-x-scroll scrolling-touch scrollbar-hidden flex items-center align-middle rounded-lg space-x-1">
                    <div
                      v-for="(tag, i) in item.tagsArray"
                      :key="i"
                      class="h-6 inline-flex items-center bg-blue-500 bg-opacity-40 rounded-lg px-1"
                    >
                      {{ tag }}
                    </div>
                  </div>
                </td>
                <td class="truncate pointer-events-none" @click.stop>
                  <span v-if="item.contactPhone" class="pointer-events-auto">
                    <a
                      :href="`tel:${item.contactPhone}`"
                      class="inline-block align-middle text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none"
                    >
                      <Icon>
                        {{ icons.ziPhone }}
                      </Icon>
                    </a>
                    <Icon class="text-gray-200 align-middle cursor-default ml-1">
                      {{ icons.ziAction }}
                    </Icon>
                  </span>
                </td>
                <td class="truncate text-right">{{ item.uid }}</td>
                <td class="text-center pointer-events-none" @click.prevent.stop>
                  <button
                    class="cursor-pointer pointer-events-auto flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-auto"
                    @click="deleteSupplier(item.id)"
                  >
                    <Icon>
                      {{ icons.ziDelete }}
                    </Icon>
                  </button>
                </td>
              </tr>
            </template>
          </template>

          <template v-slot:no-data>
            <div
              v-html="$t('suppliers.noData')"
              class="text-center text-gray-200 leading-tight py-4"
            />
          </template>

        </DataTable>
        <Btn
          block
          outlined
          class="mt-4"
          @click="$router.push({
            name: 'supplier-create',
            params: { orgId },
          })"
        >
          <Icon class="text-gray-200 mr-sm">
            {{ icons.ziBoxes }}
          </Icon>
          <span>{{ $t('suppliers.createSupplier') }}</span>
        </Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import {
  ziSearch,
  ziDelete,
  ziBagDeal,
  ziAction,
  ziPhone,
  ziBoxes,
  ziMoneyPlus,
  ziMoneyMinus,
  ziMoneyTernover,
  ziQuestionSign,
} from '../assets/icons'

import { LIST_SUPPLIERS } from '@/graphql/queries'
import { DELETE_SUPPLIER } from '@/graphql/mutations'

import { confirmDialog, wrapInArray } from '@/util/helpers'

import Btn from '../components/Base/Btn'
import Icon from '../components/Base/Icon'
import Tooltip from '../components/Base/Tooltip'
import DataTable from '../components/Base/DataTable'
import TextField from '../components/Base/TextField'

export default {
  name: 'Suppliers',
  components: {
    Btn,
    Icon,
    Tooltip,
    DataTable,
    TextField,
  },
  setup () {
    const { resolveClient } = useApolloClient()
    const route = useRoute()
    const orgId = route.params.orgId

    const { result, loading } = useQuery(LIST_SUPPLIERS, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listSuppliers = useResult(result)

    return {
      icons: {
        ziSearch,
        ziDelete,
        ziBagDeal,
        ziAction,
        ziPhone,
        ziBoxes,
        ziMoneyPlus,
        ziMoneyMinus,
        ziMoneyTernover,
        ziQuestionSign,
      },
      resolveClient,
      orgId,
      loading,
      listSuppliers,
    }
  },
  data () {
    return {
      sortBy: [],
      sortDesc: [],
      search: undefined,
      createLoading: false,
      deleteLoading: null,
      errors: [],
    }
  },
  computed: {
    groupBy () {
      return this.sortBy.length === 0 || this.sortBy[0] === 'companyName' ? ['companyName'] : []
    },
    groupDesc () {
      return this.groupBy[0] === 'companyName' ? this.sortDesc : []
    },
    headers () {
      return [
        { text: '', value: 'zAccount', width: 50, sortable: false },
        { text: this.$t('suppliers.companyName'), value: 'companyName', align: 'left', width: 222, minWidth: 222, sortable: true },
        { text: '', value: 'dealsCount', width: 46, sortable: true },
        { text: '', value: 'cost', align: 'right', width: 100, sortable: true },
        { text: '', value: 'debt', align: 'right', width: 100, sortable: true },
        { text: '', value: 'totalCost', align: 'right', width: 100, sortable: true },
        { text: this.$t('suppliers.contactPerson'), value: 'contactPersonFullName', align: 'left', width: 186, class: 'pl-8 pr-2', sortable: true },
        { text: this.$t('suppliers.tags'), value: 'tags', align: 'left', width: 126, sortable: true },
        { text: '', value: 'contactPhone', align: 'left', width: 60, minWidth: 60, sortable: true },
        { text: this.$t('suppliers.usn'), value: 'usn', align: 'right', width: 60, minWidth: 60, class: 'whitespace-nowrap', sortable: true },
        { text: '', value: 'actions', width: 54 },
      ]
    },
    items () {
      const items = (this.listSuppliers && this.listSuppliers.items) || []
      return items.map(item => {
        const tags = item.tags || []
        return {
          ...item,
          tags: tags.join(','),
          tagsArray: tags,
          usn: item.uid,
        }
      })
    },
  },
  created () {
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }
    if (this.$route.query.sort) {
      this.sortBy = wrapInArray(this.$route.query.sort)
      const desc = this.$route.query.desc === true || this.$route.query.desc === 'true'
      this.sortDesc = [!!(this.$route.query.sort && desc)]
    }
    // on search on server, escape input string
    this.$watch('search', (val, old) => {
      if (val === old) return
      this.updateRouteQuery()
    })
    this.$watch('sortBy', this.updateRouteQuery)
    this.$watch('sortDesc', this.updateRouteQuery)
    this.$watch('$route.query', (query, old) => {
      if (query.q !== this.search) {
        this.search = query.q
      }
      if (query.sort !== this.sortBy[0]) {
        this.sortBy = query.sort ? wrapInArray(query.sort) : []
      }
      this.sortDesc = this.sortBy.length > 0 ? [query.desc === true || query.desc === 'true'] : []
    })
  },
  methods: {
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
    updateRouteQuery () {
      const query = {}
      if (this.search) {
        query.q = this.search
      }
      if (this.sortBy[0]) {
        query.sort = this.sortBy[0]
      }
      if (this.sortDesc[0]) {
        query.desc = true
      }
      this.$router.replace({
        path: this.$route.path,
        query,
      })
    },
    customFilter (value, search) {
      if (search != null && value != null && typeof value !== 'boolean') {
        const words = search
          .split(',')
          .map(s => s.trim().toLocaleLowerCase())
          .filter(s => !!s)
        const v = value.toString().toLocaleLowerCase()
        return words.every(w => v.indexOf(w) !== -1)
      } else {
        return false
      }
    },
    goToSupplier (supplierId) {
      this.$router.push({
        name: 'supplier',
        params: { orgId: this.orgId, supplierId },
      })
    },
    async deleteSupplier (id) {
      try {
        const client = this.resolveClient()
        const msg = this.$t('alert.removeSupplier')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await client.mutate({
          mutation: DELETE_SUPPLIER,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: LIST_SUPPLIERS,
              variables: {
                orgId: this.orgId,
              },
            })
            const index = data.listSuppliers.items.findIndex(item => item.id === id)
            if (index !== -1) {
              data.listSuppliers.items.splice(index, 1)
            }
            store.writeQuery({
              query: LIST_SUPPLIERS,
              variables: {
                orgId: this.orgId,
              },
              data,
            })
          },
        })
        if (response && response.errors && response.errors.length > 0) {
          throw response
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'DeleteSupplierError',
        //   attributes: {
        //     error: message
        //   }
        // })
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>
