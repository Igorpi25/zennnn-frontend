<template>
  <div
    class="fixed top-0 inset-x-0 flex justify-center pointer-events-none pt-8 px-3"
    style="z-index: 999;"
  >
    <transition-group
      tag="div"
      name="notification-transition"
      class="flex flex-col-reverse"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-gray-700 rounded-md mb-3"
      >
        <Notification
          :color="item.color"
          :text="item.text"
          :icon="item.icon"
          :close="item.close"
          :timeout="item.timeout"
          @remove="remove(item.id)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
import Notification from './Notification'

export default {
  name: 'Notifications',
  components: {
    Notification,
  },
  data () {
    return {
      items: [],
    }
  },
  beforeDestroy () {
    this.clear()
  },
  methods: {
    add (payload) {
      this.items.push(payload)
    },
    remove (id) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    removeByName (name) {
      const index = this.items.findIndex(item => item.name === name)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    clear () {
      this.items = []
    },
  },
}
</script>
