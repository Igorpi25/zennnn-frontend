<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">

      <div class="overflow-x-auto overflow-scroll-touch pb-8">
        <DataTable
          :headers="headers"
          :items="items"
          table-width="100%"
          table-class="table-fixed"
        >
          <template v-slot:items="{ items }">
            <tr
              v-for="(item) in items"
              :key="item.id"
              class="cursor-pointer"
            >
              <td class="text-center align-middle">
                <div
                  class="cursor-pointer select-none inline-block align-middle"
                  @click="setDefaultRequisite(item.id)"
                >
                  <Icon size="24">
                    {{ item.id === currentOrg.defaultRequisite ? icons.mdiStar : icons.mdiStarOutline }}
                  </Icon>
                </div>
              </td>
              <td @click="goToRequisite(item)">{{ item.name }}</td>
              <td @click="goToRequisite(item)">{{ item.nameEng }}</td>
              <td @click="goToRequisite(item)">{{ item.ownerFullName }}</td>
              <td @click="goToRequisite(item)">{{ item.ownerJobPosition }}</td>
              <td>
                <div
                  class="cursor-pointer flex items-center"
                  @click="deleteRequisite(item.id)"
                >
                  <i class="zi-delete text-2xl text-gray-200 hover:text-gray-100" />
                </div>
              </td>
            </tr>
          </template>
        </DataTable>
      </div>
      <Button
        block
        outlined
        @click="$router.push({
          name: 'requisite-create'
        })"
      >
        <template v-slot:icon>
          <i class="zi-plus-outline text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('requisites.addRequisites') }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiStar, mdiStarOutline } from '@mdi/js'

import { LIST_ORG_REQUISITES, GET_ORGS } from '../graphql/queries'
import { DELETE_REQUISITE, SET_DEFAULT_REQUISITE } from '../graphql/mutations'

import { confirmDialog } from '@/util/helpers'

export default {
  name: 'RequisiteList',
  apollo: {
    getOrgs: {
      query: GET_ORGS,
      fetchPolicy: 'cache-only',
    },
    listOrgRequisites: {
      query: LIST_ORG_REQUISITES,
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
      icons: {
        mdiPlusCircleOutline,
        mdiStar,
        mdiStarOutline,
      },
      deleteLoading: null,
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    currentOrg () {
      const orgs = this.getOrgs || []
      return orgs.find(el => el.id === this.orgId) || {}
    },
    headers () {
      return [
        { text: '', value: 'current', align: 'center', width: 36, minWidth: 36 },
        { text: this.$t('requisites.companyName'), value: 'name', align: 'left', width: 200, minWidth: 200 },
        { text: this.$t('requisites.companyNameEng'), value: 'nameEng', align: 'left', width: 240, minWidth: 240 },
        { text: this.$t('requisites.fullName'), value: 'ownerFullName', align: 'left', width: 160, minWidth: 160 },
        { text: this.$t('requisites.position'), value: 'ownerJobPosition', align: 'left', width: 120, minWidth: 120 },
        { text: '', value: 'action', width: 48, minWidth: 48 },
      ]
    },
    items () {
      return this.listOrgRequisites || []
    },
  },
  methods: {
    goToRequisite (item) {
      this.$router.push({
        name: 'requisite',
        params: {
          reqId: item.id,
        },
      })
    },
    async deleteRequisite (id) {
      try {
        const msg = this.$t('alert.removeRequisites')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await this.$apollo.mutate({
          mutation: DELETE_REQUISITE,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: LIST_ORG_REQUISITES,
              variables: {
                orgId: this.orgId,
              },
            })
            const index = data.listOrgRequisites.findIndex(item => item.id === id)
            if (index !== -1) {
              data.listOrgRequisites.splice(index, 1)
            }
            store.writeQuery({
              query: LIST_ORG_REQUISITES,
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
      } finally {
        this.deleteLoading = null
      }
    },
    async setDefaultRequisite (id) {
      try {
        await this.$apollo.mutate({
          mutation: SET_DEFAULT_REQUISITE,
          variables: { orgId: this.orgId, id },
        })
        // update orgs query
        await this.$apollo.query({
          query: GET_ORGS,
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', 'SET_DEFAULT_REQUISITE', error)
      }
    },
  },
}
</script>
