import { h, ref, computed, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { convertToUnit } from 'vue-supp'

import Progress from '../Progress'

import type { VNode, PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'Btn',

  props: {
    tag: {
      type: String,
      default: 'button',
    },
    to: [String, Object] as PropType<RouteLocationRaw>,
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
    link: Boolean,
    icon: Boolean,
    small: Boolean,
    light: Boolean,
    dark: Boolean,
    contentClass: {
      type: String,
      default: '',
    },
    minWidth: [String, Number] as PropType<string | number>,
    maxWidth: [String, Number] as PropType<string | number>,
    darkIcon: Boolean,
    retainFocusOnClick: Boolean,
    type: String as PropType<'submit' | 'reset' | 'button'>,
  },

  setup(props, { slots }) {
    const MIN_WIDTH = 128
    const MIN_WIDTH_SMALL = 96

    const rootRef = ref<HTMLElement>()

    const isDisabled = computed(() => {
      return props.disabled || props.loading
    })

    const classes = computed(() => {
      return {
        btn: true,
        'btn--primary':
          !props.text && !props.outlined && props.primary !== false,
        'btn--outlined': !props.text && props.outlined,
        'btn--block': props.block,
        'btn--text': props.text,
        'btn--link': props.link,
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
      if (
        !props.icon &&
        !props.text &&
        !props.link &&
        !props.xSmall &&
        !props.mini
      ) {
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
      return h(
        'span',
        {
          class: 'btn__loader',
        },
        slots.loader
          ? slots.loader()
          : h(Progress, {
              indeterminate: true,
              size: 24,
              width: 2,
            })
      )
    }

    const genRouterLink = (data: any, children: VNode[] | undefined) => {
      Object.assign(data, {
        to: props.to,
        replace: props.replace,
      })
      return h(RouterLink, data, {
        default: () => children,
      })
    }

    const genButton = (data: any, children: VNode[] | undefined) => {
      const tag = (props.href && 'a') || props.tag || 'div'
      if (tag === 'a') {
        // TODO: data href="null" not remove href from element
        // not set href on disabled or loading
        if (props.href && !isDisabled.value) {
          data.href = props.href
        }
      }
      if (tag === 'button') {
        data.type = props.type
        data.disabled = isDisabled.value || null
      }
      data.onClick = () => {
        !props.retainFocusOnClick && rootRef.value?.blur()
      }
      return h(tag, data, children)
    }

    return {
      rootRef,
      classes,
      styles,
      genContent,
      genLoader,
      genRouterLink,
      genButton,
    }
  },

  render() {
    const children = this.link
      ? this.$slots.default?.()
      : ([this.genContent(), this.loading && this.genLoader()] as VNode[])
    const data = {
      ref: 'rootRef',
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
