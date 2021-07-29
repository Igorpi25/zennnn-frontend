import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import {
  ziMenu,
  ziSettings,
  ziUsers,
  ziExit,
  ziZSign,
  ziComment,
  ziMoonOutline,
  ziAddressCard,
  ziLanguages,
  ziRocket,
} from '@zennnn/icons'
import { Icon, Switch } from '@zennnn/core'
import AppBar from 'shared/components/AppBar'
import AccountListItem from 'shared/components/AccountListItem'
import Sidebar from 'shared/components/Sidebar'
import Divider from 'shared/components/Divider'
import Badge from 'shared/components/Badge'
import SidebarItem from 'shared/components/SidebarItem'
import LocalePicker from 'shared/components/LocalePicker'
import AccountPicker from '@/components/core/AccountPicker'
import SubscriptionLabel from '@/components/core/SubscriptionLabel'
import { useOrgs } from '@/composables/orgs'
import { useSubscription } from '@/composables/subscription'
import { auth, useTheme } from '@/plugins'

import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'

export default defineComponent({
  setup(props, { slots }) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const { isDark } = useTheme()
    const { currentOrg } = useOrgs()
    const { productName, status } = useSubscription()

    const isSidebarActive = ref(false)

    const zennnnHostname = process.env.VUE_APP_HOSTNAME

    function toggleSidebar() {
      isSidebarActive.value = !isSidebarActive.value
    }

    function closeSidebar() {
      isSidebarActive.value = false
    }

    function toggleTheme() {
      isDark.value = !isDark.value
    }

    async function logout() {
      await auth.signOut()
      resolveClient().resetStore()
      closeSidebar()
      await router.replace({ name: 'signin' })
    }

    return () => (
      <>
        <AppBar
          altMode
          v-slots={{
            start: () => slots.start?.(),
          }}
        >
          <div class="flex items-center">
            <LocalePicker
              v-slots={{
                activator: ({
                  active,
                  icon,
                  locale,
                }: LocaleActivatorSlotProps) => (
                  <button
                    class={{
                      'h-14 flex items-center cursor-pointer px-3': true,
                      'hover:bg-light-gray-400 dark:hover:bg-gray-200': true,
                      'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible':
                        true,
                      'bg-light-gray-200 dark:bg-gray-500': active,
                    }}
                  >
                    <img
                      src={
                        icon
                          ? require(`@zennnn/icons/flags/${icon}.svg`).default
                          : undefined
                      }
                      alt={locale}
                    />
                  </button>
                ),
              }}
              class="flex-shrink-0"
            />

            <div class="h-5 mx-3 border-r border-light-gray-300 dark:border-gray-300" />

            <button
              class={{
                'h-14 flex items-center pl-3 pr-2 -mr-2': true,
                'hover:bg-light-gray-400 dark:hover:bg-gray-200': true,
                'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible':
                  true,
              }}
              onClick={toggleSidebar}
              onKeydown={(e: KeyboardEvent) => {
                if (
                  e.key === 'Enter' ||
                  e.key === ' ' ||
                  e.key === 'Spacebar'
                ) {
                  toggleSidebar()
                }
              }}
            >
              <Icon class="mr-2">{ziMenu}</Icon>
              <AccountListItem
                class="flex-row-reverse"
                avatarSize={32}
                avatarSrc={currentOrg.value?.picture}
                avatarClass="text-lg md:ml-2"
                title={currentOrg.value?.name}
                subtitle={
                  currentOrg.value?.role
                    ? t(`header.role.${currentOrg.value.role}`)
                    : undefined
                }
                initials={currentOrg.value?.name?.charAt(0).toUpperCase()}
                infoClass="text-right hidden md:flex max-w-[180px]"
              />
            </button>
          </div>
        </AppBar>

        <Sidebar v-model={isSidebarActive.value} altMode>
          <AccountPicker
            v-slots={{
              activator: () => (
                <SidebarItem
                  v-slots={{
                    end: () => <Icon>{ziSettings}</Icon>,
                  }}
                  class="group"
                >
                  <Icon class="flex-grow-0">{ziUsers}</Icon>
                  <AccountListItem
                    v-slots={{
                      title: () => (
                        <div class="group-hover:text-white truncate">
                          {currentOrg.value?.name}
                        </div>
                      ),
                      subtitle: () => (
                        <div class="group-hover:text-light-gray-400">
                          {currentOrg.value?.role
                            ? t(`header.role.${currentOrg.value.role}`)
                            : undefined}
                        </div>
                      ),
                    }}
                    class="flex-grow"
                    hideAvatar
                  />
                </SidebarItem>
              ),
            }}
          />

          <Divider class="m-6" />

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziZSign}</Icon>,
            }}
            href={zennnnHostname}
            onClick={closeSidebar}
            {...{
              target: '_blank',
            }}
          >
            <span>Go to ZENNNN</span>
          </SidebarItem>

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziAddressCard}</Icon>,
            }}
            to={{ name: 'companies', params: { orgId: route.params.orgId } }}
          >
            {/* TODO: add to locales */}
            <div>My Companies</div>
          </SidebarItem>

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziComment}</Icon>,
              end: () => <Badge>3</Badge>,
            }}
          >
            {/* TODO: add to locales */}
            <div>Messages</div>
          </SidebarItem>

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziLanguages}</Icon>,
            }}
            to={{ name: 'dictionary', params: { orgId: route.params.orgId } }}
          >
            {/* TODO: add to locales */}
            <div>Dictionary</div>
          </SidebarItem>

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziRocket}</Icon>,
              end: () => (
                <SubscriptionLabel status={status.value}>
                  {productName.value}
                </SubscriptionLabel>
              ),
            }}
            to={{ name: 'subscription' }}
          >
            {/* TODO: add to locales */}
            <div>Subscription</div>
          </SidebarItem>

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziExit}</Icon>,
            }}
            onClick={logout}
          >
            <span>{t('header.signout')}</span>
          </SidebarItem>

          <Divider class="m-6" />

          <LocalePicker
            v-slots={{
              activator: ({
                active,
                text,
                icon,
                locale,
              }: LocaleActivatorSlotProps) => (
                <SidebarItem
                  v-slots={{
                    start: () => (
                      <img
                        src={
                          icon
                            ? require(`@zennnn/icons/flags/${icon}.svg`).default
                            : undefined
                        }
                        alt={locale}
                      />
                    ),
                  }}
                  class={active ? 'bg-white dark:bg-gray-600' : undefined}
                  retainFocusOnClick
                >
                  <span>{text}</span>
                </SidebarItem>
              ),
            }}
            placementStart
            distance={8}
            skidding={8}
          />

          <SidebarItem
            v-slots={{
              start: () => <Icon>{ziMoonOutline}</Icon>,
              end: () => (
                <Switch
                  tabindex="-1"
                  modelValue={isDark.value}
                  {...{
                    onClick: (e: MouseEvent) => {
                      e.preventDefault()
                    },
                  }}
                />
              ),
            }}
            retainFocusOnClick
            onClick={toggleTheme}
          >
            <span>Dark Mode</span>
          </SidebarItem>
        </Sidebar>
      </>
    )
  },
})
