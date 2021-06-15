import { defineComponent } from 'vue'
import { Btn } from '@zennnn/core'

export default defineComponent({
  name: 'About',

  setup() {
    return () => (
      <>
        <div class="text-2xl font-semibold my-4">About</div>
        <Btn to="/">Home</Btn>
      </>
    )
  },
})
