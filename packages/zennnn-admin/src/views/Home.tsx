import { defineComponent } from 'vue'
import { Btn } from '@zennnn/core'

export default defineComponent({
  name: 'Home',

  setup() {
    return () => (
      <>
        <div class="text-2xl font-semibold my-4">Home</div>
        <Btn to="/about">About</Btn>
      </>
    )
  },
})