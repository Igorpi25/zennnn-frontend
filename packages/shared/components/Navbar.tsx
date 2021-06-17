import { defineComponent } from 'vue'
import Logo from './icons/Logo'

export default defineComponent({
  setup(props, { slots }) {
    return () => (
      <>
        <nav class="sticky top-0 z-10 w-full bg-light-gray-550 dark:bg-gray-400">
          <div class="flex items-center justify-between space-x-4 container h-14">
            <div class="flex space-x-12">
              <router-link
                to="/"
                class="rounded text-gray-200 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible"
              >
                <Logo />
              </router-link>
              {slots.start?.()}
            </div>
            {slots.default ? slots.default() : slots.end?.()}
          </div>
        </nav>
      </>
    )
  },
})
