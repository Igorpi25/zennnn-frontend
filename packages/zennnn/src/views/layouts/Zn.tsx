import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import ZAppBar from '@/components/core/ZAppBar'
import Copyright from '@/components/core/Copyright'
import Navbar from '@/components/core/Navbar'

export default defineComponent({
  setup() {
    return () => (
      <>
        <ZAppBar />

        <main class="flex-grow">
          <Navbar />
          <RouterView />
        </main>

        <footer class="container h-12 text-center">
          <Copyright />
        </footer>
      </>
    )
  },
})
