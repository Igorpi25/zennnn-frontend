<template>
  <div class="notifications">
    <div>
      <div class="notifications__content">
        <Notification
          v-for="item in items"
          :key="item.id"
          :color="item.color"
          :text="item.text"
          :close="item.close"
          :timeout="item.timeout"
          @remove="remove(item.id)"
        />
      </div>
    </div>
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

<style>
.notifications {
  position: fixed;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 999;
}
.notifications > div {
  max-width: 320px;
  width: 100%;
}
.notifications__content {
  display: flex;
  flex-direction: column-reverse;
}
.notifications .alert {
  pointer-events: auto;
}
.notifications__content .alert:not(:first-child) {
  margin-bottom: 12px;
}
</style>
