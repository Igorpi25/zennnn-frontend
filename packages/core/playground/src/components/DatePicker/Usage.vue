<template>
  <DatePicker v-model="model">
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
