import { defineComponent, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOrgs } from '@/composables/orgs'

import type { RouteLocationNormalized } from 'vue-router'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const route = useRoute()

    const { isOwner, isManager } = useOrgs()

    const navItems = computed(() => {
      const isOwnerOrManager = isOwner.value || isManager.value
      return [
        {
          name: 'deals',
          text: t('navbar.deals'),
        },
        {
          name: 'clients',
          text: t('navbar.clients'),
          disabled: !isOwnerOrManager,
        },
        {
          name: 'suppliers',
          text: t('navbar.suppliers'),
          disabled: !isOwnerOrManager,
        },
        {
          name: 'staff',
          text: t('navbar.staff'),
          disabled: !isOwner,
        },
        {
          name: 'items',
          text: t('navbar.goods'),
        },
      ]
    })

    return () => (
      <nav class="relative">
        <div class="absolute bottom-0 inset-x-0 border-b border-light-gray-300 dark:border-gray-500" />
        <div class="container text-gray-200">
          <div class="overflow-x-auto scrolling-touch flex h-16 space-x-6 -mx-2">
            {navItems.value.map((item) =>
              item.disabled ? (
                <div class="text-gray-100 dark:text-gray-400 cursor-not-allowed opacity-50 text-xl leading-6 flex items-center px-2">
                  {item.text}
                </div>
              ) : (
                <RouterLink
                  v-slots={{
                    default: (props: { route: RouteLocationNormalized }) => (
                      <span
                        class={[
                          'border-b-2 border-transparent whitespace-nowrap h-full flex items-center',
                          {
                            'text-gray-900 dark:text-white border-blue-500 relative':
                              props.route.name === 'deals'
                                ? route.name === 'deals' ||
                                  route.name === 'spec'
                                : route.path.startsWith(props.route.path),
                          },
                        ]}
                      >
                        {item.text}
                      </span>
                    ),
                  }}
                  key={item.name}
                  to={{
                    name: item.name,
                    params: { orgId: route.params.orgId },
                  }}
                  class="text-xl leading-6 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible duration-100 transition-color ease-out px-2"
                ></RouterLink>
              )
            )}
          </div>
        </div>
      </nav>
    )
  },
})
