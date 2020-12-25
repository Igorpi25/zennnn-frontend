<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">

      <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-6">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :content-class="[search ? 'shadow-blue-500' : '', 'bg-transparent']"
          class="w-full md:max-w-md"
          input-class="placeholder-blue-500"
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
                  class="text-green-500 focus:text-green-400 focus:outline-none hover:text-green-400 select-none"
                  @click.prevent.stop="setDefaultRequisite(item.id)"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.13281 0.473666C9.53846 -0.157888 10.4615 -0.157889 10.8672 0.473665L13.648 4.80317C13.7876 5.02047 14.0037 5.17745 14.2535 5.24304L19.2304 6.5499C19.9564 6.74053 20.2417 7.61844 19.7664 8.19939L16.5081 12.182C16.3446 12.3819 16.262 12.6359 16.2768 12.8938L16.5719 18.0309C16.6149 18.7803 15.8681 19.3229 15.1688 19.0504L10.3742 17.1823C10.1335 17.0885 9.86647 17.0885 9.62582 17.1823L4.83125 19.0504C4.13185 19.3229 3.38506 18.7803 3.4281 18.0309L3.72316 12.8938C3.73797 12.6359 3.65544 12.3819 3.49191 12.182L0.233638 8.1994C-0.241653 7.61844 0.0435964 6.74053 0.769592 6.5499L5.74652 5.24304C5.99632 5.17745 6.21238 5.02047 6.35195 4.80317L9.13281 0.473666Z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  v-else
                  class="text-gray-200 focus:text-gray-100 focus:outline-none hover:text-gray-100 select-none"
                  @click.prevent.stop="setDefaultRequisite(item.id)"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9742 1.01409C9.97804 1.00811 9.98065 1.00564 9.98139 1.00496C9.98225 1.00417 9.98294 1.0037 9.98382 1.00324C9.98597 1.00211 9.99155 1 10 1C10.0085 1 10.014 1.00211 10.0162 1.00324C10.0171 1.0037 10.0178 1.00417 10.0186 1.00496C10.0194 1.00564 10.022 1.00811 10.0258 1.01409L12.8067 5.34359C13.0816 5.77173 13.5073 6.08102 13.9995 6.21025L18.9764 7.51711C18.9833 7.51891 18.9865 7.52063 18.9873 7.52112C18.9884 7.5217 18.989 7.52221 18.9897 7.5229C18.9915 7.5246 18.9952 7.52925 18.9978 7.53729C19.0004 7.54533 19.0001 7.55129 18.9997 7.55369C18.9996 7.55466 18.9993 7.55546 18.9988 7.55653C18.9984 7.55744 18.9969 7.56069 18.9924 7.56619L15.7341 11.5488L16.462 12.1443L15.7341 11.5488C15.4119 11.9427 15.2493 12.4431 15.2785 12.9511L15.5735 18.0883C15.574 18.0954 15.5733 18.0989 15.5731 18.0999C15.573 18.1003 15.5729 18.1006 15.5729 18.1009C15.5727 18.1015 15.5724 18.1021 15.5721 18.1027C15.5711 18.1049 15.5678 18.1099 15.561 18.1149C15.5541 18.1198 15.5484 18.1214 15.546 18.1217C15.545 18.1219 15.5441 18.1219 15.543 18.1218C15.542 18.1217 15.5384 18.1212 15.5318 18.1186L10.7372 16.2505C10.2631 16.0658 9.7369 16.0658 9.26278 16.2505L4.46821 18.1186C4.46159 18.1212 4.45802 18.1217 4.45703 18.1218C4.45586 18.1219 4.45503 18.1219 4.45405 18.1217C4.45164 18.1214 4.44589 18.1198 4.43905 18.1149C4.43221 18.1099 4.42893 18.1049 4.42786 18.1027C4.42742 18.1018 4.42714 18.101 4.4269 18.0999C4.4267 18.0989 4.42605 18.0954 4.42646 18.0883L4.72152 12.9511C4.75069 12.4431 4.58809 11.9427 4.26589 11.5488L1.00762 7.56619C1.00312 7.56069 1.00157 7.55744 1.00116 7.55653C1.00067 7.55547 1.00044 7.55466 1.00027 7.55369C0.999859 7.55129 0.999577 7.54533 1.00219 7.53729C1.0048 7.52925 1.00853 7.5246 1.01027 7.5229C1.01098 7.52221 1.01164 7.5217 1.01266 7.52112C1.01353 7.52063 1.01669 7.51891 1.02357 7.51711L6.0005 6.21025C6.49265 6.08102 6.91835 5.77173 7.19335 5.34359L9.9742 1.01409Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <button
                class="text-2xl text-gray-200 focus:text-gray-100 focus:outline-none hover:text-gray-100 select-none"
                @click.prevent.stop="deleteRequisite(item.id)"
              >
                <i class="zi-delete" />
              </button>
            </div>
            <div class="pt-16 leading-tight">
              <div
                class="flex flex-col relative bg-gray-600 rounded-md text-center pt-16 px-6"
                style="height: 282px;"
              >
                <!-- TODO: add image upload -->
                <div class="absolute w-26 h-26 rounded-full bg-gray-400 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-gray-200">
                  <i class="zi-user text-gray-200 text-3xl" />
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
                <i class="zi-info text-3xl flex-shrink-0 text-yellow-500 pr-4" />
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
            @click="$router.push({ name: 'requisite-create' })"
            @keydown.enter.exact.self="$router.push({ name: 'requisite-create' })"
          >
            <div class="flex flex-col items-center pb-8">
              <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48.0117 40.05H64.061V48.0747H48.0117V64.1241H39.987V48.0747H23.9376V40.05H39.987V24.0006H48.0117V40.05Z" fill="#676767"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.666016 44C0.666016 20.0676 20.067 0.666626 43.9994 0.666626C67.9317 0.666626 87.3327 20.0676 87.3327 44C87.3327 67.9323 67.9317 87.3333 43.9994 87.3333C20.067 87.3333 0.666016 67.9323 0.666016 44ZM43.9994 7.08638C23.6125 7.08638 7.08577 23.6132 7.08577 44C7.08577 64.3868 23.6125 80.9136 43.9994 80.9136C64.3862 80.9136 80.9129 64.3868 80.9129 44C80.9129 23.6132 64.3862 7.08638 43.9994 7.08638Z" fill="#676767"/>
              </svg>
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
import { useQuery, useResult } from '@vue/apollo-composable'

import { LIST_ORG_REQUISITES, GET_ORGS } from '../graphql/queries'
import { DELETE_REQUISITE, SET_DEFAULT_REQUISITE } from '../graphql/mutations'

import { confirmDialog, defaultFilter, getObjectValueByPath } from '@/util/helpers'

import Progress from '../components/Base/Progress'
import TextField from '../components/Base/TextField'

export default {
  name: 'RequisiteList',
  components: {
    Progress,
    TextField,
  },
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId

    const { result: result1 } = useQuery(GET_ORGS, null, { fetchPolicy: 'cache-only' })
    const getOrgs = useResult(result1)

    const { result: result2, loading } = useQuery(LIST_ORG_REQUISITES, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listOrgRequisites = useResult(result2)

    return {
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
      }).catch(() => {})
    },
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
