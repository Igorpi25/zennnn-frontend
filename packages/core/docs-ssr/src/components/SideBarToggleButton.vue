<template>
  <Btn
    :primary="true"
    mini
    icon
    retain-focus-on-click
    class="md:hidden hover:text-gray-200 mr-3"
    @click="$emit('toggle')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      viewBox="0 0 24 24"
      width="24px"
      height="24px"
    >
      <path
        fill="currentColor"
        d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm18 6H3v2h18v-2z"
      />
    </svg>
  </Btn>
</template>

<script setup lang="ts">
import { defineEmit } from 'vue'

defineEmit(['toggle'])
</script>
