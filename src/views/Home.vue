<template>
  <div class="flex-grow flex flex-col">
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
          <LocalePicker nudge-bottom="24" class="sm:pr-4" />
          <router-link
            :to="{ name: 'signin' }"
            class="hidden sm:block text-blue-500 select-none focus:outline-none focus:text-blue-600 hover:text-blue-600 mr-3 sm:mr-8"
          >
            {{ $t('signup.signin') }}
          </router-link>
          <Btn
            :to="{ name: 'signup' }"
            outlined
            class="text-center leading-none"
          >
            {{ $t('signup.submit') }}
          </Btn>
        </div>
      </div>
    </header>
    <!-- HEADER / -->
    <!-- / MAIN -->
    <main class="container container--sm home-main--top flex-grow">
      <h1
        v-html="$t('home.title')"
        class="text-4xl sm:text-56 text-light-gray-400 text-center font-semibold leading-tight mb-10"
      />
      <div class="flex flex-wrap justify-center pb-12">
        <div
          v-for="item of subtitleItems"
          :key="item"
          class="w-auto flex items-center pl-2 sm:pr-6 sm:pl-6"
        >
          <i class="zi-check text-xl sm:text-2xl text-blue-500 mr-2" />
          <div class="text-sm sm:text-xl text-gray-200">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <Btn
          :to="{ name: 'signup' }"
          class="text-center leading-none"
        >
          <div class="flex items-center px-2">
            <span>{{ $t('home.cty') }}</span>
            <i class="zi-arrow-right text-lg ml-sm" />
          </div>
        </Btn>
      </div>
      <div class="relative pt-8 md:pt-16 mt-8 md:mt-0">
        <img width="296" src="/static/img/home-list.png" class="absolute top-0 right-0 home-list">
        <div class="px-4 sm:px-18">
          <Image
            :aspect-ratio="1.6"
            src="/static/img/home-main.png"
            alt="image"
            lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAAB7klEQVQoz2VTy3LiQAzkP8D4ATZgsOdtDKTyI9n/v25VbolT0rZkJ0vtHlStmdG0Wu3xarfbcV3XnOc559stF0XB+/2ey7L8QamR/S3O83zL26VWc2Am+RxfK1yiEAL1fU/WWmqahtbrNWVZ9hSbf9YZbTbzHoTMMTecVqLgfLnw6XTSACFXVQVVe8XnkNpv5XXdLFFL0H6eclpVZcV2cOyi55hu7L3j4XpDfuUYE/I7x2HUtfeenXMcgufreOeEfanHPvkQpOm0qtEtPXBxHPh2f+WUEvBFL1zHkW+PV5COSg5rgBE1UWu0cdQ9knMlLAqMbC/c9R33xvEF4xtg3xtEz8Z6RFguJ5wZDecDlEWtscaSR11ZlSDEF2vghXh3OBwWPHKDXPyRtaCzVhV2XaeE0ljIZgGGDATAX4wMD40edPAnaHFI8CaIGgslSZUIkXhoF2JBCz+lRl6JeKuEu7og6wyejCcXEqGAQhwJI5GxTiOlAc/KkJgvaoRA0Lqg9fDxL2FdZfy4j/z29ks9NKIACkXZ7FWE2sUrnOkEISxe2v8VlmUhCxqGgU5tS3iLhPEVj4eDKsBohJFV1fcPINjrGkrFQ6MefspXfm/bdjoejx/n8/nzOdp2RhivCFLN0fwnl308tQ80mPB7/v4D4IppMMl/iWUAAAAASUVORK5CYII="
            class="home-main"
          />
        </div>
        <img width="264" src="/static/img/home-tabs.png" class="absolute home-tabs">
        <img width="246" src="/static/img/home-container.png" class="absolute home-container">
      </div>
      <div class="pt-20 pb-20 px-2 sm:px-18">
        <div
          v-html="$t('home.info')"
          class="border-l-2 sm:border-l-4 border-blue-500 text-lg sm:text-xl leading-relaxed px-4 sm:px-10"
        />
      </div>
      <div class="flex flex-wrap leading-tight pt-8 pb-20 px-2 sm:px-18">
        <div class="w-full lg:w-1/2 lg:pr-md pb-12 lg:pb-0">
          <router-link to="/about" class="group">
            <div class="relative">
              <Image
                :aspect-ratio="2.5"
                src="/static/img/home-banner-1.png"
                contain
                class="banner"
              />
              <div class="absolute inset-0 flex">
                <div class="w-1/2 px-8 md:pl-13 pt-8 xl:pt-12">
                  <div v-html="$t('home.about')" class="text-xl lg:text-28 text-white pb-4" />
                  <i class="absolute transform group-hover:translate-x-2 transition-transform duration-100 ease-out zi-arrow-right text-blue-500 text-3xl" />
                </div>
                <div class="w-1/2">
                  <img
                    src="/static/img/home-iphones.png"
                    class="banner-image-1 bg-right-bottom absolute right-0 bottom-0"
                  >
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-md">
          <router-link to="/about#video" class="group">
            <div class="relative">
              <Image
                :aspect-ratio="2.5"
                src="/static/img/home-banner-2.png"
                contain
                class="banner"
              />
              <div class="absolute inset-0 flex">
                <div class="w-1/2 px-8 md:pl-13 pt-8 xl:pt-12">
                  <div v-html="$t('home.video')" class="text-xl lg:text-28 text-white pb-4" />
                  <i class="absolute transform group-hover:translate-x-2 transition-transform duration-100 ease-out zi-arrow-right text-blue-500 text-3xl" />
                </div>
                <div class="w-1/2">
                  <img
                    src="/static/img/home-imac.png"
                    class="banner-image-2 bg-right-bottom absolute right-0 bottom-0"
                  >
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="flex flex-wrap sm:text-lg leading-tight px-2 sm:px-18">
        <div class="w-full sm:w-1/2 sm:pr-4">
          <div
            v-for="item in features1"
            :key="item.icon"
            class="flex pb-6"
          >
            <div class="w-8 h-8 flex items-center flex-shrink-0">
              <img :src="require(`@/assets/img/${item.icon}`).default">
            </div>
            <div v-html="$t(`home.${item.path}`)" class="pl-4 pt-1" />
          </div>
        </div>
        <div class="w-full sm:w-1/2 sm:pl-4">
          <div
            v-for="item in features2"
            :key="item.icon"
            class="flex pb-6"
          >
            <div class="w-8 h-8 flex items-center flex-shrink-0">
              <img :src="require(`@/assets/img/${item.icon}`).default">
            </div>
            <div v-html="$t(`home.${item.path}`)" class="pl-4 pt-1" />
          </div>
        </div>
      </div>
      <div class="border border-gray-400 mt-18 mb-20 mx-2 sm:mx-18" />
      <div class="flex flex-wrap justify-center pb-10 sm:px-6">
        <div
          v-for="item in techStack"
          :key="item.name"
          class="pb-16 px-2 sm:px-12"
        >
          <img :src="require(`@/assets/img/${item.icon}`).default" :alt="item.name">
        </div>
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Btn from '../components/Base/Btn'
import Image from '../components/Base/Image'
import Footer from '../components/Footer.vue'
import LocalePicker from '../components/LocalePicker.vue'

export default {
  name: 'Home',
  components: {
    Btn,
    Image,
    Footer,
    LocalePicker,
  },
  // metaInfo: {
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
  computed: {
    subtitleItems () {
      return [this.$t('home.subtitle1'), this.$t('home.subtitle2'), this.$t('home.subtitle3')]
    },
    features1 () {
      return [
        {
          icon: 'language.svg',
          path: 'feat1',
        },
        {
          icon: 'bell.svg',
          path: 'feat3',
        },
        {
          icon: 'globe.svg',
          path: 'feat5',
        },
        {
          icon: 'cloud-alt.svg',
          path: 'feat7',
        },
      ]
    },
    features2 () {
      return [
        {
          icon: 'id-badge.svg',
          path: 'feat2',
        },
        {
          icon: 'file-pdf.svg',
          path: 'feat4',
        },
        {
          icon: 'chart-bar.svg',
          path: 'feat6',
        },
      ]
    },
    techStack () {
      return [
        {
          icon: 'logo-kubernetes.svg',
          name: 'kubernetes',
        },
        {
          icon: 'logo-docker.svg',
          name: 'docker',
        },
        {
          icon: 'logo-aws.svg',
          name: 'aws',
        },
        {
          icon: 'logo-vuejs.svg',
          name: 'vuejs',
        },
        {
          icon: 'logo-nodejs.svg',
          name: 'nodejs',
        },
        {
          icon: 'logo-aws-ec2.svg',
          name: 'ec2',
        },
        {
          icon: 'logo-graphql.svg',
          name: 'graphql',
        },
        {
          icon: 'logo-aws-cognito.svg',
          name: 'cognito',
        },
        {
          icon: 'logo-mongodb.svg',
          name: 'mongodb',
        },
        {
          icon: 'logo-aws-s3.svg',
          name: 's3',
        },
      ]
    },
  },
}
</script>

<style scoped lang="postcss">
.banner-image-1 {
  height: 115%;
}
.banner-image-2 {
  height: 115%;
}
.banner {
  background: linear-gradient(155.21deg, #242424 26.85%, #1E1E1E 124.44%);
  filter: drop-shadow(10px 20px 20px rgba(0, 0, 0, 0.35));
  transform: translateZ(0);
  border-radius: 6px;
}
.home-main--top {
  padding-top: 4vh;
}
.home-main {
  width: 100%;
  border-radius: 12px;
  filter: drop-shadow(20px 50px 30px rgba(0, 0, 0, 0.35));
  transform: translateZ(0);
}
img.home-list {
  z-index: -1;
  width: 26%;
}
img.home-tabs {
  left: 0;
  bottom: 40%;
  width: 23%;
  filter: drop-shadow(0px -10px 15px rgba(0, 0, 0, 0.25)) drop-shadow(8px 40px 25px rgba(0, 0, 0, 0.35));
  transform: translateZ(0);
}
img.home-container {
  right: 0;
  bottom: 16%;
  width: 21.7%;
  filter: drop-shadow(0px -10px 15px rgba(0, 0, 0, 0.25)) drop-shadow(8px 40px 25px rgba(0, 0, 0, 0.35));
  transform: translateZ(0);
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
@screen xl {
  .banner-image-1 {
    width: 297px;
    height: 229px;
  }
  .banner-image-2 {
    width: 294px;
    height: 214px;
  }
}
</style>
