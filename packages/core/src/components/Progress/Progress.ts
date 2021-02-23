import { h, reactive, computed, defineComponent } from 'vue'
import { convertToUnit } from 'vue-supp'

import './Progress.css'

export default defineComponent({
  name: 'Progress',

  props: {
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0,
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    width: {
      type: [Number, String],
      default: 4,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
  },

  setup (props, { slots }) {
    const state: any = reactive({
      radius: 20,
      circumference: computed(() => {
        return 2 * Math.PI * state.radius
      }),
      normalizedValue: computed(() => {
        if (props.value < 0) {
          return 0
        }

        if (props.value > 100) {
          return 100
        }

        return parseFloat(props.value)
      }),
      strokeDashArray: computed(() => {
        return Math.round(state.circumference * 1000) / 1000
      }),
      strokeDashOffset: computed(() => {
        return ((100 - state.normalizedValue) / 100) * state.circumference + 'px'
      }),
      strokeWidth: computed(() => {
        return Number(props.width) / +props.size * state.viewBoxSize * 2
      }),
      svgStyles: computed(() => {
        return {
          transform: `rotate(${Number(props.rotate)}deg)`,
        }
      }),
      viewBoxSize: computed(() => {
        return state.radius / (1 - Number(props.width) / +props.size)
      }),
      styles: computed(() => {
        const s = Number(props.size)
        return {
          height: convertToUnit(s),
          width: convertToUnit(s),
        }
      }),
      classes: computed(() => {
        return {
          progress: true,
          'progress--indeterminate': props.indeterminate,
        }
      }),
    })

    const genCircle = (name: string, offset: number) => {
      return h('circle', {
        class: `progress__${name}`,
        fill: 'transparent',
        cx: 2 * state.viewBoxSize,
        cy: 2 * state.viewBoxSize,
        r: state.radius,
        'stroke-width': state.strokeWidth,
        'stroke-dasharray': state.strokeDashArray,
        'stroke-dashoffset': offset,
      })
    }

    const genSvg = () => {
      const children = [
        props.indeterminate || genCircle('underlay', 0),
        genCircle('overlay', state.strokeDashOffset),
      ]

      return h('svg', {
        style: state.svgStyles,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `${state.viewBoxSize} ${state.viewBoxSize} ${2 * state.viewBoxSize} ${2 * state.viewBoxSize}`,
      }, children)
    }

    const genInfo = () => {
      return h('div', {
        class: 'progress__info',
      }, slots.default?.())
    }

    return () => {
      return h('div', {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.indeterminate ? undefined : state.normalizedValue,
        class: state.classes,
        style: state.styles,
      }, [
        genSvg(),
        genInfo(),
      ])
    }
  },
})
