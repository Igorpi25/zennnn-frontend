import { defineComponent } from 'vue'
import { Btn } from '@zennnn/core'

export default defineComponent({
  setup() {
    return () => (
      <>
        <div class="text-2xl font-semibold my-4">Words</div>
        <Btn to="/">Home</Btn>
      </>
    )
  },
})
