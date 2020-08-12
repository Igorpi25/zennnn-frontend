<template>
  <div class="relative">
    <div class="absolute bottom-0 inset-x-0 border-b border-gray-500" />
    <div class="container container--sm flex h-16 overflow-x-auto overflow-scroll-touch">
      <div
        v-for="(item, i) in items"
        :key="item.name"
        :class="[
          'text-gray-200',
          i === 0 ? 'pr-5' : 'px-5',
        ]"
      >
        <router-link
          :to="{
            name: item.name,
            params: item.params,
          }"
          :exact="item.exact"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
        >
          <a
            :href="href"
            :class="[
              'focus:outline-none focus:text-white hover:text-white border-b-2 border-transparent whitespace-no-wrap text-xl leading-6 h-full flex items-center duration-100 transition-color ease-out',
              { 'text-white border-blue-500 relative': isActive || isExactActive || ($route.name === 'specs' && item.name === $route.name && $route.params.orgId && ($route.query.clients || $route.query.clientType)) },
            ]"
            @click="navigate"
          >
            {{ item.text }}
          </a>
        </router-link>
      </div>
      <div
        v-if="ownerOrManager"
        class="px-5 text-gray-400 border-b-2 border-transparent whitespace-no-wrap text-xl leading-6 h-full flex items-center cursor-default"
      >
        {{ $t('navbar.goods') }}
      </div>
    </div>
  </div>
</template>

<script>
import { GET_ORGS } from '../graphql/queries'
import { Role } from '../graphql/enums'

export default {
  name: 'NavBar',
  apollo: {
    getOrgs: {
      query: GET_ORGS,
      fetchPolicy: 'cache-only',
    },
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
          exact: this.$route.name !== 'spec',
          text: this.$t('navbar.deals'),
          params: { orgId: this.orgId },
        },
      ]
      if (this.ownerOrManager) {
        items.push({
          name: 'clients',
          text: this.$t('navbar.clients'),
          params: { orgId: this.orgId },
        })
        items.push({
          name: 'suppliers',
          text: this.$t('navbar.suppliers'),
          params: { orgId: this.orgId },
        })
      }
      if (this.roleInOrg === Role.OWNER) {
        items.push({
          name: 'staff',
          text: this.$t('navbar.staff'),
          params: { orgId: this.orgId },
        })
      }
      return items
    },
  },
}
</script>
