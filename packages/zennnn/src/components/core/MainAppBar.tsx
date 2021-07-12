import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import { useModel } from 'vue-supp'
import {
  ziSearch,
  ziMenu,
  ziUser,
  ziSettings,
  ziUsers,
  ziZSign,
  ziExit,
  ziMoon,
  ziMoonOutline,
  ziThLargeOutlines,
  ziComment,
  ziStarOutlineLg,
  ziRocket,
} from '@zennnn/icons'
import { Btn, Icon, Switch } from '@zennnn/core'
import AppBar from 'shared/components/AppBar'
import Sidebar from 'shared/components/Sidebar'
import SidebarItem from 'shared/components/SidebarItem'
import Divider from 'shared/components/Divider'
import AccountListItem from 'shared/components/AccountListItem'
import LocalePicker from 'shared/components/LocalePicker'
import Badge from 'shared/components/Badge'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import AccountPicker from '@/components/core/AccountPicker'
import SubscriptionLabel from '@/components/core/SubscriptionLabel'
import { useOrgs } from '@/composables/orgs'
import { useSubscription } from '@/composables/subscription'
import { auth, useTheme } from '@/plugins'
import { isLoggedInVar } from '@/plugins/apollo'

import type { PropType } from 'vue'
import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'

export default defineComponent({
  props: {
    orgId: String as PropType<string | null>,
    hasPictureOnly: Boolean,
    pictureOnly: Boolean,
    hasSearch: Boolean,
    searchActive: Boolean,
  },

  emits: ['logout', 'update:pictureOnly', 'update:searchActive'],

  setup(props, { slots, attrs, emit }) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const { isDark } = useTheme()
    const isLoggedIn = useReactiveVar(isLoggedInVar)
    const isSidebarActive = ref(false)
    const isPictureOnly = useModel(props, 'pictureOnly')
    const isSearchActive = useModel(props, 'searchActive')

    const { currentOrg } = useOrgs(props)
    const { productName, status } = useSubscription()

    const zennnnHostname = process.env.VUE_APP_HOSTNAME || ''

    {
      /* TODO: add to locales */
    }
    const navItems = computed(() => [
      {
        text: 'About',
        to: '/about',
      },
      {
        text: 'Pricing',
        to: '/pricing',
      },
      {
        text: 'Developers',
      },
      {
        text: 'Support',
      },
    ])

    function toggleTheme() {
      isDark.value = !isDark.value
    }

    function toggleSidebar() {
      isSidebarActive.value = !isSidebarActive.value
    }

    function closeSidebar() {
      isSidebarActive.value = false
    }

    function togglePictureOnly() {
      isPictureOnly.value = !isPictureOnly.value
    }

    function toggleSearch() {
      isSearchActive.value = !isSearchActive.value
    }

    async function logout() {
      await auth.signOut()
      resolveClient().resetStore()
      closeSidebar()
      emit('logout')
      if (route.meta.requiresAuth) {
        await router.replace({ name: 'signin' })
      }
    }

    return () => (
      <>
        <AppBar
          v-slots={{
            start: () =>
              slots.nav ? (
                slots.nav()
              ) : (
                <nav class="hidden lg:flex space-x-4 pl-4">
                  {navItems.value.map((item) => (
                    <Btn
                      link
                      to={item.to}
                      class="text-gray-900 dark:text-white px-4"
                    >
                      {item.text}
                    </Btn>
                  ))}
                </nav>
              ),
          }}
          {...attrs}
        >
          <div class="flex items-center space-x-2">
            {props.hasSearch && (
              <Btn
                icon
                class="sm:hidden bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
                {...{
                  onClick: toggleSearch,
                }}
              >
                <Icon>{ziSearch}</Icon>
              </Btn>
            )}

            {props.hasPictureOnly && (
              <Btn
                icon
                retainFocusOnClick
                class="hidden xs:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
                {...{
                  onClick: togglePictureOnly,
                }}
              >
                <Icon>{ziThLargeOutlines}</Icon>
              </Btn>
            )}

            <Btn
              icon
              retainFocusOnClick
              class="hidden md:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: toggleTheme,
              }}
            >
              <Icon>{isDark.value ? ziMoon : ziMoonOutline}</Icon>
            </Btn>

            <LocalePicker
              v-slots={{
                activator: ({
                  active,
                  icon,
                  locale,
                }: LocaleActivatorSlotProps) => (
                  <Btn
                    icon
                    class={{
                      'w-12 bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white':
                        true,
                      'bg-blue-550 dark:bg-blue-550': active,
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
                  </Btn>
                ),
              }}
              class="hidden sm:flex flex-shrink-0"
            />

            {isLoggedIn.value ? (
              <button
                class={{
                  'h-12 flex items-center': true,
                  'rounded-full md:rounded-none': true,
                  'focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible':
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
                <AccountListItem
                  class="flex-row-reverse"
                  avatarSize={48}
                  avatarSrc={currentOrg.value?.picture}
                  avatarClass="md:ml-2"
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
            ) : (
              <>
                <Btn
                  minWidth="none"
                  class="w-12 sm:w-auto bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white sm:px-3"
                  to="/signin"
                >
                  <Icon class="sm:hidden">{ziUser}</Icon>
                  {/* TODO: add to locales */}
                  <span class="hidden sm:flex">Sign in</span>
                </Btn>
                <Btn
                  minWidth="none"
                  class="hidden md:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white px-3"
                  to="/signup"
                >
                  {/* TODO: add to locales */}
                  Sign up
                </Btn>
              </>
            )}

            <Btn
              icon
              class="lg:hidden bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: toggleSidebar,
              }}
            >
              <Icon>{ziMenu}</Icon>
            </Btn>
          </div>
        </AppBar>

        <Sidebar v-model={isSidebarActive.value}>
          {isLoggedIn.value && (
            <>
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
                {/* TODO: add to locales */}
                <span>Go to Back office</span>
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
                  start: () => <Icon>{ziStarOutlineLg}</Icon>,
                }}
              >
                {/* TODO: add to locales */}
                <div>Favorites</div>
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
                {/* TODO: add to locales */}
                <span>Log out</span>
              </SidebarItem>

              <Divider class="lg:hidden m-6" />
            </>
          )}

          {navItems.value.map((item) => (
            <SidebarItem
              class={isLoggedIn.value ? 'lg:hidden pl-16' : 'pl-16'}
              to={item.to}
            >
              {item.text}
            </SidebarItem>
          ))}

          <Divider class="md:hidden m-6" />

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
                  class={
                    active
                      ? 'bg-blue-550 dark:bg-blue-550 text-white dark:text-white'
                      : undefined
                  }
                  retainFocusOnClick
                >
                  <span>{text}</span>
                </SidebarItem>
              ),
            }}
            class="md:hidden"
            placementStart
            distance={8}
            skidding={8}
          />

          {props.hasPictureOnly && (
            <SidebarItem
              v-slots={{
                start: () => <Icon>{ziThLargeOutlines}</Icon>,
                end: () => (
                  <Switch
                    tabindex="-1"
                    modelValue={isPictureOnly.value}
                    {...{
                      onClick: (e: MouseEvent) => {
                        e.preventDefault()
                      },
                    }}
                  />
                ),
              }}
              retainFocusOnClick
              class="md:hidden"
              onClick={togglePictureOnly}
            >
              {/* TODO: add to locales */}
              <div>Show Image Only</div>
            </SidebarItem>
          )}

          <SidebarItem
            v-slots={{
              start: () => <Icon>{isDark.value ? ziMoon : ziMoonOutline}</Icon>,
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
            class="md:hidden"
            onClick={toggleTheme}
          >
            {/* TODO: add to locales */}
            <span>Dark Mode</span>
          </SidebarItem>
        </Sidebar>
      </>
    )
  },
})
