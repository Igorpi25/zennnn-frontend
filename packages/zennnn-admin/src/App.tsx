import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  render() {
    return (
      <div class="container">
        <router-view />
      </div>
    )
  },
})
