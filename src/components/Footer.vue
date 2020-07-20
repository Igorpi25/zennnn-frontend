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
              class="focus:outline-none focus:text-blue-500 hover:text-blue-500"
            >
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.href"
              class="focus:outline-none focus:text-blue-500 hover:text-blue-500"
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
              class="focus:outline-none focus:text-blue-500 hover:text-blue-500"
            >
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.href"
              class="focus:outline-none focus:text-blue-500 hover:text-blue-500"
            >
              {{ item.text }}
            </a>
          </div>
        </div>
        <div class="relative h-full w-full md:w-1/3 md:pl-6 pt-6 md:pt-0">
          <div class="hidden md:block absolute left-0 w-px h-full bg-gray-400" />
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              Facebook
              <i class="zi-facebook text-2xl text-gray-200 float-right" />
            </a>
          </div>
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              Telegram
              <i class="zi-telegram text-2xl text-gray-200 float-right" />
            </a>
          </div>
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              Instagram
              <i class="zi-instagram text-2xl text-gray-200 float-right" />
            </a>
          </div>
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              Youtube ({{ $t('footer.training') }})
              <i class="zi-youtube text-2xl text-gray-200 float-right" />
            </a>
          </div>
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              {{ $t('footer.vk') }}
              <i class="zi-vk text-2xl text-gray-200 float-right" />
            </a>
          </div>
          <div class="pb-5 px-4 sm:px-0">
            <a href="#" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              Github
              <div class="text-gray-200 float-right">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.33337 14.1C2.33337 7.77905 7.32464 2.98022 13.8495 2.98022C20.3744 2.98022 25.6667 7.77905 25.6667 14.1C25.6667 19.1541 22.4772 23.4789 17.7729 24.9919C17.1754 25.0968 16.959 24.7367 16.959 24.4405C16.959 24.3171 16.9606 24.027 16.9627 23.6386V23.6386C16.9668 22.8511 16.9732 21.6591 16.9732 20.6306C16.9732 19.5597 16.6062 18.8761 16.1734 18.516C18.8031 18.2289 21.574 17.878 21.574 13.4802C21.574 12.2315 21.1129 11.6026 20.3603 10.796C20.4826 10.4998 20.8824 9.28296 20.2379 7.70158C19.2547 7.4008 16.992 8.93205 16.992 8.93205C16.0511 8.67684 15.0397 8.54468 14.0377 8.54468C13.0357 8.54468 12.0242 8.67684 11.0834 8.93205C11.0834 8.93205 8.82061 7.40535 7.83741 7.70158C7.19292 9.2784 7.59278 10.4998 7.71509 10.796C6.96241 11.5981 6.60488 12.227 6.60488 13.4802C6.60488 17.8643 9.25811 18.2335 11.8878 18.516C11.5491 18.8168 11.2433 19.3227 11.1351 20.0518C10.4624 20.3526 8.73593 20.8585 7.70569 19.0994C7.0612 18.0147 5.88983 17.9236 5.88983 17.9236C4.73727 17.9099 5.81456 18.6254 5.81456 18.6254C6.58606 18.9672 7.12235 20.2934 7.12235 20.2934C7.81389 22.335 11.1069 21.6514 11.1069 21.6514C11.1069 22.2715 11.1128 23.1442 11.117 23.7586C11.1193 24.0925 11.121 24.3502 11.121 24.4496C11.121 24.7459 10.9093 25.1059 10.3072 25.0011C5.61698 23.4789 2.33337 19.1541 2.33337 14.1ZM8.87707 20.7445C8.73594 20.7172 8.64186 20.6124 8.67479 20.5212C8.70772 20.4301 8.84414 20.3845 8.96645 20.4164C9.10758 20.4574 9.19697 20.5622 9.16874 20.6534C9.14051 20.7445 8.99938 20.7901 8.87707 20.7445ZM9.89321 20.8904C10.0296 20.8904 10.1378 20.8175 10.1378 20.7263C10.1378 20.6215 10.0155 20.5486 9.87439 20.5622C9.73796 20.5622 9.62977 20.6352 9.62977 20.7263C9.62977 20.8311 9.73796 20.904 9.89321 20.8904ZM10.7541 20.4438C10.6176 20.4757 10.5236 20.5623 10.5377 20.6671C10.5518 20.7583 10.6741 20.8175 10.8152 20.7856C10.9516 20.7537 11.0457 20.6671 11.0316 20.576C11.0175 20.4894 10.8905 20.4301 10.7541 20.4438ZM6.90597 18.6983C6.84482 18.7439 6.85893 18.8487 6.9389 18.9353C7.01417 19.0082 7.12237 19.0401 7.18353 18.9809C7.24468 18.9353 7.23057 18.8305 7.1506 18.7439C7.07533 18.671 6.96713 18.6391 6.90597 18.6983ZM6.50608 18.5069C6.412 18.4613 6.36495 18.3884 6.39788 18.3292C6.43081 18.2836 6.50608 18.2699 6.60017 18.2972C6.69425 18.3428 6.7413 18.4157 6.70837 18.475C6.67544 18.5388 6.58135 18.5525 6.50608 18.5069ZM7.92209 19.9516C7.84682 20.0108 7.87505 20.1476 7.98325 20.2342C8.09145 20.339 8.22787 20.3526 8.28903 20.2797C8.35018 20.2205 8.32196 20.0838 8.22787 19.9972C8.12438 19.8924 7.98325 19.8787 7.92209 19.9516ZM7.38579 19.5505C7.31052 19.4457 7.31052 19.3272 7.38579 19.2817C7.46106 19.2224 7.58337 19.268 7.64923 19.3728C7.7245 19.4776 7.7245 19.5961 7.64923 19.6554C7.58807 19.7009 7.46106 19.6554 7.38579 19.5505Z" fill="black"/>
                  <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="24" height="24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.33337 14.1C2.33337 7.77905 7.32464 2.98022 13.8495 2.98022C20.3744 2.98022 25.6667 7.77905 25.6667 14.1C25.6667 19.1541 22.4772 23.4789 17.7729 24.9919C17.1754 25.0968 16.959 24.7367 16.959 24.4405C16.959 24.3171 16.9606 24.027 16.9627 23.6386V23.6386C16.9668 22.8511 16.9732 21.6591 16.9732 20.6306C16.9732 19.5597 16.6062 18.8761 16.1734 18.516C18.8031 18.2289 21.574 17.878 21.574 13.4802C21.574 12.2315 21.1129 11.6026 20.3603 10.796C20.4826 10.4998 20.8824 9.28296 20.2379 7.70158C19.2547 7.4008 16.992 8.93205 16.992 8.93205C16.0511 8.67684 15.0397 8.54468 14.0377 8.54468C13.0357 8.54468 12.0242 8.67684 11.0834 8.93205C11.0834 8.93205 8.82061 7.40535 7.83741 7.70158C7.19292 9.2784 7.59278 10.4998 7.71509 10.796C6.96241 11.5981 6.60488 12.227 6.60488 13.4802C6.60488 17.8643 9.25811 18.2335 11.8878 18.516C11.5491 18.8168 11.2433 19.3227 11.1351 20.0518C10.4624 20.3526 8.73593 20.8585 7.70569 19.0994C7.0612 18.0147 5.88983 17.9236 5.88983 17.9236C4.73727 17.9099 5.81456 18.6254 5.81456 18.6254C6.58606 18.9672 7.12235 20.2934 7.12235 20.2934C7.81389 22.335 11.1069 21.6514 11.1069 21.6514C11.1069 22.2715 11.1128 23.1442 11.117 23.7586C11.1193 24.0925 11.121 24.3502 11.121 24.4496C11.121 24.7459 10.9093 25.1059 10.3072 25.0011C5.61698 23.4789 2.33337 19.1541 2.33337 14.1ZM8.87707 20.7445C8.73594 20.7172 8.64186 20.6124 8.67479 20.5212C8.70772 20.4301 8.84414 20.3845 8.96645 20.4164C9.10758 20.4574 9.19697 20.5622 9.16874 20.6534C9.14051 20.7445 8.99938 20.7901 8.87707 20.7445ZM9.89321 20.8904C10.0296 20.8904 10.1378 20.8175 10.1378 20.7263C10.1378 20.6215 10.0155 20.5486 9.87439 20.5622C9.73796 20.5622 9.62977 20.6352 9.62977 20.7263C9.62977 20.8311 9.73796 20.904 9.89321 20.8904ZM10.7541 20.4438C10.6176 20.4757 10.5236 20.5623 10.5377 20.6671C10.5518 20.7583 10.6741 20.8175 10.8152 20.7856C10.9516 20.7537 11.0457 20.6671 11.0316 20.576C11.0175 20.4894 10.8905 20.4301 10.7541 20.4438ZM6.90597 18.6983C6.84482 18.7439 6.85893 18.8487 6.9389 18.9353C7.01417 19.0082 7.12237 19.0401 7.18353 18.9809C7.24468 18.9353 7.23057 18.8305 7.1506 18.7439C7.07533 18.671 6.96713 18.6391 6.90597 18.6983ZM6.50608 18.5069C6.412 18.4613 6.36495 18.3884 6.39788 18.3292C6.43081 18.2836 6.50608 18.2699 6.60017 18.2972C6.69425 18.3428 6.7413 18.4157 6.70837 18.475C6.67544 18.5388 6.58135 18.5525 6.50608 18.5069ZM7.92209 19.9516C7.84682 20.0108 7.87505 20.1476 7.98325 20.2342C8.09145 20.339 8.22787 20.3526 8.28903 20.2797C8.35018 20.2205 8.32196 20.0838 8.22787 19.9972C8.12438 19.8924 7.98325 19.8787 7.92209 19.9516ZM7.38579 19.5505C7.31052 19.4457 7.31052 19.3272 7.38579 19.2817C7.46106 19.2224 7.58337 19.268 7.64923 19.3728C7.7245 19.4776 7.7245 19.5961 7.64923 19.6554C7.58807 19.7009 7.46106 19.6554 7.38579 19.5505Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H28V28H0V0Z" fill="currentColor"/>
                  </g>
                </svg>
              </div>
            </a>
          </div>
          <div class="px-4 sm:px-0">
            <a :href="`mailto:${mailTo}`" class="focus:outline-none focus:text-blue-500 hover:text-blue-500">
              {{ mailTo }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container container--sm h-20 flex items-center">
      <div class="flex md:pl-6">
        <router-link :to="{ name: 'home' }" class="select-none focus:outline-none">
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
import Copyright from '../components/Copyright.vue'
import { GET_PROFILE, GET_IS_LOGGED_IN } from '../graphql/queries'

export default {
  name: 'Footer',
  components: {
    Copyright,
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
  },
  computed: {
    hasSubscription () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.subscriptionId
    },
    mailTo () {
      return process.env.VUE_APP_MAILTO
    },
    aboutLinks () {
      const items = [
        {
          text: this.$t('footer.about'),
          to: { name: 'about' },
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
          href: '#',
        },
        {
          text: this.$t('footer.privacy'),
          href: '#',
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
  },
}
</script>
