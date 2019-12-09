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
              @click="$router.push({
                name: 'requisites',
                params: {
                  reqId: item.id
                }
              })"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.location }}</td>
              <td class="text-right pointer-events-none" @click.prevent.stop>
                <div
                  class="cursor-pointer pointer-events-auto"
                  @click="deleteCompany(item.id)"
                >
                  <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 13 16"><defs></defs><g><g><title>Delete</title><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAAU0lEQVQ4T2NkQANBQUH/0cXWrVvHiCyGwgFJgDQhK0Lng9QwYjMZ3SZ0PoZNhDSQbxM2N+OzDaQe7CeQx0mhSVIMM3xUEzSUKQsIYpIPLEGTlWAB2MDtgmErnM4AAAAASUVORK5CYII=" width="13" height="16" transform="matrix(1,0,0,1,0,0)" ></image></g></g></svg>
                </div>
              </td>
            </tr>
          </template>
        </DataTable>
       </div>
    </div>
  </div>
</template>

<script>
import { LIST_ORG_REQUISITES } from '../graphql/queries'

export default {
  name: 'RequisiteList',
  apollo: {
    listOrgRequisites: {
      query: LIST_ORG_REQUISITES,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
    },
  },
  data () {
    return {
      // items: [
      //   { id: 1, name: 'AliBaba', location: 'Guangzhou' },
      //   { id: 2, name: 'Amazon', location: 'Тверь' },
      //   { id: 3, name: 'Apple', location: '2-я дверь' },
      //   { id: 4, name: 'Google', location: 'Налево' },
      //   { id: 5, name: 'Netflix', location: 'ИК-порт' },
      // ],
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    headers () {
      return [
        { text: this.$t('requisites.companyName'), value: 'name', bgcolor: 'tansparent', align: 'left' },
        { text: this.$t('requisites.companyNameEng'), value: 'nameEng', bgcolor: 'tansparent', align: 'left' },
        { text: this.$t('requisites.fullName'), value: 'ownerFullName', bgcolor: 'tansparent', align: 'left' },
      ]
    },
    items () {
      return this.listOrgRequisites || []
    },
  },
}
</script>

<style scoped>
  li {
    cursor: pointer;
    margin-bottom: 10px;
  }
</style>
