<template>
  <div class="relative">
    <div class="absolute bottom-0 inset-x-0 border-b border-gray-500" />
    <div class="container flex h-16 overflow-x-auto scrolling-touch text-gray-200 space-x-10">
      <router-link
        v-for="item in items"
        v-slot="{ route }"
        :key="item.name"
        :to="{
          name: item.name,
          params: { orgId },
        }"
        class="text-xl leading-6 focus:outline-none focus:text-white hover:text-white duration-100 transition-color ease-out"
      >
        <span
          :class="[
            'border-b-2 border-transparent whitespace-nowrap h-full flex items-center',
            {
              'text-white border-blue-500 relative': route.name === 'specs'
                ? $route.name === 'specs' || $route.name === 'spec'
                : $route.path.startsWith(route.path)
            },
          ]"
        >
          {{ item.text }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useQuery, useResult } from '@vue/apollo-composable'

import { GET_ORGS } from '../graphql/queries'
import { Role } from '../graphql/enums'

export default {
  name: 'NavBar',
  setup () {
    const { result } = useQuery(GET_ORGS, null, {
      fetchPolicy: 'cache-only',
    })
    const getOrgs = useResult(result)

    return {
      getOrgs,
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    roleInOrg () {
      const orgs = this.getOrgs || []
      const org = orgs.find(el => el.id === this.orgId) || {}
      return org.role || null
    },
    ownerOrManager () {
      return this.roleInOrg === Role.OWNER || this.roleInOrg === Role.MANAGER
    },
    items () {
      const items = [
        {
          name: 'specs',
          text: this.$t('navbar.deals'),
        },
      ]
      if (this.ownerOrManager) {
        items.push({
          name: 'clients',
          text: this.$t('navbar.clients'),
        })
        items.push({
          name: 'suppliers',
          text: this.$t('navbar.suppliers'),
        })
      }
      if (this.roleInOrg === Role.OWNER) {
        items.push({
          name: 'staff',
          text: this.$t('navbar.staff'),
        })
      }
      if (this.ownerOrManager) {
        items.push({
          name: 'items',
          text: this.$t('navbar.goods'),
        })
      }
      return items
    },
  },
}
</script>
