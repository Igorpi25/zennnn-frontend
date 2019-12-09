<template>
  <div class="modal">
    <div class="modal-header">
      <div style="width:28px; height:28px; background-color:#aaa; color:#000"></div>
      <span class="ml-3">{{ $t('companies.myCompanies') }}</span>
    </div>
    <div class="modal-body">
      <ul
        v-for="item in orgsByRole"
        :key="item.id"
        class="mt-2 mb-6"
      >
        <span
          v-if="item.header"
          class="ml-6 text-gray-light font-bold tracking-widest"
        >
          {{ item.position }}
        </span>
        <li
          v-for="i in item.companies"
          :key="i.name"
          class="py-3 px-6 flex items-center hover:bg-accent1"
        >
          <div class="company-avatar border border-gray-lightest rounded-full"></div>
          <span class="ml-2">
            <span>{{ i.name }}</span>
            <span v-if="i.location">
              , {{ i.location }}
            </span>
          </span>
          <div
            class="ml-auto cursor-pointer"
            @click="i.isActive=!i.isActive"
          >
            <Icon size="24">
              {{ i.isActive ? icons.mdiStar : icons.mdiStarOutline }}
            </Icon>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mdiStar, mdiStarOutline } from '@mdi/js'

import { Role } from '../graphql/enums'
import { GET_ORGS } from '../graphql/queries'

export default {
  name: 'CompanyListModal',
  apollo: {
    getOrgs: {
      query: GET_ORGS,
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      icons: {
        mdiStar,
        mdiStarOutline,
      },
    }
  },
  computed: {
    items () {
      return [
        {
          id: 1,
          position: this.$t('companies.director'),
          companies: [
            { name: 'Taiwan Semiconductor Manufacturer Company', location: 'Taiwan', isActive: true },
            { name: 'Naftogaz', location: 'Kiyv', isActive: false },
            { name: 'Oxxxymiron', location: '', isActive: false },
          ],
        },
        {
          id: 2,
          position: this.$t('companies.manager'),
          companies: [
            { name: 'Tinkoff Credit Systems', location: 'Your mom', isActive: false },
            { name: 'Facebook LLC', location: 'Palo Alto', isActive: false },
          ],
        },
        {
          id: 3,
          position: this.$t('companies.freelancer'),
          companies: [
            { name: 'Third Reich', location: 'Munchen', isActive: true },
          ],
        },
      ]
    },
    orgsByRole () {
      const orgs = this.getOrgs || []
      let groups = {}
      let items = []
      orgs.forEach(org => {
        if (groups[org.role]) {
          groups[org.role].push(org)
        } else {
          groups[org.role] = [org]
        }
      })
      Object.keys(Role).forEach(role => {
        const orgs = groups[role]
        if (orgs) {
          items.push({ header: true, text: role })
          items.push(...groups[role])
        }
      })
      return items
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    display: flex;
    flex-direction: column;
    position: relative;
    @apply bg-gray;
  }
  .modal-header {
    width: 100%;
    max-width: 480px;
    height: 70px;
    padding: 25px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: #aaaaaa;
    @apply bg-gray-darkest;
  }
  .modal-body {
    padding: 20px 0;
    height: 520px;
    overflow-y: auto;
    flex-grow: 1;
    color: #CDCDCD;
  }
  .company-avatar {
    min-width: 32px;
    min-height: 32px;
  }
</style>
