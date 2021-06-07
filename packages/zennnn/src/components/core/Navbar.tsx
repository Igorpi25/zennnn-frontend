import { defineComponent, PropType } from 'vue'
import { useModel } from 'vue-supp'
import { ziMenu, ziUser, ziSearch } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'
import Logo from './icons/Logo'
import AccountInfo from './AccountInfo'
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
    searchActive: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: Boolean,
    navItems: {
      type: Array as PropType<NavItems>,
      default: () => [],
    },
  },

  emits: [
    'update:auth',
    'update:sidebarActive',
    'update:pictureOnly',
    'update:searchActive',
  ],

  setup(props) {
    const { isDark } = useTheme()
    const isAuth = useModel(props, 'auth')
    const isSidebarActive = useModel(props, 'sidebarActive')
    const isPictureOnly = useModel(props, 'pictureOnly')
    const isSearchActive = useModel(props, 'searchActive')

    function toggleSidebar() {
      isSidebarActive.value = !isSidebarActive.value
    }

    function toggleSearch() {
      isSearchActive.value = !isSearchActive.value
    }

    return () => (
      <>
        <nav class="sticky top-0 z-10 h-20 sm:h-24 flex items-center justify-between space-x-4 container bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-xl">
          <div class="flex space-x-12">
            <router-link
              to="/"
              class="focus:outline-none focus:ring focus:ring-blue-400 rounded"
            >
              <Logo />
            </router-link>
            <div class="hidden lg:flex space-x-12">
              {props.navItems.map((item) => (
                <Btn
                  text
                  to={item.to}
                  class="text-gray-900 dark:text-white h-auto px-0"
                >
                  {item.text}
                </Btn>
              ))}
            </div>
          </div>
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
              retainFocusOnClick={true}
              class="hidden xs:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: () => {
                  isPictureOnly.value = !isPictureOnly.value
                },
              }}
            >
              {/* TODO: add th outlined icon to lib */}
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
            </Btn>

            <Btn
              icon
              retainFocusOnClick={true}
              class="hidden md:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
              {...{
                onClick: () => {
                  isDark.value = !isDark.value
                },
              }}
            >
              {/* TODO: can't control stroke on svg tag, need set class to svg in Icon from attrs or prop, outline icons has 1.6 stroke, check all other icons, mb need convert to path */}
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
            </Btn>

            <Btn
              icon
              class="hidden sm:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white px-3"
            >
              <img
                src={require('@/assets/img/flags/locale/en-US.svg').default}
                alt="en-US"
              />
            </Btn>

            {isAuth.value ? (
              <AccountInfo
                class="cursor-pointer flex-row-reverse"
                avatarSize={48}
                avatarSrc="https://via.placeholder.com/48x48"
                avatarClass="md:ml-2"
                title="Berlogga LLC."
                subtitle="Director"
                infoClass="text-right hidden md:flex"
                {...{
                  onClick: toggleSidebar,
                }}
              />
            ) : (
              <>
                <Btn
                  minWidth="none"
                  class="w-12 sm:w-auto bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white sm:px-3"
                  // to="/signin"
                  {...{
                    onClick: () => {
                      isAuth.value = !isAuth.value
                    },
                  }}
                >
                  <Icon class="sm:hidden">{ziUser}</Icon>
                  <span class="hidden sm:flex">Sign in</span>
                </Btn>
                <Btn
                  minWidth="none"
                  class="hidden md:flex bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white px-3"
                  to="/signup"
                >
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
        </nav>
      </>
    )
  },
})
