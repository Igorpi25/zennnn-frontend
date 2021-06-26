import { defineComponent } from 'vue'
import { useDimensionProps, useModel } from 'vue-supp'
import { ziCloseWindow } from '@zennnn/icons'
import { Modal, Icon } from '@zennnn/core'

export default defineComponent({
  props: {
    ...useDimensionProps({ width: '100%', maxWidth: 448 }),
    modelValue: Boolean,
    title: String,
    icon: String,
    iconClass: {
      type: String,
      default: 'dark:text-white',
    },
    hideClose: Boolean,
    closePrimary: {
      type: Boolean,
      default: true,
    },
    closeFocusable: {
      type: Boolean,
      default: true,
    },
    closeClass: String,
    contentClass: String,
    bodyClass: {
      type: String,
      default: 'px-4 py-6',
    },
  },

  setup(props, { slots }) {
    const model = useModel(props, 'modelValue')

    return () => (
      <Modal
        v-model={model.value}
        v-slots={{
          activator: (props: { attrs: any; listeners: any }) =>
            slots.activator?.(props),
        }}
        width={props.width}
        maxWidth={props.maxWidth}
        contentClass={props.contentClass}
      >
        <div class="bg-light-gray-300 dark:bg-gray-500 flex items-center space-x-2 p-4">
          {props.icon && (
            <Icon large class={['self-start', props.iconClass]}>
              {props.icon}
            </Icon>
          )}
          <h5 class="dark:text-white font-semibold text-lg flex-grow">
            {props.title}
          </h5>
          {!props.hideClose && (
            <div class="self-start w-8 h-8 inline-flex items-center justify-end">
              <Icon
                {...{
                  tabindex: props.closeFocusable ? undefined : -1,
                }}
                class={[
                  props.closePrimary
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-gray-200 hover:text-gray-900 dark:hover:text-white',
                  props.closeClass,
                ]}
                // TODO: onClick on dynamic tag
                // @ts-ignore
                onClick={() => {
                  model.value = false
                }}
              >
                {ziCloseWindow}
              </Icon>
            </div>
          )}
        </div>
        <div class={props.bodyClass}>{slots.default?.()}</div>
      </Modal>
    )
  },
})
