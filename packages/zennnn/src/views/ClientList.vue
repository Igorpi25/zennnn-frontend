<template>
  <div class="container">
    <div class="pt-4 pb-10">
      <div class="flex items-end flex-wrap lg:flex-nowrap justify-between">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :control-class="
            search
              ? 'bg-transparent dark:bg-transparent ring-1 ring-blue-500'
              : 'bg-transparent dark:bg-transparent'
          "
          :prepend-icon="icons.ziSearch"
          class="w-full lg:w-auto lg:flex-grow md:max-w-md pb-4 lg:pr-8"
          input-class="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
        >
        </TextField>
        <div class="h-11 flex lg:inline-flex overflow-x-auto scrolling-touch">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="clientType === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t',
              'select-none whitespace-nowrap cursor-pointer',
              'transition-colors duration-100 ease-in px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled
                ? 'pointer-events-none opacity-40'
                : 'focus:outline-none focus:text-white hover:text-white',
              clientType === tab.value
                ? 'text-white bg-gray-800'
                : 'bg-transparent',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchClientType(tab.value)"
            @keydown.enter.exact="switchClientType(tab.value)"
          >
            <span class="relative">
              <div
                class="
                  absolute
                  top-0
                  right-0
                  text-13
                  font-semibold
                  transform
                  translate-x-full
                  -mt-1
                  -mr-1
                "
              >
                <transition
                  @before-enter="
                    (el) => {
                      el.style.transformOrigin = 'center center'
                      el.style.webkitTransformOrigin = 'center center'
                    }
                  "
                  name="scale-transition"
                >
                  <div
                    v-if="
                      search &&
                      clientType !== tab.value &&
                      filteredItemsLength[tab.value] > 0
                    "
                    style="min-width: 1rem"
                    class="
                      h-4
                      flex
                      justify-center
                      items-center
                      relative
                      rounded-full
                      text-white
                      bg-purple-500
                      px-0.5
                    "
                  >
                    <span>
                      {{
                        filteredItemsLength[tab.value] > 99
                          ? '99+'
                          : filteredItemsLength[tab.value]
                      }}
                    </span>
                  </div>
                </transition>
              </div>
              {{ tab.text }}
            </span>
          </div>
        </div>
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
        table-class="table-fixed rounded-tl-none md:rounded-tl-md rounded-tr-none sm:rounded-tr-md md:rounded-tr-none"
        hoverable
      >
        <template v-slot:header-content-dealsSearch>
          <Tooltip
            placement="top-start"
            distance="2"
            skidding="-16"
            origin="24px 100%"
            max-width="162"
          >
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('clients.dealsSearchHint') }}
            </span>
          </Tooltip>
        </template>
        <template v-slot:header-content-dealsCount>
          <Icon size="20" class="align-middle">
            {{ icons.ziBagDeal }}
          </Icon>
          <Tooltip
            placement="top-start"
            distance="2"
            skidding="-16"
            origin="24px 100%"
          >
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('clients.currentDealsAmount') }}
            </span>
          </Tooltip>
        </template>
        <template v-slot:header-content-prepayment>
          <Icon class="align-middle">
            {{ icons.ziMoneyPlus }}
          </Icon>
          <Tooltip
            placement="top-start"
            distance="2"
            skidding="-16"
            origin="24px 100%"
            max-width="152"
          >
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('clients.totalPrepaymentHint') }}
            </span>
          </Tooltip>
        </template>
        <template v-slot:header-content-debt>
          <Icon class="align-middle">
            {{ icons.ziMoneyMinus }}
          </Icon>
          <Tooltip
            placement="top-start"
            distance="2"
            skidding="-16"
            origin="24px 100%"
            max-width="200"
          >
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('clients.debtHint') }}
            </span>
          </Tooltip>
        </template>
        <template v-slot:header-content-turnover>
          <Icon class="align-middle">
            {{ icons.ziMoneyTernover }}
          </Icon>
          <Tooltip
            placement="top-start"
            distance="2"
            skidding="-16"
            origin="24px 100%"
            max-width="135"
          >
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('clients.turnoverHint') }}
            </span>
          </Tooltip>
        </template>
        <template v-slot:header-content-contactPhone>
          <Icon>
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
                :style="{
                  height: i === 0 ? '16px' : '32px',
                  paddingLeft: '51px',
                }"
                class="text-gray-200 text-base leading-tight align-bottom p-0"
              >
                <span class="text-white">{{ item.groupName }}</span> ({{
                  item.groupItemsCount
                }})
              </td>
            </tr>
            <tr
              v-else
              :key="item.id"
              class="cursor-default"
              tabindex="0"
              @click="goToClient(item)"
              @keydown.enter.exact.self="goToClient(item)"
            >
              <td></td>
              <td class="truncate">{{ item.fullName }}</td>
              <td
                class="text-center pointer-events-none"
                @click.stop="goToClientSpecs(item)"
              >
                <Icon
                  class="
                    text-gray-200
                    align-middle
                    cursor-pointer
                    pointer-events-auto
                  "
                >
                  {{ icons.ziSearch }}
                </Icon>
              </td>
              <td class="truncate text-right">
                {{ $n(item.dealsCount || 0) }}
              </td>
              <td class="truncate text-right">
                {{ $n(item.prepayment || 0) }}
              </td>
              <td
                :class="[
                  'truncate text-right',
                  { 'text-pink-500': item.debt > 0 },
                ]"
              >
                {{ $n(item.debt || 0) }}
              </td>
              <td class="truncate text-right">{{ $n(item.turnover || 0) }}</td>
              <td class="truncate pl-8 pr-2">
                {{ item.contactPersonFullName }}
              </td>
              <td class="whitespace-nowrap pr-4">
                <div
                  class="
                    overflow-x-scroll
                    scrolling-touch
                    scrollbar-hidden
                    flex
                    items-center
                    align-middle
                    rounded-lg
                    space-x-1
                  "
                >
                  <div
                    v-for="(tag, i) in item.tagsArray"
                    :key="i"
                    class="
                      h-6
                      inline-flex
                      items-center
                      bg-gray-400
                      rounded-lg
                      px-1
                    "
                  >
                    {{ tag }}
                  </div>
                </div>
              </td>
              <td class="truncate pointer-events-none" @click.stop>
                <span v-if="item.contactPhone" class="pointer-events-auto">
                  <a
                    :href="`tel:${item.contactPhone}`"
                    class="
                      inline-block
                      align-middle
                      text-gray-200
                      hover:text-gray-100
                      focus:text-gray-100
                      focus:outline-none
                    "
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
                  class="
                    cursor-pointer
                    pointer-events-auto
                    flex
                    items-center
                    text-gray-200
                    focus:text-gray-100
                    hover:text-gray-100
                    focus:outline-none
                    select-none
                    mx-auto
                  "
                  @click="deleteClient(item.id)"
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
            v-html="$t('clients.noData')"
            class="text-center text-gray-200 leading-tight py-4"
          />
        </template>
      </DataTable>
      <Btn
        block
        outlined
        class="mt-4"
        @click="
          $router.push({
            name: 'client-create',
            params: { orgId },
            query: { clientType },
          })
        "
      >
        <Icon left>
          {{ icons.ziUserPlus }}
        </Icon>
        <span>{{ $t('clients.createClient') }}</span>
      </Btn>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { wrapInArray, getObjectValueByPath } from 'vue-supp'

import {
  ziSearch,
  ziDelete,
  ziBagDeal,
  ziAction,
  ziPhone,
  ziUserPlus,
  ziMoneyPlus,
  ziMoneyMinus,
  ziMoneyTernover,
  ziQuestionSign,
} from '@zennnn/icons'
import { Btn, Icon, Tooltip, TextField, DataTable } from '@zennnn/core'

import { ClientType } from '../graphql/enums'
import { LIST_CLIENTS } from '../graphql/queries'
import { DELETE_CLIENT } from '../graphql/mutations'

import { confirmDialog } from '../utils/confirmDialog'

export default {
  name: 'ClientList',
  components: {
    Btn,
    Icon,
    Tooltip,
    DataTable,
    TextField,
  },
  setup() {
    const route = useRoute()
    const orgId = route.params.orgId

    const { result, loading } = useQuery(
      LIST_CLIENTS,
      () => ({
        orgId: orgId,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )
    const listClients = useResult(result)

    const { mutate: deleteClientMutate } = useMutation(DELETE_CLIENT)

    return {
      icons: {
        ziSearch,
        ziDelete,
        ziBagDeal,
        ziAction,
        ziPhone,
        ziUserPlus,
        ziMoneyPlus,
        ziMoneyMinus,
        ziMoneyTernover,
        ziQuestionSign,
      },
      orgId,
      loading,
      listClients,
      deleteClientMutate,
    }
  },
  data() {
    return {
      sortBy: [],
      sortDesc: [],
      clientType: 1,
      search: undefined,
      createLoading: false,
      deleteLoading: null,
      errors: [],
    }
  },
  computed: {
    tabs() {
      return [
        {
          value: 1,
          text: this.$t('client.legalPerson'),
        },
        {
          value: 2,
          text: this.$t('client.privatePerson'),
        },
        {
          value: 3,
          text: this.$t('client.other'),
        },
      ]
    },
    clientTypeEnum() {
      switch (this.clientType) {
        case 1:
          return ClientType.LEGAL
        case 2:
          return ClientType.PRIVATE
        case 3:
          return ClientType.OTHER
        default:
          return ClientType.LEGAL
      }
    },
    groupBy() {
      return this.sortBy.length === 0 || this.sortBy[0] === 'fullName'
        ? ['fullName']
        : []
    },
    groupDesc() {
      return this.groupBy[0] === 'fullName' ? this.sortDesc : []
    },
    headers() {
      return [
        { text: '', value: 'zAccount', width: 50, sortable: false },
        {
          text:
            this.clientTypeEnum === ClientType.PRIVATE
              ? this.$t('clients.clientName')
              : this.$t('clients.companyName'),
          value: 'fullName',
          align: 'left',
          width: 190,
          minWidth: 190,
          sortable: true,
        },
        { text: '', value: 'dealsSearch', width: 32, sortable: false },
        { text: '', value: 'dealsCount', width: 46, sortable: true },
        {
          text: '',
          value: 'prepayment',
          align: 'right',
          width: 100,
          sortable: true,
        },
        { text: '', value: 'debt', align: 'right', width: 100, sortable: true },
        {
          text: '',
          value: 'turnover',
          align: 'right',
          width: 100,
          sortable: true,
        },
        {
          text: this.$t('clients.contactPerson'),
          value: 'contactPersonFullName',
          align: 'left',
          width: 186,
          class: 'pl-8 pr-2',
          sortable: true,
        },
        {
          text: this.$t('clients.tags'),
          value: 'tags',
          align: 'left',
          width: 126,
          sortable: true,
        },
        {
          text: '',
          value: 'contactPhone',
          align: 'left',
          width: 60,
          minWidth: 60,
          sortable: true,
        },
        {
          text: this.$t('clients.ucn'),
          value: 'ucn',
          align: 'right',
          width: 60,
          minWidth: 60,
          class: 'whitespace-nowrap',
          sortable: true,
        },
        { text: '', value: 'actions', width: 54 },
      ]
    },
    compItems() {
      const items = (this.listClients && this.listClients.items) || []
      return items.map((item) => {
        const tags = item.tags || []
        return {
          ...item,
          tags: tags.join(','),
          tagsArray: tags,
          ucn: item.uid,
        }
      })
    },
    items() {
      return this.compItems.filter(
        (el) => el.clientType === this.clientTypeEnum
      )
    },
    filteredLegalItems() {
      const items = this.compItems.filter(
        (el) => el.clientType === ClientType.LEGAL
      )
      return this.filterItems(items, this.search)
    },
    filteredPrivateItems() {
      const items = this.compItems.filter(
        (el) => el.clientType === ClientType.PRIVATE
      )
      return this.filterItems(items, this.search)
    },
    filteredOtherItems() {
      const items = this.compItems.filter(
        (el) => el.clientType === ClientType.OTHER
      )
      return this.filterItems(items, this.search)
    },
    filteredItemsLength() {
      return {
        1: this.filteredLegalItems.length,
        2: this.filteredPrivateItems.length,
        3: this.filteredOtherItems.length,
      }
    },
  },
  created() {
    if (this.$route.query.clientType) {
      this.clientType = Number.parseInt(this.$route.query.clientType, 10) || 1
    }
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }
    if (this.$route.query.sort) {
      this.sortBy = wrapInArray(this.$route.query.sort)
      const desc =
        this.$route.query.desc === true || this.$route.query.desc === 'true'
      this.sortDesc = [!!(this.$route.query.sort && desc)]
    }
    // on search on server, escape input string
    this.$watch('search', (val, old) => {
      if (val === old) return
      this.updateRouteQuery()
    })
    this.$watch('sortBy', this.updateRouteQuery)
    this.$watch('sortDesc', this.updateRouteQuery)
    this.$watch('$route.query', (query) => {
      const clientType = Number.parseInt(this.$route.query.clientType, 10) || 1
      if (clientType !== this.clientType) {
        this.clientType = clientType
      }
      if (query.q !== this.search) {
        this.search = query.q
      }
      if (query.sort !== this.sortBy[0]) {
        this.sortBy = query.sort ? wrapInArray(query.sort) : []
      }
      this.sortDesc =
        this.sortBy.length > 0
          ? [query.desc === true || query.desc === 'true']
          : []
    })
  },
  methods: {
    customGroup(items, groupBy, groupDesc) {
      const key = groupBy[0]
      const desc = groupDesc[0]
      const re =
        /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
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
      sorted.forEach((k) => {
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
    filterItems(items, search) {
      let filtered = items
      search = typeof search === 'string' ? search.trim() : null
      if (search) {
        filtered = items.filter((item) =>
          this.headers.some((header) => {
            const value = getObjectValueByPath(item, header.value)
            return this.customFilter(value, search, item)
          })
        )
      }
      return filtered
    },
    updateRouteQuery() {
      const query = {}
      if (this.clientType > 1) {
        query.clientType = this.clientType
      }
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
    customFilter(value, search) {
      if (search != null && value != null && typeof value !== 'boolean') {
        const words = search
          .split(',')
          .map((s) => s.trim().toLocaleLowerCase())
          .filter((s) => !!s)
        const v = value.toString().toLocaleLowerCase()
        return words.every((w) => v.indexOf(w) !== -1)
      } else {
        return false
      }
    },
    switchClientType(type) {
      if (type === this.clientType) return
      this.clientType = type
      this.updateRouteQuery()
    },
    getClientTypeNumeric(type) {
      switch (type) {
        case ClientType.LEGAL:
          return 1
        case ClientType.PRIVATE:
          return 2
        case ClientType.OTHER:
          return 3
        default:
          return 1
      }
    },
    goToClient(item) {
      this.$router.push({
        name: 'client',
        params: {
          orgId: this.orgId,
          groupId: item.groupId,
          clientId: item.id,
        },
        query: {
          clientType: this.getClientTypeNumeric(item.clientType),
        },
      })
    },
    goToClientSpecs(item) {
      this.$router.push({
        name: 'specs',
        params: {
          orgId: this.orgId,
        },
        query: {
          clients: [item.id],
        },
      })
    },
    async deleteClient(id) {
      try {
        const msg = this.$t('alert.removeClient')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await this.deleteClientMutate(
          { id },
          {
            update: (cache) => {
              const data = cache.readQuery({
                query: LIST_CLIENTS,
                variables: {
                  orgId: this.orgId,
                },
              })
              if (data.listClients.items.some((item) => item.id === id)) {
                cache.writeQuery({
                  query: LIST_CLIENTS,
                  variables: {
                    orgId: this.orgId,
                  },
                  data: {
                    listClients: {
                      items: data.listClients.items.filter(
                        (item) => item.id !== id
                      ),
                    },
                  },
                })
              }
            },
          }
        )
        if (response && response.errors && response.errors.length > 0) {
          throw response
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'DeleteClientError',
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
