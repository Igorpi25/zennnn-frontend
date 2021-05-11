<template>
  <Select
    v-model="model"
    :items="items"
    :prepend-icon="ziSearch"
    :max-height="304"
    clearable
    placeholder="Search..."
  >
  </Select>
</template>

<script setup>
import { ref } from 'vue'
import { ziSearch } from '@zennnn/icons'

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
