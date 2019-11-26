<template>
  <div
    v-if="value"
    :class="['alert', classes]"
  >
    <div class="flex-grow">
      {{ text }}
    </div>
    <div class="flex items-center">
      <a
        v-if="close"
        class="alert_close"
        @click="$emit('input', false)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    close: {
      type: Boolean,
      default: false,
    },
    text: String,
  },
  computed: {
    classes () {
      return `bg-${this.color}`
    },
  },
}
</script>
