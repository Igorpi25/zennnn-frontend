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
  },

  directives: { ClickOutside },

  emits: ['update:modelValue'],

  setup(props, { slots }) {
    const route = useRoute()
    const { smAndDown } = useDisplay()

    const isActive = useModel(props, 'modelValue')
    const rootRef = ref<HTMLElement>()

    function closeSidebar() {
      isActive.value = false
    }

    watch(() => route.path, closeSidebar)

    const transition = computed(() =>
      smAndDown.value
        ? {
            appear: true,
            enterActiveClass: 'transition ease-out duration-300',
            enterFromClass: 'transform translate-x-full',
            enterToClass: 'transform translate-x-0',
            leaveActiveClass: 'transition ease-in duration-300',
            leaveFromClass: 'transform translate-x-0',
            leaveToClass: 'transform translate-x-full',
          }
        : undefined
    )

    return () => (
      <Modal
        v-model={isActive.value}
        transition={transition.value}
        class="md:container flex justify-end items-start min-h-0 h-full md:h-auto"
        content-class="h-full md:h-auto rounded-none md:rounded-lg overflow-auto m-0 md:-mx-6"
        top="0"
        hideOverlay
        hideOverflow
      >
        <nav
          ref={rootRef}
          v-show={isActive.value}
          class="w-68 md:w-80 bg-white dark:bg-gray-650 md:py-4"
          v-click-outside={[
            {
              handler: closeSidebar,
              closeConditional: (e: Event) => {
                const target = e.target as Element
                const wrapper = rootRef.value as Element
                return isActive.value && !(wrapper && wrapper.contains(target))
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
          <div>{slots.default?.()}</div>
        </nav>
      </Modal>
    )
  },
})
