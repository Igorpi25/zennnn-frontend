import {
  h,
  computed,
  withDirectives,
  Transition,
  vShow,
  cloneVNode,
  defineComponent,
} from 'vue'
import { useModel, convertToUnit } from 'vue-supp'
import { ziCloseDelete, ziInfoBig } from '@zennnn/icons'
import Icon from '../Icon'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'Alert',

  props: {
    modelValue: {
      type: [String, Boolean],
      default: true,
    },
    color: {
      type: String,
      validator: (value: string) => {
        return ['primary', 'error', 'warn', 'success', 'info'].includes(value)
      },
      default: 'primary',
    },
    icon: {
      type: Boolean,
      default: true,
    },
    close: Boolean,
    text: String,
    transition: String,
    mode: String as PropType<'in-out' | 'out-in' | 'default'>,
    minWidth: [String, Number],
    maxWidth: [String, Number],
    iconClass: String,
    closeClass: String,
    contentClass: String,
    containerClass: String,
  },

  slots: ['icon', 'close', 'default'],

  emits: ['update:modelValue'],

  setup(props, { slots }) {
    const internal = useModel(props, 'modelValue')

    const containerClasses = computed(() => [
      'alert__container',
      {
        'alert__container--primary': props.color === 'primary',
        'alert__container--error': props.color === 'error',
        'alert__container--warn': props.color === 'warn',
        'alert__container--success': props.color === 'success',
        'alert__container--info': props.color === 'info',
        'alert__container--closable': props.close,
      },
      props.containerClass,
    ])

    const styles = computed(() => {
      const styles: Record<string, unknown> = {}

      if (props.maxWidth) styles.maxWidth = convertToUnit(props.maxWidth)
      if (props.minWidth) styles.minWidth = convertToUnit(props.minWidth)

      return styles
    })

    const hasIcon = computed(() => slots.icon || props.icon)

    const hasClose = computed(() => slots.close || props.close)

    function close() {
      internal.value = false
    }

    function genIcon() {
      if (slots.icon) {
        return slots.icon()
      } else if (props.icon) {
        return h(
          Icon,
          {
            size: 24,
            class: [
              'alert__icon',
              {
                'alert__icon--error': props.color === 'error',
                'alert__icon--info': props.color === 'info',
              },
              props.iconClass,
            ],
          },
          {
            default: () => ziInfoBig,
          }
        )
      }
      return undefined
    }

    function genClose() {
      const closeChildren = slots.close?.() ?? []
      if (closeChildren.length === 1) {
        return cloneVNode(closeChildren[0], { onClick: close })
      } else if (props.close) {
        return h(
          Icon,
          {
            size: 24,
            class: ['alert__close', props.closeClass],
            onClick: close,
          },
          {
            default: () => ziCloseDelete,
          }
        )
      }
      return undefined
    }

    function genContent() {
      const children = []

      if (hasIcon.value) {
        children.push(genIcon())
      }

      children.push(
        h(
          'div',
          {
            class: ['alert__content', props.contentClass],
          },
          slots.default?.() ?? props.text
        )
      )

      if (hasClose.value) {
        children.push(genClose())
      }

      return withDirectives(
        h(
          'div',
          {
            class: 'alert',
            style: styles.value,
            role: 'alert',
          },
          h(
            'div',
            {
              class: containerClasses.value,
            },
            children
          )
        ),
        [[vShow, internal.value]]
      )
    }

    return {
      internal,
      genContent,
    }
  },

  render() {
    const content = this.genContent()

    if (this.transition) {
      return h(
        Transition,
        {
          name: this.transition,
          mode: this.mode,
        },
        { default: () => content }
      )
    } else {
      return this.internal ? content : undefined
    }
  },
})
