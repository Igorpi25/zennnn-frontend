import { h, computed, defineComponent } from 'vue'
import { useLink } from 'vue-router'
import { convertToUnit } from 'vue-supp'
import Progress from '../Progress'

import type { PropType } from 'vue'
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router'

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
    target: String,
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
    minWidth: [String, Number] as PropType<string | number>,
    maxWidth: [String, Number] as PropType<string | number>,
    type: {
      type: String as PropType<'submit' | 'reset' | 'button'>,
      default: 'button',
    },
    loaderClass: String,
    loaderSize: {
      type: Number,
      default: 24,
    },
    onClick: Function as PropType<(e: MouseEvent) => void>,
  },

  slots: ['loader', 'default'],

  emits: ['click'],

  setup(props, { slots, emit }) {
    const MIN_WIDTH = 128
    const MIN_WIDTH_SMALL = 96

    const isDisabled = computed(() => props.disabled || props.loading)

    const classes = computed(() => ({
      btn: true,
      'btn--primary':
        !props.text &&
        !props.link &&
        !props.outlined &&
        props.primary !== false,
      'btn--outlined': !props.text && !props.link && props.outlined,
      'btn--block': props.block,
      'btn--text': props.text,
      'btn--link': props.link,
      'btn--icon': props.icon,
      'btn--small': props.small,
      'btn--x-small': props.xSmall,
      'btn--mini': props.mini,
      'btn--loading': props.loading,
      'btn--disabled': props.disabled,
    }))

    const styles = computed(() => {
      let minWidth = undefined
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

    function genLoader() {
      return slots.loader
        ? slots.loader()
        : h(
            'div',
            {
              class: ['btn__loader', props.loaderClass],
            },
            h(Progress, {
              indeterminate: true,
              size: props.loaderSize,
              width: 2,
            })
          )
    }

    return () => {
      const tag = props.href || props.to ? 'a' : props.tag
      const link = props.to ? useLink(props as RouterLinkProps) : undefined

      return h(
        tag,
        {
          class: classes.value,
          style: styles.value,
          type: tag === 'a' ? undefined : props.type,
          disabled: isDisabled.value || undefined,
          href: props.to ? link?.href.value : props.href,
          target: props.target,
          onClick: (e: MouseEvent) => {
            if (isDisabled.value) return
            link?.navigate(e)
            emit('click', e)
          },
        },
        [slots.default?.(), props.loading && genLoader()]
      )
    }
  },
})
