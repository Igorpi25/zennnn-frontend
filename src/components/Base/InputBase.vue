<template>
  <div
    :class="
    [
      'input',
      { 'is-dirty': isDirty },
      { 'has-error': hasError }
    ]"
  >
    <div class="input__controls">
      <div class="flex items-center">
        <div class="input__slot">
          <slot />
        </div>
      </div>
      <div
        v-if="!hideDetails"
        class="input__details"
      >
        {{ detailText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputBases',
  props: {
    isDirty: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    hasStateIcon: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    detailText: {
      type: String,
      default: '',
    },
  },
}
</script>
