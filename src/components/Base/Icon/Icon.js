import { h, computed } from 'vue'

import './Icon.css'

import { convertToUnit } from '../../../utils/convertToUnit'

const SIZE_CLASS_MAP = {
  small: 'text-lg',
  base: 'text-2xl',
  large: 'text-3xl',
}

/**
 * Props
 * @param {string} [props.tag=i] The root tag name.
 * @param {string|number} props.size The static size.
 * @param {boolean} props.small The small size preset.
 * @param {boolean} props.base The default size.
 * @param {boolean} props.large The large size preset.
 */
export default (props, { slots }) => {
  const tag = computed(() => props.tag || 'i')

  const fontSize = computed(() => {
    return props.size ? convertToUnit(props.size) : undefined
  })

  const fontSizeClass = computed(() => {
    return props.small || props.small === ''
      ? SIZE_CLASS_MAP.small
      : props.base || props.base === ''
        ? SIZE_CLASS_MAP.base
        : props.large || props.large === ''
          ? SIZE_CLASS_MAP.large
          : ''
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
  if (fontSizeClass.value) {
    classes[fontSizeClass.value] = true
  }

  return h(tag.value, {
    class: classes,
  }, genSvg())
}
