import { defineComponent, computed, Teleport } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ziChecked, ziArrowRight } from '@zennnn/icons'
import { Btn, Icon, Image } from '@zennnn/core'
import MainAppBar from '@/components/core/MainAppBar'
import Footer from '@/components/core/Footer'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const ogTitle = computed(() => t('app.title'))
    const ogDescription = computed(() => t('app.description'))
    const ogUrl = `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}`
    const ogImage = `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png`

    const subtitleItems = computed(() => [
      t('home.subtitle1'),
      t('home.subtitle2'),
      t('home.subtitle3'),
    ])

    const features1 = computed(() => [
      {
        icon: 'language',
        path: 'feat1',
      },
      {
        icon: 'bell',
        path: 'feat3',
      },
      {
        icon: 'globe',
        path: 'feat5',
      },
      {
        icon: 'cloud',
        path: 'feat7',
      },
    ])

    const features2 = computed(() => [
      {
        icon: 'id-badge',
        path: 'feat2',
      },
      {
        icon: 'file-pdf',
        path: 'feat4',
      },
      {
        icon: 'chart-bar',
        path: 'feat6',
      },
    ])

    const techStack = computed(() => [
      {
        icon: 'kubernetes',
        name: 'Kubernetes',
      },
      {
        icon: 'docker',
        name: 'Docker',
      },
      {
        icon: 'aws',
        name: 'AWS',
      },
      {
        icon: 'vuejs',
        name: 'Vue.js',
      },
      {
        icon: 'nodejs',
        name: 'Node.js',
      },
      {
        icon: 'aws-ec2',
        name: 'AWS EC2',
      },
      {
        icon: 'graphql',
        name: 'GraphQL',
      },
      {
        icon: 'aws-cognito',
        name: 'AWS Cognito',
      },
      {
        icon: 'mongodb',
        name: 'MongoDB',
      },
      {
        icon: 'aws-s3',
        name: 'AWS S3',
      },
    ])

    return () => (
      <>
        <Teleport to="head">
          <meta name="title" content={ogTitle.value} />
          <meta name="description" content={ogDescription.value} />
          <meta property="og:title" content={ogTitle.value} />
          <meta property="og:description" content={ogDescription.value} />
          <meta property="og:site_name" content="ZENNNN" />
          <meta property="og:url" content={ogUrl} />
          <meta property="og:image" content={ogImage} />
        </Teleport>
        <MainAppBar />

        <main class="container pt-[4vh] sm:pt-[8vh] flex-grow">
          <h1
            v-html={t('home.title')}
            class="text-4xl sm:text-56 dark:text-light-gray-400 text-center font-semibold leading-tight mb-10"
          />
          <div class="flex flex-wrap justify-center pb-12">
            {subtitleItems.value.map((item) => (
              <div class="w-auto flex items-center pl-2 sm:pr-6 sm:pl-6">
                <Icon
                  base={false}
                  class="text-xl sm:text-2xl text-blue-500 mr-2"
                >
                  {ziChecked}
                </Icon>
                <div class="text-sm sm:text-xl text-gray-200">{item}</div>
              </div>
            ))}
          </div>
          <div class="flex justify-center">
            <Btn to={{ name: 'signup' }} class="text-center leading-none">
              <div class="flex items-center px-2">
                <span>{t('home.cty')}</span>
                <Icon size="20" class="ml-2.5">
                  {ziArrowRight}
                </Icon>
              </div>
            </Btn>
          </div>
          <div class="relative pt-8 md:pt-16 mt-8 md:mt-0">
            <img
              width="296"
              src={require('@/assets/img/home/list.png').default}
              class="absolute top-0 right-0 z-[-1] w-[26%]"
            />
            <div class="px-4 sm:px-18">
              <Image
                aspect-ratio={1.6}
                src={require('@/assets/img/home/main.png').default}
                alt="image"
                lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABCcAAAQnAEmzTo0AAAB7klEQVQoz2VTy3LiQAzkP8D4ATZgsOdtDKTyI9n/v25VbolT0rZkJ0vtHlStmdG0Wu3xarfbcV3XnOc559stF0XB+/2ey7L8QamR/S3O83zL26VWc2Am+RxfK1yiEAL1fU/WWmqahtbrNWVZ9hSbf9YZbTbzHoTMMTecVqLgfLnw6XTSACFXVQVVe8XnkNpv5XXdLFFL0H6eclpVZcV2cOyi55hu7L3j4XpDfuUYE/I7x2HUtfeenXMcgufreOeEfanHPvkQpOm0qtEtPXBxHPh2f+WUEvBFL1zHkW+PV5COSg5rgBE1UWu0cdQ9knMlLAqMbC/c9R33xvEF4xtg3xtEz8Z6RFguJ5wZDecDlEWtscaSR11ZlSDEF2vghXh3OBwWPHKDXPyRtaCzVhV2XaeE0ljIZgGGDATAX4wMD40edPAnaHFI8CaIGgslSZUIkXhoF2JBCz+lRl6JeKuEu7og6wyejCcXEqGAQhwJI5GxTiOlAc/KkJgvaoRA0Lqg9fDxL2FdZfy4j/z29ks9NKIACkXZ7FWE2sUrnOkEISxe2v8VlmUhCxqGgU5tS3iLhPEVj4eDKsBohJFV1fcPINjrGkrFQ6MefspXfm/bdjoejx/n8/nzOdp2RhivCFLN0fwnl308tQ80mPB7/v4D4IppMMl/iWUAAAAASUVORK5CYII="
                class="w-full rounded-xl filter drop-shadow-2xl transform translate-z-0"
                cover
              />
            </div>
            <img
              width="264"
              src={require('@/assets/img/home/tabs.png').default}
              class="absolute left-0 bottom-[40%] w-[23%] sm:left-[38px] filter drop-shadow-2xl"
            />
            <img
              width="246"
              src={require('@/assets/img/home/container.png').default}
              class="absolute right-0 bottom-[16%] w-[21.7%] sm:right-6 filter drop-shadow-2xl"
            />
          </div>
          <div class="pt-20 pb-20 px-2 sm:px-18">
            <div
              v-html={t('home.info')}
              class="border-l-2 sm:border-l-4 border-blue-500 text-lg sm:text-xl leading-relaxed px-4 sm:px-10"
            />
          </div>
          <div class="flex flex-wrap leading-tight pt-8 pb-20 px-2 sm:px-18">
            <div class="w-full md:w-1/2 lg:pr-3.5 pb-12 lg:pb-0">
              <RouterLink to="/about/#video" class="group">
                <div class="relative">
                  <Image
                    aspect-ratio={2.5}
                    src={require('@/assets/img/home/banner-1.png').default}
                    class="bg-gradient-to-b from-gray-800 to-gray-900 filter drop-shadow-2xl transform translate-z-0 rounded-md"
                  />
                  <div class="absolute inset-0 flex">
                    <div class="flex flex-col w-1/2 pl-8 lg:pl-13 pt-6 md:pt-4 lg:pt-8 xl:pt-12">
                      <div
                        v-html={t('home.about')}
                        class="text-xl lg:text-28 text-white relative z-1"
                      />
                      <div class="h-full max-h-12 flex items-end mb-2">
                        <Icon
                          large
                          class="text-blue-500 transform group-hover:translate-x-2 transition-transform duration-150 ease-out"
                        >
                          {ziArrowRight}
                        </Icon>
                      </div>
                    </div>
                    <div class="w-1/2">
                      <img
                        src={require('@/assets/img/home/iphones.png').default}
                        class="bg-right-bottom absolute right-0 bottom-0 h-[115%] xl:w-[297px] xl:h-[229px]"
                      />
                    </div>
                  </div>
                </div>
              </RouterLink>
            </div>
            <div class="w-full md:w-1/2 lg:pl-3.5">
              <RouterLink to="/about#video" class="group">
                <div class="relative">
                  <Image
                    aspect-ratio={2.5}
                    src={require('@/assets/img/home/banner-2.png').default}
                    class="bg-gradient-to-b from-gray-800 to-gray-900 filter drop-shadow-2xl transform translate-z-0 rounded-md"
                  />
                  <div class="absolute inset-0 flex">
                    <div class="flex flex-col w-1/2 pl-8 lg:pl-13 pt-6 md:pt-4 lg:pt-8 xl:pt-12">
                      <div
                        v-html={t('home.video')}
                        class="text-xl lg:text-28 text-white relative z-1"
                      />
                      <div class="h-full max-h-12 flex items-end mb-2">
                        <Icon
                          large
                          class="text-blue-500 transform group-hover:translate-x-2 transition-transform duration-150 ease-out"
                        >
                          {ziArrowRight}
                        </Icon>
                      </div>
                    </div>
                    <div class="w-1/2">
                      <img
                        src={require('@/assets/img/home/imac.png').default}
                        class="bg-right-bottom absolute right-0 bottom-0 h-[115%] xl:w-[294px] xl:h-[214px]"
                      />
                    </div>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
          <div class="flex flex-wrap sm:text-lg leading-tight px-2 sm:px-18">
            <div class="w-full md:w-1/2 md:pr-4">
              {features1.value.map((item) => (
                <div class="flex pb-6">
                  <div class="w-8 h-8 flex items-center flex-shrink-0">
                    <img
                      src={
                        require(`@/assets/img/home/icons/${item.icon}.svg`)
                          .default
                      }
                    />
                  </div>
                  <div v-html={t(`home.${item.path}`)} class="pl-4 pt-1" />
                </div>
              ))}
            </div>
            <div class="w-full md:w-1/2 md:pl-4">
              {features2.value.map((item) => (
                <div class="flex pb-6">
                  <div class="w-8 h-8 flex items-center flex-shrink-0">
                    <img
                      src={
                        require(`@/assets/img/home/icons/${item.icon}.svg`)
                          .default
                      }
                    />
                  </div>
                  <div v-html={t(`home.${item.path}`)} class="pl-4 pt-1" />
                </div>
              ))}
            </div>
          </div>
          <div class="border border-gray-100 dark:border-gray-400 mt-18 mb-20 mx-2 sm:mx-18" />
          <div class="flex flex-wrap justify-center pb-10 sm:px-6">
            {techStack.value.map((item) => (
              <div class="pb-16 px-2 sm:px-12">
                <img
                  src={require(`@/assets/img/logos/${item.icon}.svg`).default}
                  alt={item.name}
                />
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </>
    )
  },
})
