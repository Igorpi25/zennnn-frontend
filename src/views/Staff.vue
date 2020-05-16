<template>
  <div>

    <StaffCreateModal
      v-model="createStaffDialog"
      @update="refetchInvitations"
    />

    <div class="container container--sm">
      <div class="pt-4 pb-10">
        <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

        <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between pb-4">
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            class="w-full sm:w-64"
            content-class="input-transparent"
            input-class="placeholder-blue-500"
          >
            <template v-slot:prepend>
              <i class="zi-magnifier text-2xl text-gray-100"></i>
            </template>
          </TextField>
        </div>

        <div class="overflow-x-auto pb-4">
          <DataTable
            :headers="headers"
            :items="items"
            :search="search"
            table-width="100%"
            table-class="table-fixed"
          >
            <template v-slot:header.status="{ header }">
              <td
                :width="header.width + 'px'"
                class="px-3"
              >
                <div class="ml-6 w-3 h-3 rounded-full border border-gray-400" />
              </td>
            </template>
            <template v-slot:header.debt="{ header }">
              <td
                :width="header.width + 'px'"
                class="px-3"
              >
                ($→)
              </td>
            </template>
            <template v-slot:header.fullName="{ header }">
              <td
                :width="header.width + 'px'"
                class="text-left pl-10"
              >
                {{ $t('staff.fullName') }}
              </td>
            </template>

             <template v-slot:items="{ items }">
              <template v-for="(item, index) in items">
                <tr :key="item.id" class="items bg-gray-900 hover:bg-gray-800 border-none">
                  <td class="relative px-3">
                    <span
                      :class="[
                        'ml-6 w-3 h-3 rounded-full',
                        item.specStatus === SpecStatus.IN_STOCK
                          ? 'bg-green-500' : item.specStatus === SpecStatus.IN_PRODUCTION
                            ? 'bg-yellow-500' : item.specStatus === SpecStatus.IN_PROCESSING
                              ? 'bg-pink-500' : 'bg-gray-800'
                      ]"
                    >
                    </span>
                  </td>
                  <td>
                    <span class="flex item-center">
                      <span>{{ item.inWorkCount }}</span>
                    </span>
                  </td>
                  <td class="text-right">{{ $n(item.profit || 0, 'fixed') }}</td>
                  <td class="text-right">{{ $n(item.percent) }}%</td>
                  <td class="text-right">{{ $n(item.finalObtainCost || 0, 'fixed') }}</td>
                  <td class="text-right">{{ $n(item.finalCost || 0, 'fixed') }}</td>
                  <td class="text-left">
                    <div class="pl-2 leading-tight">
                      {{ item.givenName }} {{ item.familyName }}
                    </div>
                  </td>
                  <td class="text-left">{{ item.role | roleFilter }}</td>
                  <td class="text-center pointer-events-none" @click.prevent.stop>
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
                    <div
                      v-else
                      class="cursor-pointer pointer-events-auto flex items-center"
                      @click="deleteUser(item.id)"
                    >
                      <i class="zi-delete text-2xl text-gray-200 hover:text-gray-100" />
                    </div>
                  </td>
                  <td>
                    <div
                      class="text-2xl cursor-pointer select-none flex items-center"
                      @click="toggle(index)"
                    >
                      <i
                        v-if="expanded.includes(index)"
                        class="zi-chevron-up text-blue-500 hover:text-blue-600"
                      />
                      <i
                        v-else
                        class="zi-chevron-down text-blue-500 hover:text-blue-600"
                      />
                    </div>
                  </td>
                </tr>
                <template v-if="expanded.includes(index)" class="expanded">
                  <tr
                    v-for="specItem in item.specs"
                    :key="`expand-${index}-${specItem.id}`"
                    class="cursor-default"
                  >
                    <!-- <td :colspan="headers.length" class="bg-gray-900">
                      <DataTable
                        :headers="headers"
                        :items="item.specs"
                        hide-headers
                        table-width="100%"
                        table-class="table-fixed"
                        items-row-class="bg-gray-900"
                        items-cell-class="bg-gray-900"
                      />
                    </td> -->
                    <td class="text-right relative px-3">
                      <span
                        :class="[
                          'ml-6 w-3 h-3 rounded-full',
                          specItem.specStatus === SpecStatus.IN_STOCK
                            ? 'bg-green-500' : specItem.specStatus === SpecStatus.IN_PRODUCTION
                              ? 'bg-yellow-500' : specItem.specStatus === SpecStatus.IN_PROCESSING
                                ? 'bg-pink-500' : 'bg-gray-800'
                        ]"
                      >
                      </span>
                    </td>
                    <td class="text-center relative">
                      <strong>
                        <!-- +$</strong>&nbsp;&nbsp;<strong>-$ -->
                      </strong>
                    </td>
                    <td class="text-right">{{ $n(specItem.profit || 0, 'fixed') }}</td>
                    <td class="text-right">{{ $n(specItem.percent) }}%</td>
                    <td class="text-right">{{ $n(specItem.finalObtainCost || 0, 'fixed') }}</td>
                    <td class="text-right">{{ $n(specItem.finalCost || 0, 'fixed') }}</td>
                    <td class="text-left">
                      <div class="pl-2">
                        {{ specItem.specNo || '' }}
                      </div>
                    </td>
                    <td class="text-left">{{ specItem.clientFullName }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </template>
            </template>
          </DataTable>
        </div>
        <h4 class="text-xl font-semibold text-white mt-12">
          {{ $t('staff.invitations') }}
        </h4>
        <div class="overflow-x-auto overflow-scroll-touch pb-8">
          <DataTable
            :headers="invitationsHeaders"
            :items="invitations"
            table-width="100%"
            table-class="table-fixed"
            thead-class="text-gray-200 border-b border-gray-200"
            items-row-class="border-none bg-gray-900 hover:bg-gray-800"
            items-cell-class="bg-transparent"
          >
            <template v-slot:item.invitationEmail="{ item }">
              <td class="truncate">
                <span>{{ item.invitationEmail }}</span>
              </td>
            </template>
            <template v-slot:item.invitationRole="{ item }">
              <td class="leading-tight">
                {{ item.invitationRole | roleFilter }}
              </td>
            </template>
            <template v-slot:item.status="{ item }">
              <td>
                {{ item.status | statusFilter }}
              </td>
            </template>
            <template v-slot:item.createdAt="{ item }">
              <td>
                {{ $d($parseDate(item.createdAt), 'short') }}
              </td>
            </template>
            <template v-slot:item.updatedAt="{ item }">
              <td>
                {{ $d($parseDate(item.updatedAt), 'short') }}
              </td>
            </template>
            <template v-slot:item.actions="{ item }">
              <td>
                <div
                  class="cursor-pointer pointer-events-auto flex items-center justify-center"
                  @click="cancelInvitation(item.id)"
                >
                  <i class="zi-delete text-2xl text-gray-200 hover:text-gray-100" />
                </div>
              </td>
            </template>
          </DataTable>
        </div>
        <Button
          block
          outlined
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
import {
  mdiMagnify,
  mdiChevronUp,
  mdiChevronDown,
  mdiPlusCircleOutline,
} from '@mdi/js'

import StaffCreateModal from '../components/StaffCreateModal.vue'
import { LIST_ORG_INVITATIONS, LIST_STAFF } from '../graphql/queries'
import { CANCEL_INVITATION, REMOVE_USER_FROM_ORG } from '../graphql/mutations'
import { SpecStatus } from '../graphql/enums'
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
    },
    listOrgInvitations: {
      query: LIST_ORG_INVITATIONS,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
    },
  },
  data () {
    return {
      SpecStatus,
      deleteUserLoading: null,
      search: '',
      loading: false,
      createLoading: false,
      deleteLoading: null,
      createStaffDialog: false,
      expanded: [],
      errors: [],
      icons: {
        mdiMagnify,
        mdiChevronUp,
        mdiChevronDown,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    items () {
      const items = (this.listStaff && this.listStaff.items) || []
      return items.map(item => {
        return {
          ...item,
          // for search
          fullName: `${item.givenName} ${item.familyName}`,
        }
      })
    },
    orgId () {
      return this.$route.params.orgId
    },
    invitations () {
      return this.listOrgInvitations || []
    },
    headers () {
      return [
        { text: '', value: 'status', align: 'left', width: 45, sortable: true },
        { text: this.$t('staff.inWork'), value: 'inWorkCount', align: 'left', width: 80, minWidth: 80, sortable: true },
        { text: this.$t('staff.diff'), value: 'profit', align: 'right', width: 120, minWidth: 120 },
        { text: this.$t('staff.percent'), value: 'diffPercent', align: 'right', width: 80, minWidth: 80, sortable: true },
        { text: this.$t('staff.revenue'), value: 'finalObtainCost', align: 'right', width: 120, sortable: true },
        { text: this.$t('staff.costOfGoods'), value: 'finalCost', align: 'right', width: 120, sortable: true },
        { text: this.$t('staff.fullName'), value: 'fullName', align: 'left', width: 180, minWidth: 180 },
        { text: this.$t('staff.access'), value: 'access', align: 'left', width: 120, minWidth: 120 },
        { text: '', value: 'actions', width: 48 },
        { text: '', value: 'expand', width: 32 },
      ]
    },
    invitationsHeaders () {
      return [
        { text: this.$t('staff.inviteGivenName'), width: 160, align: 'left', value: 'invitationGivenName' },
        { text: this.$t('staff.inviteFamilyName'), width: 160, align: 'left', value: 'invitationFamilyName' },
        { text: this.$t('staff.inviteEmail'), width: 200, align: 'left', value: 'invitationEmail' },
        { text: this.$t('staff.inviteRole'), width: 120, align: 'left', value: 'invitationRole' },
        { text: this.$t('staff.inviteStatus'), width: 100, align: 'left', value: 'status' },
        { text: this.$t('staff.inviteCreatedAt'), width: 100, align: 'left', value: 'createdAt' },
        { text: this.$t('staff.inviteUpdatedAt'), width: 100, align: 'left', value: 'updatedAt' },
        { text: '', value: 'actions', width: 48 },
        { text: '', value: 'expand', width: 32 },
      ]
    },
  },
  methods: {
    // TODO: update on after mutation
    refetchInvitations () {
      this.$apollo.queries.listOrgInvitations.refetch()
    },
    async cancelInvitation (id) {
      try {
        await this.$apollo.mutate({
          mutation: CANCEL_INVITATION,
          variables: { id },
        })
        this.refetchInvitations()
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
