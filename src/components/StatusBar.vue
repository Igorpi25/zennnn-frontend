<template>
  <div class="bg-accent1">
    <div class="container">
      <div class="status-bar">
        <!-- Logo -->
        <div class="status-bar__logo">
          <router-link to="/" class="text-logo-mobile md:text-logo-desktop">
            <svg
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 247.8 37.8"
              xml:space="preserve">
              <polygon fill="currentColor" points="33.5,9.7 33.5,0.9 0.9,0.9 0.9,11.3 16.4,11.3 0,29.3 0,37.8 34.7,37.8 34.7,27.4 16.8,27.4 "/>
              <path fill="currentColor" d="M56.8,0c-5.9,0-10.6,1.9-14.1,5.6c-3.6,3.7-5.4,8.3-5.4,13.8c0,5.9,2,10.6,6,14.1c4,3.5,8.9,5.2,14.6,5.2
                c6.3,0,11.2-1.3,14.7-3.8V25c-3.8,2.1-7.8,3.2-11.8,3.2c-5.3,0-9.7-1.9-10.7-5.7h24.7v-3.2c0-5.7-1.7-10.3-5-13.9
                C66.3,1.8,62,0,56.8,0z M49.8,15.7c0.5-3.8,3-6.2,6.4-6.2c3.1,0,5.7,2.5,5.8,6.2H49.8z"/>
              <path fill="currentColor" d="M104.7,0c-4.3,0-8,1.7-11.2,5.1V0.9H80.7v36.9h12.8V14.7c1.6-2.2,3.6-3.3,6.2-3.3c3,0,5.3,1.7,5.3,6.1v20.2
                h12.8V15.2C117.8,5.9,112.9,0,104.7,0z"/>
              <path fill="currentColor" d="M148.4,0.7c-4.9,0-8.9,1.7-12.1,5.3V1.6h-10.2v36.2h10.2V14.7c1.7-2.7,5-4.7,8.2-4.7c3.8,0,6.9,2.1,6.9,7.7
                v20.1h10.2V15.6C161.6,6.3,156.9,0.7,148.4,0.7z"/>
              <path fill="currentColor" d="M191.7,1.2c-5.2,0-9.6,1.9-13.1,5.7V2.2h-7.8v35.6h7.8V14.4c2-3.3,6.1-5.8,10.1-5.8c4.6,0,8.3,2.2,8.3,9.2
                v20h7.8V16C205,6.8,200.2,1.2,191.7,1.2z"/>
              <path fill="currentColor" d="M234.1,1.9c-5.7,0-10.3,2.1-14,6.2V2.8h-5.2v35h5.2V14.1c1.2-2,2.9-3.6,5.2-5.1c2.3-1.5,4.6-2.2,7-2.2
                c4.3,0,9.9,1.6,9.9,10.8v20.2h5.2V16.5C247.5,7.3,242.8,1.9,234.1,1.9z"/>
            </svg>
          </router-link>
        </div>
        <div class="flex-grow" />
        <!-- Lang picker -->
        <div class="flex justify-end">
          <div class="status-bar__items">
            <v-menu
              v-model="langMenu"
              :nudge-width="100"
              bottom
              left
              offset-y
            >
              <template v-slot:activator="{ on }">
                <img
                  :src="`/img/flags/${$i18n.locale}.svg`"
                  :class="[
                    'lang-picker__flag lang-picker__flag--hoverable',
                    { 'lang-picker__flag--active': langMenu }
                  ]"
                  v-on="on"
                >
              </template>
              <template>
                <ul
                  class="lang-picker"
                  role="menu"
                >
                  <li
                    v-for="lang in langs"
                    :key="lang.value"
                    :value="lang.value"
                    :class="[
                      'lang-picker__item',
                      { 'lang-picker__item--selected': lang.value === $i18n.locale }
                    ]"
                    tabindex="0"
                    role="menuitem"
                    @click="changeLang(lang.value)"
                  >
                    <img
                      :src="`/img/flags/${lang.value}.svg`"
                      :alt="lang.text"
                      class="lang-picker__flag mr-2"
                    >
                    <span>{{ lang.text }}</span>
                  </li>
                </ul>
              </template>
            </v-menu>
          </div>
          <!-- Menu and lock -->
          <div class="status-bar__items">
            <!-- Lock -->
            <router-link
              v-if="!isLoggedIn"
              :to="{ name: 'signin' }"
              class="hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21">
                <g><g><path fill="#1e1e1e" d="M3.728 7V5c0-2.8 2.197-5 4.995-5 2.797 0 4.995 2.2 4.995 5v2h1c1.098 0 1.998.9 1.998 2v10c0 1.1-.9 2-1.998 2H2.728a2.004 2.004 0 0 1-1.997-2V9c0-1.1.899-2 1.998-2zm4.995 9a2.004 2.004 0 0 0 1.997-2c0-1.1-.899-2-1.998-2-1.098 0-1.997.9-1.997 2s.899 2 1.998 2zm3.096-9V5c0-1.7-1.398-3.1-3.097-3.1A3.115 3.115 0 0 0 5.627 5v2z"/></g></g>
              </svg>
            </router-link>
            <!-- Menu -->
            <template v-if="isLoggedIn">
              <a href="#" class="text-logo-mobile block md:hidden" @click.prevent>
                <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.000244141" width="22.9998" height="3.20623" fill="currentColor"/>
                  <rect y="8.01367" width="22.9998" height="3.20623" fill="currentColor"/>
                  <rect y="16.0312" width="22.9998" height="3.20623" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" class="hidden md:block" @click.prevent>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12"><g><g><path fill="#1e1e1e" d="M15.614 2H.628V0h14.986z"/></g><g><path fill="#1e1e1e" d="M15.614 7H.628V5h14.986z"/></g><g><path fill="#1e1e1e" d="M15.614 12H.628v-2h14.986z"/></g></g></svg>
              </a>
            </template>
          </div>
          <div
            v-if="isLoggedIn"
            class="status-bar__items"
          >
            <v-menu
              v-model="profileMenu"
              :nudge-width="100"
              bottom
              left
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on" class="flex cursor-pointer">
                  <div
                    v-if="currentOrg"
                    class="text-xs leading-none text-right pr-2 max-w-xs"
                  >
                    <div
                      class="text-white truncate"
                    >
                      {{ currentOrg.name }}
                    </div>
                    <div
                      class="text-gray-100"
                      style="font-size:10px;"
                    >
                      {{ $t(`statusBar.role.${currentOrg.role}`) }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'lang-picker__flag lang-picker__flag--hoverable',
                      { 'lang-picker__flag--active': profileMenu }
                    ]"
                    style="width:23px;height:23px;"
                  >
                    <div class="avatar">
                      <img
                        v-if="profile.picture"
                        :src="profile.picture"
                        alt="Profile"
                      >
                      <Icon
                        v-else
                        size="24"
                      >
                        {{ icons.mdiAccountCircle }}
                      </Icon>
                    </div>
                  </div>
                </div>
              </template>
              <template>
                <ul
                  class="lang-picker"
                  role="menu"
                >
                  <li
                    v-if="username"
                    class="text-gray-lighter text-sm px-2 py-1 focus:outline-none"
                    tabindex="0"
                    role="menuitem"
                  >
                    <!-- username & email for debug -->
                    <div>
                      {{ username }}
                    </div>
                    <div class="text-xs">
                      {{ profile.email }}
                    </div>
                  </li>
                  <li
                    v-for="item in profileItems"
                    :key="item.value"
                    :value="item.value"
                    class="lang-picker__item"
                    tabindex="0"
                    role="menuitem"
                    @click="profileAction(item.value)"
                  >
                    <span>{{ item.text }}</span>
                  </li>
                </ul>
              </template>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="orgDialog"
      max-width="480px"
    >
      <div class="bg-gray">
        <div class="p-6 flex items-center bg-gray-darkest">
          <div style="width:28px; height:28px; background-color:#aaa;"></div>
          <span class="ml-3" style="color:#aaa">{{ $t('statusBar.myCompanies') }}</span>
        </div>
        <ul class="list-none text-white overflow-y-auto" style="max-height:520px;">
          <template v-for="(item, i) in orgsByRole">
            <li
              v-if="item.header"
              :key="`header${i}`"
              class="px-3 pt-2 text-sm text-gray-lighter font-bold tracking-widest"
            >
              {{ item.text }}
            </li>
            <li
              v-else
              :key="`${item.id}${i}`"
              class="px-3 py-2 text-sm hover:bg-gray-dark relative"
            >
              <div
                v-if="item.id === orgId"
                class="absolute top-0 left-0 h-full bg-gray-100"
                style="width: 2px"
              />
              <div class="flex items-center">
                <div class="flex-shrink-0 w-9">
                  <FileUploader
                    v-if="item.role === Role.OWNER"
                    :loading="updateOrgImageLoading[item.id]"
                    :uploading.sync="updateOrgImageUploading[item.id]"
                    :src="item.picture"
                    rounded
                    show-preview
                    check-download-url
                    style="width:32px; height:32px"
                    @update="updateOrgImage($event, item.id)"
                  />
                  <div
                    v-else-if="item.picture"
                    class="flex justify-center items-center overflow-hidden rounded-full w-8 h-8"
                  >
                    <img
                      :src="item.picture"
                      alt="avatar"
                      class="w-full h-full object-cover rounded-full"
                    >
                  </div>
                  <div
                    v-else
                    class="border border-gray-lightest rounded-full w-8 h-8"
                  />
                </div>
                <div
                  class="leading-tight flex-grow flex items-center cursor-pointer"
                  @click="changeOrg(item)"
                >
                  <div class="ml-3">
                    <div class="text-sm">{{ item.name }}</div>
                    <div
                      v-text="`${item.owner.givenName} ${item.owner.familyName}`"
                      class="text-xs text-gray-lighter"
                    />
                  </div>
                </div>
                <div class="flex-shrink-0 w-6 cursor-pointer" @click.prevent.stop="addFavorites(item.id)">
                  <Icon size="24">
                    {{ favorites.includes(item.id) ? icons.mdiStar : icons.mdiStarOutline }}
                  </Icon>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mdiStar, mdiStarOutline, mdiAccountCircle } from '@mdi/js'

import { CURRENT_LANG_STORE_KEY } from '../config/globals'
import { Role } from '../graphql/enums'
import { GET_ORGS, GET_PROFILE, GET_IS_LOGGED_IN } from '../graphql/queries'
import { SET_ORG_AVATAR } from '../graphql/mutations'

import FileUploader from './FileUploader.vue'

export default {
  name: 'StatusBar',
  components: {
    FileUploader,
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-only',
      skip () {
        return !this.isLoggedIn
      },
    },
    getOrgs: {
      query: GET_ORGS,
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      Role,
      updateOrgImageLoading: {},
      updateOrgImageUploading: {},
      favorites: [],
      orgDialog: false,
      profileMenu: false,
      langMenu: false,
      langs: [
        { value: 'en', text: 'English' },
        { value: 'ru', text: 'Русский' },
      ],
      icons: {
        mdiStar,
        mdiStarOutline,
        mdiAccountCircle,
      },
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
    orgsByRole () {
      let orgs = this.getOrgs || []
      let groups = {}
      let items = []
      if (this.favorites) {
        orgs = orgs.sort((a, b) => {
          const a1 = this.favorites.includes(a.id)
          const b1 = this.favorites.includes(b.id)
          if (a1 > b1) {
            return -1
          }
          if (a1 < b1) {
            return 1
          }
          return 0
        })
      }
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
          items.push({ header: true, text: this.$t(`statusBar.role.${role}`) })
          items.push(...groups[role])
        }
      })
      return items
    },
    favoritesKeyStore () {
      return `zFavorites.${this.profile.id}`
    },
    profileItems () {
      return [
        { value: 'orgsList', text: this.$t('statusBar.myCompanies') },
        { value: 'logout', text: this.$t('statusBar.signout') },
      ]
    },
    profile () {
      return this.getProfile || {}
    },
    username () {
      const profile = this.profile
      const name = profile.givenName || ''
      return profile.familyName
        ? `${name} ${profile.familyName}`
        : name
    },
  },
  mounted () {
    this.favorites = JSON.parse(localStorage.getItem(this.favoritesKeyStore)) || []
  },
  methods: {
    async updateOrgImage (src, orgId) {
      try {
        await this.$apollo.mutate({
          mutation: SET_ORG_AVATAR,
          variables: { orgId, avatar: src },
        })
        await this.$apollo.query({
          query: GET_ORGS,
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', 'on setting org avatar', error)
      }
    },
    changeOrg (org) {
      const orgId = org.id
      if (orgId !== this.orgId) {
        this.$router.push({ name: 'specs', params: { orgId } })
      }
      this.orgDialog = false
    },
    addFavorites (id) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter(el => el !== id)
      } else {
        this.favorites.push(id)
      }
      localStorage.setItem(this.favoritesKeyStore, JSON.stringify(this.favorites))
    },
    profileAction (value) {
      switch (value) {
        case 'orgsList':
          this.orgDialog = true
          break
        case 'logout': return this.onSignOut()
        default: return false
      }
    },
    onSignOut () {
      const profile = this.profile
      const username = profile.username || ''
      // TODO with Cache and FederatedInfo
      // const federatedInfo = Cache.getItem('federatedInfo')
      const isGoogleUser = username.startsWith('Google_')
      const response = this.$Auth.signOut()
      this.$logger.info('Sign Out: ', response)
      this.$apollo.provider.clients.defaultClient.resetStore()
      if (!isGoogleUser) {
        this.$router.replace({ name: 'signin' })
      }
    },
    changeLang (lang) {
      localStorage.setItem(CURRENT_LANG_STORE_KEY, lang)
      this.$i18n.locale = lang
      this.langMenu = false
    },
  },
}
</script>

<style lang="postcss">
.lang-picker {
  color: #aaaaaa;
  @apply py-1 bg-gray;
}
.lang-picker__item {
  @apply flex cursor-pointer py-1 px-2 outline-none;
}
.lang-picker__item--selected {
  @apply text-primary;
}
.lang-picker__item:hover {
  @apply bg-gray-darker;
}
.lang-picker__flag {
  width: 22px;
  height: 22px;
  @apply cursor-pointer;
}
.lang-picker__flag--hoverable {
  filter: brightness(75%);
  transition: filter .1s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}
.lang-picker__flag--active,
.lang-picker__flag--hoverable:hover {
  filter: brightness(100%);
}
.avatar {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img {
  display: inline-flex;
  width: inherit;
  height: inherit;
  object-fit: cover;
  border-radius: 50%;
}
.avatar svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  letter-spacing: normal;
  line-height: 1;
  text-indent: 0;
  vertical-align: middle;
  user-select: none;
  transition: .3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
