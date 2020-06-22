<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <Header
      v-if="isLoggedIn"
      :org="orgId"
      light
    >
      <template v-slot:breadcrumbs>
        <div class="flex items-center pl-2 sm:pl-6">
          <i class="hidden sm:block zi-chevron-up text-2xl text-gray-75 transform rotate-90" />
          <div class="hidden sm:block ml-2 sm:ml-6">
            {{ $t('pricing.title') }}
          </div>
        </div>
      </template>
    </Header>
    <header v-else class="border-b border-gray-75">
      <div class="h-20 flex items-center container container--sm">
        <router-link
          :to="{ name: 'home' }"
          class="flex-shrink-0 select-none focus:outline-none mr-2 sm:mr-6"
        >
          <img src="@/assets/img/logo-light.svg" alt="Logo" style="height: 18px">
        </router-link>
        <i class="hidden sm:block zi-chevron-up text-2xl text-gray-75 transform rotate-90" />
        <div class="hidden sm:block ml-2 sm:ml-6">
          {{ $t('pricing.title') }}
        </div>
        <div class="flex-grow flex items-center justify-end">
          <router-link
            :to="{ name: 'signin' }"
            class="hidden sm:block text-blue-500 select-none focus:outline-none focus:text-blue-600 hover:text-blue-600 mr-3 sm:mr-8"
          >
            {{ $t('signup.signin') }}
          </router-link>
          <Button
            :to="{ name: 'signup' }"
            outlined
            class="text-center leading-none"
            merge-class="border-blue-500 hover:text-blue-600"
          >
            {{ $t('signup.submit') }}
          </Button>
        </div>
      </div>
    </header>
    <!-- HEADER / -->
    <!-- / MAIN -->
    <main class="container container--sm flex-grow pt-16">
      <div class="flex flex-wrap justify-between">
        <h1
          class="text-40 font-bold leading-tight mb-6"
        >
          {{ $t('pricing.title') }}
        </h1>
        <router-link
          v-if="hasSubscription"
          :to="{ name: 'subscription' }"
          class="inline-flex items-center focus:outline-none text-blue-500 hover:text-blue-600 focus:text-blue-600 select-none whitespace-no-wrap"
        >
          <span class="mr-2">{{ $t('footer.subscriptionManagement') }}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2549 0.269518C19.4932 0.320297 19.6807 0.507788 19.7315 0.746058C20.001 2.00381 20.001 2.98814 19.9971 3.97247C19.9971 7.984 17.833 10.4097 14.9971 12.2182V16.2961C14.9971 17.0031 14.5987 17.6554 13.9619 17.9718L10.1065 19.9014C9.48538 20.21 8.751 19.7569 8.751 19.0616V15.3469C8.251 15.5774 7.75491 15.8078 7.27835 16.0461C7.03616 16.1672 6.7471 16.1203 6.55569 15.9289L4.07132 13.4447C3.87991 13.2533 3.83304 12.9642 3.95413 12.7221C4.19241 12.2455 4.42679 11.7494 4.65725 11.2495H0.942411C0.243192 11.2495 -0.209933 10.519 0.102567 9.89406L2.03225 6.03487C2.34866 5.40209 2.9971 4.99976 3.70804 4.99976H7.77835C9.58304 2.15615 12.001 0 16.0323 0C17.0127 0 17.9971 0 19.2549 0.269518ZM13.751 4.37479C13.751 5.4099 14.5908 6.2497 15.626 6.2497C16.6612 6.2497 17.501 5.4099 17.501 4.37479C17.501 3.33969 16.6612 2.49988 15.626 2.49988C14.5908 2.49988 13.751 3.33969 13.751 4.37479Z" fill="currentColor"/>
          </svg>
        </router-link>
      </div>
      <div v-if="!isLoggedIn" class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md p-4 mb-12" style="box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.1);">
        <div class="text-lg text-black leading-snug pl-2 pb-4 sm:pb-0">
          <span v-html="$t('pricing.oneUsdTitle')" class="font-bold mr-1" />
          <span>{{ $t('pricing.oneUsdSubtitle') }}</span>
        </div>
        <Button :to="{ name: 'signup' }" class="ml-4">
          {{ $t('signup.submit') }}
        </Button>
      </div>
      <div class="pb-20">
        <PriceList
          :is-logged-in="isLoggedIn"
          :org-id="orgId"
        />
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import PriceList from '../components/PriceList.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

import { GET_IS_LOGGED_IN, GET_PROFILE } from '../graphql/queries'

export default {
  name: 'Pricing',
  components: {
    PriceList,
    Header,
    Footer,
  },
  metaInfo: {
    style: [
      { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
    ],
    meta: [
      { hid: 'title', name: 'title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { hid: 'description', name: 'description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:title', property: 'og:title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { vmid: 'og:description', property: 'og:description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:site_name', property: 'og:site_name', content: 'ZENNNN' },
      { vmid: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}` },
      { vmid: 'og:image', property: 'og:image', content: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png` },
    ],
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-first',
      skip () {
        return !this.isLoggedIn
      },
    },
  },
  computed: {
    orgId () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.org
    },
    hasSubscription () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.subscriptionId
    },
  },
}
</script>
