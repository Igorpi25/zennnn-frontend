import { defineComponent } from 'vue'
import { convertToUnit } from 'vue-supp'

export default defineComponent({
  props: {
    src: String,
    size: {
      type: [Number, String],
      default: 48,
    },
  },

  setup(props, { slots }) {
    return () => (
      <div
        class="relative align-middle rounded-full overflow-hidden inline-flex items-center justify-center leading-none text-center"
        style={{
          width: convertToUnit(props.size),
          minWidth: convertToUnit(props.size),
          height: convertToUnit(props.size),
        }}
      >
        {props.src ? (
          <img
            src={props.src}
            class="inline-flex"
            style={{
              width: 'inherit',
              height: 'inherit',
              borderRadius: 'inherit',
            }}
          />
        ) : (
          slots.default?.()
        )}
      </div>
    )
  },
})
