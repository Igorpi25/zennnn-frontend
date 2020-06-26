<template>
  <div class="flex-grow flex- flex-col">
    <!-- / HEADER -->
    <header>
      <div class="h-20 flex items-center container container--sm">
        <router-link
          :to="{ name: 'home' }"
          class="flex-shrink-0 select-none focus:outline-none mr-2 sm:mr-4"
        >
          <img src="@/assets/img/logo-dark.svg" alt="Logo">
        </router-link>
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
          >
            {{ $t('signup.submit') }}
          </Button>
        </div>
      </div>
    </header>
    <!-- HEADER / -->
    <!-- / MAIN -->
    <main class="container container--sm home-main--top flex-grow">
      <h1
        v-html="$t('home.title')"
        class="text-4xl sm:text-56 text-gray-75 text-center font-semibold mb-10"
      />
      <div class="flex flex-wrap sm:justify-center pb-12">
        <div
          v-for="item of subtitleItems"
          :key="item"
          class="w-full sm:w-auto flex items-center px-10 pr-6 sm:pl-6"
        >
          <i class="zi-check text-2xl text-blue-500 mr-2" />
          <div class="text-xl text-gray-200">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <Button
          :to="{ name: 'signup' }"
          class="text-center leading-none"
        >
          <div class="flex items-center px-2">
            <span>{{ $t('home.cty') }}</span>
            <i class="zi-arrow-right text-lg ml-sm" />
          </div>
        </Button>
      </div>
      <div class="relative pt-8 md:pt-16 mt-8 md:mt-0">
        <img width="296" src="/static/img/home-list.png" class="absolute top-0 right-0 home-list">
        <div class="px-4 sm:px-18">
          <img src="/static/img/home-main.png" alt="image" class="home-main">
        </div>
        <img width="264" src="/static/img/home-tabs.png" class="absolute home-tabs">
        <img width="246" src="/static/img/home-container.png" class="absolute home-container">
      </div>
      <div class="pt-20 pb-20">
        <div
          v-html="$t('home.info')"
          class="border-l-2 sm:border-l-4 border-blue-500 text-xl leading-relaxed px-4 sm:px-18"
        />
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Footer,
  },
  metaInfo: {
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
  computed: {
    subtitleItems () {
      return [this.$t('home.subtitle1'), this.$t('home.subtitle2'), this.$t('home.subtitle3')]
    },
  },
}
</script>

<style scoped lang="postcss">
.home-main--top {
  padding-top: 4vh;
}
img.home-main {
  box-shadow: 20px 50px 60px rgba(0, 0, 0, 0.35);
}
img.home-list {
  z-index: -1;
  width: 26%;
}
img.home-tabs {
  left: 0;
  bottom: 40%;
  width: 23%;
  box-shadow: 0px -10px 30px rgba(0, 0, 0, 0.25), 8px 40px 50px rgba(0, 0, 0, 0.35);
}
img.home-container {
  right: 0;
  bottom: 16%;
  width: 21.7%;
  box-shadow: 0px -10px 30px rgba(0, 0, 0, 0.25), 8px 40px 50px rgba(0, 0, 0, 0.35);
}
@screen sm {
 .home-main--top {
    padding-top: 8vh;
  }
  img.home-tabs {
    left: 38px;
  }
  img.home-container {
    right: 24px;
  }
}
</style>
