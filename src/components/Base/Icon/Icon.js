import { h, computed } from 'vue'

import { convertToUnit } from '../../../utils/convertToUnit'

import './Icon.css'

const SIZE_CLASS_MAP = {
  small: '18px',
  base: '24px',
  large: '32px',
}

export default {
  name: 'Icon',

  props: {
    tag: {
      type: String,
      default: 'i',
    },
    size: {
      type: [Number, String],
      default: undefined,
    },
    small: Boolean,
    large: Boolean,
    base: {
      type: Boolean,
      default: true,
    },
  },

  setup (props, { attrs, slots }) {
    const tag = computed(() => props.tag || 'i')

    const fontSize = computed(() => {
      return props.size
        ? convertToUnit(props.size)
        : props.small
          ? SIZE_CLASS_MAP.small
          : props.large
            ? SIZE_CLASS_MAP.large
            : props.base
              ? SIZE_CLASS_MAP.base
              : undefined
    })

    const genSvg = () => {
      const node = slots.default ? slots.default() : []
      const children = node[0] && node[0].children
      const icon = typeof children === 'string' ? children : undefined

      if (!icon) return undefined

      const svgData = {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        height: fontSize.value || '24',
        width: fontSize.value || '24',
        role: 'img',
        'aria-hidden': true,
      }
      if (fontSize.value) {
        svgData.style = {
          fontSize: fontSize.value,
          height: fontSize.value,
          width: fontSize.value,
        }
      }

      return h('svg', svgData, h('g', {
        fill: 'currentColor',
      }, h('path', {
        d: icon,
      })))
    }

    const classes = { icon: true }

    const clickable = attrs.onClick

    return () => {
      return h(tag.value, {
        class: classes,
        role: clickable ? 'button' : undefined,
      }, genSvg())
    }
  },
}
