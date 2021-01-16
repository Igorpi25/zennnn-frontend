<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">

      <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-6">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :control-class="search ? 'bg-transparent dark:bg-transparent ring-1 ring-blue-500' : 'bg-transparent dark:bg-transparent'"
          :prepend-icon="icons.ziSearch"
          class="w-full md:max-w-md"
          input-class="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
        >
        </TextField>
      </div>

      <div class="font-semibold text-white text-2xl leading-tight whitespace-nowrap overflow-x-auto scrolling-touch pb-4">
        <span class="relative">
          {{ $t('requisites.title') }}
          <transition name="fade-transition">
            <div
              v-if="loading"
              class="absolute right-0 -mr-6 inline-block text-gray-200"
            >
              <Progress
                indeterminate
                size="20"
                width="2"
              />
            </div>
          </transition>
        </span>
        <router-link
          :to="{ name: 'dictionary', params: { orgId } }"
          class="text-gray-200 hover:text-white focus:text-white focus:outline-none transition-colors duration-75 ease-out ml-10"
        >
          {{ $t('header.dictionary') }}
        </router-link>
      </div>

      <div
        role="menu"
        class="grid sm:grid-cols-2-264 lg:grid-cols-3-264 xl:grid-cols-4-264 gap-x-6 gap-y-8 justify-center sm:justify-between pt-6 pb-10"
      >
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="cursor-pointer"
        >
          <div
            class="bg-gray-800 bg-opacity-90 rounded-md focus:outline-none focus:shadow-blue-500 hover:shadow-blue-500 px-sm pt-4 pb-sm"
            role="menuitem"
            tabindex="0"
            @click="goToRequisite(item)"
            @keydown.enter.exact.self="goToRequisite(item)"
          >
            <div class="h-10 w-full flex justify-between px-2">
              <div class="p-1">
                <button
                  v-if="item.id === currentOrg.defaultRequisite"
                  class="flex text-green-500 focus:text-green-400 focus:outline-none hover:text-green-400 select-none"
                  @click.prevent.stop="setDefaultRequisite(item.id)"
                >
                  <Icon>
                    {{ icons.ziStarLg }}
                  </Icon>
                </button>
                <button
                  v-else
                  class="flex text-gray-200 focus:text-gray-100 focus:outline-none hover:text-gray-100 select-none"
                  @click.prevent.stop="setDefaultRequisite(item.id)"
                >
                  <Icon>
                    {{ icons.ziStarOutlineLg }}
                  </Icon>
                </button>
              </div>
              <button
                class="text-gray-200 focus:text-gray-100 focus:outline-none hover:text-gray-100"
                @click.prevent.stop="deleteRequisite(item.id)"
              >
                <Icon>
                  {{ icons.ziDelete }}
                </Icon>
              </button>
            </div>
            <div class="pt-16 leading-tight">
              <div
                class="flex flex-col relative bg-gray-600 rounded-md text-center pt-16 px-6"
                style="height: 282px;"
              >
                <!-- TODO: add image upload -->
                <div class="absolute w-26 h-26 rounded-full bg-gray-400 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-gray-200">
                  <Icon large class="text-gray-200">
                    {{ icons.ziUser }}
                  </Icon>
                </div>
                <div class="font-bold text-white pb-2 pt-1">
                  {{ item.companyName }}
                </div>
                <div class="flex-grow text-sm pb-2">
                  {{ item.companyNameLocal }}
                </div>
                <div v-if="item.companyOwner && item.companyOwner.fullName">
                  <div class="text-white bg-gray-800 bg-opacity-90 text-sm h-8 inline-flex items-center justify-center rounded-20 px-4">
                    {{ $t('role.OWNER') }}
                  </div>
                </div>
                <div class="pt-2 pb-8">
                  {{ item.companyOwner && item.companyOwner.fullName }}
                </div>
              </div>
            </div>
            <div class="h-16 pt-sm">
              <div
                v-if="!item.isRequiredFilled || !item.isOptionalFilled"
                class="h-full flex items-center rounded-md relative text-white text-yellow-500 bg-yellow-500 bg-opacity-10 py-2 px-3"
              >
                <Icon large class="text-yellow-500 flex-shrink-0 mr-4">
                  {{ icons.ziInfoBig }}
                </Icon>
                <div class="flex-grow flex items-center text-sm leading-tight">
                  {{ $t('requisites.unfilled') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="min-height: 476px;" class="h-full">
          <div
            class="border border-gray-400 focus:outline-none focus:border-blue-500 hover:border-blue-500 rounded-md h-full flex items-center justify-center cursor-pointer"
            role="menuitem"
            tabindex="0"
            @click="$router.push({ name: 'requisite-create', params: { orgId } })"
            @keydown.enter.exact.self="$router.push({ name: 'requisite-create', params: { orgId } })"
          >
            <div class="flex flex-col items-center pb-8">
              <Icon :size="106" class="text-gray-200">
                {{ icons.ziPlusOutline }}
              </Icon>
              <div class="text-blue-500 pt-6">
                {{ $t('requisites.addCompany') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import {
  ziStarLg,
  ziStarOutlineLg,
  ziUser,
  ziSearch,
  ziDelete,
  ziInfoBig,
  ziPlusOutline,
} from '../assets/icons'

import { LIST_ORG_REQUISITES, GET_ORGS } from '../graphql/queries'
import { DELETE_REQUISITE, SET_DEFAULT_REQUISITE } from '../graphql/mutations'

import { confirmDialog, defaultFilter, getObjectValueByPath } from '../util/helpers'

import Icon from '../components/Base/Icon'
import Progress from '../components/Base/Progress'
import TextField from '../components/Base/TextField'

export default {
  name: 'RequisiteList',
  components: {
    Icon,
    Progress,
    TextField,
  },
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result: result1 } = useQuery(GET_ORGS, null, { fetchPolicy: 'cache-only' })
    const getOrgs = useResult(result1)

    const { result: result2, loading } = useQuery(LIST_ORG_REQUISITES, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listOrgRequisites = useResult(result2)

    return {
      icons: {
        ziStarLg,
        ziStarOutlineLg,
        ziUser,
        ziSearch,
        ziDelete,
        ziInfoBig,
        ziPlusOutline,
      },
      orgId,
      apolloClient,
      loading,
      getOrgs,
      listOrgRequisites,
    }
  },
  data () {
    return {
      search: undefined,
      deleteLoading: null,
    }
  },
  computed: {
    currentOrg () {
      const orgs = this.getOrgs || []
      return orgs.find(el => el.id === this.orgId) || {}
    },
    items () {
      return (this.listOrgRequisites || []).map(item => {
        return {
          ...item,
          ownerFullName: item.companyOwner && item.companyOwner.fullName,
        }
      })
    },
    filteredItems () {
      let filtered = this.items.slice()
      const search = typeof this.search === 'string' ? this.search.trim() : null
      if (search) {
        const filters = ['companyName', 'companyNameLocal', 'ownerFullName']
        filtered = filtered.filter(item => filters.some(v => {
          const value = getObjectValueByPath(item, v)
          return defaultFilter(value, search, item)
        }))
      }
      return filtered
    },
  },
  created () {
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }
    // on search on server, escape input string
    this.$watch('search', (val, old) => {
      if (val === old) return
      this.updateRouteQuery()
    })
  },
  methods: {
    updateRouteQuery () {
      const query = {}
      if (this.search) {
        query.q = this.search
      }
      this.$router.replace({
        path: this.$route.path,
        query,
      })
    },
    goToRequisite (item) {
      this.$router.push({
        name: 'requisite',
        params: {
          orgId: this.orgId,
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
        const response = await this.apolloClient.mutate({
          mutation: DELETE_REQUISITE,
          variables: { id },
          update: (cache) => {
            const data = cache.readQuery({
              query: LIST_ORG_REQUISITES,
              variables: {
                orgId: this.orgId,
              },
            })
            if (data.listOrgRequisites.some(item => item.id === id)) {
              cache.writeQuery({
                query: LIST_ORG_REQUISITES,
                variables: {
                  orgId: this.orgId,
                },
                data: {
                  listOrgRequisites: data.listOrgRequisites.filter(item => item.id !== id),
                },
              })
            }
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
        await this.apolloClient.mutate({
          mutation: SET_DEFAULT_REQUISITE,
          variables: { orgId: this.orgId, id },
        })
        // update orgs query
        await this.apolloClient.query({
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
