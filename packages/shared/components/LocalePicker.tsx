import { defineComponent } from 'vue'

import type { PropType } from 'vue'

interface Locale {
  text: string
  value: string
}

export default defineComponent({
  props: {
    locales: {
      type: Array as PropType<Locale[]>,
      default: [],
    },
  },

  setup() {
    return () => <div>LocalePicker</div>
  },
})
