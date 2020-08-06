<template>
  <div>

    <StaffCreateModal
      v-model="createStaffDialog"
      @update="refetchItems"
    />

    <div class="container container--sm">
      <div class="pt-4 pb-10">
        <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

        <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between pb-4">
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            class="w-full flex-shrink-0 md:max-w-md pb-4 md:pr-8"
            content-class="input-transparent"
            input-class="placeholder-blue-500"
            append-slot-class="w-auto"
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
        </div>

        <div class="overflow-x-auto overflow-scroll-touch pb-4">
          <DataTable
            :headers="headers"
            :items="items"
            :search="search"
            table-width="100%"
            table-class="table-fixed"
            hide-no-data
          >
            <template v-slot:header.inWorkCount-content>
              <span class="truncate inline-block max-w-full align-middle pl-6">
                {{ $t('staff.inWork') }}
              </span>
            </template>
            <template v-slot:items="{ items }">
              <template v-for="(item, index) in items">
                <tr
                  :key="item.id"
                  :class="[{ 'hover:bg-gray-500 cursor-pointer': item.isStaff }, { 'text-white expanded': expanded.includes(index) }]"
                  @click="item.isStaff ? toggle(index) : false"
                >
                  <td :colspan="item.isStaff ? 1 : 2" :class="{ 'bg-gray-400': item.isInvitation }">
                    <div v-if="item.isStaff" class="flex items-center justify-between">
                      <div
                        :class="[
                          'w-3 h-3 rounded-full ml-5 mr-3',
                          item.specStatus === SpecStatus.IN_STOCK
                            ? 'bg-green-500' : item.specStatus === SpecStatus.IN_PRODUCTION
                              ? 'bg-yellow-500' : item.specStatus === SpecStatus.IN_PROCESSING
                                ? 'bg-pink-500' : 'bg-gray-800'
                        ]"
                      >
                      </div>
                      <div class="truncate">
                        {{ item.inWorkCount }}
                      </div>
                    </div>
                    <span v-else class="whitespace-no-wrap pl-4">
                      {{ $t('staff.invitationFrom') }}: {{ $d($parseDate(item.createdAt), 'short') }}
                    </span>
                  </td>
                  <td v-if="item.isStaff" :class="['truncate text-right', { 'text-green-500': item.diff > 0 }, { 'text-pink-500' :item.diff < 0 }]">
                    {{ $n(item.diff || 0) }}
                  </td>
                  <td :colspan="item.isStaff ? 1 : 2" class="truncate text-right" :class="{ 'bg-gray-400': item.isInvitation }">
                    <span v-if="item.isStaff">
                      {{ $n(item.totalMargin) }}%
                    </span>
                    <span v-else class="pl-8">
                      {{ item.invitationEmail }}
                    </span>
                  </td>
                  <td v-if="item.isStaff" class="truncate text-right">
                    <span>
                      {{ $n(item.revenue || 0) }}
                    </span>
                  </td>
                  <td class="truncate text-right" :class="{ 'bg-gray-400': item.isInvitation }">
                    <span v-if="item.isStaff">
                      {{ $n(item.totalItemsCost || 0) }}
                    </span>
                    <span v-else class="text-left block align-middle pl-12" :class="[item.status === InvitationStatus.PENDING ? 'text-yellow-500' : item.status === InvitationStatus.DECLINED ? 'text-pink-500' : item.status === InvitationStatus.ACCEPTED ? 'text-green-500' : '']">
                      {{ item.status | statusFilter }}
                    </span>
                  </td>
                  <td class="truncate text-left leading-tight pl-16" :class="{ 'bg-gray-400': item.isInvitation }">
                    {{ item.fullName }}
                  </td>
                  <td class="truncate text-left" :class="{ 'bg-gray-400': item.isInvitation }">{{ item.role | roleFilter }}</td>
                  <td :class="{ 'bg-gray-400': item.isInvitation }">
                    <SwitchInput
                      hide-details
                      disabled
                      @click.stop.prevent
                    />
                  </td>
                  <td class="text-center" :class="{ 'bg-gray-400': item.isInvitation }">
                    <div
                      v-if="deleteUserLoading === item.id"
                      class="flex items-center justify-center"
                    >
                      <v-progress-circular
                        indeterminate
                        size="18"
                        width="2"
                      />
                    </div>
                    <template v-else>
                      <button
                        v-if="item.isStaff"
                        class="flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none"
                        @click.stop.prevent="deleteUser(item.id)"
                      >
                        <i class="zi-delete" />
                      </button>
                      <button
                        v-else
                        class="flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none"
                        @click.stop.prevent="cancelInvitation(item.id)"
                      >
                        <i class="zi-delete" />
                      </button>
                    </template>
                  </td>
                  <td :class="{ 'bg-gray-400': item.isInvitation }">
                    <button
                      v-if="item.isStaff"
                      class="flex items-center text-2xl text-blue-500 focus:text-blue-600 hover:text-blue-600 focus:outline-none select-none mx-auto"
                    >
                      <i
                        v-if="expanded.includes(index)"
                        class="zi-chevron-down"
                      />
                      <i
                        v-else
                        class="zi-chevron-up transform rotate-90"
                      />
                    </button>
                  </td>
                </tr>
                <template v-if="expanded.includes(index)">
                  <tr
                    :key="`expand-${index}-${item.id}`"
                    class="expand bg-gray-700"
                    style="background-color: #282828;"
                  >
                    <td :colspan="headers.length" class="relative p-0">
                      <div
                        :style="{
                          background: 'linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0) 100%)',
                        }"
                        class="absolute inset-x-0 top-0 pointer-events-none opacity-50 h-6 -mt-1"
                      />
                      <div
                        v-if="!item.specs || item.specs.length === 0"
                        v-html="$t('dataTable.noData')"
                        class="bg-gray-700 rounded-b-md text-center text-gray-200 leading-tight py-4 -mt-1"
                      />
                      <DataTable
                        v-if="item.specs && item.specs.length > 0"
                        :headers="subHeaders"
                        :items="item.specs"
                        hide-headers
                        table-width="100%"
                        table-class="table-fixed -mt-1"
                        flat
                        hide-no-data
                      >
                        <template v-slot:items="{ items: subItems }">
                          <template v-for="(subItem, i) in subItems">
                            <tr class="bg-gray-700" :key="subItem.id" style="background-color: #282828;">
                              <td :width="subHeaders[0].width" :style="{ width: subHeaders[0].width, minWidth: subHeaders[0].width }" class="bg-gray-700" :class="{ 'rounded-bl-md': i + 1 === subItems.length }">
                                <div class="flex items-center justify-between">
                                  <div class="w-3 h-3 flex items-center justify-center ml-5 mr-3">
                                    <div
                                      :class="[
                                        'w-2 h-2 rounded-full',
                                        subItem.specStatus === SpecStatus.IN_STOCK
                                          ? 'bg-green-500' : subItem.specStatus === SpecStatus.IN_PRODUCTION
                                            ? 'bg-yellow-500' : subItem.specStatus === SpecStatus.IN_PROCESSING
                                              ? 'bg-pink-500' : 'bg-gray-800'
                                      ]"
                                    >
                                    </div>
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
                              <td :width="subHeaders[1].width" :style="{ width: subHeaders[1].width, minWidth: subHeaders[1].width }" :class="['bg-gray-700 truncate text-right']">
                                {{ $n(subItem.diff || 0) }}
                              </td>
                              <td :width="subHeaders[2].width" :style="{ width: subHeaders[2].width, minWidth: subHeaders[2].width }" class="bg-gray-700 truncate text-right">
                                {{ $n(subItem.totalMargin) }}%
                              </td>
                              <td :width="subHeaders[3].width" :style="{ width: subHeaders[3].width, minWidth: subHeaders[3].width }" class="bg-gray-700 truncate text-right">
                                {{ $n(subItem.revenue || 0) }}
                              </td>
                              <td :width="subHeaders[4].width" :style="{ width: subHeaders[4].width, minWidth: subHeaders[4].width }" class="bg-gray-700 truncate text-right">
                                {{ $n(subItem.totalItemsCost || 0) }}
                              </td>
                              <td :width="subHeaders[5].width" :style="{ width: subHeaders[5].width, minWidth: subHeaders[5].width }" class="bg-gray-700 truncate text-left leading-tight pl-16">
                                <span class="whitespace-no-wrap pl-5">
                                  {{ subItem.specNo || '' }}
                                </span>
                              </td>
                              <td :width="subHeaders[6].width" :style="{ width: subHeaders[6].width, minWidth: subHeaders[6].width }" class="bg-gray-700 truncate text-left">
                                <span class="whitespace-no-wrap pl-5">
                                  {{ subItem.clientFullName }}
                                </span>
                              </td>
                              <td :width="subHeaders[7].width" :style="{ width: subHeaders[7].width, minWidth: subHeaders[7].width }" class="bg-gray-700 text-right">
                                <router-link
                                  :to="{
                                    name: 'spec',
                                    params: {
                                      orgId,
                                      specId: subItem.id,
                                    },
                                  }"
                                  tabindex="-1"
                                  class="align-middle text-2xl text-gray-200 focus:outline-none focus:text-gray-100 hover:text-gray-100 -mr-3"
                                >
                                  <i class="zi-magnifier align-middle" />
                                </router-link>
                              </td>
                              <td :width="subHeaders[8].width" :style="{ width: subHeaders[8].width, minWidth: subHeaders[8].width }" class="bg-gray-700 text-center" :class="{ 'rounded-br-md': i + 1 === subItems.length }">
                                <span v-if="subItem.shipped" class="inline-block align-middle h-2 w-2 rounded-full bg-blue-400"></span>
                              </td>
                            </tr>
                          </template>
                        </template>
                      </DataTable>
                    </td>
                  </tr>
                </template>
              </template>
            </template>
          </DataTable>
        </div>
        <div
          v-if="items.length === 0"
          v-html="$t('staff.noData')"
          class="text-center text-gray-200 leading-tight py-4"
        />
        <Button
          block
          outlined
          class="mt-4"
          @click="createStaffDialog = true"
        >
          <template v-slot:icon>
            <i class="zi-user-plus text-gray-100 text-2xl" />
          </template>
          <span>{{ $t('staff.addStaff') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import StaffCreateModal from '../components/StaffCreateModal.vue'
import { LIST_STAFF } from '../graphql/queries'
import { CANCEL_INVITATION, REMOVE_USER_FROM_ORG } from '../graphql/mutations'
import { SpecStatus, InvitationStatus } from '../graphql/enums'
import { i18n } from '../plugins'
import { confirmDialog } from '../util/helpers'

export default {
  name: 'Staff',
  components: {
    StaffCreateModal,
  },
  filters: {
    roleFilter: function (val) {
      return i18n.te(`role.${val}`)
        ? i18n.t(`role.${val}`) : val
    },
    statusFilter: function (val) {
      return i18n.te(`invitationStatus.${val}`)
        ? i18n.t(`invitationStatus.${val}`) : val
    },
  },
  apollo: {
    listStaff: {
      query: LIST_STAFF,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      SpecStatus,
      InvitationStatus,
      deleteUserLoading: null,
      search: '',
      loading: false,
      createLoading: false,
      deleteLoading: null,
      createStaffDialog: false,
      expanded: [],
      errors: [],
    }
  },
  computed: {
    items () {
      const items = (this.listStaff && this.listStaff.items) || []
      const invitations = (this.listStaff && this.listStaff.invitations) || []
      const staffItems = items.map(item => {
        return {
          ...item,
          // for search
          fullName: `${item.givenName} ${item.familyName}`,
          isStaff: true,
        }
      })
      const invitationsItems = invitations.map(item => {
        return {
          ...item,
          // for search
          fullName: `${item.invitationGivenName} ${item.invitationFamilyName}`,
          role: item.invitationRole,
          isInvitation: true,

        }
      })
      return [
        ...staffItems,
        ...invitationsItems,
      ]
    },
    orgId () {
      return this.$route.params.orgId
    },
    headers () {
      return [
        { text: this.$t('staff.inWork'), value: 'inWorkCount', align: 'right', width: 100, minWidth: 100, sortable: true },
        { text: this.$t('staff.diff'), value: 'diff', align: 'right', width: 105, minWidth: 105, sortable: true },
        { text: this.$t('staff.percent'), value: 'margin', align: 'right', width: 66, minWidth: 66, sortable: true },
        { text: this.$t('staff.revenue'), value: 'revenue', align: 'right', width: 118, minWidth: 118, sortable: true },
        { text: this.$t('staff.costOfGoods'), value: 'totalItemsCost', align: 'right', width: 140, minWidth: 140, sortable: true },
        { text: this.$t('staff.staffName'), value: 'fullName', align: 'left', width: 220, minWidth: 220, class: 'whitespace-no-wrap pl-16', sortable: true },
        { text: this.$t('staff.access'), value: 'access', align: 'left', width: 132, minWidth: 132, class: 'whitespace-no-wrap', sortable: true },
        { text: this.$t('staff.accessControl'), value: 'accessControl', align: 'left', width: 75, minWidth: 75, class: 'whitespace-no-wrap', sortable: false },
        { text: '', value: 'actions', width: 40, minWidth: 40 },
        { text: '', value: 'expand', width: 50, minWidth: 50 },
      ]
    },
    subHeaders () {
      return [
        { text: '', value: 'status', align: 'right', width: '100px', minWidth: '100px' },
        { text: '', value: 'diff', align: 'right', width: '105px', minWidth: '105px' },
        { text: '', value: 'margin', align: 'right', width: '66px', minWidth: '66px' },
        { text: '', value: 'revenue', align: 'right', width: '118px', minWidth: '118px' },
        { text: '', value: 'totalItemsCost', align: 'right', width: '140px', minWidth: '140px' },
        { text: '', value: 'specNo', align: 'left', width: '220px', minWidth: '220px', class: 'whitespace-no-wrap pl-16' },
        { text: '', value: 'clientFullName', align: 'left', width: '207px', minWidth: '207px', class: 'whitespace-no-wrap' },
        { text: '', value: 'actions', width: '40px', minWidth: '40px' },
        { text: '', value: 'expand', width: '50px', minWidth: '50px' },
      ]
    },
  },
  methods: {
    goToSpec (item) {
      this.$router.push({
        name: 'spec',
        params: {
          orgId: this.$route.params.orgId,
          specId: item.id,
        },
      })
    },
    // TODO: update on after mutation
    refetchItems () {
      this.$apollo.queries.listStaff.refetch()
    },
    async cancelInvitation (id) {
      try {
        await this.$apollo.mutate({
          mutation: CANCEL_INVITATION,
          variables: { id },
        })
        this.refetchItems()
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteUser (userId) {
      try {
        const msg = this.$t('alert.removeEmployee')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteUserLoading = userId
        await this.$apollo.mutate({
          mutation: REMOVE_USER_FROM_ORG,
          variables: {
            orgId: this.orgId,
            userId,
          },
        })
        const { listStaff } = this.$apollo.provider.defaultClient.readQuery({
          query: LIST_STAFF,
          variables: { orgId: this.orgId },
        })

        const index = listStaff.items.findIndex(el => el.id === userId)

        if (index !== -1) {
          listStaff.items.splice(index, 1)
          this.$apollo.provider.defaultClient.writeQuery({
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
    toggle (index) {
      if (this.expanded.indexOf(index) > -1) {
        const expIndex = this.expanded.indexOf(index)
        this.expanded.splice(expIndex, 1)
      } else {
        this.expanded.push(index)
      }
    },
  },
}
</script>
