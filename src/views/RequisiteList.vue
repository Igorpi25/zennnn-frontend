<template>
  <div class="container container--sm">
    <div class="py-10">

       <div class="overflow-x-auto">
        <DataTable
          :headers="headers"
          :items="items"
          table-width="100%"
          table-class="table-fixed"
          thead-class="text-accent2 border-b border-accent2 bg-background"
        >
          <template v-slot:items="{ items }">
            <tr
              v-for="(item) in items"
              :key="item.id"
              class="items bg-background hover:bg-accent3 border-none"
            >
              <td
                class="text-center align-middle"
              >
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
              <td
                class="text-center align-middle"
              >
                <div
                  class="cursor-pointer inline-block align-middle"
                  @click="deleteRequisite(item.id)"
                >
                  <i class="icon-delete text-lg text-gray-200" />
                </div>
              </td>
            </tr>
          </template>
        </DataTable>
      </div>
      <Button
        outline
        class="mt-6"
        @click="$router.push({
          name: 'requisite-create'
        })"
      >
        <template v-slot:icon>
          <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
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
        { text: '', value: 'current', bgcolor: 'tansparent', align: 'center', width: 36, minWidth: 36 },
        { text: this.$t('requisites.companyName'), value: 'name', bgcolor: 'tansparent', align: 'left', width: 200, minWidth: 200 },
        { text: this.$t('requisites.companyNameEng'), value: 'nameEng', bgcolor: 'tansparent', align: 'left', width: 220, minWidth: 220 },
        { text: this.$t('requisites.fullName'), value: 'ownerFullName', bgcolor: 'tansparent', align: 'left', width: 100, minWidth: 100 },
        { text: '', value: 'action', bgcolor: 'tansparent', width: 48, minWidth: 48 },
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
