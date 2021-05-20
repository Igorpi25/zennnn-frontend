import { h, ref, computed, defineComponent, VNode } from 'vue'
import { RouterLink } from 'vue-router'
import { convertToUnit } from 'vue-supp'

import Progress from '../Progress'

export default defineComponent({
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
    retainFocusOnClick: Boolean,
  },

  setup (props, { slots }) {
    const MIN_WIDTH = 128
    const MIN_WIDTH_SMALL = 96

    const rootElement = ref<HTMLElement>()

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
      return h('span', data, slots.default?.())
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

    const genRouterLink = (data: any, children: VNode[]) => {
      Object.assign(data, {
        to: props.to,
        replace: props.replace,
      })
      return h(RouterLink, data, {
        default: () => children,
      })
    }

    const genButton = (data: any, children: VNode[]) => {
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
        !props.retainFocusOnClick && rootElement.value?.blur()
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
    ] as VNode[]
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
})
