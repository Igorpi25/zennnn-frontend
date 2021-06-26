import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import {
  ziMenu,
  ziSettings,
  ziUsers,
  ziExit,
  ziZSign,
  ziMoonOutline,
} from '@zennnn/icons'
import { Icon, Switch } from '@zennnn/core'
import AppBar from 'shared/components/AppBar'
import ListItem from 'shared/components/ListItem'
import Sidebar from 'shared/components/Sidebar'
import Divider from 'shared/components/Divider'
import SidebarItem from 'shared/components/SidebarItem'
import LocalePicker from 'shared/components/LocalePicker'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { auth, useTheme } from '@/plugins'
import { isLoggedInVar } from '@/plugins/apollo'

import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'

export default defineComponent({
  name: 'App',

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const { isDark } = useTheme()
    const isSidebarActive = ref(false)
    const currentUser = ref()

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    watch(isLoggedIn, setCurrentuser)

    const zennnnHostname = (process.env.VUE_APP_HOSTNAME || '').replace(
      'admin.',
      ''
    )

    function toggleSidebar() {
      isSidebarActive.value = !isSidebarActive.value
    }

    function closeSidebar() {
      isSidebarActive.value = false
    }

    function toggleTheme() {
      isDark.value = !isDark.value
    }

    async function setCurrentuser(val: boolean) {
      if (val) {
        const user = await auth.currentUserPoolUser()
        currentUser.value = {
          username: user.username,
          picture: user.picture,
          role: user.role,
        }
      } else {
        currentUser.value = undefined
      }
    }

    async function logout() {
      await auth.signOut()
      resolveClient().resetStore()
      closeSidebar()
      await router.replace({ name: 'Login' })
    }

    return () => (
      <div class="flex-grow flex flex-col items-center">
        <AppBar>
          {isLoggedIn.value && (
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
              />

              <div class="h-5 mx-3 border-r border-light-gray-300 dark:border-gray-300" />

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
                <Icon class="mr-2">{ziMenu}</Icon>
                <ListItem
                  class="flex-row-reverse"
                  avatarSize={32}
                  avatarSrc={currentUser.value?.picture}
                  avatarClass="md:ml-2"
                  title={currentUser.value?.username}
                  subtitle={currentUser.value?.role}
                  initials={
                    currentUser.value &&
                    currentUser.value.username &&
                    currentUser.value.username.charAt(0).toUpperCase()
                  }
                  infoClass="text-right hidden md:flex"
                />
              </button>
            </div>
          )}
        </AppBar>
        {isLoggedIn.value && (
          <Sidebar v-model={isSidebarActive.value}>
            <SidebarItem
              v-slots={{
                end: () => <Icon>{ziSettings}</Icon>,
              }}
              class="group"
              onClick={closeSidebar}
            >
              <Icon class="flex-grow-0">{ziUsers}</Icon>
              <ListItem
                v-slots={{
                  title: () => (
                    <span class="group-hover:text-white">
                      {currentUser.value?.username}
                    </span>
                  ),
                  subtitle: () => (
                    <span class="group-hover:text-light-gray-400">
                      {currentUser.value?.role}
                    </span>
                  ),
                }}
                class="flex-grow"
                hideAvatar
              />
            </SidebarItem>

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
              <span>{t('header.goToZennnn')}</span>
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
                              ? require(`@zennnn/icons/flags/${icon}.svg`)
                                  .default
                              : undefined
                          }
                          alt={locale}
                        />
                      ),
                    }}
                    class={
                      active ? 'bg-light-gray-200 dark:bg-gray-500' : undefined
                    }
                    retainFocusOnClick={true}
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
              retainFocusOnClick={true}
              onClick={toggleTheme}
            >
              <span>{t('header.darkMode')}</span>
            </SidebarItem>
          </Sidebar>
        )}
        <router-view />
      </div>
    )
  },
})
