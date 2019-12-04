<template>
  <div class="navbar container container--sm">
    <router-link
      :to="{
        name: 'home',
        params: {
          specId,
        },
      }"
      :class="{ active: $route.name == 'spec' }"
    >
      <div class="navbar__link">
        <Icon
          v-if="$route.name == 'spec'"
          :class="[
            'mr-2',
            {'-ml-2': $route.name == 'spec'}
          ]"
        >
          {{ icons.mdiArrowLeft }}
        </Icon>
        {{ $t('navbar.deals') }}
      </div>
    </router-link>
    <router-link
      :to="{
        name: 'clients',
        params: {
          specId,
        },
      }"
      :class="{ active: $route.name == 'client' || $route.name == 'client-create' }"
    >
      <div class="navbar__link">
        <Icon
          v-if="$route.name == 'client' ||
          $route.name == 'client-create'"
          :class="[
            'mr-2',
            {'-ml-2': $route.name == 'client' || $route.name == 'client-create'}
          ]"
        >
          {{ icons.mdiArrowLeft }}
        </Icon>
        {{ $t('navbar.clients') }}
      </div>
    </router-link>
    <router-link
      :to="{
        name: 'suppliers',
        params: {
          specId,
        },
      }"
      :class="{ active: $route.name == 'supplier' ||
      $route.name == 'supplier-create' }"
    >
      <div class="navbar__link">
        <Icon
          v-if="$route.name == 'supplier' ||
          $route.name == 'supplier-create'"
          :class="[
            'mr-2',
            {'-ml-2': $route.name == 'supplier' || $route.name == 'supplier-create'}
          ]"
        >
          {{ icons.mdiArrowLeft }}
        </Icon>
        {{ $t('navbar.suppliers') }}
      </div>
    </router-link>
    <router-link
      :to="{
        name: 'requisites-list',
      }"
      :class="{ active: $route.name == 'requisites' }"
    >
      <div class="navbar__link">
        <Icon
          v-if="$route.name == 'requisites'"
          :class="[
            'mr-2',
            {'-ml-2': $route.name == 'requisites'}
          ]"
        >
          {{ icons.mdiArrowLeft }}
        </Icon>
        My Requisites
      </div>
    </router-link>
    <!-- <router-link
      :to="{
        name: 'staff',
        params: {
          specId,
        },
      }"
    >
      <div class="navbar__link">
        {{ $t('navbar.staff') }}
      </div>
    </router-link> -->
  </div>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'

import { GET_ROLE_IN_PROJECT } from '../graphql/queries'

export default {
  name: 'NavBar',
  apollo: {
    roleInProject: {
      query: GET_ROLE_IN_PROJECT,
      variables () {
        return {
          specId: this.specId,
        }
      },
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      icons: {
        mdiArrowLeft,
      },
    }
  },
  computed: {
    specId () {
      return this.$route.params.specId
    },
  },
}
</script>

<style>
.navbar {
  display: flex;
  padding-top: 40px;
  overflow-x: auto;
}
.navbar__link {
  white-space: nowrap;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
}
.navbar > a.router-link-exact-active,
.navbar > a.router-link-active.active {
  border: 1px solid #aaaaaa;
  border-radius: 9999px;
  position: relative;
}
</style>
