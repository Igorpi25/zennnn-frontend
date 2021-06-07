import { defineComponent, ref, watch, PropType, Transition } from 'vue'
import { useRoute } from 'vue-router'
import { useModel, ClickOutside } from 'vue-supp'
import {
  ziCloseWindow,
  ziExit,
  ziSettings,
  ziUsers,
  ziComment,
  ziStarOutlineLg,
  ziRocket,
} from '@zennnn/icons'
import { Switch, Btn, Icon } from '@zennnn/core'
import SidebarItem from './SidebarItem'
import Divider from './Divider'
import Badge from './Badge'
import SubscriptionLabel from './SubscriptionLabel'
import AccountInfo from './AccountInfo'
import AccountPicker from './AccountPicker'
import { useTheme } from '@/composables/theme'
import { NavItems } from '@/types'

export default defineComponent({
  props: {
    auth: {
      type: Boolean,
      default: false,
    },
    sidebarActive: {
      type: Boolean,
      default: false,
    },
    pictureOnly: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: Boolean,
    navItems: {
      type: Array as PropType<NavItems>,
      default: () => [],
    },
  },

  directives: { ClickOutside },

  setup(props) {
    const route = useRoute()
    const { isDark } = useTheme()
    const isAuth = useModel(props, 'auth')
    const isSidebarActive = useModel(props, 'sidebarActive')
    const isPictureOnly = useModel(props, 'pictureOnly')
    const rootRef = ref<HTMLElement>()

    function closeSidebar() {
      isSidebarActive.value = false
    }

    watch(() => route.path, closeSidebar)

    return () => (
      <Transition
        enterActiveClass="transition ease-out duration-300"
        enterFromClass="transform translate-x-full"
        enterToClass="transform translate-x-0"
        leaveActiveClass="transition ease-in duration-300"
        leaveFromClass="transform translate-x-0"
        leaveToClass="transform translate-x-full"
      >
        <nav
          ref={rootRef}
          v-show={isSidebarActive.value}
          class="w-68 md:w-80 z-10 fixed inset-y-0 md:bottom-auto md:rounded-lg right-0 bg-white dark:bg-gray-650 shadow-main-day dark:shadow-main-night overflow-y-auto md:py-6"
          style={{ willChange: 'transform' }}
          v-click-outside={[
            {
              handler: closeSidebar,
              closeConditional: (e: Event) => {
                const target = e.target as Element
                const wrapper = rootRef.value as Element
                return (
                  isSidebarActive.value &&
                  !(wrapper && wrapper.contains(target))
                )
              },
            },
          ]}
        >
          <div class="flex justify-end md:hidden p-4">
            <Btn
              icon
              class="bg-light-gray-300 dark:bg-gray-900 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: closeSidebar,
              }}
            >
              <Icon>{ziCloseWindow}</Icon>
            </Btn>
          </div>
          <div>
            {isAuth.value && (
              <>
                <AccountPicker
                  v-slots={{
                    activator: () => (
                      <SidebarItem
                        v-slots={{
                          end: () => <Icon>{ziSettings}</Icon>,
                        }}
                        class="pl-4"
                        onClick={closeSidebar}
                      >
                        <AccountInfo
                          class="flex-grow"
                          avatarSize={32}
                          avatarSrc="https://via.placeholder.com/48x48"
                          avatarClass="mr-4"
                          title="Berlogga LLC."
                          subtitle="Director"
                        />
                      </SidebarItem>
                    ),
                  }}
                />
                <SidebarItem
                  v-slots={{
                    start: () => <Icon>{ziUsers}</Icon>,
                  }}
                >
                  <div>Go to Back office</div>
                </SidebarItem>
                <SidebarItem
                  v-slots={{
                    start: () => <Icon>{ziComment}</Icon>,
                    end: () => <Badge>3</Badge>,
                  }}
                >
                  <div>Messages</div>
                </SidebarItem>
                <SidebarItem
                  v-slots={{
                    start: () => <Icon>{ziStarOutlineLg}</Icon>,
                  }}
                >
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
                  <div>Subscription</div>
                </SidebarItem>
                <SidebarItem
                  v-slots={{
                    start: () => <Icon>{ziExit}</Icon>,
                  }}
                  onClick={() => {
                    isAuth.value = false
                    closeSidebar()
                  }}
                >
                  <div>Log out</div>
                </SidebarItem>

                <Divider class="lg:hidden m-6" />
              </>
            )}

            {props.navItems.map((item) => (
              <SidebarItem class="lg:hidden pl-16" to={item.to}>
                {item.text}
              </SidebarItem>
            ))}

            <Divider class="md:hidden m-6" />

            <SidebarItem
              v-slots={{
                start: () => (
                  <img
                    src={require('@/assets/img/flags/locale/en-US.svg').default}
                    alt="en-US"
                    class="w-6 h-6"
                  />
                ),
              }}
              class="md:hidden"
            >
              <div>English</div>
            </SidebarItem>
            {/* TODO: add th outlined icon to lib */}
            <SidebarItem
              v-slots={{
                start: () => (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 4.1875L1.99902 10.0625C1.99902 10.5803 2.41875 11 2.93652 11H10.0615C10.5793 11 10.999 10.5803 10.999 10.0625L11 4.1875C11 3.66973 10.5803 3.25 10.0625 3.25H2.9375C2.41973 3.25 2 3.66973 2 4.1875ZM9.39989 4.85H3.59989L3.59913 9.4H9.39913L9.39989 4.85ZM14.599 4.85V9.775H20.4V4.85H14.599ZM3.6 19.15H9.39902V14.6H3.6V19.15ZM20.4 19.15V14.6H14.599V19.15H20.4ZM13.9365 3.25H21.0625C21.5803 3.25 22 3.66973 22 4.1875V10.4375C22 10.9553 21.5803 11.375 21.0625 11.375H13.9365C13.4187 11.375 12.999 10.9553 12.999 10.4375V4.1875C12.999 3.66973 13.4187 3.25 13.9365 3.25ZM2 19.8125V13.9375C2 13.4197 2.41973 13 2.9375 13H10.0615C10.5793 13 10.999 13.4197 10.999 13.9375V19.8125C10.999 20.3303 10.5793 20.75 10.0615 20.75H2.9375C2.41973 20.75 2 20.3303 2 19.8125ZM13.9365 20.75H21.0625C21.5803 20.75 22 20.3303 22 19.8125V13.9375C22 13.4197 21.5803 13 21.0625 13H13.9365C13.4187 13 12.999 13.4197 12.999 13.9375V19.8125C12.999 20.3303 13.4187 20.75 13.9365 20.75Z"
                      fill="currentColor"
                    />
                  </svg>
                ),
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
              retainFocusOnClick={true}
              class="md:hidden"
              onClick={() => {
                isPictureOnly.value = !isPictureOnly.value
              }}
            >
              <div>Show Image Only</div>
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
              class="md:hidden"
              onClick={() => {
                isDark.value = !isDark.value
              }}
            >
              <div>Dark Mode</div>
            </SidebarItem>
          </div>
        </nav>
      </Transition>
    )
  },
})
