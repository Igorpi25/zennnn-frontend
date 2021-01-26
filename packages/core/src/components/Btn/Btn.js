import { h, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { convertToUnit } from 'vue-supp'

import Progress from '../Progress'

import './Btn.css'

export default {
  name: 'Btn',

  props: {
    tag: {
      type: String,
      default: 'button',
    },
    to: {
      type: [String, Object],
      default: undefined,
    },
    append: Boolean,
    replace: Boolean,
    href: String,
    loading: Boolean,
    disabled: Boolean,
    primary: {
      type: Boolean,
      default: undefined,
    },
    block: Boolean,
    outlined: Boolean,
    xSmall: Boolean,
    mini: Boolean,
    text: Boolean,
    icon: Boolean,
    small: Boolean,
    light: Boolean,
    dark: Boolean,
    contentClass: {
      type: String,
      default: '',
    },
    minWidth: [String, Number],
    maxWidth: [String, Number],
    darkIcon: Boolean,
  },

  setup (props, { slots }) {
    const MIN_WIDTH = 128
    const MIN_WIDTH_SMALL = 96

    const rootElement = ref(null)

    const isDisabled = computed(() => {
      return props.disabled || props.loading
    })

    const classes = computed(() => {
      return {
        btn: true,
        'btn--primary': !props.text && !props.outlined && props.primary !== false,
        'btn--outlined': !props.text && props.outlined,
        'btn--block': props.block,
        'btn--text': props.text,
        'btn--icon': props.icon,
        'btn--dark-icon': props.darkIcon,
        'btn--small': props.small,
        'btn--x-small': props.xSmall,
        'btn--mini': props.mini,
        'btn--loading': props.loading,
        'btn--disabled': props.disabled,
        'btn--light': props.light,
        'btn--dark': props.dark,
      }
    })

    const styles = computed(() => {
      let minWidth = null
      if (!props.icon && !props.text && !props.xSmall && !props.mini) {
        minWidth = props.small ? MIN_WIDTH_SMALL : MIN_WIDTH
      }
      return {
        minWidth: convertToUnit(props.minWidth || minWidth),
        maxWidth: convertToUnit(props.maxWidth),
      }
    })

    const genContent = () => {
      const data = {
        class: {
          btn__content: true,
          [props.contentClass.trim()]: true,
        },
      }
      return h('span', data, slots.default ? slots.default() : null)
    }

    const genLoader = () => {
      return h('span', {
        class: 'btn__loader',
      }, slots.loader
        ? slots.loader()
        : h(Progress, {
          indeterminate: true,
          size: 24,
          width: 2,
        }))
    }

    const genRouterLink = (data, children) => {
      Object.assign(data, {
        to: props.to,
        append: props.append,
        replace: props.replace,
      })
      return h(RouterLink, data, {
        default: () => {
          return [children]
        },
      })
    }

    const genButton = (data, children) => {
      const tag = (props.href && 'a') || props.tag || 'div'
      if (tag === 'a') {
        // TODO: data href="null" not remove href from element
        // not set href on disabled or loading
        if (props.href && !isDisabled.value) {
          data.href = props.href
        }
      }
      if (tag === 'button') {
        data.disabled = isDisabled.value || null
      }
      data.onClick = () => {
        rootElement.value.blur()
      }
      return h(tag, data, children)
    }

    return {
      rootElement,
      classes,
      styles,
      genContent,
      genLoader,
      genRouterLink,
      genButton,
    }
  },

  render () {
    const children = [
      this.genContent(),
      this.loading && this.genLoader(),
    ]
    const data = {
      ref: 'rootElement',
      class: this.classes,
      style: this.styles,
    }
    if (this.to) {
      return this.genRouterLink(data, children)
    } else {
      return this.genButton(data, children)
    }
  },
}
