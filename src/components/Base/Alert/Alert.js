import {
  h,
  ref,
  computed,
  Transition,
  withDirectives,
  vShow,
  watch,
  cloneVNode,
} from 'vue'

import { ziCloseDelete, ziInfoBig } from '../../../assets/icons'

import { convertToUnit } from '../../../utils/convertToUnit'

import Icon from '../Icon'

import './Alert.css'

export default {
  name: 'Alert',

  props: {
    modelValue: Boolean,
    color: {
      type: String,
      validator: (value) => {
        return [
          'primary',
          'error',
          'warn',
          'success',
          'info',
        ].includes(value)
      },
      default: 'primary',
    },
    infoIcon: {
      type: Boolean,
      default: true,
    },
    close: Boolean,
    text: {
      type: String,
      default: '',
    },
    transition: String,
    minWidth: {
      type: [String, Number],
      default: undefined,
    },
    maxWidth: {
      type: [String, Number],
      default: 494,
    },
    infoIconClass: {
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

  setup (props, { slots, emit }) {
    const internalValue = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      internalValue.value = val
    })

    watch(internalValue, (val) => {
      emit('update:modelValue', val)
    })

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
      const styles = {}

      if (props.maxWidth) styles.maxWidth = convertToUnit(props.maxWidth)
      if (props.minWidth) styles.minWidth = convertToUnit(props.minWidth)

      return styles
    })

    const hasIcon = computed(() => {
      return slots.icon || props.infoIcon
    })

    const hasClose = computed(() => {
      return slots.close || props.close
    })

    const close = () => {
      internalValue.value = false
    }

    const genIcon = () => {
      if (slots.icon) {
        return slots.icon()
      } else if (props.infoIcon) {
        return h(Icon, {
          size: 24,
          class: {
            'alert__info-icon': true,
            'alert__info-icon--error': props.color === 'error',
            'alert__info-icon--info': props.color === 'info',
            [props.infoIconClass.trim()]: true,
          },
        }, {
          default: () => ziInfoBig,
        })
      }
      return null
    }

    const genClose = () => {
      const closeChildren = slots.close ? slots.close() : []
      if (closeChildren.length === 1) {
        return cloneVNode(slots.close()[0], { onClick: close })
      } else if (props.close) {
        return h(Icon, {
          size: 24,
          class: {
            alert__close: true,
            [props.closeClass.trim()]: true,
          },
          onClick: close,
        }, {
          default: () => ziCloseDelete,
        })
      }
      return null
    }

    const genContent = () => {
      const children = []

      if (hasIcon.value) {
        children.push(genIcon())
      }

      children.push(h('div', {
        class: {
          alert__content: true,
          [props.contentClass.trim()]: true,
        },
      }, slots.default ? slots.default() : props.text))

      if (hasClose.value) {
        children.push(genClose())
      }

      return withDirectives(
        h('div', {
          class: 'alert',
          style: styles.value,
          role: 'alert',
        }, h('div', {
          class: containerClasses.value,
        }, children)),
        [
          [vShow, internalValue.value],
        ],
      )
    }

    return {
      internalValue,
      genContent,
    }
  },

  render () {
    const content = this.genContent()

    if (this.transition) {
      return h(Transition, {
        name: this.transition,
      }, { default: () => content })
    } else {
      return this.internalValue ? content : undefined
    }
  },
}
