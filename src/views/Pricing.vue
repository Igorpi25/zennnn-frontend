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
            outlined
            :to="{ name: 'signup' }"
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
      <div class="leading-snug pb-20">
        <div class="tariff-card bg-white overflow-hidden rounded-md flex flex-wrap sm:justify-center">
          <div
            v-for="(item, i) of tarrifs"
            :key="i"
            :class="{ 'bg-gray-50': item.name === 'advanced' }"
            class="tariff-card__item w-full sm:w-1/2 lg:w-1/4 flex flex-col px-8 pt-8"
          >
            <div class="flex items-center justify-between font-semibold pb-lg">
              <div class="text-xl">{{ item.title }}</div>
              <div class="h-9 flex items-center text-gray-200 bg-gray-50 rounded-xl px-2">
                <i class="zi-users text-2xl mr-2" />
                <span>{{ item.team }}</span>
              </div>
            </div>
            <div class="py-6">
              <div class="h-8">
                <span class="text-32 font-semibold">
                  {{ item.price }}
                </span>
                <template v-if="item.priceInCurrency">
                  <span>~</span>
                  <span>
                    {{ item.priceInCurrency }}
                  </span>
                </template>
              </div>
            </div>
            <div style="min-height: 164px">
              <div class="pb-4">
                {{ item.econ }}
              </div>
              <div class="text-gray-200">
                {{ item.priceMonthly }}
              </div>
            </div>
            <div class="pb-4">
              <Button
                :to="!isLoggedIn ? { name: 'signup' } : null"
                block
                outlined
                merge-class="border-gray-100"
              >
                {{ item.name === 'permium' ? contactText : selectText }}
              </Button>
            </div>
            <div class="text-sm text-gray-200" style="min-height: 90px">
              {{ item.description }}
            </div>
            <div class="border-b border-gray-50 my-5" />
            <div
              v-for="(feat, fi) of item.feats"
              :key="`feat-${fi}`"
              class="flex pb-6"
            >
              <i class="zi-check text-2xl text-blue-500 -ml-2 pr-2" />
              <span>
                {{ feat }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue'
import { GET_IS_LOGGED_IN } from '../graphql/queries'

export default {
  name: 'Pricing',
  components: {
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
    tarrifs () {
      return [
        {
          name: 'start',
          title: 'Старт',
          team: 'до 3-х',
          price: '$15',
          priceInCurrency: '1097 руб.',
          priceMonthly: '$30 / месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Все необходимые функции для начала работы в международной торговле',
          feats: ['Отправка уведомлений на эл. почту'],
        },
        {
          name: 'standard',
          title: 'Стандарт',
          team: '4-10',
          price: '$99',
          priceInCurrency: '7244 руб.',
          priceMonthly: '$198 в месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Полноценная работа офиса на удаленке',
          feats: ['Отправка уведомлений на эл. почту'],
        },
        {
          name: 'advanced',
          title: 'Продвинутый',
          team: '11+',
          price: '$199',
          priceInCurrency: '14 561 руб.',
          priceMonthly: '$398 в месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Идеально подойдет малому и среднему бизнесу для повышения дохода компании',
          feats: ['Оформление аккаунта в соответствии с фирменным стилем компании', 'Настраиваемая реклама на странице кабинета клиента', 'Отправка СМС уведомлений'],
        },
        {
          name: 'permium',
          title: 'Премиум',
          team: '25+',
          price: '$~',
          econ: 'Индивидуальная цена зависит от условий обслуживания',
          description: 'Индивидуальный подход — индивидуален во всем',
          feats: ['Помощь всей компании перейти на логику ZENNNN', 'Поддержка 24/7', 'Серверная инфраструктура', 'Оформление аккаунта в соответствии с фирменным стилем компании', 'Настраиваемая реклама на странице кабинета клиента', 'Синяя галочка «Авторизовано ZENNNN»', 'Отправка СМС уведомлений'],
        },
      ]
    },
  },
}
</script>

<style>
.tariff-card {
  border: 1px solid #F0F0F0;
}
.tariff-card .tariff-card__item:not(:last-child) {
  border-bottom: 1px solid #F0F0F0;
}
@screen sm {
  .tariff-card .tariff-card__item:not(:last-child) {
    border-bottom: none;
  }
  .tariff-card .tariff-card__item:nth-child(odd) {
    border-right: 1px solid #F0F0F0;
  }
  .tariff-card .tariff-card__item:nth-child(1),
  .tariff-card .tariff-card__item:nth-child(2) {
    border-bottom: 1px solid #F0F0F0;
  }
}
@screen lg {
  .tariff-card .tariff-card__item:nth-child(1),
  .tariff-card .tariff-card__item:nth-child(2) {
    border-bottom: none;
    border-right: 1px solid #F0F0F0;
  }
}
</style>
