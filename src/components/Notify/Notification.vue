<template>
  <Alert
    :value="true"
    :color="color"
    :text="text"
    :icon="icon"
    :close="close"
    class="pointer-events-auto shadow-md"
    min-width="220"
    @input="remove"
  />
</template>

<script>
export default {
  name: 'Notification',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: Boolean,
      default: true,
    },
    close: Boolean,
    timeout: {
      type: Number,
      default: 0,
    },
    text: String,
  },
  data () {
    return {
      timer: null,
    }
  },
  created () {
    if (this.timeout) {
      this.timer = setTimeout(() => {
        this.remove()
      }, this.timeout)
    }
  },
  methods: {
    remove () {
      clearTimeout(this.timer)
      this.timer = null
      this.$emit('remove')
    },
  },
}
</script>
