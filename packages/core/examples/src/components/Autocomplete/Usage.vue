<template>
  <Autocomplete
    v-model="model"
    :items="items"
    placeholder="Select item"
  >
  </Autocomplete>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const items = Array.from(Array(10).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
    disabled: i === 3,
  }
})
</script>
