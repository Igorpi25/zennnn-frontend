import { defineComponent, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModel, ClickOutside } from 'vue-supp'
import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon, Modal } from '@zennnn/core'
import { useDisplay } from '../composables/display'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    altMode: Boolean,
  },

  directives: { ClickOutside },

  emits: ['update:modelValue'],

  setup(props, { slots }) {
    const route = useRoute()
    const { smAndDown } = useDisplay()

    const isActive = useModel(props, 'modelValue')

    function closeSidebar() {
      isActive.value = false
    }

    watch(() => route.path, closeSidebar)

    const transition = computed(() =>
      smAndDown.value
        ? {
            appear: true,
            enterActiveClass: 'transition ease-out duration-300',
            enterFromClass: 'translate-x-full',
            enterToClass: 'translate-x-0',
            leaveActiveClass: 'transition ease-in duration-300',
            leaveFromClass: 'translate-x-0',
            leaveToClass: 'translate-x-full',
          }
        : undefined
    )

    return () => (
      <Modal
        v-model={isActive.value}
        transition={transition.value}
        class="md:container flex justify-end items-start min-h-0 h-full md:h-auto px-0"
        contentClass="h-full md:h-auto rounded-none md:rounded-lg overflow-auto md:-mx-6 my-0"
        overlayClass="bg-transparent"
        top="0"
        hideOverflow
      >
        <nav
          class={[
            'w-[17rem] md:w-80 h-full py-4',
            props.altMode
              ? 'bg-light-gray-100 dark:bg-gray-500 text-gray-200 dark:text-gray-100'
              : 'bg-white dark:bg-gray-650 text-gray-900 dark:text-white md:py-6',
          ]}
        >
          <div class="flex justify-end md:hidden p-4 pt-0">
            <Btn
              icon
              class="bg-light-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              onClick={closeSidebar}
            >
              <Icon>{ziCloseWindow}</Icon>
            </Btn>
          </div>
          <div>{slots.default?.()}</div>
        </nav>
      </Modal>
    )
  },
})
