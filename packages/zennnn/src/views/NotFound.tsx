import { defineComponent } from 'vue'
import NotFound from 'shared/components/NotFound'
import MainAppBar from '@/components/core/MainAppBar'

export default defineComponent({
  setup() {
    return () => (
      <>
        <MainAppBar />
        <NotFound />
      </>
    )
  },
})
