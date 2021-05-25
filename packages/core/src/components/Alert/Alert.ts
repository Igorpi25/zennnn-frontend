import {
  h,
  computed,
  withDirectives,
  Transition,
  vShow,
  cloneVNode,
  defineComponent,
  PropType,
} from 'vue'

import { useModel, convertToUnit } from 'vue-supp'

import { ziCloseDelete, ziInfoBig } from '@zennnn/icons'

import Icon from '../Icon'

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
    iconClass: {
      type: String,
      default: '',
    },
    closeClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    containerClass: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { slots }) {
    const internal = useModel(props, 'modelValue')

    const containerClasses = computed(() => {
      return {
        alert__container: true,
        'alert__container--primary': props.color === 'primary',
        'alert__container--error': props.color === 'error',
        'alert__container--warn': props.color === 'warn',
        'alert__container--success': props.color === 'success',
        'alert__container--info': props.color === 'info',
        'alert__container--closable': props.close,
        [props.containerClass.trim()]: true,
      }
    })

    const styles = computed(() => {
      const styles: Record<string, unknown> = {}

      if (props.maxWidth) styles.maxWidth = convertToUnit(props.maxWidth)
      if (props.minWidth) styles.minWidth = convertToUnit(props.minWidth)

      return styles
    })

    const hasIcon = computed(() => {
      return slots.icon || props.icon
    })

    const hasClose = computed(() => {
      return slots.close || props.close
    })

    const close = () => {
      internal.value = false
    }

    const genIcon = () => {
      if (slots.icon) {
        return slots.icon()
      } else if (props.icon) {
        return h(
          Icon,
          {
            size: 24,
            class: {
              alert__icon: true,
              'alert__icon--error': props.color === 'error',
              'alert__icon--info': props.color === 'info',
              [props.iconClass.trim()]: true,
            },
          },
          {
            default: () => ziInfoBig,
          }
        )
      }
      return null
    }

    const genClose = () => {
      const closeChildren = slots.close?.() ?? []
      if (closeChildren.length === 1) {
        return cloneVNode(closeChildren[0], { onClick: close })
      } else if (props.close) {
        return h(
          Icon,
          {
            size: 24,
            class: {
              alert__close: true,
              [props.closeClass.trim()]: true,
            },
            onClick: close,
          },
          {
            default: () => ziCloseDelete,
          }
        )
      }
      return null
    }

    const genContent = () => {
      const children = []

      if (hasIcon.value) {
        children.push(genIcon())
      }

      children.push(
        h(
          'div',
          {
            class: {
              alert__content: true,
              [props.contentClass.trim()]: true,
            },
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
