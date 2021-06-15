import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',

  setup() {
    return () => <div class="text-blue-500">Home</div>
  },
})
