import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import MainAppBar from '@/components/core/MainAppBar'

export default defineComponent({
  setup() {
    return () => (
      <>
        <MainAppBar />
        <main class="flex-grow">
          <RouterView />
        </main>
      </>
    )
  },
})
