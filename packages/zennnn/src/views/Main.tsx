import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useResult, useApolloClient } from '@vue/apollo-composable'
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
import Navbar from 'shared/components/Navbar'
import Sidebar from 'shared/components/Sidebar'
import SidebarItem from 'shared/components/SidebarItem'
import Divider from 'shared/components/Divider'
import ListItem from 'shared/components/ListItem'
import LocalePicker from 'shared/components/LocalePicker'
import Badge from 'shared/components/Badge'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import Search from '@/components/item/Search'
import Card, { CardItem, LabelTypes } from '@/components/item/Card'
import AccountPicker from '@/components/core/AccountPicker'
import SubscriptionLabel from '@/components/core/SubscriptionLabel'
import { GET_PROFILE } from '@/graphql/queries'
import { auth, useDisplay, useTheme } from '@/plugins'
import { isLoggedInVar } from '@/plugins/apollo'

import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'
import type { GetProfile } from '@/graphql/types'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { resolveClient } = useApolloClient()
    const isLoggedIn = useReactiveVar(isLoggedInVar)
    const { isDark } = useTheme()
    const isSidebarActive = ref(false)
    const isPictureOnly = ref(false)
    const isSearchActive = ref(false)

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

    const items = Array.from(Array(12).keys()).map((key) => {
      const i = key + 1
      return {
        name: `T-Shirt Man Seven Collection - ${i}`,
        article: '', // model
        rate: {
          percent: 97,
          count: 1,
        },
        picture: 'https://via.placeholder.com/265x279',
        labels: [LabelTypes.New, [LabelTypes.Colors, { count: 2 }]],
        price: 111.11,
        owner: {
          picture: 'https://via.placeholder.com/24x24',
          fullName: 'FOG',
          isVerified: true,
        },
      } as CardItem
    })

    const { mobile } = useDisplay()

    const { result: getProfileResult } = useQuery<GetProfile>(
      GET_PROFILE,
      null,
      () => ({
        enabled: isLoggedIn.value,
        fetchPolicy: 'cache-only',
      })
    )
    const profile = useResult(getProfileResult)

    const fullName = computed(() => {
      return [profile.value?.familyName, profile.value?.givenName]
        .filter((e) => !!e)
        .join(' ')
    })

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
      await router.replace({ name: 'signin' })
    }

    return () => (
      <>
        <Navbar
          v-slots={{
            start: () => (
              <nav class="hidden lg:flex space-x-12">
                {navItems.value.map((item) => (
                  <Btn
                    text
                    to={item.to}
                    class="text-gray-900 dark:text-white h-auto px-0"
                  >
                    {item.text}
                  </Btn>
                ))}
              </nav>
            ),
          }}
          altMode
        >
          <div class="flex space-x-2">
            <Btn
              icon
              class="sm:hidden bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: toggleSearch,
              }}
            >
              <Icon>{ziSearch}</Icon>
            </Btn>

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
                      'bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white':
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
              class="hidden sm:flex"
            />

            {isLoggedIn.value ? (
              <button
                class={{
                  'h-14 flex items-center cursor-pointer pl-3 pr-2 -mr-2': true,
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
                <ListItem
                  class="flex-row-reverse"
                  avatarSize={48}
                  avatarSrc={profile.value?.picture || undefined}
                  avatarClass="md:ml-2"
                  title={fullName.value}
                  subtitle={profile.value?.email}
                  initials={
                    fullName.value && fullName.value.charAt(0).toUpperCase()
                  }
                  infoClass="text-right hidden md:flex"
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
        </Navbar>

        <Sidebar v-model={isSidebarActive.value} altMode>
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
                      <ListItem
                        v-slots={{
                          title: () => (
                            <span class="group-hover:text-white">
                              {fullName.value}
                            </span>
                          ),
                          subtitle: () => (
                            <span class="group-hover:text-light-gray-400">
                              {profile.value?.email}
                            </span>
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
                    <SubscriptionLabel status="paid">
                      Advanced
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

        <div class="container px-0 xs:px-4 sm:px-6 pb-40 md:pb-32">
          <Search v-model={[isSearchActive.value, 'visible']} />
          <div class="grid gap-1 sm:gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <Card
                item={item}
                pictureOnly={isPictureOnly.value}
                isMobile={mobile.value}
              />
            ))}
          </div>
        </div>
      </>
    )
  },
})
