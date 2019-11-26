<template>
  <Alert
    :value="true"
    :color="color"
    :text="text"
    :close="close"
    class="px-3 py-2 shadow-md rounded-lg"
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
    close: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: '',
    },
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
