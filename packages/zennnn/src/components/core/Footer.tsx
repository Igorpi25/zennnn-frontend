import { defineComponent, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery, useResult } from '@vue/apollo-composable'
import {
  ziFacebook,
  ziTelegram,
  ziInstagram,
  ziYoutube,
  ziVk,
  ziGithub,
} from '@zennnn/icons'
import { Icon } from '@zennnn/core'

import Logo from 'shared/components/Logo'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { isLoggedInVar } from '@/plugins/apollo'

import { GET_PROFILE } from '@/graphql/queries'

import Copyright from '@/components/core/Copyright'

export default defineComponent({
  setup() {
    const mailTo = process.env.VUE_APP_MAILTO
    const isLoggedIn = useReactiveVar(isLoggedInVar)
    const { t } = useI18n()

    const { result: result2 } = useQuery(GET_PROFILE)
    const getProfile = useResult(result2, null, () => ({
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-only',
    }))

    const hasSubscription = computed(() => getProfile.value)

    const aboutLinks = computed(() => [
      {
        text: t('footer.about'),
        to: { name: 'about', hash: '#video' },
      },
      {
        text: t('footer.faq'),
        href: '#',
      },
      {
        text: t('footer.stack'),
        href: '#',
      },
      {
        text: t('footer.terms'),
        to: '/agreement',
      },
      {
        text: t('footer.privacy'),
        to: '/policy',
      },
      {
        text: t('footer.modules'),
        href: '#',
      },
    ])

    const extLinks = computed(() => {
      const items = [
        {
          text: t('footer.tariffs'),
          to: { name: 'pricing' },
        },
        {
          text: t('footer.jobs'),
          href: '#',
        },
        {
          text: t('footer.coordinates'),
          href: '#',
        },
        // {
        //   text: 'https://status.miro.com',
        //   href: '#',
        // },
        {
          text: t('footer.blog'),
          href: '#',
        },
      ]
      return hasSubscription.value
        ? [
            ...items,
            {
              text: t('footer.subscriptionManagement'),
              to: { name: 'subscription' },
              href: '#',
            },
          ]
        : items
    })

    const socialLinks = computed(() => [
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
        text: `Youtube ${t('footer.training')}`,
        href: '#',
        icon: ziYoutube,
      },
      {
        text: t('footer.vk'),
        href: '#',
        icon: ziVk,
      },
      {
        text: 'Github',
        href: '#',
        icon: ziGithub,
      },
    ])

    return () => (
      <footer class="bg-gray-900 text-gray-100">
        <div class="bg-gray-800 bg-opacity-90">
          <div class="container flex flex-wrap py-8 sm:py-16">
            <div class="relative h-full w-full md:w-1/3 md:pl-6 pb-6 md:pb-0">
              <div class="absolute bottom-0 md:bottom-auto left-0 w-full md:w-px h-px md:h-full bg-gray-400" />
              {aboutLinks.value.map((item, i) => (
                <div
                  class={{
                    'px-4 sm:px-0': true,
                    'pb-5': i + 1 < aboutLinks.value.length,
                  }}
                >
                  {item.to ? (
                    <RouterLink
                      to={item.to}
                      class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
                    >
                      {item.text}
                    </RouterLink>
                  ) : (
                    <a
                      href={item.href}
                      class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
                    >
                      {item.text}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div class="relative h-full w-full md:w-1/3 md:pl-6 py-6 md:py-0">
              <div class="absolute bottom-0 md:bottom-auto left-0 w-full md:w-px h-px md:h-full bg-gray-400" />
              {extLinks.value.map((item, i) => (
                <div
                  class={{
                    'px-4 sm:px-0': true,
                    'pb-5': i + 1 < extLinks.value.length,
                  }}
                >
                  {item.to ? (
                    <RouterLink
                      to={item.to}
                      class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
                    >
                      {item.text}
                    </RouterLink>
                  ) : (
                    <a
                      href={item.href}
                      class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
                    >
                      {item.text}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div class="relative h-full w-full md:w-1/3 md:pl-6 pt-6 md:pt-0">
              <div class="hidden md:block absolute left-0 w-px h-full bg-gray-400" />
              {socialLinks.value.map((item) => (
                <div key={item.text} class="pb-5 px-4 sm:px-0">
                  <a
                    href={item.href}
                    class="group focus:outline-none focus:text-blue-400 hover:text-blue-400"
                  >
                    {item.text}
                    <Icon class="text-gray-200 group-hover:text-blue-400 group-focus:text-blue-400 float-right">
                      {item.icon}
                    </Icon>
                  </a>
                </div>
              ))}
              <div class="px-4 sm:px-0">
                <a
                  href={`mailto:${mailTo}`}
                  class="focus:outline-none focus:text-blue-400 hover:text-blue-400"
                >
                  {mailTo}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="container h-20 flex items-center">
          <div class="flex md:pl-6">
            <RouterLink
              to={{ name: 'home' }}
              class="focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible"
            >
              <Logo />
            </RouterLink>
            <div class="w-px h-6 bg-gray-400 ml-6" />
          </div>
          <div class="flex items-center pl-6">
            <Copyright
              hideUserAgreement
              class="text-gray-200 dark:text-gray-200"
            />
          </div>
        </div>
      </footer>
    )
  },
})
