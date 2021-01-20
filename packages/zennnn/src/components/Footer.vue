<template>
  <footer class="bg-gray-900 text-gray-100">
    <div class="bg-gray-800 bg-opacity-90">
      <div class="container container--sm flex flex-wrap py-8 sm:py-16">
        <div class="relative h-full w-full md:w-1/3 md:pl-6 pb-6 md:pb-0">
          <div class="absolute bottom-0 md:bottom-auto left-0 w-full md:w-px h-px md:h-full bg-gray-400" />
          <div
            v-for="(item, i) in aboutLinks"
            :key="i"
            :class="{ 'pb-5': i + 1 < aboutLinks.length }"
            class="px-4 sm:px-0"
          >
            <router-link
              v-if="item.to"
              :to="item.to"
              class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
            >
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.href"
              class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
            >
              {{ item.text }}
            </a>
          </div>
        </div>
        <div class="relative h-full w-full md:w-1/3 md:pl-6 py-6 md:py-0">
        <div class="absolute bottom-0 md:bottom-auto left-0 w-full md:w-px h-px md:h-full bg-gray-400" />
          <div
            v-for="(item, i) in extLinks"
            :key="i"
            :class="{ 'pb-5': i + 1 < extLinks.length }"
            class="px-4 sm:px-0"
          >
            <router-link
              v-if="item.to"
              :to="item.to"
              class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
            >
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.href"
              class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
            >
              {{ item.text }}
            </a>
          </div>
        </div>
        <div class="relative h-full w-full md:w-1/3 md:pl-6 pt-6 md:pt-0">
          <div class="hidden md:block absolute left-0 w-px h-full bg-gray-400" />
          <div
            v-for="item in socialLinks"
            :key="item.text"
            class="pb-5 px-4 sm:px-0"
          >
            <a
              :href="item.href"
              class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
            >
              {{ item.text }}
              <Icon class="text-gray-200 float-right">
                {{ item.icon }}
              </Icon>
            </a>
          </div>
          <div class="px-4 sm:px-0">
            <a :href="`mailto:${mailTo}`" class="focus:outline-none focus:text-blue-400 hover:text-blue-400">
              {{ mailTo }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container container--sm h-20 flex items-center">
      <div class="flex md:pl-6">
        <router-link
          :to="{ name: 'home' }" class="select-none focus:ring focus:outline-none"
          @mousedown="e => e.preventDefault()"
        >
          <img src="@/assets/img/logo-dark.svg" alt="Logo">
        </router-link>
        <div class="w-px h-6 bg-gray-400 ml-6" />
      </div>
      <div class="flex items-center pl-6">
        <Copyright hide-user-agreement />
      </div>
    </div>
  </footer>
</template>

<script>
import { useQuery, useResult } from '@vue/apollo-composable'

import { GET_PROFILE, GET_IS_LOGGED_IN } from '../graphql/queries'

import { ziFacebook, ziTelegram, ziInstagram, ziYoutube, ziVk } from '../assets/icons'

import Icon from './Base/Icon'
import Copyright from '../components/Copyright.vue'

export default {
  name: 'Footer',
  components: {
    Icon,
    Copyright,
  },
  setup () {
    const { result: result1 } = useQuery(GET_IS_LOGGED_IN)
    const isLoggedIn = useResult(result1)

    const { result: result2 } = useQuery(GET_PROFILE)
    const getProfile = useResult(result2, null, () => ({
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-only',
    }))

    return {
      mailTo: process.env.VUE_APP_MAILTO,
      isLoggedIn,
      getProfile,
    }
  },
  computed: {
    hasSubscription () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.subscriptionId
    },
    aboutLinks () {
      const items = [
        {
          text: this.$t('footer.about'),
          to: { name: 'about', hash: '#video' },
        },
        {
          text: this.$t('footer.faq'),
          href: '#',
        },
        {
          text: this.$t('footer.stack'),
          href: '#',
        },
        {
          text: this.$t('footer.terms'),
          to: '/agreenemt',
        },
        {
          text: this.$t('footer.privacy'),
          to: '/policy',
        },
        {
          text: this.$t('footer.modules'),
          href: '#',
        },
      ]
      return items
    },
    extLinks () {
      const items = [
        {
          text: this.$t('footer.tariffs'),
          to: { name: 'pricing' },
        },
        {
          text: this.$t('footer.jobs'),
          href: '#',
        },
        {
          text: this.$t('footer.coordinates'),
          href: '#',
        },
        // {
        //   text: 'https://status.miro.com',
        //   href: '#',
        // },
        {
          text: this.$t('footer.blog'),
          href: '#',
        },
      ]
      if (this.hasSubscription) {
        items.push({
          text: this.$t('footer.subscriptionManagement'),
          to: { name: 'subscription' },
          href: '#',
        })
      }
      return items
    },
    socialLinks () {
      return [
        {
          text: 'Facebook',
          href: '#',
          icon: ziFacebook,
        },
        {
          text: 'Telegram',
          href: '#',
          icon: ziTelegram,
        },
        {
          text: 'Instagram',
          href: '#',
          icon: ziInstagram,
        },
        {
          text: `Youtube ${this.$t('footer.training')}`,
          href: '#',
          icon: ziYoutube,
        },
        {
          text: this.$t('footer.vk'),
          href: '#',
          icon: ziVk,
        },
        // TODO: add github icon
        // {
        //   text: 'Github',
        //   href: '#',
        //   icon: ziGithub,
        // },
      ]
    },
  },
}
</script>
