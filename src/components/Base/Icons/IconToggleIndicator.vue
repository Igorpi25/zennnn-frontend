<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :style="styles"
    viewBox="0 0 24 24"
  >
    <g>
      <circle cx="12" cy="12" r="12" fill="#5a8199" />
      <circle cx="12" cy="12" r="9" fill="#16a0ce" />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 24,
    },
    height: {
      type: [Number, String],
      default: 24,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
