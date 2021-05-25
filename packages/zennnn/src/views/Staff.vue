<template>
  <div>
    <StaffCreateModal
      v-model="createStaffDialog"
      @update:model-value="refetchItems"
    />

    <div class="container">
      <div class="pt-4 pb-10">
        <div
          class="
            flex flex-wrap
            sm:flex-nowrap
            items-center
            justify-between
            pb-4
          "
        >
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            :control-class="
              search
                ? 'bg-transparent dark:bg-transparent ring-1 ring-blue-500'
                : 'bg-transparent dark:bg-transparent'
            "
            :prepend-icon="icons.ziSearch"
            class="w-full flex-shrink-0 md:max-w-md pb-4 md:pr-8"
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
          :group-by="['type']"
          :group-desc="[true]"
          :loading="loading"
          table-width="100%"
          table-class="table-fixed"
        >
          <template v-slot:header-content-processing>
            <span class="truncate inline-block max-w-full align-middle pl-6">
              {{ $t('staff.inWork') }}
            </span>
          </template>
          <template v-slot:header-content-fullName="{ header }">
            <span
              class="truncate inline-block align-middle"
              :style="{ maxWidth: header.width - 88 + 'px' }"
            >
              {{ header.text }}
            </span>
          </template>
          <template v-slot:header-content-role="{ header }">
            <span
              class="truncate inline-block align-middle"
              :style="{ maxWidth: header.width - 24 + 'px' }"
            >
              {{ header.text }}
            </span>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="item in items">
              <tr
                v-if="!item.group"
                :key="item.id"
                :class="[
                  { 'hover:bg-gray-500 cursor-default': item.isStaff },
                  { 'text-white expanded': expanded.includes(item.id) },
                ]"
                @click="item.isStaff ? toggle(item.id) : false"
              >
                <td
                  :colspan="item.isStaff ? 1 : 2"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  <div
                    v-if="item.isStaff"
                    class="flex items-center justify-between"
                  >
                    <div
                      :class="[
                        'w-3 h-3 rounded-full ml-5 mr-3',
                        item.specStatus === SpecStatus.IN_STOCK
                          ? 'bg-green-500'
                          : item.specStatus === SpecStatus.IN_PRODUCTION
                          ? 'bg-yellow-500'
                          : item.specStatus === SpecStatus.IN_PROCESSING
                          ? 'bg-pink-500'
                          : 'bg-gray-800',
                      ]"
                    ></div>
                    <div class="truncate">
                      {{ item.processing }}
                    </div>
                  </div>
                  <span v-else class="whitespace-nowrap pl-4">
                    {{ $t('staff.invitationFrom') }}:
                    {{ $d($parseDate(item.createdAt), 'short') }}
                  </span>
                </td>
                <td
                  v-if="item.isStaff"
                  :class="[
                    'truncate text-right',
                    { 'text-green-500': item.diff > 0 },
                    { 'text-pink-500': item.diff < 0 },
                  ]"
                >
                  {{ $n(item.diff || 0) }}
                </td>
                <td
                  :colspan="item.isStaff ? 1 : 2"
                  class="truncate text-right"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  <span v-if="item.isStaff"> {{ $n(item.totalMargin) }}% </span>
                  <span v-else class="pl-8">
                    {{ item.invitationEmail }}
                  </span>
                </td>
                <td v-if="item.isStaff" class="truncate text-right">
                  <span>
                    {{ $n(item.revenue || 0) }}
                  </span>
                </td>
                <td
                  class="truncate text-right"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  <span v-if="item.isStaff">
                    {{ $n(item.totalItemsCost || 0) }}
                  </span>
                  <span
                    v-else
                    class="text-left block align-middle pl-12"
                    :class="[
                      item.status === InvitationStatus.PENDING
                        ? 'text-yellow-500'
                        : item.status === InvitationStatus.DECLINED
                        ? 'text-pink-500'
                        : item.status === InvitationStatus.ACCEPTED
                        ? 'text-green-500'
                        : '',
                    ]"
                  >
                    {{ item.statusText }}
                  </span>
                </td>
                <td
                  class="truncate text-left leading-tight pl-16"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  {{ item.fullName }}
                </td>
                <td
                  class="truncate text-left"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  {{ item.role }}
                </td>
                <td :class="{ 'bg-gray-400': item.isInvitation }">
                  <Switch hide-details disabled @click.stop.prevent />
                </td>
                <td
                  class="text-center"
                  :class="{ 'bg-gray-400': item.isInvitation }"
                >
                  <div
                    v-if="deleteUserLoading === item.id"
                    class="flex items-center justify-center"
                  >
                    <Progress indeterminate size="18" width="2" />
                  </div>
                  <template v-else>
                    <button
                      v-if="item.isStaff"
                      class="
                        flex
                        items-center
                        text-gray-200
                        focus:text-gray-100
                        hover:text-gray-100
                        focus:outline-none
                      "
                      @click.stop.prevent="deleteUser(item.id)"
                    >
                      <Icon>
                        {{ icons.ziDelete }}
                      </Icon>
                    </button>
                    <button
                      v-else
                      class="
                        flex
                        items-center
                        text-gray-200
                        focus:text-gray-100
                        hover:text-gray-100
                        focus:outline-none
                      "
                      @click.stop.prevent="cancelInvitation(item.id)"
                    >
                      <Icon>
                        {{ icons.ziDelete }}
                      </Icon>
                    </button>
                  </template>
                </td>
                <td :class="{ 'bg-gray-400': item.isInvitation }">
                  <button
                    v-if="item.isStaff"
                    class="
                      flex
                      items-center
                      text-2xl text-blue-500
                      focus:text-blue-400
                      hover:text-blue-400
                      focus:outline-none
                      select-none
                      mx-auto
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
                </td>
              </tr>
              <tr
                v-if="expanded.includes(item.id)"
                :key="`expand-${item.id}`"
                class="expand bg-gray-700"
                style="background-color: #282828"
              >
                <td :colspan="headers.length" class="relative p-0">
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
                  <div
                    v-if="!item.specs || item.specs.length === 0"
                    v-html="$t('dataTable.noData')"
                    class="
                      bg-gray-700
                      rounded-b-md
                      text-center text-gray-200
                      leading-tight
                      py-4
                      -mt-1
                    "
                  />
                  <DataTable
                    v-if="item.specs && item.specs.length > 0"
                    :headers="subHeaders"
                    :items="item.specs"
                    :rounded="false"
                    :scrollable="false"
                    hide-headers
                    table-width="100%"
                    table-class="table-fixed -mt-1"
                  >
                    <template v-slot:items="{ items: subItems }">
                      <tr
                        v-for="(subItem, i) in subItems"
                        :key="subItem.id"
                        class="bg-gray-700"
                        style="background-color: #282828"
                      >
                        <td
                          :width="subHeadersMap['status'].width"
                          :style="{
                            width: subHeadersMap['status'].width,
                            minWidth: subHeadersMap['status'].width,
                          }"
                          class="bg-gray-700"
                          :class="{
                            'rounded-bl-md': i + 1 === subItems.length,
                          }"
                        >
                          <div class="flex items-center justify-between">
                            <div
                              class="
                                w-3
                                h-3
                                flex
                                items-center
                                justify-center
                                ml-5
                                mr-3
                              "
                            >
                              <div
                                :class="[
                                  'w-2 h-2 rounded-full',
                                  subItem.specStatus === SpecStatus.IN_STOCK
                                    ? 'bg-green-500'
                                    : subItem.specStatus ===
                                      SpecStatus.IN_PRODUCTION
                                    ? 'bg-yellow-500'
                                    : subItem.specStatus ===
                                      SpecStatus.IN_PROCESSING
                                    ? 'bg-pink-500'
                                    : 'bg-gray-800',
                                ]"
                              ></div>
                            </div>
                            <div class="flex">
                              <div class="w-6 text-right">
                                <span v-if="subItem.isMoneyRecieved">+$</span>
                              </div>
                              <div class="w-6 text-right">
                                <span v-if="subItem.isExpensesPaid">-$</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          :width="subHeadersMap['diff'].width"
                          :style="{
                            width: subHeadersMap['diff'].width,
                            minWidth: subHeadersMap['diff'].width,
                          }"
                          :class="['bg-gray-700 truncate text-right']"
                        >
                          {{ $n(subItem.diff || 0) }}
                        </td>
                        <td
                          :width="subHeadersMap['margin'].width"
                          :style="{
                            width: subHeadersMap['margin'].width,
                            minWidth: subHeadersMap['margin'].width,
                          }"
                          class="bg-gray-700 truncate text-right"
                        >
                          <!-- TODO: vue error -->
                          <!-- {{ $n(subItem.totalMargin) }}% -->
                          {{ subItem.totalMargin }}%
                        </td>
                        <td
                          :width="subHeadersMap['revenue'].width"
                          :style="{
                            width: subHeadersMap['revenue'].width,
                            minWidth: subHeadersMap['revenue'].width,
                          }"
                          class="bg-gray-700 truncate text-right"
                        >
                          {{ $n(subItem.revenue || 0) }}
                        </td>
                        <td
                          :width="subHeadersMap['totalItemsCost'].width"
                          :style="{
                            width: subHeadersMap['totalItemsCost'].width,
                            minWidth: subHeadersMap['totalItemsCost'].width,
                          }"
                          class="bg-gray-700 truncate text-right"
                        >
                          {{ $n(subItem.totalItemsCost || 0) }}
                        </td>
                        <td
                          :width="subHeadersMap['specNo'].width"
                          :style="{
                            width: subHeadersMap['specNo'].width,
                            minWidth: subHeadersMap['specNo'].width,
                          }"
                          class="
                            bg-gray-700
                            truncate
                            text-left
                            leading-tight
                            pl-16
                          "
                        >
                          <span class="whitespace-nowrap pl-5">
                            {{ subItem.specNo || '' }}
                          </span>
                        </td>
                        <td
                          :width="subHeadersMap['clientFullName'].width"
                          :style="{
                            width: subHeadersMap['clientFullName'].width,
                            minWidth: subHeadersMap['clientFullName'].width,
                          }"
                          class="bg-gray-700 truncate text-left"
                        >
                          <span class="whitespace-nowrap pl-5">
                            {{ subItem.clientFullName }}
                          </span>
                        </td>
                        <td
                          :width="subHeadersMap['actions'].width"
                          :style="{
                            width: subHeadersMap['actions'].width,
                            minWidth: subHeadersMap['actions'].width,
                            overflow: 'visible',
                          }"
                          class="bg-gray-700 text-right"
                        >
                          <router-link
                            :to="{
                              name: 'spec',
                              params: {
                                orgId,
                                specId: subItem.id,
                              },
                            }"
                            tabindex="-1"
                            class="
                              align-middle
                              text-gray-200
                              focus:outline-none
                              focus:text-gray-100
                              hover:text-gray-100
                              -mr-3
                            "
                          >
                            <Icon class="align-middle">
                              {{ icons.ziSearch }}
                            </Icon>
                          </router-link>
                        </td>
                        <td
                          :width="subHeadersMap['shipped'].width"
                          :style="{
                            width: subHeadersMap['shipped'].width,
                            minWidth: subHeadersMap['shipped'].width,
                          }"
                          class="bg-gray-700 text-center"
                          :class="{
                            'rounded-br-md': i + 1 === subItems.length,
                          }"
                        >
                          <span
                            v-if="subItem.shipped"
                            class="
                              inline-block
                              align-middle
                              h-2
                              w-2
                              rounded-full
                              bg-cold-blue-400
                            "
                          ></span>
                        </td>
                      </tr>
                    </template>
                  </DataTable>
                </td>
              </tr>
            </template>
          </template>

          <template v-slot:no-data>
            <div
              v-html="$t('staff.noData')"
              class="text-center text-gray-200 leading-tight py-4"
            />
          </template>
        </DataTable>
        <Btn block outlined class="mt-4" @click="createStaffDialog = true">
          <Icon class="text-gray-200 mr-sm">
            {{ icons.ziUserPlus }}
          </Icon>
          <span>{{ $t('staff.addStaff') }}</span>
        </Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'
import { wrapInArray } from 'vue-supp'

import { ziDelete, ziSearch, ziUserPlus, ziChevronRight } from '@zennnn/icons'
import { Btn, Icon, Progress, TextField, Switch, DataTable } from '@zennnn/core'

import { LIST_STAFF } from '../graphql/queries'
import { CANCEL_INVITATION, REMOVE_USER_FROM_ORG } from '../graphql/mutations'
import { SpecStatus, InvitationStatus } from '../graphql/enums'

import { confirmDialog } from '../utils/confirmDialog'

import StaffCreateModal from '../components/StaffCreateModal.vue'

export default {
  name: 'Staff',
  components: {
    Btn,
    Icon,
    Progress,
    DataTable,
    TextField,
    Switch,
    StaffCreateModal,
  },
  setup() {
    const route = useRoute()
    const orgId = route.params.orgId

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const {
      result,
      loading,
      refetch: listStaffRefetch,
    } = useQuery(
      LIST_STAFF,
      () => ({
        orgId: orgId,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )
    const listStaff = useResult(result)

    return {
      icons: {
        ziDelete,
        ziSearch,
        ziUserPlus,
        ziChevronRight,
      },
      apolloClient,
      orgId,
      loading,
      listStaff,
      listStaffRefetch,
    }
  },
  data() {
    return {
      SpecStatus,
      InvitationStatus,
      deleteUserLoading: null,
      sortBy: [],
      sortDesc: [],
      search: undefined,
      createLoading: false,
      deleteLoading: null,
      createStaffDialog: false,
      expanded: [],
      errors: [],
    }
  },
  computed: {
    items() {
      const roleFilter = (val) => {
        return this.$te(`role.${val}`) ? this.$t(`role.${val}`) : val
      }
      const statusFilter = (val) => {
        return this.$te(`invitationStatus.${val}`)
          ? this.$t(`invitationStatus.${val}`)
          : val
      }
      const items = (this.listStaff && this.listStaff.items) || []
      const invitations = (this.listStaff && this.listStaff.invitations) || []
      const staffItems = items.map((item) => {
        return {
          ...item,
          // for search
          fullName: `${item.givenName} ${item.familyName}`,
          isStaff: true,
          type: 'staff',
          role: roleFilter(item.role),
        }
      })
      const invitationsItems = invitations.map((item) => {
        return {
          ...item,
          // for search
          fullName: `${item.invitationGivenName} ${item.invitationFamilyName}`,
          isInvitation: true,
          type: 'invitations',
          role: roleFilter(item.invitationRole),
          statusText: statusFilter(item.status),
        }
      })
      return [...staffItems, ...invitationsItems]
    },
    headers() {
      return [
        {
          text: this.$t('staff.inWork'),
          value: 'processing',
          align: 'right',
          width: 100,
          minWidth: 100,
          sortable: true,
        },
        {
          text: this.$t('staff.diff'),
          value: 'diff',
          align: 'right',
          width: 105,
          minWidth: 105,
          sortable: true,
        },
        {
          text: this.$t('staff.percent'),
          value: 'totalMargin',
          align: 'right',
          width: 66,
          minWidth: 66,
          sortable: true,
        },
        {
          text: this.$t('staff.revenue'),
          value: 'revenue',
          align: 'right',
          width: 118,
          minWidth: 118,
          sortable: true,
        },
        {
          text: this.$t('staff.costOfGoods'),
          value: 'totalItemsCost',
          align: 'right',
          width: 140,
          minWidth: 140,
          sortable: true,
        },
        {
          text: this.$t('staff.staffName'),
          value: 'fullName',
          align: 'left',
          width: 220,
          minWidth: 220,
          class: 'whitespace-nowrap pl-16',
          sortable: true,
        },
        {
          text: this.$t('staff.access'),
          value: 'role',
          align: 'left',
          width: 132,
          minWidth: 132,
          class: 'whitespace-nowrap',
          sortable: true,
        },
        {
          text: this.$t('staff.accessControl'),
          value: 'accessControl',
          align: 'left',
          width: 75,
          minWidth: 75,
          class: 'whitespace-nowrap',
          sortable: false,
        },
        { text: '', value: 'actions', width: 40, minWidth: 40 },
        { text: '', value: 'expand', width: 50, minWidth: 50 },
      ]
    },
    subHeaders() {
      return [
        {
          text: '',
          value: 'status',
          align: 'right',
          width: '100px',
          minWidth: '100px',
        },
        {
          text: '',
          value: 'diff',
          align: 'right',
          width: '105px',
          minWidth: '105px',
        },
        {
          text: '',
          value: 'margin',
          align: 'right',
          width: '66px',
          minWidth: '66px',
        },
        {
          text: '',
          value: 'revenue',
          align: 'right',
          width: '118px',
          minWidth: '118px',
        },
        {
          text: '',
          value: 'totalItemsCost',
          align: 'right',
          width: '140px',
          minWidth: '140px',
        },
        {
          text: '',
          value: 'specNo',
          align: 'left',
          width: '220px',
          minWidth: '220px',
          class: 'whitespace-nowrap pl-16',
        },
        {
          text: '',
          value: 'clientFullName',
          align: 'left',
          width: '207px',
          minWidth: '207px',
          class: 'whitespace-nowrap',
        },
        { text: '', value: 'actions', width: '40px', minWidth: '40px' },
        { text: '', value: 'shipped', width: '50px', minWidth: '50px' },
      ]
    },
    subHeadersMap() {
      const headers = this.subHeaders || []
      const result = {}
      headers.forEach((item) => {
        result[item.value] = item
      })
      return result
    },
  },
  created() {
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
    updateRouteQuery() {
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
    goToSpec(item) {
      this.$router.push({
        name: 'spec',
        params: {
          orgId: this.$route.params.orgId,
          specId: item.id,
        },
      })
    },
    // TODO: update on after mutation
    refetchItems() {
      this.listStaffRefetch()
    },
    async cancelInvitation(id) {
      try {
        await this.apolloClient.mutate({
          mutation: CANCEL_INVITATION,
          variables: { id },
        })
        this.refetchItems()
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteUser(userId) {
      try {
        const msg = this.$t('alert.removeEmployee')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteUserLoading = userId
        await this.apolloClient.mutate({
          mutation: REMOVE_USER_FROM_ORG,
          variables: {
            orgId: this.orgId,
            userId,
          },
        })
        const { listStaff } = this.apolloClient.readQuery({
          query: LIST_STAFF,
          variables: { orgId: this.orgId },
        })

        const index = listStaff.items.findIndex((el) => el.id === userId)

        if (index !== -1) {
          listStaff.items.splice(index, 1)
          this.apolloClient.writeQuery({
            query: LIST_STAFF,
            variables: { orgId: this.orgId },
            data: {
              listStaff,
            },
          })
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        if (error.message !== 'ForbiddenError: Owner cannot be deleted.') return
        throw new Error(error)
      } finally {
        this.deleteUserLoading = null
      }
    },
    toggle(id) {
      if (this.expanded.indexOf(id) > -1) {
        const expIndex = this.expanded.indexOf(id)
        this.expanded.splice(expIndex, 1)
      } else {
        this.expanded.push(id)
      }
    },
  },
}
</script>
