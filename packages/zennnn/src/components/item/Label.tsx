import { defineComponent, computed, PropType, CSSProperties } from 'vue'
import { convertToUnit } from 'vue-supp'
import { LabelTypes } from '@/components/item/Card'

export interface ItemLabelProps {
  preset?: LabelTypes
  background?: string
  count?: number | string
  maxWidth?: number | string
}

export default defineComponent({
  props: {
    preset: null as any as PropType<LabelTypes>,
    background: String,
    count: [Number, String] as PropType<number | string>,
    maxWidth: [Number, String] as PropType<number | string>,
  },

  setup(props, { slots }) {
    const background = computed(() => {
      if (!props.preset) return props.background
      switch (props.preset) {
        case LabelTypes.New:
          return '#34B0B0'
        case LabelTypes.Sale:
          return '#0476FF'
        case LabelTypes.Models:
          return '#A26014'
        case LabelTypes.Colors:
          return 'linear-gradient(270deg, #C51D1D 0%, #146491 50%, #0F761A 100%)'
        case LabelTypes.Sizes:
          return '#4634B0'
        default:
          return props.background
      }
    })

    const text = computed(() => {
      if (!props.preset) return undefined
      switch (props.preset) {
        case LabelTypes.New:
          return 'New'
        case LabelTypes.Sale:
          return 'Sale'
        case LabelTypes.Models:
          return 'Models'
        case LabelTypes.Colors:
          return 'Colors'
        case LabelTypes.Sizes:
          return 'Sizes'
        default:
          return undefined
      }
    })

    const styles = computed(() => {
      const s = {} as CSSProperties
      if (background.value) {
        s.background = background.value
      }
      if (props.maxWidth) {
        s.maxWidth = convertToUnit(props.maxWidth)
      }
      return s
    })

    return () => (
      <div
        class={{
          'h-4.5 inline-flex items-center text-xs text-white rounded-10 space-x-1 truncate px-1':
            true,
          'pr-0.5': props.count,
        }}
        style={styles.value}
      >
        <span>{slots.default ? slots.default() : text.value}</span>
        {props.count && (
          <span
            class="inline-flex items-center justify-center rounded-full bg-light-gray-400 text-gray-900"
            style={{ height: '14px', minWidth: '14px' }}
          >
            {props.count}
          </span>
        )}
      </div>
    )
  },
})
