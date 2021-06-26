import { defineComponent } from 'vue'
import Logo from './Logo'

export default defineComponent({
  props: {
    altMode: Boolean,
  },

  setup(props, { slots }) {
    return () => (
      <header
        class={[
          'sticky top-0 z-10 w-full',
          props.altMode
            ? 'bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 backdrop-filter backdrop-blur-xl'
            : 'bg-light-gray-550 dark:bg-gray-400',
        ]}
      >
        <div
          class={[
            'flex items-center justify-between space-x-4 container',
            props.altMode ? 'h-20 sm:h-24' : 'h-14',
          ]}
        >
          <div class="flex space-x-12">
            <router-link
              to="/"
              class={[
                'rounded focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible',
                props.altMode
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-200 dark:text-gray-100',
              ]}
            >
              <Logo />
            </router-link>
            {slots.start?.()}
          </div>
          {slots.default ? slots.default() : slots.end?.()}
        </div>
      </header>
    )
  },
})
