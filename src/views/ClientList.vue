<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div class="flex items-end flex-wrap lg:flex-no-wrap justify-between">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :content-class="[search ? 'shadow-blue-500' : '', 'bg-transparent']"
          class="w-full lg:w-auto lg:flex-grow md:max-w-md pb-4 lg:pr-8"
          input-class="placeholder-blue-500"
        >
          <template v-slot:prepend>
            <i class="zi-magnifier text-2xl text-gray-100"></i>
          </template>
          <template v-slot:append v-if="search">
            <i
              class="zi-close text-2xl text-gray-200 cursor-pointer focus:outline-none focus:text-gray-100 hover:text-gray-100"
              @click="search = null"
            />
          </template>
        </TextField>
        <div class="h-11 flex lg:inline-flex overflow-x-auto overflow-scroll-touch">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="clientType === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t',
              'select-none whitespace-no-wrap cursor-pointer',
              'transition-colors duration-100 ease-in px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
              clientType === tab.value ? 'text-white bg-gray-800' : 'bg-transparent',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchClientType(tab.value)"
            @keydown.enter.exact="switchClientType(tab.value)"
          >
            <span
              class="relative"
            >
              <div class="absolute top-0 right-0 text-13 font-semibold transform translate-x-full -mt-1 -mr-1">
                <v-scale-transition origin="center center">
                  <div
                    v-if="search && clientType !== tab.value && filteredItemsLength[tab.value] > 0"
                    style="min-width: 1rem;"
                    class="h-4 flex justify-center items-center relative rounded-full text-white bg-purple-500 px-xs"
                  >
                    <span>
                      {{ filteredItemsLength[tab.value] > 99 ? '99+' : filteredItemsLength[tab.value] }}
                    </span>
                  </div>
                </v-scale-transition>
              </div>
              {{ tab.text }}
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto overflow-scroll-touch pb-4">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :custom-filter="customFilter"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          table-width="100%"
          table-class="table-fixed rounded-tl-none md:rounded-tl-md rounded-tr-none sm:rounded-tr-md md:rounded-tr-none"
          hoverable
          hide-no-data
        >
          <template v-slot:[`header.dealsSearch-content`]>
            <v-tooltip top max-width="162">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('clients.dealsSearchHint') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`header.dealsCount-content`]>
            <i class="zi-bag text-2xl text-400 align-middle" />
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('clients.currentDealsAmount') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`header.prepayment-content`]>
            <span class="inline-block align-middle mr-xs">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.9 19.512V17.912C3.8 17.812 2.7 17.512 2 17.212L2.5 15.212C3.2 15.612 4.2 16.012 5.4 16.012C6.4 16.012 7.1 15.612 7.1 14.912C7.1 14.212 6.5 13.812 5.3 13.412C3.5 12.812 2.2 11.912 2.2 10.212C2.1 8.71196 3.2 7.51196 5 7.11196V5.51196H6.7V7.01196C7.9 7.01196 8.6 7.31196 9.2 7.51196L8.7 9.51196C8.3 9.31196 7.5 8.91196 6.2 8.91196C5.1 8.91196 4.7 9.41196 4.7 9.91196C4.7 10.512 5.3 10.812 6.8 11.412C8.9 12.112 9.7 13.112 9.7 14.612C9.7 16.112 8.6 17.412 6.6 17.812V19.512H4.9Z" fill="#404040"/>
                <path d="M17 7.51196C14.2 7.51196 12 9.71196 12 12.512C12 15.312 14.2 17.512 17 17.512C19.8 17.512 22 15.312 22 12.512C22 9.71196 19.8 7.51196 17 7.51196ZM20.2 13.112H17.6V15.812H16.4V13.112H13.8V11.912H16.4V9.31196H17.6V12.012H20.2V13.112Z" fill="#404040"/>
              </svg>
            </span>
            <v-tooltip top max-width="152">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('clients.totalPrepaymentHint') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`header.debt-content`]>
            <span class="inline-block align-middle mr-xs">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.9 19.512V17.912C3.7 17.812 2.6 17.512 2 17.212L2.5 15.212C3.2 15.612 4.2 16.012 5.4 16.012C6.4 16.012 7.1 15.612 7.1 14.912C7.1 14.212 6.5 13.812 5.3 13.412C3.5 12.812 2.2 11.912 2.2 10.212C2.1 8.61199 3.2 7.41199 5 7.11199V5.41199H6.7V6.91199C7.9 7.01199 8.6 7.21199 9.2 7.51199L8.7 9.51199C8.3 9.31199 7.5 8.91199 6.2 8.91199C5.1 8.91199 4.7 9.41199 4.7 9.91199C4.7 10.512 5.3 10.812 6.8 11.412C8.9 12.112 9.7 13.112 9.7 14.612C9.7 16.112 8.6 17.412 6.6 17.812V19.612H4.9V19.512Z" fill="#404040"/>
                <path d="M17 7.51196C14.2 7.51196 12 9.71196 12 12.512C12 15.312 14.2 17.512 17 17.512C19.8 17.512 22 15.312 22 12.512C22 9.71196 19.8 7.51196 17 7.51196ZM19.7 13.112H14.3V11.912H19.7V13.112Z" fill="#404040"/>
              </svg>
            </span>
            <v-tooltip top max-width="200">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('clients.debtHint') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`header.turnover-content`]>
            <span class="inline-block align-middle mr-xs">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0729 19.5713V17.9713C9.87285 17.8713 8.77285 17.5713 8.17285 17.2713L8.67285 15.2713C9.37285 15.6713 10.3729 16.0713 11.5729 16.0713C12.5729 16.0713 13.2729 15.6713 13.2729 14.9713C13.2729 14.2713 12.6729 13.8713 11.4729 13.4713C9.67285 12.8713 8.37285 11.9713 8.37285 10.2713C8.37285 8.77129 9.47285 7.57129 11.2729 7.17129V5.57129H12.9729V7.07129C14.1729 7.17129 14.8729 7.37129 15.4729 7.67129L14.8729 9.57129C14.4729 9.37129 13.6729 8.97129 12.3729 8.97129C11.2729 8.97129 10.8729 9.47129 10.8729 9.97129C10.8729 10.5713 11.4729 10.8713 12.9729 11.4713C15.0729 12.1713 15.8729 13.1713 15.8729 14.6713C15.8729 16.1713 14.7729 17.4713 12.7729 17.8713V19.5713H11.0729Z" fill="#404040"/>
                <path d="M15.9726 1.27137C15.0726 0.871371 14.1726 0.671371 13.2726 0.571371C7.0726 -0.0286289 1.4726 3.97137 0.272596 10.0714C-0.227404 12.4714 -0.0274037 14.7714 0.772596 16.8714C0.972596 17.2714 1.4726 17.4714 1.8726 17.2714C2.1726 17.0714 2.3726 16.6714 2.1726 16.3714C1.6726 15.0714 1.4726 13.7714 1.4726 12.2714C1.6726 7.17137 5.6726 2.77137 10.6726 2.17137C12.2726 1.97137 13.8726 2.17137 15.2726 2.67137L14.9726 3.37137L19.1726 3.97137C19.4726 3.97137 19.5726 3.67137 19.3726 3.47137L16.4726 0.571371L15.9726 1.27137Z" fill="#404040"/>
                <path d="M7.97241 23.7714C8.87241 24.1714 9.77241 24.3714 10.6724 24.4714C16.8724 25.0714 22.4724 21.1714 23.7724 15.0714C24.2724 12.6714 24.0724 10.3714 23.2724 8.27142C22.9724 7.77142 22.5724 7.57142 22.1724 7.87142C21.8724 8.07142 21.6724 8.47142 21.8724 8.77142C22.3724 10.0714 22.5724 11.3714 22.5724 12.8714C22.3724 17.9714 18.3724 22.3714 13.3724 22.9714C11.7724 23.1714 10.1724 22.9714 8.77241 22.4714L9.07241 21.7714L4.87241 21.1714C4.57241 21.1714 4.47241 21.4714 4.67241 21.6714L7.77241 24.5714L7.97241 23.7714Z" fill="#404040"/>
              </svg>
            </span>
            <v-tooltip top max-width="135">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('clients.turnoverHint') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`header.contactPhone-content`]>
            <span class="inline-block align-middle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.23 15.26L16.69 14.97C16.08 14.9 15.48 15.11 15.05 15.54L13.21 17.38C10.38 15.94 8.06004 13.63 6.62004 10.79L8.47004 8.94001C8.90004 8.51001 9.11004 7.91001 9.04004 7.30001L8.75004 4.78001C8.63004 3.77001 7.78004 3.01001 6.76004 3.01001H5.03004C3.90004 3.01001 2.96004 3.95001 3.03004 5.08001C3.56004 13.62 10.39 20.44 18.92 20.97C20.05 21.04 20.99 20.1 20.99 18.97V17.24C21 16.23 20.24 15.38 19.23 15.26Z" fill="currentColor"/>
              </svg>
            </span>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="(item) in items">
              <tr
                v-if="item.group"
                :key="item.groupName"
                :style="{ background: 'transparent' }"
              >
                <td
                  :colspan="headers.length"
                  :style="{ height: '32px', paddingLeft: '51px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> ({{ item.groupItemsCount }})
                </td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="cursor-pointer"
                tabindex="0"
                @click="goToClient(item)"
                @keydown.enter.exact.self="goToClient(item)"
              >
                <td></td>
                <td class="truncate">{{ item.fullName }}</td>
                <td class="text-center pointer-events-none" @click.stop="goToClientSpecs(item)">
                  <i class="zi-magnifier align-middle text-2xl text-gray-200 cursor-pointer pointer-events-auto" />
                </td>
                <td class="truncate text-right">{{ $n(item.dealsCount || 0) }}</td>
                <td class="truncate text-right">{{ $n(item.prepayment || 0) }}</td>
                <td :class="['truncate text-right', { 'text-pink-500': item.debt > 0 }]">{{ $n(item.debt || 0) }}</td>
                <td class="truncate text-right">{{ $n(item.turnover || 0) }}</td>
                <td class="truncate pl-8 pr-2">{{ item.contactPersonFullName }}</td>
                <td class="whitespace-no-wrap pr-4">
                  <div class="overflow-x-scroll scrolling-touch scrollbar-hidden flex items-center align-middle rounded-lg space-x-1">
                    <div
                      v-for="(tag, i) in item.tagsArray"
                      :key="i"
                      class="h-6 inline-flex items-center bg-gray-400 rounded-lg px-1"
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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.23 15.26L16.69 14.97C16.08 14.9 15.48 15.11 15.05 15.54L13.21 17.38C10.38 15.94 8.06004 13.63 6.62004 10.79L8.47004 8.94001C8.90004 8.51001 9.11004 7.91001 9.04004 7.30001L8.75004 4.78001C8.63004 3.77001 7.78004 3.01001 6.76004 3.01001H5.03004C3.90004 3.01001 2.96004 3.95001 3.03004 5.08001C3.56004 13.62 10.39 20.44 18.92 20.97C20.05 21.04 20.99 20.1 20.99 18.97V17.24C21 16.23 20.24 15.38 19.23 15.26Z" fill="currentColor"/>
                      </svg>
                    </a>
                    <i class="zi-action text-2xl text-gray-200 align-middle cursor-default ml-1" />
                  </span>
                </td>
                <td class="truncate text-right">{{ item.uid }}</td>
                <td class="text-center pointer-events-none" @click.prevent.stop>
                  <button
                    class="cursor-pointer pointer-events-auto flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-auto"
                    @click="deleteClient(item.id)"
                  >
                    <i class="zi-delete" />
                  </button>
                </td>
              </tr>
            </template>
          </template>

        </DataTable>
      </div>
      <div
        v-if="items.length === 0 && loading"
        class="text-center text-gray-200 leading-tight py-4"
      >
        <v-progress-circular
          indeterminate
          size="24"
          width="2"
        />
      </div>
      <div
        v-else-if="items.length === 0"
        v-html="$t('clients.noData')"
        class="text-center text-gray-200 leading-tight py-4"
      />
      <Button
        block
        outlined
        class="mt-4"
        @click="$router.push({
          name: 'client-create',
          query: {
            clientType,
          },
        })"
      >
        <template v-slot:icon>
          <i class="zi-user-plus text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('clients.createClient') }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
import { ClientType } from '../graphql/enums'
import { LIST_CLIENTS } from '../graphql/queries'
import { DELETE_CLIENT } from '../graphql/mutations'

import { confirmDialog, wrapInArray, getObjectValueByPath } from '../util/helpers'

export default {
  name: 'ClientList',
  apollo: {
    listClients: {
      query: LIST_CLIENTS,
      variables () {
        return {
          orgId: this.$route.params.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
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
    loading () {
      return this.$apollo.queries.listClients.loading
    },
    tabs () {
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
    clientTypeEnum () {
      switch (this.clientType) {
        case 1: return ClientType.LEGAL
        case 2: return ClientType.PRIVATE
        case 3: return ClientType.OTHER
        default: return ClientType.LEGAL
      }
    },
    groupBy () {
      return this.sortBy.length === 0 || this.sortBy[0] === 'fullName' ? ['fullName'] : []
    },
    groupDesc () {
      return this.groupBy[0] === 'fullName' ? this.sortDesc : []
    },
    headers () {
      return [
        { text: '', value: 'zAccount', width: 50, sortable: false },
        {
          text: this.clientTypeEnum === ClientType.PRIVATE ? this.$t('clients.clientName') : this.$t('clients.companyName'),
          value: 'fullName',
          align: 'left',
          width: 190,
          minWidth: 190,
          sortable: true,
        },
        { text: '', value: 'dealsSearch', width: 32, sortable: false },
        { text: '', value: 'dealsCount', width: 46, sortable: true },
        { text: '', value: 'prepayment', align: 'right', width: 100, sortable: true },
        { text: '', value: 'debt', align: 'right', width: 100, sortable: true },
        { text: '', value: 'turnover', align: 'right', width: 100, sortable: true },
        { text: this.$t('clients.contactPerson'), value: 'contactPersonFullName', align: 'left', width: 186, class: 'pl-8 pr-2', sortable: true },
        { text: this.$t('clients.tags'), value: 'tags', align: 'left', width: 126, sortable: true },
        { text: '', value: 'contactPhone', align: 'left', width: 60, minWidth: 60, sortable: true },
        { text: this.$t('clients.ucn'), value: 'ucn', align: 'right', width: 60, minWidth: 60, class: 'whitespace-no-wrap', sortable: true },
        { text: '', value: 'actions', width: 54 },
      ]
    },
    compItems () {
      const items = (this.listClients && this.listClients.items) || []
      return items.map(item => {
        const tags = item.tags || []
        return {
          ...item,
          tags: tags.join(','),
          tagsArray: tags,
          ucn: item.uid,
        }
      })
    },
    items () {
      return this.compItems.filter(el => el.clientType === this.clientTypeEnum)
    },
    filteredLegalItems () {
      const items = this.compItems.filter(el => el.clientType === ClientType.LEGAL)
      return this.filterItems(items, this.search)
    },
    filteredPrivateItems () {
      const items = this.compItems.filter(el => el.clientType === ClientType.PRIVATE)
      return this.filterItems(items, this.search)
    },
    filteredOtherItems () {
      const items = this.compItems.filter(el => el.clientType === ClientType.OTHER)
      return this.filterItems(items, this.search)
    },
    filteredItemsLength () {
      return {
        1: this.filteredLegalItems.length,
        2: this.filteredPrivateItems.length,
        3: this.filteredOtherItems.length,
      }
    },
  },
  created () {
    if (this.$route.query.clientType) {
      this.clientType = Number.parseInt(this.$route.query.clientType, 10) || 1
    }
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
      sorted.map(k => {
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
    filterItems (items, search) {
      let filtered = items
      search = typeof search === 'string' ? search.trim() : null
      if (search) {
        filtered = items.filter(item => this.headers.some(header => {
          const value = getObjectValueByPath(item, header.value)
          return this.customFilter(value, search, item)
        }))
      }
      return filtered
    },
    updateRouteQuery () {
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
      }).catch(() => {})
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
    switchClientType (type) {
      if (type === this.clientType) return
      this.clientType = type
      this.updateRouteQuery()
    },
    getClientTypeNumeric (type) {
      switch (type) {
        case ClientType.LEGAL: return 1
        case ClientType.PRIVATE: return 2
        case ClientType.OTHER: return 3
        default: return 1
      }
    },
    goToClient (item) {
      this.$router.push({
        name: 'client',
        params: {
          groupId: item.groupId,
          clientId: item.id,
        },
        query: {
          clientType: this.getClientTypeNumeric(item.clientType),
        },
      })
    },
    goToClientSpecs (item) {
      this.$router.push({
        name: 'specs',
        params: {
          orgId: this.$route.params.orgId,
        },
        query: {
          clients: [item.id],
        },
      })
    },
    async deleteClient (id) {
      try {
        const msg = this.$t('alert.removeClient')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await this.$apollo.mutate({
          mutation: DELETE_CLIENT,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: LIST_CLIENTS,
              variables: {
                orgId: this.$route.params.orgId,
              },
            })
            const index = data.listClients.items.findIndex(item => item.id === id)
            if (index !== -1) {
              data.listClients.items.splice(index, 1)
            }
            store.writeQuery({
              query: LIST_CLIENTS,
              variables: {
                orgId: this.$route.params.orgId,
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
