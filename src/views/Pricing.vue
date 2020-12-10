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
          <i class="hidden sm:block zi-chevron-up text-2xl text-light-gray-400 transform rotate-90" />
          <div class="hidden sm:block ml-2 sm:ml-6">
            {{ $t('pricing.title') }}
          </div>
        </div>
      </template>
    </Header>
    <header v-else class="border-b border-light-gray-400">
      <div class="h-20 flex items-center container container--sm">
        <router-link
          :to="{ name: 'home' }"
          class="flex-shrink-0 select-none focus:outline-none mr-2 sm:mr-6"
        >
          <img src="@/assets/img/logo-light.svg" alt="Logo" class="h-lg">
        </router-link>
        <i class="hidden sm:block zi-chevron-up text-2xl text-light-gray-400 transform rotate-90" />
        <div class="hidden sm:block ml-2 sm:ml-6">
          {{ $t('pricing.title') }}
        </div>
        <div class="flex-grow flex items-center justify-end">
          <LocalePicker :nudge-bottom="52" light class="sm:pr-4" />
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
      <div v-if="!isLoggedIn" class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-lg p-4 mb-12">
        <div class="text-lg text-black leading-snug pl-2 pb-4 sm:pb-0">
          <span v-html="$t('pricing.oneUsdTitle')" class="font-bold mr-1" />
          <span>{{ $t('pricing.oneUsdSubtitle') }}</span>
        </div>
        <Button :to="{ name: 'signup' }" class="flex-shrink-0 ml-4">
          {{ $t('signup.submit') }}
        </Button>
      </div>
      <div class="pb-20">
        <PriceList
          :is-logged-in="isLoggedIn"
          :org-id="orgId"
        />
      </div>
      <div class="pb-20">
        <h2 class="font-semibold text-32 leading-tight pb-10">{{ $t('pricing.specsTitle') }}</h2>
        <div class="overflow-x-auto scrolling-touch">
          <table width="100%" class="w-full leading-tight text-gray-900 text-center">
            <thead>
              <tr class="h-16 text-xl text-gray-100">
                <td class="whitespace-no-wrap text-left px-8">{{ $t('pricing.specCount') }}</td>
                <td class="px-6">{{ $t('pricing.start') }}</td>
                <td class="px-6">{{ $t('pricing.standard') }}</td>
                <td class="text-gray-900 px-6">{{ $t('pricing.advanced') }}</td>
                <td class="px-6">{{ $t('pricing.premium') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in specs" :key="i" class="h-16 even:bg-white">
                <td class="whitespace-no-wrap text-left rounded-l-md px-8" v-html="item.text" />
                <td class="text-gray-200 px-6">
                  <img v-if="item.start === 'infinite'" src="@/assets/img/infinite.svg" class="mx-auto">
                  <span v-else-if="item.start === 'na'">&mdash;</span>
                  <span v-else>{{ item.start }}</span>
                </td>
                <td class="text-gray-200 px-6">
                  <img v-if="item.standard === 'infinite'" src="@/assets/img/infinite.svg" class="mx-auto">
                  <span v-else-if="item.standard === 'na'">&mdash;</span>
                  <span v-else>{{ item.standard }}</span>
                </td>
                <td class="text-gray-900 font-semibold px-6">
                  <img v-if="item.advanced === 'infinite'" src="@/assets/img/infinite.svg" class="mx-auto">
                  <span v-else>{{ item.advanced }}</span>
                </td>
                <td class="rounded-r-md text-gray-200 px-6">
                  <img v-if="item.premium === 'infinite'" src="@/assets/img/infinite.svg" class="mx-auto">
                  <span v-else>{{ item.premium }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 class="font-semibold text-32 leading-tight pb-10">{{ $t('pricing.funcTitle') }}</h2>
        <div class="flex flex-wrap -mx-3">
          <div
            v-for="item in functions"
            :key="item.icon"
            class="text-center w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 pb-20 px-3"
          >
            <div class="w-12 h-12 flex items-center justify-center mx-auto text-blue-500">
              <img :src="require(`@/assets/img/solid/${item.icon}`)">
            </div>
            <div class="leading-tight text-gray-900 pt-4">
              <div v-html="item.title" />
              <div v-if="item.subtitle" class="text-gray-200" v-html="item.subtitle" />
            </div>
          </div>
        </div>
      </div>
      <div class="pb-4">
        <h2 class="font-semibold text-32 leading-tight pb-10">{{ $t('pricing.faqTitle') }}</h2>
        <ul class="faq-list">
          <li
            v-for="(item, i) in faqs"
            :key="i"
          >
            <div class="text-gray-900 pb-16">
              <span class="text-2xl leading-tight pb-4" v-html="item.title" />
              <br><br>
              <p v-html="item.text" />
            </div>
          </li>
        </ul>
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import { useQuery, useResult } from '@vue/apollo-composable'

import PriceList from '../components/PriceList.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import LocalePicker from '../components/LocalePicker.vue'

import { GET_IS_LOGGED_IN, GET_PROFILE } from '../graphql/queries'

export default {
  name: 'Pricing',
  components: {
    PriceList,
    Header,
    Footer,
    LocalePicker,
  },
  // metaInfo: {
  //   style: [
  //     { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
  //   ],
  //   meta: [
  //     { hid: 'title', name: 'title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
  //     { hid: 'description', name: 'description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
  //     { vmid: 'og:title', property: 'og:title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
  //     { vmid: 'og:description', property: 'og:description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
  //     { vmid: 'og:site_name', property: 'og:site_name', content: 'ZENNNN' },
  //     { vmid: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}` },
  //     { vmid: 'og:image', property: 'og:image', content: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png` },
  //   ],
  // },
  setup () {
    const { result: result1 } = useQuery(GET_IS_LOGGED_IN)
    const isLoggedIn = useResult(result1)

    const { result: result2 } = useQuery(GET_PROFILE)
    const getProfile = useResult(result2, null, {
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-first',
    })

    return {
      isLoggedIn,
      getProfile,
    }
  },
  computed: {
    orgId () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.org
    },
    hasSubscription () {
      return this.getProfile && this.getProfile.account && this.getProfile.account.subscriptionId
    },
    specs () {
      return [
        {
          text: this.$t('pricing.spec1'),
          start: this.$t('pricing.upTo'),
          standard: '4+',
          advanced: '11+',
          premium: '25+',
        },
        {
          text: this.$t('pricing.spec2'),
          start: '50',
          standard: '100',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec3'),
          start: '500',
          standard: '1000',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec4'),
          start: '1000',
          standard: '2000',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec5'),
          start: '250',
          standard: '500',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec6'),
          start: '5',
          standard: '10',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec7'),
          start: '5',
          standard: '10',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec8'),
          start: 'infinite',
          standard: 'infinite',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec9'),
          start: 'infinite',
          standard: 'infinite',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec10'),
          start: 'infinite',
          standard: 'infinite',
          advanced: 'infinite',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec11'),
          start: '5Gb',
          standard: '10Gb',
          advanced: '50Gb',
          premium: 'infinite',
        },
        {
          text: this.$t('pricing.spec12'),
          start: 'na',
          standard: 'na',
          advanced: 'infinite',
          premium: 'infinite',
        },
      ]
    },
    functions () {
      return [
        {
          icon: 'paper-plane.svg',
          title: this.$t('pricing.func1'),
          subtitle: '',
        },
        {
          icon: 'id-badge.svg',
          title: this.$t('pricing.func2'),
          subtitle: this.$t('pricing.func2desc'),
        },
        {
          icon: 'cog.svg',
          title: this.$t('pricing.func3'),
          subtitle: this.$t('pricing.func3desc'),
        },
        {
          icon: 'check-circle.svg',
          title: this.$t('pricing.func4'),
          subtitle: this.$t('pricing.func4desc'),
        },
        {
          icon: 'address-card.svg',
          title: this.$t('pricing.func5'),
          subtitle: '',
        },
        {
          icon: 'th-list.svg',
          title: this.$t('pricing.func6'),
          subtitle: '',
        },
        {
          icon: 'share-square.svg',
          title: this.$t('pricing.func7'),
          subtitle: '',
        },
        {
          icon: 'share.svg',
          title: this.$t('pricing.func8'),
          subtitle: '',
        },
        {
          icon: 'calendar-alt.svg',
          title: this.$t('pricing.func9'),
          subtitle: '',
        },
        {
          icon: 'cubes.svg',
          title: this.$t('pricing.func10'),
          subtitle: this.$t('pricing.func10desc'),
        },
        {
          icon: 'qrcode.svg',
          title: this.$t('pricing.func11'),
          subtitle: '',
        },
        {
          icon: 'comments.svg',
          title: this.$t('pricing.func12'),
          subtitle: this.$t('pricing.func12desc'),
        },
        {
          icon: 'calculator.svg',
          title: this.$t('pricing.func13'),
          subtitle: this.$t('pricing.func13desc'),
        },
        {
          icon: 'file-pdf.svg',
          title: this.$t('pricing.func14'),
          subtitle: '',
        },
        {
          icon: 'tasks.svg',
          title: this.$t('pricing.func15'),
          subtitle: '',
        },
        {
          icon: 'chart-area.svg',
          title: this.$t('pricing.func16'),
          subtitle: '',
        },
        {
          icon: 'chart-bar.svg',
          title: this.$t('pricing.func17'),
          subtitle: '',
        },
        {
          icon: 'user-md.svg',
          title: this.$t('pricing.func18'),
          subtitle: '',
        },
        {
          icon: 'users.svg',
          title: this.$t('pricing.func19'),
          subtitle: '',
        },
        {
          icon: 'cloud.svg',
          title: this.$t('pricing.func20'),
          subtitle: '',
        },
        {
          icon: 'lock.svg',
          title: this.$t('pricing.func21'),
          subtitle: '',
        },
        {
          icon: 'language.svg',
          title: this.$t('pricing.func22'),
          subtitle: this.$t('pricing.func22desc'),
        },
        {
          icon: 'archive.svg',
          title: this.$t('pricing.func23'),
          subtitle: '',
        },
        {
          icon: 'gem.svg',
          title: this.$t('pricing.more'),
          subtitle: '',
        },
        {
          icon: 'arrow-right.svg',
          title: this.$t('pricing.next'),
          subtitle: '',
        },
        {
          icon: 'th.svg',
          title: this.$t('pricing.func24'),
          subtitle: '',
        },
        {
          icon: 'dollar-sign.svg',
          title: this.$t('pricing.func25'),
          subtitle: '',
        },
        {
          icon: 'file-excel.svg',
          title: this.$t('pricing.func26'),
          subtitle: '',
        },
        {
          icon: 'amazon.svg',
          title: this.$t('pricing.func27'),
          subtitle: '',
        },
        {
          icon: 'puzzle-piece.svg',
          title: this.$t('pricing.func28'),
          subtitle: '',
        },
      ]
    },
    faqs () {
      return [
        {
          title: this.$t('pricing.q1'),
          text: this.$t('pricing.a1'),
        },
        {
          title: this.$t('pricing.q2'),
          text: this.$t('pricing.a2'),
        },
        {
          title: this.$t('pricing.q3'),
          text: this.$t('pricing.a3'),
        },
        {
          title: this.$t('pricing.q4'),
          text: this.$t('pricing.a4'),
        },
        {
          title: this.$t('pricing.q5'),
          text: this.$t('pricing.a5'),
        },
        {
          title: this.$t('pricing.q6'),
          text: this.$t('pricing.a6'),
        },
        {
          title: this.$t('pricing.q7'),
          text: this.$t('pricing.a7'),
        },
        {
          title: this.$t('pricing.q8'),
          text: this.$t('pricing.a8'),
        },
        {
          title: this.$t('pricing.q9'),
          text: this.$t('pricing.a9'),
        },
        {
          title: this.$t('pricing.q10'),
          text: this.$t('pricing.a10'),
        },
        {
          title: this.$t('pricing.q11'),
          text: this.$t('pricing.a11'),
        },
        {
          title: this.$t('pricing.q12'),
          text: this.$t('pricing.a12'),
        },
        {
          title: this.$t('pricing.q13'),
          text: this.$t('pricing.a13'),
        },
        {
          title: this.$t('pricing.q14'),
          text: this.$t('pricing.a14'),
        },
        {
          title: this.$t('pricing.q15'),
          text: this.$t('pricing.a15'),
        },
        {
          title: this.$t('pricing.q16'),
          text: this.$t('pricing.a16'),
        },
        {
          title: this.$t('pricing.q17'),
          text: this.$t('pricing.a17'),
        },
      ]
    },
  },
}
</script>

<style lang="postcss">
.faq-list li {
  break-inside: avoid;
}
@screen md {
  ul.faq-list {
    columns: 2;
  }
}
@screen lg {
  ul.faq-list {
    columns: 3;
  }
}
</style>
