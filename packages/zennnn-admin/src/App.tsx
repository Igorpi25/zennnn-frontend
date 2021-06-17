import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import { ziMenu, ziSettings, ziUsers, ziExit, ziZSign } from '@zennnn/icons'
import { Icon, Switch } from '@zennnn/core'
import Navbar from 'shared/components/Navbar'
import ListItem from 'shared/components/ListItem'
import Sidebar from 'shared/components/Sidebar'
import Divider from 'shared/components/Divider'
import SidebarItem from 'shared/components/SidebarItem'
import { isLoggedIn, auth, useTheme } from '@/plugins'

export default defineComponent({
  name: 'App',

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const { isDark } = useTheme()
    const isSidebarActive = ref(false)
    const currentUser = ref()

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
      const client = resolveClient()
      client.resetStore()
      await router.push({ name: 'Login' })
    }

    return () => (
      <div class="flex-grow flex flex-col items-center">
        <Navbar>
          {isLoggedIn.value && (
            <div class="flex items-center">
              <div
                class={{
                  'h-14 flex items-center cursor-pointer pl-2': true,
                  'hover:bg-light-gray-400 dark:hover:bg-gray-200': true,
                  'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible':
                    true,
                }}
                role="button"
                tabindex="0"
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
              </div>
            </div>
          )}
        </Navbar>
        {isLoggedIn.value && (
          <Sidebar v-model={isSidebarActive.value}>
            <SidebarItem
              v-slots={{
                end: () => <Icon>{ziSettings}</Icon>,
              }}
              onClick={closeSidebar}
            >
              <Icon class="flex-grow-0">{ziUsers}</Icon>
              <ListItem
                class="flex-grow"
                hideAvatar
                title={currentUser.value?.username}
                subtitle={currentUser.value?.role}
              />
            </SidebarItem>

            <Divider class="m-6" />

            <SidebarItem
              v-slots={{
                start: () => <Icon>{ziZSign}</Icon>,
              }}
              extLink={zennnnHostname}
              onClick={closeSidebar}
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

            <SidebarItem
              v-slots={{
                start: () => <img class="w-6 h-6" />,
              }}
            >
              <span>English</span>
            </SidebarItem>
            {/* TODO: can't control stroke on svg tag, need set class to svg in Icon from attrs or prop, outline icons has 1.6 stroke, check all other icons, mb need convert to path */}
            <SidebarItem
              v-slots={{
                start: () => (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="dark:fill-current"
                  >
                    <path
                      d="M13.0625 22C16.147 22 18.964 20.5967 20.8304 18.2972C21.1064 17.957 20.8054 17.4601 20.3787 17.5413C15.527 18.4653 11.0716 14.7454 11.0716 9.84781C11.0716 7.02664 12.5818 4.43238 15.0364 3.03555C15.4147 2.82023 15.3196 2.2466 14.8896 2.16719C14.2869 2.05605 13.6754 2.00009 13.0625 2C7.54262 2 3.0625 6.47309 3.0625 12C3.0625 17.5199 7.53559 22 13.0625 22Z"
                      stroke="currentColor"
                      stroke-width="1.6"
                      class="dark:stroke-0"
                    />
                  </svg>
                ),
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
