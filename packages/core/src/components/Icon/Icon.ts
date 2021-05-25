import { h, computed, defineComponent } from 'vue'
import { convertToUnit } from 'vue-supp'

const SIZE_CLASS_MAP = {
  small: '18px',
  base: '24px',
  large: '32px',
}

export default defineComponent({
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
    left: Boolean,
    right: Boolean,
  },

  setup(props, { attrs, slots }) {
    const fontSize = computed((): string | undefined => {
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
      const node = slots.default?.() ?? []
      const children = node[0] && node[0].children
      const icon = typeof children === 'string' ? children : undefined

      if (!icon) return undefined

      const svgData: Record<string, any> = {
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

      return h(
        'svg',
        svgData,
        h(
          'g',
          {
            fill: 'currentColor',
          },
          h('path', {
            d: icon,
          })
        )
      )
    }

    const clickable = attrs.onClick

    return () => {
      const tag = clickable ? 'button' : props.tag
      return h(
        tag,
        {
          class: {
            icon: true,
            'icon--left': props.left,
            'icon--right': props.right,
            'icon--link': clickable,
          },
          role: clickable ? 'button' : undefined,
          'aria-hidden': !clickable,
        },
        genSvg()
      )
    }
  },
})
