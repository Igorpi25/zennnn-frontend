import { defineComponent, computed, Teleport } from 'vue'
import { useI18n } from 'vue-i18n'

import { ziInfinity, ziRocket } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

import { useReactiveVar } from 'shared/composables/reactiveVar'
import MainAppBar from '@/components/core/MainAppBar'
import Footer from '@/components/core/Footer'
import List from '@/components/price/List'
import { useProfile } from '@/composables/profile'
import { isLoggedInVar } from '@/plugins/apollo'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const ogTitle = computed(() => t('app.title'))
    const ogDescription = computed(() => t('app.description'))
    const ogUrl = `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}`
    const ogImage = `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png`

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const { profile } = useProfile()

    const orgId = computed(() => profile.value?.account?.org)

    const hasSubscription = computed(
      () => profile.value?.account?.subscriptionId
    )

    const specs = computed(() => [
      {
        text: t('pricing.spec1'),
        start: t('pricing.upTo'),
        standard: '4+',
        advanced: '11+',
        premium: '25+',
      },
      {
        text: t('pricing.spec2'),
        start: '50',
        standard: '100',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec3'),
        start: '500',
        standard: '1000',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec4'),
        start: '1000',
        standard: '2000',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec5'),
        start: '250',
        standard: '500',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec6'),
        start: '5',
        standard: '10',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec7'),
        start: '5',
        standard: '10',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec8'),
        start: 'infinite',
        standard: 'infinite',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec9'),
        start: 'infinite',
        standard: 'infinite',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec10'),
        start: 'infinite',
        standard: 'infinite',
        advanced: 'infinite',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec11'),
        start: '5Gb',
        standard: '10Gb',
        advanced: '50Gb',
        premium: 'infinite',
      },
      {
        text: t('pricing.spec12'),
        start: 'na',
        standard: 'na',
        advanced: 'infinite',
        premium: 'infinite',
      },
    ])

    const functions = computed(() => [
      {
        icon: 'paper-plane',
        title: t('pricing.func1'),
        subtitle: '',
      },
      {
        icon: 'id-badge',
        title: t('pricing.func2'),
        subtitle: t('pricing.func2desc'),
      },
      {
        icon: 'cog',
        title: t('pricing.func3'),
        subtitle: t('pricing.func3desc'),
      },
      {
        icon: 'check-circle',
        title: t('pricing.func4'),
        subtitle: t('pricing.func4desc'),
      },
      {
        icon: 'address-card',
        title: t('pricing.func5'),
        subtitle: '',
      },
      {
        icon: 'th-list',
        title: t('pricing.func6'),
        subtitle: '',
      },
      {
        icon: 'share-square',
        title: t('pricing.func7'),
        subtitle: '',
      },
      {
        icon: 'share',
        title: t('pricing.func8'),
        subtitle: '',
      },
      {
        icon: 'calendar-alt',
        title: t('pricing.func9'),
        subtitle: '',
      },
      {
        icon: 'cubes',
        title: t('pricing.func10'),
        subtitle: t('pricing.func10desc'),
      },
      {
        icon: 'qrcode',
        title: t('pricing.func11'),
        subtitle: '',
      },
      {
        icon: 'comments',
        title: t('pricing.func12'),
        subtitle: t('pricing.func12desc'),
      },
      {
        icon: 'calculator',
        title: t('pricing.func13'),
        subtitle: t('pricing.func13desc'),
      },
      {
        icon: 'file-pdf',
        title: t('pricing.func14'),
        subtitle: '',
      },
      {
        icon: 'tasks',
        title: t('pricing.func15'),
        subtitle: '',
      },
      {
        icon: 'chart-area',
        title: t('pricing.func16'),
        subtitle: '',
      },
      {
        icon: 'chart-bar',
        title: t('pricing.func17'),
        subtitle: '',
      },
      {
        icon: 'user-md',
        title: t('pricing.func18'),
        subtitle: '',
      },
      {
        icon: 'users',
        title: t('pricing.func19'),
        subtitle: '',
      },
      {
        icon: 'cloud',
        title: t('pricing.func20'),
        subtitle: '',
      },
      {
        icon: 'lock',
        title: t('pricing.func21'),
        subtitle: '',
      },
      {
        icon: 'language',
        title: t('pricing.func22'),
        subtitle: t('pricing.func22desc'),
      },
      {
        icon: 'archive',
        title: t('pricing.func23'),
        subtitle: '',
      },
      {
        icon: 'gem',
        title: t('pricing.more'),
        subtitle: '',
      },
      {
        icon: 'arrow-right',
        title: t('pricing.next'),
        subtitle: '',
      },
      {
        icon: 'th',
        title: t('pricing.func24'),
        subtitle: '',
      },
      {
        icon: 'dollar-sign',
        title: t('pricing.func25'),
        subtitle: '',
      },
      {
        icon: 'file-excel',
        title: t('pricing.func26'),
        subtitle: '',
      },
      {
        icon: 'amazon',
        title: t('pricing.func27'),
        subtitle: '',
      },
      {
        icon: 'puzzle-piece',
        title: t('pricing.func28'),
        subtitle: '',
      },
    ])

    const faqs = computed(() => [
      {
        title: t('pricing.q1'),
        text: t('pricing.a1'),
      },
      {
        title: t('pricing.q2'),
        text: t('pricing.a2'),
      },
      {
        title: t('pricing.q3'),
        text: t('pricing.a3'),
      },
      {
        title: t('pricing.q4'),
        text: t('pricing.a4'),
      },
      {
        title: t('pricing.q5'),
        text: t('pricing.a5'),
      },
      {
        title: t('pricing.q6'),
        text: t('pricing.a6'),
      },
      {
        title: t('pricing.q7'),
        text: t('pricing.a7'),
      },
      {
        title: t('pricing.q8'),
        text: t('pricing.a8'),
      },
      {
        title: t('pricing.q9'),
        text: t('pricing.a9'),
      },
      {
        title: t('pricing.q10'),
        text: t('pricing.a10'),
      },
      {
        title: t('pricing.q11'),
        text: t('pricing.a11'),
      },
      {
        title: t('pricing.q12'),
        text: t('pricing.a12'),
      },
      {
        title: t('pricing.q13'),
        text: t('pricing.a13'),
      },
      {
        title: t('pricing.q14'),
        text: t('pricing.a14'),
      },
      {
        title: t('pricing.q15'),
        text: t('pricing.a15'),
      },
      {
        title: t('pricing.q16'),
        text: t('pricing.a16'),
      },
      {
        title: t('pricing.q17'),
        text: t('pricing.a17'),
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

        <main class="flex-grow bg-light-gray-100 dark:bg-gray-700 dark:text-white">
          <div class="container pt-16">
            <div class="flex flex-wrap justify-between">
              <h1 class="text-40 font-bold leading-tight mb-6">
                {t('pricing.title')}
              </h1>
              {hasSubscription.value && (
                <Btn text to={{ name: 'subscription' }}>
                  <span>{t('footer.subscriptionManagement')}</span>
                  <Icon right>{ziRocket}</Icon>
                </Btn>
              )}
            </div>
            {!isLoggedIn.value && (
              <div class="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 mb-12">
                <div class="text-lg text-black dark:text-white leading-snug pl-2 pb-4 sm:pb-0">
                  <span
                    v-html={t('pricing.oneUsdTitle')}
                    class="font-bold mr-1"
                  />
                  <span>{t('pricing.oneUsdSubtitle')}</span>
                </div>
                <Btn to={{ name: 'signup' }} class="flex-shrink-0 ml-4">
                  {t('signup.submit')}
                </Btn>
              </div>
            )}
            <div class="pb-20">
              <List orgId={orgId.value || undefined} />
            </div>
            <div class="pb-20">
              <h2 class="font-semibold text-32 leading-tight pb-10">
                {t('pricing.specsTitle')}
              </h2>
              <div class="overflow-x-auto scrolling-touch">
                <table class="w-full leading-tight text-center">
                  <thead>
                    <tr class="h-16 text-xl text-gray-100">
                      <td class="whitespace-nowrap text-left px-8">
                        {t('pricing.specCount')}
                      </td>
                      <td class="px-6">{t('pricing.start')}</td>
                      <td class="px-6">{t('pricing.standard')}</td>
                      <td class="text-gray-900 dark:text-white px-6">
                        {t('pricing.advanced')}
                      </td>
                      <td class="px-6">{t('pricing.premium')}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.value.map((item) => (
                      <tr class="h-16 even:bg-white dark:even:bg-gray-800">
                        <td
                          class="whitespace-nowrap text-left rounded-l-md px-8"
                          v-html={item.text}
                        />
                        <td class="text-gray-200 px-6">
                          {item.start === 'infinite' ? (
                            <Icon large class="text-green-500 mx-auto">
                              {ziInfinity}
                            </Icon>
                          ) : item.start === 'na' ? (
                            <span>&mdash;</span>
                          ) : (
                            <span>{item.start}</span>
                          )}
                        </td>
                        <td class="text-gray-200 px-6">
                          {item.standard === 'infinite' ? (
                            <Icon large class="text-green-500 mx-auto">
                              {ziInfinity}
                            </Icon>
                          ) : item.standard === 'na' ? (
                            <span>&mdash;</span>
                          ) : (
                            <span>{item.standard}</span>
                          )}
                        </td>
                        <td class="text-gray-900 dark:text-white font-semibold px-6">
                          {item.advanced === 'infinite' ? (
                            <Icon large class="text-green-500 mx-auto">
                              {ziInfinity}
                            </Icon>
                          ) : (
                            <span>{item.advanced}</span>
                          )}
                        </td>
                        <td class="rounded-r-md text-gray-200 px-6">
                          {item.premium === 'infinite' ? (
                            <Icon large class="text-green-500 mx-auto">
                              {ziInfinity}
                            </Icon>
                          ) : (
                            <span>{item.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 class="font-semibold text-32 leading-tight pb-10">
                {t('pricing.funcTitle')}
              </h2>
              <div class="flex flex-wrap -mx-3">
                {functions.value.map((item) => (
                  <div class="text-center w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 pb-20 px-3">
                    <div class="w-12 h-12 flex items-center justify-center mx-auto">
                      <img
                        src={
                          require(`@/assets/img/icons/solid/${item.icon}.svg`)
                            .default
                        }
                      />
                    </div>
                    <div class="leading-tight pt-4">
                      <div v-html={item.title} />
                      {item.subtitle && (
                        <div class="text-gray-200" v-html={item.subtitle} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div class="pb-4">
              <h2 class="font-semibold text-32 leading-tight pb-10">
                {t('pricing.faqTitle')}
              </h2>
              <ul class="md:list-cols-2 lg:list-cols-3">
                {faqs.value.map((item) => (
                  <li class="break-inside-avoid">
                    <div class="pb-16">
                      <span
                        class="text-2xl leading-tight pb-4"
                        v-html={item.title}
                      />
                      <br />
                      <br />
                      <p v-html={item.text} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  },
})
