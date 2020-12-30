<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-4">
        <TextField
          v-model="search"
          :placeholder="clientsFilter.length === 0 ? $t('placeholder.pageSearch') : ''"
          :control-class="search || clientsFilter.length > 0 ? 'bg-transparent dark:bg-transparent overflow-x-auto ring-1 ring-blue-500' : 'bg-transparent dark:bg-transparent overflow-x-auto'"
          class="w-full pb-4 sm:pb-0 sm:pr-8"
          input-class="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
          @click:clear="clearFilters"
        >
          <template v-slot:prepend>
            <span class="w-10 flex items-center justify-center flex-shrink-0">
              <Icon class="text-gray-100">
                {{ icons.ziSearch }}
              </Icon>
            </span>
            <span v-if="clientsFilter.length > 0" class="text-base text-white pr-2">
              <span
                v-for="filter in clientsFilter"
                :key="filter.value"
                class="h-6 inline-flex items-center rounded-lg bg-gray-400 whitespace-nowrap pl-1 mr-1"
              >
                <span class="flex-grow pl-xs -mr-xs">
                  {{ filter.text }}
                </span>
                <Icon
                  class="w-6 flex-shrink-0 text-gray-200 focus:outline-none focus:text-gray-100 hover:text-gray-100"
                  @click="clearClientFilter(filter.value)"
                >
                  {{ icons.ziCloseDelete }}
                </Icon>
              </span>
            </span>
          </template>
        </TextField>
        <div class="flex w-full sm:w-auto items-center justify-end" style="min-width: 165px;">
          <Menu
            v-model="filterMenu"
            :value="currentFilter"
            :arrow="false"
            distance="10"
            skidding="8"
            placement="bottom-end"
            @update:value="changeClientType"
          >
            <template v-slot:activator>
              <div class="group flex items-center cursor-pointer whitespace-nowrap">
                <span class="text-gray-100 group-hover:text-light-gray-400 select-none pr-2">
                  {{ currentFilterText }}
                </span>
                <span class="relative">
                  <Icon
                    class="text-gray-200 group-hover:text-gray-100"
                  >
                    {{ hasFilter ? icons.ziFilter : icons.ziFilterOutline }}
                  </Icon>
                </span>
              </div>
            </template>
            <MenuItem
              v-for="(item, i) in filters"
              :key="item.value"
              :index="i"
              :value="item.value"
            >
              {{ item.text }}
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div class="overflow-x-auto scrolling-touch pb-4">
        <DataTable
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          :headers="headers"
          :items="items"
          :search="search"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          table-width="100%"
          table-class="table-fixed"
          hoverable
          hide-no-data
        >
          <template v-slot:[`header.status`]="{ header }">
            <th
              :width="header.width + 'px'"
            >
              <div class="ml-6 w-3 h-3 rounded-full border border-gray-400" />
            </th>
          </template>
          <template v-slot:[`header.isMoneyRecieved`]="{ header }">
            <th :width="header.width + 'px'">
              <div class="flex items-center">
                <Icon>
                  {{ icons.ziMoneyPlus }}
                </Icon>
                <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%">
                  <template v-slot:activator>
                    <Icon class="text-blue-500 align-middle">
                      {{ icons.ziQuestionSign }}
                    </Icon>
                  </template>
                  <span>
                    {{ $t('deals.moneyRecieved') }}
                  </span>
                </Tooltip>
              </div>
            </th>
          </template>
          <template v-slot:[`header.isExpensesPaid`]="{ header }">
            <th :width="header.width + 'px'">
              <div class="flex items-center">
                <Icon>
                  {{ icons.ziMoneyMinus }}
                </Icon>
                <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%">
                  <template v-slot:activator>
                    <Icon class="text-blue-500 align-middle">
                      {{ icons.ziQuestionSign }}
                    </Icon>
                  </template>
                  <span>
                    {{ $t('deals.expensesPaid') }}
                  </span>
                </Tooltip>
              </div>
            </th>
          </template>
          <template v-slot:[`header.finalCost-content`]="{ header }">
            <th :width="header.width + 'px'">
              <Icon class="align-middle">
                {{ icons.ziMoneyTernover }}
              </Icon>
              <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="158">
                <template v-slot:activator>
                  <Icon class="text-blue-500 align-middle">
                    {{ icons.ziQuestionSign }}
                  </Icon>
                </template>
                <span>
                  {{ $t('deals.turnoverHint') }}
                </span>
              </Tooltip>
            </th>
          </template>
          <template v-slot:[`header.margin-content`]="{ header }">
            <th :width="header.width + 'px'">
              <span class="inline-block align-middle">%</span>
              <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="158">
                <template v-slot:activator>
                  <Icon class="text-blue-500 align-middle">
                    {{ icons.ziQuestionSign }}
                  </Icon>
                </template>
                <span>
                  {{ $t('deals.marginHint') }}
                </span>
              </Tooltip>
            </th>
          </template>
          <template v-slot:[`header.hasNewComment`]="{ header }">
            <th :width="header.width + 'px'" />
          </template>
          <template v-slot:[`header.specNo-content`]="{ header }">
            <span>
              {{ header.text }}
            </span>
            <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="220">
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span v-html="$t('deals.numberHint')" />
            </Tooltip>
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
                  :style="{ height: '32px', paddingLeft: '26px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> <span class="text-gray-200">({{ item.groupItemsCount }})</span>
                </td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="cursor-default"
                tabindex="0"
                @click="goToSpec(item.id)"
                @keydown.enter.exact.self="goToSpec(item.id)"
              >
                <td class="relative">
                  <div
                    :class="[
                      'ml-6 w-3 h-3 rounded-full',
                      item.specStatus === SpecStatus.IN_STOCK
                      ? 'bg-green-500' : item.specStatus === SpecStatus.IN_PRODUCTION
                        ? 'bg-yellow-500' : item.specStatus === SpecStatus.IN_PROCESSING
                          ? 'bg-pink-500' : 'bg-gray-800'
                    ]"
                  />
                </td>
                <td class="text-center">
                  <Icon v-if="item.isMoneyRecieved" class="text-gray-200 align-middle">
                    {{ icons.ziChecked }}
                  </Icon>
                </td>
                <td class="text-center">
                  <Icon v-if="item.isExpensesPaid" class="text-gray-200 align-middle">
                    {{ icons.ziChecked }}
                  </Icon>
                </td>
                <td class="truncate text-right">{{ $n(item.finalCost || 0) }}</td>
                <td class="truncate text-right text-gray-200">{{ item.margin || 0 }}%</td>
                <td class="truncate pl-6 pr-2">{{ item.client.fullName }}</td>
                <td class="truncate pr-2">{{ item.client.contactPersonFullName }}</td>
                <td class="truncate pl-3">
                  <span>
                    <Tooltip placement="top-start" skidding="-16" origin="24px 100%">
                      <template v-slot:activator>
                        <Icon class="text-gray-200 align-middle">
                          {{ icons.ziNumberOffDocument }}
                        </Icon>
                        <span v-if="item.specNoCount" class="align-middle text-light-gray-400">
                          - {{ item.specNoCount }}
                        </span>
                      </template>
                      <span>
                        {{ item.specNo }}
                      </span>
                    </Tooltip>
                  </span>
                </td>
                <td>
                  {{ $d($parseDate(item.createdAt), 'short') }}
                </td>
                <td class="truncate pointer-events-none" @click.stop>
                  <span v-if="item.client.contactPhone" class="pointer-events-auto">
                    <a
                      :href="`tel:${item.client.contactPhone}`"
                      class="inline-block align-middle"
                    >
                      <Icon class="text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none">
                        {{ icons.ziPhone }}
                      </Icon>
                    </a>
                    <Icon class="text-gray-200 align-middle cursor-default ml-1">
                      {{ icons.ziAction }}
                    </Icon>
                  </span>
                </td>
                <td class="truncate text-right">{{ (item.client.uid) }}</td>
                <td class="text-center pointer-events-none" @click.prevent.stop>
                  <button
                    class="cursor-pointer pointer-events-auto flex items-center select-none mx-auto"
                    @click="deleteSpec(item.id)"
                  >
                    <Icon class="text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none">
                      {{ icons.ziDelete }}
                    </Icon>
                  </button>
                </td>
                <td>
                  <span v-if="item.shipped" class="inline-block align-middle h-2 w-2 rounded-full bg-cold-blue-400"></span>
                </td>
                <td :class="{ 'bg-purple-500': item.hasNewComment }"></td>
              </tr>
            </template>
          </template>
        </DataTable>
      </div>
      <div
        v-if="items.length === 0 && loading"
        class="text-center text-gray-200 leading-tight py-4"
      >
        <Progress
          indeterminate
          size="24"
          width="2"
        />
      </div>
      <div
        v-else-if="items.length === 0"
        v-html="$t('deals.noData')"
        class="text-center text-gray-200 leading-tight py-4"
      />
      <Btn
        v-if="canCreateSpec"
        block
        outlined
        class="mt-4"
        @click="createSpecDialog = true"
      >
        <Icon class="text-gray-200 mr-sm">
          {{ icons.ziBagDeal }}
        </Icon>
        <span>{{ $t('deals.createDeal') }}</span>
      </Btn>
    </div>
    <Dialog
      v-if="canCreateSpec"
      v-model="createSpecDialog"
      :icon="icons.ziUserPlus"
      :title="$t('deals.createSpecDialogHeader')"
    >
      <div class="p-6">
        <Select
          ref="clientSearchInput"
          v-model:search="clientSearch"
          :model-value="createSpecClient"
          :label="$t('deals.createSpecDialogSearchPlaceholder')"
          :placeholder="$t('placeholder.startTyping')"
          :items="clients"
          :rules="[rules.required]"
          :prepend-icon="icons.ziSearch"
          label-no-wrap
          searchable
          return-object
          no-filter
          item-value="id"
          item-text="fullName"
          state-icon
          state-error-color="none"
          @update:model-value="v => createSpecClient = v"
          @click:prepend-item="createClient"
        >
          <template v-slot:prepend-item>
            <div
              role="option"
              class="flex items-center jusitfy-center text-blue-500 hover:text-blue-400 cursor-pointer h-9 px-4"
            >
              <Icon class="mr-1">
                {{ icons.ziPlusOutline }}
              </Icon>
              <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
            </div>
          </template>
        </Select>
        <div class="flex justify-between">
          <Btn
            :disabled="createWithClientLoading"
            :loading="createWithoutClientLoading"
            outlined
            class="border-gray-200"
            @click="createSpec(true)"
          >
            {{ $t('deals.createSpecDialogWithoutClient') }}
          </Btn>
          <Btn
            v-if="createSpecClient"
            :disabled="createWithoutClientLoading"
            :loading="createWithClientLoading"
            @click="createSpec()"
          >
            {{ $t('deals.createSpecDialogAdd') }}
          </Btn>
        </div>
      </div>
    </Dialog>
    <Modal
      ref="clientDialog"
      v-if="canCreateSpec"
      v-model="clientDialog"
      :fullscreen="$breakpoint.smAndDown"
      scrollable
      max-width="1110"
      content-class="scrolling-touch"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </Modal>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import {
  ziFilter,
  ziFilterOutline,
  ziSearch,
  ziDelete,
  ziBagDeal,
  ziAction,
  ziPhone,
  ziUserPlus,
  ziChecked,
  ziPlusOutline,
  ziCloseDelete,
  ziQuestionSign,
  ziMoneyPlus,
  ziMoneyMinus,
  ziMoneyTernover,
  ziNumberOffDocument,
} from '../assets/icons'

import {
  Role,
  Typename,
  Operation,
  SpecStatus,
  ClientType,
} from '../graphql/enums'
import { SPEC_FRAGMENT } from '../graphql/typeDefs'
import { GET_SPECS, GET_ORGS, SEARCH_CLIENTS, GET_CLIENTS_BY_ID } from '../graphql/queries'
import { CREATE_SPEC, DELETE_SPEC } from '../graphql/mutations'
import { SPECS_DELTA } from '../graphql/subscriptions'

import Btn from '../components/Base/Btn'
import Icon from '../components/Base/Icon'
import { Menu, MenuItem } from '../components/Base/Menu'
import Modal from '../components/Base/Modal'
import Tooltip from '../components/Base/Tooltip'
import Progress from '../components/Base/Progress'
import DataTable from '../components/Base/DataTable'
import TextField from '../components/Base/TextField'
import Select from '../components/Base/Select'
import ClientCard from '../components/ClientCard.vue'
import Dialog from '../components/Dialog'

import { confirmDialog, wrapInArray } from '../util/helpers'

export default {
  name: 'Specs',
  components: {
    Btn,
    Icon,
    Menu,
    MenuItem,
    Modal,
    Tooltip,
    Progress,
    DataTable,
    TextField,
    Select,
    ClientCard,
    Dialog,
  },
  setup () {
    const { resolveClient } = useApolloClient()
    const route = useRoute()
    const orgId = route.params.orgId
    const clientSearch = ref('')
    const filter = ref({
      clientsIds: [],
      clientType: null,
      group: false,
    })

    const { result: result1 } = useQuery(SEARCH_CLIENTS, () => ({
      orgId: orgId,
      search: clientSearch.value,
    }), () => ({
      enabled: !!clientSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    }))
    const searchClients = useResult(result1)

    const clientTypeEnum = computed(() => {
      switch (filter.value.clientType) {
        case 1: return ClientType.LEGAL
        case 2: return ClientType.PRIVATE
        case 3: return ClientType.OTHER
        default: return null
      }
    })

    const { result: result2, loading } = useQuery(GET_SPECS, () => ({
      orgId: orgId,
      clientsIds: filter.value.clientsIds,
      clientType: clientTypeEnum.value,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const getSpecs = useResult(result2)

    const { result: result3 } = useQuery(GET_ORGS, null, { fetchPolicy: 'cache-only' })
    const getOrgs = useResult(result3)

    const { result: result4 } = useQuery(GET_CLIENTS_BY_ID, () => ({
      orgId: orgId,
      ids: filter.value.clientsIds,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const getClientsById = useResult(result4)

    return {
      icons: {
        ziFilter,
        ziFilterOutline,
        ziSearch,
        ziDelete,
        ziBagDeal,
        ziAction,
        ziPhone,
        ziUserPlus,
        ziChecked,
        ziPlusOutline,
        ziCloseDelete,
        ziQuestionSign,
        ziMoneyPlus,
        ziMoneyMinus,
        ziMoneyTernover,
        ziNumberOffDocument,
      },
      resolveClient,
      orgId,
      clientSearch,
      filter,
      loading,
      searchClients,
      getSpecs,
      getOrgs,
      getClientsById,
      clientTypeEnum,
    }
  },
  data () {
    return {
      clientDialog: false,
      createSpecClient: null,
      createSpecDialog: false,
      SpecStatus,
      sortBy: ['createdAt'],
      sortDesc: [true],
      search: undefined,
      createWithoutClientLoading: false,
      createWithClientLoading: false,
      deleteLoading: null,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
      filterMenu: false,
      currentFilter: null,
    }
  },
  computed: {
    hasFilter () {
      return this.filter.clientType || this.filter.group
    },
    filters () {
      return [
        {
          text: this.$t('label.noSort'),
          value: null,
        },
        {
          text: this.$t('client.legalPerson'),
          value: 1,
        },
        {
          text: this.$t('client.privatePerson'),
          value: 2,
        },
        {
          text: this.$t('client.other'),
          value: 3,
        },
        {
          text: this.$t('deals.byEmployees'),
          value: 4,
        },
      ]
    },
    groupBy () {
      return this.filter.group ? ['employeeId'] : null
    },
    groupDesc () {
      return this.filter.group ? [false] : null
    },
    currentFilterText () {
      switch (this.currentFilter) {
        case 1: return this.$t('client.legalPerson')
        case 2: return this.$t('client.privatePerson')
        case 3: return this.$t('client.other')
        case 4: return this.$t('deals.byEmployees')
        default: return this.$t('label.noSort')
      }
    },
    clientsFilter () {
      return this.filter.clientsIds.map(id => {
        const clients = (this.getClientsById && this.getClientsById.items) || []
        const client = clients.find(item => item.id === id) || {}
        const text = ((client.contactPerson && client.contactPerson.fullName) || client.uid) || ''
        return {
          text,
          value: id,
        }
      })
    },
    clients () {
      return (this.searchClients && this.searchClients.items) || []
    },
    canCreateSpec () {
      return this.roleInOrg === Role.OWNER ||
        this.roleInOrg === Role.MANAGER ||
        this.roleInOrg === Role.FREELANCER
    },
    roleInOrg () {
      const orgs = this.getOrgs || []
      const org = orgs.find(el => el.id === this.orgId) || {}
      return org.role || null
    },
    headers () {
      return [
        { text: '', value: 'status', align: 'left', width: 45, sortable: true },
        { text: '', value: 'isMoneyRecieved', align: 'left', width: 50, sortable: false },
        { text: '', value: 'isExpensesPaid', align: 'left', width: 50, sortable: false },
        { text: '', value: 'finalCost', align: 'right', width: 110, sortable: true },
        { text: '', value: 'margin', align: 'right', width: 62, sortable: true },
        { text: this.$t('deals.clientName'), value: 'client.fullName', align: 'left', width: 230, minWidth: 230, class: 'whitespace-nowrap text-left pl-6', sortable: true },
        { text: this.$t('deals.contactPerson'), value: 'client.contactPersonFullName', align: 'left', width: 152, sortable: true },
        { text: this.$t('deals.number'), value: 'specNo', align: 'left', width: 80, minWidth: 80, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.createdAt'), value: 'createdAt', align: 'left', width: 100, minWidth: 100, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.contact'), value: 'client.contactPhone', align: 'left', width: 85, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.clientUcn'), value: 'client.uid', align: 'right', width: 60, class: 'whitespace-nowrap', sortable: true },
        { text: '', value: 'actions', width: 54 },
        { text: '', value: 'isShipped', width: 28 },
        { text: '', value: 'hasNewComment', width: 5 },
      ]
    },
    items () {
      const items = this.getSpecs || []
      return items.map(item => {
        let specNoCount = null
        const specNo = item.specNo || ''
        const specNoSplit = specNo.split('-')
        const hasClientUid = specNo.split(/\d{4,4}-\d{2,2}-\d{2,2}/)[0]
        if (hasClientUid) {
          specNoCount = specNoSplit[4]
        } else {
          specNoCount = specNoSplit[3]
        }
        const client = item.client || {}
        return {
          ...item,
          client,
          specNoCount,
        }
      })
    },
  },
  watch: {
    createSpecDialog (val) {
      if (val) {
        setTimeout(() => {
          if (this.$refs.clientSearchInput) {
            this.$refs.clientSearchInput.focus()
          }
        }, 300)
      } else {
        setTimeout(() => {
          this.createSpecClient = null
        }, 300)
      }
    },
  },
  created () {
    if (this.$route.query.clients) {
      this.filter.clientsIds = !Array.isArray(this.$route.query.clients) ? [this.$route.query.clients] : this.$route.query.clients
    }
    const clientType = Number.parseInt(this.$route.query.clientType, 10) || null
    if (this.$route.query.group) {
      this.filter.group = true
      this.currentFilter = 4
    }
    if (clientType) {
      this.filter.clientType = clientType
      this.currentFilter = clientType
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
      // TODO: deep equal query 'clients' and 'filter.clientsIds'
      if (!query.clients) {
        this.filter.clientsIds = []
      }
      this.filter.group = !!query.group
      const clientType = Number.parseInt(query.clientType, 10) || null
      if (clientType !== this.filter.clientType) {
        this.filter.clientType = clientType
      }
      if (query.q !== this.search) {
        this.search = query.q
      }
      if (query.sort !== this.sortBy[0]) {
        this.sortBy = query.sort ? wrapInArray(query.sort) : []
      }
      this.sortDesc = this.sortBy.length > 0 ? [query.desc === true || query.desc === 'true'] : []
    })
    this.$watch('filter', this.updateRouteQuery, { deep: true })
  },
  mounted () {
    const apolloClient = this.resolveClient()

    const observer = apolloClient.subscribe({
      query: SPECS_DELTA,
      fetchPolicy: 'no-cache',
    })

    observer.subscribe({
      next: ({ data }) => {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        if (operation === Operation.INSERT_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            getSpecs.push(data.delta.payload)

            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
        }

        if (operation === Operation.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${Typename.SPEC}:${data.delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: data.delta.payload,
          })
        }

        if (operation === Operation.DELETE_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          const index = getSpecs.findIndex(el => el.id === data.delta.payload.id)

          if (index !== -1) {
            getSpecs.splice(index, 1)
            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
  methods: {
    customGroup (items, groupBy) {
      const key = groupBy[0]
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const id = curr[key]
        if (id) {
          if (Object.prototype.hasOwnProperty.call(acc, id)) {
            acc[id].push(curr)
          } else {
            acc[id] = [curr]
          }
        } else {
          others.push(curr)
        }
        return acc
      }, {})
      const result = []
      const roles = Object.keys(Role).reduce((acc, curr, index) => {
        return { ...acc, [curr]: index + 1 }
      }, {})
      // sort by roles
      const keys = Object.keys(grouped).sort((a, b) => {
        const itemA = grouped[a][0]
        const itemB = grouped[b][0]
        return roles[itemA.employeeRole] - roles[itemB.employeeRole]
      })
      keys.forEach(k => {
        const groupItems = grouped[k]
        const item = groupItems[0]
        const fullName = item.employeeFullName || ''
        const role = this.$te(`role.${item.employeeRole}`) ? this.$t(`role.${item.employeeRole}`) : item.employeeRole || ''
        const name = `${fullName} (${role})`
        const group = { name, items: groupItems }
        result.push(group)
      })
      if (others.length > 0) {
        result.push({ name: '#', items: others })
      }
      return result
    },
    updateRouteQuery () {
      const query = {}
      if (this.filter.clientsIds.length > 0) {
        query.clients = this.filter.clientsIds
      }
      if (this.filter.group) {
        query.group = true
      }
      if (this.filter.clientType) {
        query.clientType = this.filter.clientType
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
    changeClientType (value) {
      this.currentFilter = value
      if (value === 4) {
        this.filter.clientType = null
        this.filter.group = true
      } else {
        this.filter.clientType = value
        this.filter.group = false
      }
    },
    clearClientFilter (id) {
      this.filter.clientsIds = this.filter.clientsIds.filter(el => el !== id)
    },
    clearFilters () {
      this.filter.clientsIds = []
    },
    goToSpec (specId) {
      this.$router.push({
        name: 'spec',
        params: { specId },
      })
    },
    createClient () {
      this.clientDialog = true
      this.$nextTick(() => {
        if (this.$refs.clientCard) {
          this.$refs.clientCard.reset()
          if (this.$refs.clientDialog.$refs.dialog) {
            this.$refs.clientDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    setCreateSpecClient (client) {
      this.clientDialog = false
      this.createSpecClient = client
    },
    async createSpec (withoutClient) {
      const client = this.resolveClient()
      const loading = withoutClient ? 'createWithoutClientLoading' : 'createWithClientLoading'
      this[loading] = true
      try {
        const variables = { orgId: this.orgId }
        if (!withoutClient && this.createSpecClient && this.createSpecClient.id) {
          variables.clientId = this.createSpecClient.id
        }
        const response = await client.mutate({
          mutation: CREATE_SPEC,
          variables,
        })
        if (response && response.data && response.data.createSpec) {
          const spec = response.data.createSpec

          const { getSpecs } = client.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          if (!getSpecs.some(el => el.id === spec.id)) {
            getSpecs.push(spec)

            client.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
          this.$router.push({ name: 'spec', params: { orgId: this.orgId, specId: spec.id } })
        }
      } catch (error) {
        if (error.graphQLErrors) {
          for (const err of error.graphQLErrors) {
            const { message } = err
            if (message === 'ForbiddenError: Insufficient access rights') {
              // alert(this.$t('alert.insufficientAccess'))
            }
          }
        } else {
          throw new Error(error)
        }
      } finally {
        setTimeout(() => {
          this[loading] = false
        }, 150)
      }
    },
    async deleteSpec (id) {
      try {
        const client = this.resolveClient()
        const msg = this.$t('alert.removeDeal')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        await client.mutate({
          mutation: DELETE_SPEC,
          variables: {
            id,
          },
        })
        const { getSpecs } = client.readQuery({
          query: GET_SPECS,
          variables: {
            orgId: this.orgId,
            clientsIds: this.filter.clientsIds,
            clientType: this.clientTypeEnum,
          },
        })

        const index = getSpecs.findIndex(el => el.id === id)

        if (index !== -1) {
          getSpecs.splice(index, 1)
          client.writeQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
            data: {
              getSpecs,
            },
          })
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        throw new Error(error)
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>
