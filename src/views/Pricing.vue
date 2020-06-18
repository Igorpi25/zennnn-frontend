<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <header class="border-b border-gray-75">
      <div class="h-20 flex items-center container container--sm">
        <router-link
          :to="{ name: 'home' }"
          class="flex-shrink-0 select-none focus:outline-none mr-2 sm:mr-6"
        >
          <img src="@/assets/img/logo-light.svg" alt="Logo" style="height: 18px">
        </router-link>
        <i class="hidden sm:block zi-chevron-up text-2xl text-gray-75 transform rotate-90" />
        <div class="hidden sm:block ml-2 sm:ml-6">
          {{ title }}
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
      <h1
        class="text-40 font-bold mb-6"
      >
        {{ title }}
      </h1>
      <div v-if="!isLoggedIn" class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md p-4 mb-12" style="box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.1);">
        <div class="text-lg text-black leading-snug pl-2 pb-4 sm:pb-0">
          <span v-html="alertTitle" class="font-bold mr-1" />
          <span>{{ alertSubtitle }}</span>
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
import Footer from '../components/Footer.vue'
import { GET_IS_LOGGED_IN, GET_PROFILE } from '../graphql/queries'

export default {
  name: 'Pricing',
  components: {
    PriceList,
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
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      title: 'Тарифы',
      alertTitle: 'Продвинутый аккаунт без ограничений на 30&nbsp;дней.',
      alertSubtitle: 'Получите бесплатно после регистрации.',
      selectText: 'Выбрать',
      contactText: 'Связаться',
    }
  },
  computed: {
    orgId () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.org
    },
  },
}
</script>
